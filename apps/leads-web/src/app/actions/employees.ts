"use server";

// ─────────────────────────────────────────────────────────────
// Imports
// ─────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Employee } from "@/types";



// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────

export interface EmployeeActionState {
  error: string | null;
  success: boolean;
}

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────
const employeeBaseSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),

  apellidos: z.string().optional(),

  telefono: z.string().optional(),

  email: z.string().email().optional().or(z.literal("")),

  direccion: z.string().optional(),

  foto_url: z.string().optional(),

  especialidad: z.string().optional(),

  tipo_contrato: z.enum([
    "empleado",
    "autonomo",
    "temporal",
    "subcontrata",
  ]),

  estado: z.enum([
    "activo",
    "vacaciones",
    "baja",
    "inactivo",
  ]),

  fecha_alta: z.string().optional(),

  coste_hora: z.string().optional(),

  salario_mensual: z.string().optional(),

  notas: z.string().optional(),
});

// Estado inicial siempre "activo"
const createEmployeeSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  apellidos: z.string().optional(),
  especialidad: z.string().optional(),
  tipo_contrato: z.enum([
    "empleado",
    "autonomo",
    "temporal",
    "subcontrata",
  ]),
});

const updateEmployeeSchema = employeeBaseSchema;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
//

async function getMyTenantId(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  return data?.tenant_id ?? null;
}

// ─────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────

export async function getEmployees(): Promise<Employee[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .order("nombre", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as Employee[];
}

export async function getEmployeeById(
  id: string,
): Promise<Employee | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Employee;
}

export async function createEmployeeAction(
  _prevState: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const getField = (name: string) =>
    String(formData.get(name) ?? "");

  const raw = {
    nombre: getField("nombre"),
    apellidos: getField("apellidos"),
    especialidad: getField("especialidad"),
    tipo_contrato: getField("tipo_contrato"),
  };

  const parsed = createEmployeeSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
      success: false,
    };
  }

  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      error: "No se encontró el negocio asociado",
      success: false,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();

  const { error } = await admin
    .from("employees")
    .insert({
      tenant_id: tenantId,
      created_by: user!.id,

      nombre: parsed.data.nombre,
      apellidos: parsed.data.apellidos || null,
      especialidad: parsed.data.especialidad || null,
      tipo_contrato: parsed.data.tipo_contrato,

      estado: "activo",
    });

  if (error) {
    return {
      error: "Error al crear el empleado",
      success: false,
    };
  }

  revalidatePath("/empleados");

  return {
    error: null,
    success: true,
  };
}

export async function updateEmployeeAction(
  id: string,
  _prevState: EmployeeActionState,
  formData: FormData,
): Promise<EmployeeActionState> {
  const raw = {
    nombre: formData.get("nombre") as string,
    apellidos: formData.get("apellidos") as string,
    telefono: formData.get("telefono") as string,
    email: formData.get("email") as string,
    direccion: formData.get("direccion") as string,
    foto_url: formData.get("foto_url") as string,
    especialidad: formData.get("especialidad") as string,
    tipo_contrato: formData.get("tipo_contrato") as string,
    estado: formData.get("estado") as string,
    fecha_alta: formData.get("fecha_alta") as string,
    coste_hora: formData.get("coste_hora") as string,
    salario_mensual: formData.get("salario_mensual") as string,
    notas: formData.get("notas") as string,
  };

  const parsed = updateEmployeeSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
      success: false,
    };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("employees")
    .update({
      nombre: parsed.data.nombre,
      apellidos: parsed.data.apellidos || null,
      telefono: parsed.data.telefono || null,
      email: parsed.data.email || null,
      direccion: parsed.data.direccion || null,
      foto_url: parsed.data.foto_url || null,
      especialidad: parsed.data.especialidad || null,
      tipo_contrato: parsed.data.tipo_contrato,
      estado: parsed.data.estado,
      fecha_alta: parsed.data.fecha_alta || null,
      coste_hora: parsed.data.coste_hora
        ? parseFloat(parsed.data.coste_hora)
        : null,
      salario_mensual: parsed.data.salario_mensual
        ? parseFloat(parsed.data.salario_mensual)
        : null,
      notas: parsed.data.notas || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return {
      error: "Error al actualizar el empleado",
      success: false,
    };
  }

  revalidatePath("/empleados");
  revalidatePath(`/empleados/${id}`);

  return {
    error: null,
    success: true,
  };
}

export async function updateEmployeeStatusAction(
  employeeId: string,
  estado: "activo" | "vacaciones" | "baja" | "inactivo",
): Promise<void> {
  const admin = createAdminClient();

  await admin
    .from("employees")
    .update({
      estado,
      updated_at: new Date().toISOString(),
    })
    .eq("id", employeeId);

  revalidatePath("/empleados");
  revalidatePath(`/empleados/${employeeId}`);
}

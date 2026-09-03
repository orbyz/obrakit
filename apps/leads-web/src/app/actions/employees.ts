"use server";

// ─────────────────────────────────────────────────────────────
// Imports
// ─────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import type {
  Employee,
  EmployeePricingModel,
  EstadoEmpleado,
} from "@/types";

import { requireActiveSubscription } from "@/lib/subscription/access";

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


// Estado inicial siempre "activo"
const optionalRateSchema = z
  .union([
    z.literal(""),
    z.coerce
      .number()
      .finite("El importe debe ser un número válido")
      .min(0, "El importe no puede ser negativo"),
  ])
  .transform((value) => (value === "" ? null : value));

function getPricingValues(
  pricingModel: EmployeePricingModel,
  rates: {
    hourly_rate: number | null;
    daily_rate: number | null;
    monthly_salary: number | null;
    fixed_rate: number | null;
  },
) {
  return {
    pricing_model: pricingModel,
    hourly_rate: pricingModel === "hourly" ? rates.hourly_rate : null,
    daily_rate: pricingModel === "daily" ? rates.daily_rate : null,
    monthly_salary:
      pricingModel === "monthly" ? rates.monthly_salary : null,
    fixed_rate: pricingModel === "fixed" ? rates.fixed_rate : null,
  };
}

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
  pricing_model: z.enum(["hourly", "daily", "monthly", "fixed"]),
  hourly_rate: optionalRateSchema,
  daily_rate: optionalRateSchema,
  monthly_salary: optionalRateSchema,
  fixed_rate: optionalRateSchema,
});


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
    pricing_model: getField("pricing_model"),
    hourly_rate: getField("hourly_rate"),
    daily_rate: getField("daily_rate"),
    monthly_salary: getField("monthly_salary"),
    fixed_rate: getField("fixed_rate"),
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

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      error: subscription.error,
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
      ...getPricingValues(parsed.data.pricing_model, parsed.data),

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
  const getField = (name: string) =>
    String(formData.get(name) ?? "");

  const raw = {
    nombre: getField("nombre"),
    apellidos: getField("apellidos"),
    especialidad: getField("especialidad"),
    tipo_contrato: getField("tipo_contrato"),
    pricing_model: getField("pricing_model"),
    hourly_rate: getField("hourly_rate"),
    daily_rate: getField("daily_rate"),
    monthly_salary: getField("monthly_salary"),
    fixed_rate: getField("fixed_rate"),
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

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      error: subscription.error,
      success: false,
    };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("employees")
    .update({
      nombre: parsed.data.nombre,
      apellidos: parsed.data.apellidos || null,
      especialidad: parsed.data.especialidad || null,
      tipo_contrato: parsed.data.tipo_contrato,
      ...getPricingValues(parsed.data.pricing_model, parsed.data),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    return {
      error: "Error al actualizar el empleado",
      success: false,
    };
  }

  revalidatePath("/empleados");

  return {
    error: null,
    success: true,
  };
}

export async function deactivateEmployeeAction(
  id: string,
): Promise<EmployeeActionState> {
  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      error: "No se encontró el negocio asociado",
      success: false,
    };
  }

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      error: subscription.error,
      success: false,
    };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("employees")
    .update({
      estado: "inactivo",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    return {
      error: "Error al desactivar el empleado",
      success: false,
    };
  }

  revalidatePath("/empleados");

  return {
    error: null,
    success: true,
  };
}

export async function reactivateEmployeeAction(
  id: string,
): Promise<EmployeeActionState> {
  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      error: "No se encontró el negocio asociado",
      success: false,
    };
  }

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      error: subscription.error,
      success: false,
    };
  }


  const admin = createAdminClient();

  const { error } = await admin
    .from("employees")
    .update({
      estado: "activo",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    return {
      error: "Error al reactivar el empleado",
      success: false,
    };
  }

  revalidatePath("/empleados");

  return {
    error: null,
    success: true,
  };
}

export async function updateEmployeeStatusAction(
  employeeId: string,
  estado: EstadoEmpleado,
): Promise<EmployeeActionState> {
  const parsedStatus = z
    .enum(["activo", "vacaciones", "baja", "inactivo"])
    .safeParse(estado);

  if (!parsedStatus.success) {
    return {
      error: "El estado del empleado no es válido",
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

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      error: subscription.error,
      success: false,
    };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("employees")
    .update({
      estado: parsedStatus.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", employeeId)
    .eq("tenant_id", tenantId);

  if (error) {
    return {
      error: "Error al actualizar el estado del empleado",
      success: false,
    };
  }

  revalidatePath("/empleados");
  revalidatePath(`/empleados/${employeeId}`);

  return {
    error: null,
    success: true,
  };
}

export async function getProjectAssignments(
  projectId: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employee_assignments")
    .select(`
      *,
      employee:employees (
        id,
        nombre,
        apellidos,
        especialidad,
        estado
      )
    `)
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data;
}

export async function getAvailableEmployees() {
  const supabase = await createClient();

  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return [];
  }

  const { data, error } = await supabase
    .from("employees")
    .select("id, nombre, apellidos")
    .eq("tenant_id", tenantId)
    .eq("estado", "activo")
    .order("nombre");

  if (error || !data) {
    return [];
  }

  return data;
}

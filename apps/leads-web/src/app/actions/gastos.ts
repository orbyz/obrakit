"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type { Gasto } from "@/types";

import { requireActiveSubscription } from "@/lib/subscription/access";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface GastoActionState {
  error: string | null;
  success: boolean;
}

interface TenantContext {
  tenantId: string;
  userId: string;
}

interface ProjectContext {
  id: string;
  name: string;
}

// ─────────────────────────────────────────────────────────────
// Schema
// ─────────────────────────────────────────────────────────────

const gastoSchema = z.object({
  material: z
    .string()
    .trim()
    .min(1, "El concepto es obligatorio"),

  importe: z
    .string()
    .trim()
    .min(1, "El importe es obligatorio")
    .refine(
      (value) =>
        Number.isFinite(Number(value)) &&
        Number(value) >= 0,
      "El importe no es válido",
    ),

  proveedor: z.string().trim().optional(),

  categoria: z.enum([
    "combustible",
    "transporte",
    "dietas",
    "contenedores",
    "herramientas",
    "alquiler",
    "peajes",
    "otros",
  ]),

  cantidad: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) =>
        !value ||
        (Number.isFinite(Number(value)) &&
          Number(value) >= 0),
      "La cantidad no es válida",
    ),

  unidad: z.preprocess(
    (value) => value === "" ? undefined : value,
    z.enum([
      "m2",
      "ml",
      "kg",
      "ud",
      "sacos",
      "litros",
      "otro",
    ]).optional(),
  ),

  project_id: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),

  notas: z.string().trim().optional(),

  fecha: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function getField(
  formData: FormData,
  name: string,
): string {
  return String(formData.get(name) ?? "");
}

async function getTenantContext(): Promise<TenantContext | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: membership, error } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (error || !membership?.tenant_id) {
    return null;
  }

  return {
    tenantId: membership.tenant_id,
    userId: user.id,
  };
}

async function getProjectForTenant(
  projectId: string,
  tenantId: string,
): Promise<ProjectContext | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id, name")
    .eq("id", projectId)
    .eq("tenant_id", tenantId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
  };
}

function getDefaultDate(): string {
  return new Date().toISOString().split("T")[0];
}

function parseGastoForm(formData: FormData) {
  return gastoSchema.safeParse({
    material: getField(formData, "material"),
    importe: getField(formData, "importe"),
    proveedor: getField(formData, "proveedor"),
    categoria: getField(formData, "categoria"),
    cantidad: getField(formData, "cantidad"),
    unidad: getField(formData, "unidad"),
    project_id: getField(formData, "project_id"),
    notas: getField(formData, "notas"),
    fecha: getField(formData, "fecha"),
  });
}

// ─────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────

export async function getGastos(): Promise<Gasto[]> {
  const context = await getTenantContext();

  if (!context) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .eq("tenant_id", context.tenantId)
    .order("fecha", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Gasto[];
}

export async function getGastosByProject(
  projectId: string,
): Promise<Gasto[]> {
  const context = await getTenantContext();

  if (!context) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .eq("tenant_id", context.tenantId)
    .eq("project_id", projectId)
    .order("fecha", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Gasto[];
}

/**
 * Returns company-wide expenses that are not associated
 * with a project.
 */
export async function getGeneralGastos(): Promise<Gasto[]> {
  const context = await getTenantContext();

  if (!context) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .eq("tenant_id", context.tenantId)
    .is("project_id", null)
    .order("fecha", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Gasto[];
}

/**
 * Legacy query.
 *
 * Kept while the lead-based expense flow is still
 * supported by the application.
 */

// ─────────────────────────────────────────────────────────────
// Financial summary
// ─────────────────────────────────────────────────────────────

export async function getResumenGastos(): Promise<{
  totalMes: number;
  totalAnio: number;
  totalGeneral: number;
  totalObras: number;
  porCategoria: Record<string, number>;
  porObra: { nombre: string; total: number }[];
}> {
  const context = await getTenantContext();

  if (!context) {
    return {
      totalMes: 0,
      totalAnio: 0,
      totalGeneral: 0,
      totalObras: 0,
      porCategoria: {},
      porObra: [],
    };
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .eq("tenant_id", context.tenantId);

  if (error || !data) {
    return {
      totalMes: 0,
      totalAnio: 0,
      totalGeneral: 0,
      totalObras: 0,
      porCategoria: {},
      porObra: [],
    };
  }

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalMes = data
    .filter((gasto) => {
      const fecha = new Date(gasto.fecha);

      return (
        fecha.getMonth() === currentMonth &&
        fecha.getFullYear() === currentYear
      );
    })
    .reduce(
      (total, gasto) =>
        total + Number(gasto.importe),
      0,
    );

  const totalAnio = data
    .filter(
      (gasto) =>
        new Date(gasto.fecha).getFullYear() ===
        currentYear,
    )
    .reduce(
      (total, gasto) =>
        total + Number(gasto.importe),
      0,
    );

  const generalExpenses = data.filter(
    (gasto) => gasto.project_id === null,
  );

  const projectExpenses = data.filter(
    (gasto) => gasto.project_id !== null,
  );

  const totalGeneral = generalExpenses.reduce(
    (total, gasto) =>
      total + Number(gasto.importe),
    0,
  );

  const totalObras = projectExpenses.reduce(
    (total, gasto) =>
      total + Number(gasto.importe),
    0,
  );

  const porCategoria = data.reduce(
    (acc, gasto) => {
      const categoria = gasto.categoria ?? "otro";

      acc[categoria] =
        (acc[categoria] ?? 0) +
        Number(gasto.importe);

      return acc;
    },
    {} as Record<string, number>,
  );

  const obraMap = projectExpenses.reduce(
    (acc, gasto) => {
      const nombre =
        gasto.obra_nombre ?? "Obra";

      acc[nombre] =
        (acc[nombre] ?? 0) +
        Number(gasto.importe);

      return acc;
    },
    {} as Record<string, number>,
  );

  const porObra = Object.entries(obraMap)
    .map(([nombre, total]) => ({
      nombre,
      total: Number(total),
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return {
    totalMes,
    totalAnio,
    totalGeneral,
    totalObras,
    porCategoria,
    porObra,
  };
}

// ─────────────────────────────────────────────────────────────
// Create
// ─────────────────────────────────────────────────────────────

export async function createGastoAction(
  _prevState: GastoActionState,
  formData: FormData,
): Promise<GastoActionState> {
  const parsed = parseGastoForm(formData);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
      success: false,
    };
  }

  const context = await getTenantContext();

  if (!context) {
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

  const projectId =
    parsed.data.project_id || null;

  let project: ProjectContext | null = null;

  if (projectId) {
    project = await getProjectForTenant(
      projectId,
      context.tenantId,
    );

    if (!project) {
      return {
        error: "La obra seleccionada no es válida.",
        success: false,
      };
    }
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("gastos")
    .insert({
      tenant_id: context.tenantId,
      created_by: context.userId,

      project_id: projectId,

      // Legacy relation intentionally not used
      // for newly created expenses.
      lead_id: null,

      obra_nombre: project?.name ?? null,

      material: parsed.data.material,
      importe: Number(parsed.data.importe),
      cantidad: parsed.data.cantidad
        ? Number(parsed.data.cantidad)
        : null,

      unidad: parsed.data.unidad || null,
      categoria: parsed.data.categoria,

      proveedor:
        parsed.data.proveedor || null,

      notas: parsed.data.notas || null,

      fecha:
        parsed.data.fecha ||
        getDefaultDate(),
    });

  if (error) {
    return {
      error: "No se pudo registrar el gasto.",
      success: false,
    };
  }

  revalidatePath("/gastos");

  if (projectId) {
    revalidatePath(`/obras/${projectId}`);
  }

  return {
    error: null,
    success: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Update
// ─────────────────────────────────────────────────────────────

export async function updateGastoAction(
  id: string,
  _prevState: GastoActionState,
  formData: FormData,
): Promise<GastoActionState> {
  const parsed = parseGastoForm(formData);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
      success: false,
    };
  }

  const context = await getTenantContext();

  if (!context) {
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

  const projectId = parsed.data.project_id || null;

  let project: ProjectContext | null = null;

  if (projectId) {
    project = await getProjectForTenant(
      projectId,
      context.tenantId,
    );

    if (!project) {
      return {
        error: "La obra seleccionada no es válida.",
        success: false,
      };
    }
  }

  const admin = createAdminClient();

  const { data: gasto, error: gastoError } = await admin
    .from("gastos")
    .select("id, project_id")
    .eq("id", id)
    .eq("tenant_id", context.tenantId)
    .single();

  if (gastoError || !gasto) {
    return {
      error: "El gasto no existe o no tienes permisos para editarlo.",
      success: false,
    };
  }

  const { error } = await admin
    .from("gastos")
    .update({
      project_id: projectId,
      obra_nombre: project?.name ?? null,
      material: parsed.data.material,
      importe: Number(parsed.data.importe),
      cantidad: parsed.data.cantidad
        ? Number(parsed.data.cantidad)
        : null,
      unidad: parsed.data.unidad || null,
      categoria: parsed.data.categoria,
      proveedor: parsed.data.proveedor || null,
      notas: parsed.data.notas || null,
      fecha: parsed.data.fecha || getDefaultDate(),
    })
    .eq("id", id)
    .eq("tenant_id", context.tenantId);

  if (error) {
    return {
      error: "No se pudo actualizar el gasto.",
      success: false,
    };
  }

  revalidatePath("/gastos");

  if (gasto.project_id) {
    revalidatePath(`/obras/${gasto.project_id}`);
  }

  if (projectId && projectId !== gasto.project_id) {
    revalidatePath(`/obras/${projectId}`);
  }

  return {
    error: null,
    success: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────────────────────

export async function deleteGastoAction(
  id: string,
): Promise<GastoActionState> {
  const context = await getTenantContext();

  if (!context) {
    return {
      error: "No se encontró el negocio asociado",
      success: false,
    };
  }

  const admin = createAdminClient();

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      error: subscription.error,
      success: false,
    };
  }

  const { data: gasto, error: gastoError } = await admin
    .from("gastos")
    .select("project_id")
    .eq("id", id)
    .eq("tenant_id", context.tenantId)
    .maybeSingle();

  if (gastoError || !gasto) {
    return {
      error: "No se encontró el gasto.",
      success: false,
    };
  }

  const { error } = await admin
    .from("gastos")
    .delete()
    .eq("id", id)
    .eq("tenant_id", context.tenantId);

  if (error) {
    return {
      error: "No se pudo eliminar el gasto.",
      success: false,
    };
  }

  revalidatePath("/gastos");

  if (gasto.project_id) {
    revalidatePath(`/obras/${gasto.project_id}`);
  }

  return {
    error: null,
    success: true,
  };
}

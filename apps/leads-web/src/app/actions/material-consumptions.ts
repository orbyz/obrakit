"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireActiveSubscription } from "@/lib/subscription/access";

import type { Material, MaterialConsumption } from "@/types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface MaterialConsumptionActionState {
  error: string | null;
  success: boolean;
}

interface TenantContext {
  tenantId: string;
  userId: string;
}

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const optionalTextSchema = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value))
  .nullable()
  .optional();

const materialConsumptionBaseSchema = z.object({
  cantidad: z.coerce
    .number()
    .positive("La cantidad debe ser mayor que cero"),

  fecha: z.string().min(1, "La fecha es obligatoria"),

  notas: optionalTextSchema,
});

const createMaterialConsumptionSchema =
  materialConsumptionBaseSchema.extend({
    project_id: z.string().uuid("La obra no es válida"),
    material_id: z.string().uuid("El material no es válido"),
  });

const updateMaterialConsumptionSchema =
  materialConsumptionBaseSchema;

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function getField(formData: FormData, name: string): string {
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

function calculateTotalAmount(
  quantity: number,
  unitPrice: number,
): number {
  return Number((quantity * unitPrice).toFixed(2));
}

function parseCreateMaterialConsumptionForm(formData: FormData) {
  return createMaterialConsumptionSchema.safeParse({
    project_id: getField(formData, "project_id"),
    material_id: getField(formData, "material_id"),
    cantidad: getField(formData, "cantidad"),
    fecha: getField(formData, "fecha"),
    notas: getField(formData, "notas"),
  });
}

function parseUpdateMaterialConsumptionForm(formData: FormData) {
  return updateMaterialConsumptionSchema.safeParse({
    cantidad: getField(formData, "cantidad"),
    fecha: getField(formData, "fecha"),
    notas: getField(formData, "notas"),
  });
}

async function getProjectForTenant(
  projectId: string,
  tenantId: string,
): Promise<boolean> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("tenant_id", tenantId)
    .single();

  return !error && Boolean(data);
}

async function getMaterialSnapshot(
  materialId: string,
  tenantId: string,
): Promise<{
  material: Material;
  precio_snapshot: number;
} | null> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("materials")
    .select("*")
    .eq("id", materialId)
    .eq("tenant_id", tenantId)
    .eq("activo", true)
    .single();

  if (error || !data) {
    return null;
  }

  const material = data as Material;

  return {
    material,
    precio_snapshot: material.precio_habitual,
  };
}

async function getMaterialConsumptionForTenant(
  id: string,
  tenantId: string,
): Promise<{
  project_id: string;
  material_id: string;
  precio_snapshot: number;
  unidad_snapshot: string;
} | null> {
  const admin = createAdminClient();

  const { data, error } = await admin
    .from("material_consumptions")
    .select(
      "project_id, material_id, precio_snapshot, unidad_snapshot",
    )
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    project_id: data.project_id,
    material_id: data.material_id,
    precio_snapshot: Number(data.precio_snapshot),
    unidad_snapshot: data.unidad_snapshot,
  };
}

// ─────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────

export async function getMaterialConsumptions(
  projectId: string,
): Promise<MaterialConsumption[]> {
  const context = await getTenantContext();

  if (!context) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("material_consumptions")
    .select("*")
    .eq("project_id", projectId)
    .eq("tenant_id", context.tenantId)
    .order("fecha", { ascending: false });

  if (error) {
    throw new Error(
      `Error al obtener consumos de materiales: ${error.message}`,
    );
  }

  return (data ?? []) as MaterialConsumption[];
}

export async function getMaterialConsumptionById(
  id: string,
): Promise<MaterialConsumption | null> {
  const context = await getTenantContext();

  if (!context) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("material_consumptions")
    .select("*")
    .eq("id", id)
    .eq("tenant_id", context.tenantId)
    .single();

  if (error || !data) {
    return null;
  }

  return data as MaterialConsumption;
}

// ─────────────────────────────────────────────────────────────
// Create
// ─────────────────────────────────────────────────────────────

export async function createMaterialConsumptionAction(
  _prevState: MaterialConsumptionActionState,
  formData: FormData,
): Promise<MaterialConsumptionActionState> {
  const parsed = parseCreateMaterialConsumptionForm(formData);

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

  const projectExists = await getProjectForTenant(
    parsed.data.project_id,
    context.tenantId,
  );

  if (!projectExists) {
    return {
      error: "No se encontró la obra",
      success: false,
    };
  }

  const materialSnapshot = await getMaterialSnapshot(
    parsed.data.material_id,
    context.tenantId,
  );

  if (!materialSnapshot) {
    return {
      error: "No se encontró el material",
      success: false,
    };
  }

  const importeTotal = calculateTotalAmount(
    parsed.data.cantidad,
    materialSnapshot.precio_snapshot,
  );

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      error: subscription.error,
      success: false,
    };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("material_consumptions")
    .insert({
      tenant_id: context.tenantId,
      project_id: parsed.data.project_id,
      material_id: materialSnapshot.material.id,

      material_nombre_snapshot:
        materialSnapshot.material.nombre,

      cantidad: parsed.data.cantidad,

      unidad_snapshot:
        materialSnapshot.material.unidad_base,

      precio_snapshot:
        materialSnapshot.precio_snapshot,

      importe_total: importeTotal,

      fecha: parsed.data.fecha,
      notas: parsed.data.notas,
      created_by: context.userId,
    });

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath(`/obras/${parsed.data.project_id}`);

  return {
    error: null,
    success: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Update
// ─────────────────────────────────────────────────────────────

export async function updateMaterialConsumptionAction(
  id: string,
  _prevState: MaterialConsumptionActionState,
  formData: FormData,
): Promise<MaterialConsumptionActionState> {
  const parsed = parseUpdateMaterialConsumptionForm(formData);

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

  const currentConsumption =
    await getMaterialConsumptionForTenant(
      id,
      context.tenantId,
    );

  if (!currentConsumption) {
    return {
      error: "No se encontró el consumo de material",
      success: false,
    };
  }

  const importeTotal = calculateTotalAmount(
    parsed.data.cantidad,
    currentConsumption.precio_snapshot,
  );

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      error: subscription.error,
      success: false,
    };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("material_consumptions")
    .update({
      cantidad: parsed.data.cantidad,
      fecha: parsed.data.fecha,
      notas: parsed.data.notas,
      importe_total: importeTotal,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", context.tenantId);

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath(
    `/obras/${currentConsumption.project_id}`,
  );

  return {
    error: null,
    success: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────────────────────

export async function deleteMaterialConsumptionAction(
  id: string,
): Promise<MaterialConsumptionActionState> {
  const context = await getTenantContext();

  if (!context) {
    return {
      error: "No se encontró el negocio asociado",
      success: false,
    };
  }

  const currentConsumption =
    await getMaterialConsumptionForTenant(
      id,
      context.tenantId,
    );

  if (!currentConsumption) {
    return {
      error: "No se encontró el consumo de material",
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
    .from("material_consumptions")
    .delete()
    .eq("id", id)
    .eq("tenant_id", context.tenantId);

  if (error) {
    return {
      error: "Error al eliminar el consumo de material",
      success: false,
    };
  }

  revalidatePath(
    `/obras/${currentConsumption.project_id}`,
  );

  return {
    error: null,
    success: true,
  };
}

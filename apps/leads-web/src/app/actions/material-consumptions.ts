"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type {
  Material,
  MaterialConsumption,
} from "@/types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface MaterialConsumptionActionState {
  error: string | null;
  success: boolean;
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

async function getMyTenantId(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  return data?.tenant_id ?? null;
}

function calculateTotalAmount(
  quantity: number,
  unitPrice: number,
): number {
  return Number((quantity * unitPrice).toFixed(2));
}

function getField(
  formData: FormData,
  name: string,
): string {
  return String(formData.get(name) ?? "");
}

function parseCreateMaterialConsumptionForm(
  formData: FormData,
) {
  return createMaterialConsumptionSchema.safeParse({
    project_id: getField(formData, "project_id"),
    material_id: getField(formData, "material_id"),
    cantidad: getField(formData, "cantidad"),
    fecha: getField(formData, "fecha"),
    notas: getField(formData, "notas"),
  });
}

function parseUpdateMaterialConsumptionForm(
  formData: FormData,
) {
  return updateMaterialConsumptionSchema.safeParse({
    cantidad: getField(formData, "cantidad"),
    fecha: getField(formData, "fecha"),
    notas: getField(formData, "notas"),
  });
}

async function buildMaterialSnapshot(
  materialId: string,
  tenantId: string,
  quantity: number,
) {
  const snapshot = await getMaterialSnapshot(
    materialId,
    tenantId,
  );

  if (!snapshot) {
    return null;
  }

  return {
    snapshot,
    importeTotal: calculateTotalAmount(
      quantity,
      snapshot.precio_snapshot,
    ),
  };
}

// ─────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────

export async function getMaterialConsumptions(
  projectId: string,
): Promise<MaterialConsumption[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("material_consumptions")
    .select("*")
    .eq("project_id", projectId)
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
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("material_consumptions")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as MaterialConsumption;
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

// ─────────────────────────────────────────────────────────────
// Create
// ─────────────────────────────────────────────────────────────

export async function createMaterialConsumptionAction(
  _prevState: MaterialConsumptionActionState,
  formData: FormData,
): Promise<MaterialConsumptionActionState> {
  const parsed =
    parseCreateMaterialConsumptionForm(formData);

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

  const materialData = await buildMaterialSnapshot(
    parsed.data.material_id,
    tenantId,
    parsed.data.cantidad,
  );

  if (!materialData) {
    return {
      error: "No se encontró el material",
      success: false,
    };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("material_consumptions")
    .insert({
      tenant_id: tenantId,

      project_id: parsed.data.project_id,

      material_id: materialData.snapshot.material.id,

      material_nombre_snapshot:
        materialData.snapshot.material.nombre,

      cantidad: parsed.data.cantidad,

      unidad_snapshot:
        materialData.snapshot.material.unidad_base,

      precio_snapshot:
        materialData.snapshot.precio_snapshot,

      importe_total: materialData.importeTotal,

      fecha: parsed.data.fecha,

      notas: parsed.data.notas,

      created_by: user?.id ?? null,
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
  const parsed =
    parseUpdateMaterialConsumptionForm(formData);

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

  const admin = createAdminClient();

  const {
    data: currentConsumption,
    error: currentError,
  } = await admin
    .from("material_consumptions")
    .select(
      "project_id, material_id, precio_snapshot, unidad_snapshot",
    )
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (currentError || !currentConsumption) {
    return {
      error: "No se encontró el consumo de material",
      success: false,
    };
  }

  const importeTotal = calculateTotalAmount(
    parsed.data.cantidad,
    Number(currentConsumption.precio_snapshot),
  );

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
    .eq("tenant_id", tenantId);

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
  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      error: "No se encontró el negocio asociado",
      success: false,
    };
  }

  const admin = createAdminClient();

  const {
    data: currentConsumption,
    error: currentError,
  } = await admin
    .from("material_consumptions")
    .select("project_id")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (currentError || !currentConsumption) {
    return {
      error: "No se encontró el consumo de material",
      success: false,
    };
  }

  const { error } = await admin
    .from("material_consumptions")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

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

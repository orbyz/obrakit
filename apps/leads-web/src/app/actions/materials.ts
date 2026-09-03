"use server";

// ─────────────────────────────────────────────────────────────
// Imports
// ─────────────────────────────────────────────────────────────

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { requireActiveSubscription } from "@/lib/subscription/access";


import type {
  Material,
  MaterialCategory,
  MaterialUnit,
} from "@/types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface MaterialActionState {
  error: string | null;
  success: boolean;
}

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const materialCategories: [
  MaterialCategory,
  ...MaterialCategory[],
] = [
  "albanileria",
  "ceramica",
  "fontaneria",
  "electricidad",
  "pintura",
  "carpinteria",
  "ferreteria",
  "aislamiento",
  "cubiertas",
  "yesos",
  "hormigon",
  "otro",
];

const materialUnits: [MaterialUnit, ...MaterialUnit[]] = [
  "und",
  "m2",
  "ml",
  "kg",
  "lt",
  "sacos",
  "m3",
  "rollos",
  "cajas",
  "palets",
];

const materialSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, "El nombre es obligatorio"),

  descripcion: z
    .string()
    .trim()
    .optional(),

  categoria: z.enum(materialCategories),

  unidad_base: z.enum(materialUnits),

  precio_habitual: z.coerce
    .number()
    .finite("El precio debe ser un número válido")
    .min(0, "El precio no puede ser negativo"),

  marca: z
    .string()
    .trim()
    .optional(),

  referencia: z
    .string()
    .trim()
    .optional(),
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

function parseMaterialForm(formData: FormData) {
  return materialSchema.safeParse({
    nombre: getField(formData, "nombre"),
    descripcion: getField(formData, "descripcion"),
    categoria: getField(formData, "categoria"),
    unidad_base: getField(formData, "unidad_base"),
    precio_habitual: getField(formData, "precio_habitual"),
    marca: getField(formData, "marca"),
    referencia: getField(formData, "referencia"),
  });
}

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

// ─────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────

export async function getMaterials(): Promise<Material[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .order("nombre", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []) as Material[];
}

export async function getMaterialById(
  id: string,
): Promise<Material | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("materials")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Material;
}

// ─────────────────────────────────────────────────────────────
// Create
// ─────────────────────────────────────────────────────────────

export async function createMaterialAction(
  _prevState: MaterialActionState,
  formData: FormData,
): Promise<MaterialActionState> {
  const parsed = parseMaterialForm(formData);

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
    .from("materials")
    .insert({
      tenant_id: tenantId,
      nombre: parsed.data.nombre,
      descripcion: parsed.data.descripcion || null,
      categoria: parsed.data.categoria,
      unidad_base: parsed.data.unidad_base,
      precio_habitual: parsed.data.precio_habitual,
      marca: parsed.data.marca || null,
      referencia: parsed.data.referencia || null,
      activo: true,
    });

  if (error) {
    return {
      error: "Error al crear el material",
      success: false,
    };
  }

  revalidatePath("/materiales");

  return {
    error: null,
    success: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Update
// ─────────────────────────────────────────────────────────────

export async function updateMaterialAction(
  id: string,
  _prevState: MaterialActionState,
  formData: FormData,
): Promise<MaterialActionState> {
  const parsed = parseMaterialForm(formData);

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

  const { data, error } = await admin
    .from("materials")
    .update({
      nombre: parsed.data.nombre,
      descripcion: parsed.data.descripcion || null,
      categoria: parsed.data.categoria,
      unidad_base: parsed.data.unidad_base,
      precio_habitual: parsed.data.precio_habitual,
      marca: parsed.data.marca || null,
      referencia: parsed.data.referencia || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      error: "Error al actualizar el material",
      success: false,
    };
  }

  if (!data) {
    return {
      error: "No se encontró el material",
      success: false,
    };
  }

  revalidatePath("/materiales");

  return {
    error: null,
    success: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Deactivate
// ─────────────────────────────────────────────────────────────

export async function deactivateMaterialAction(
  id: string,
): Promise<MaterialActionState> {
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

  const { data, error } = await admin
    .from("materials")
    .update({
      activo: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      error: "Error al desactivar el material",
      success: false,
    };
  }

  if (!data) {
    return {
      error: "No se encontró el material",
      success: false,
    };
  }

  revalidatePath("/materiales");

  return {
    error: null,
    success: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Reactivate
// ─────────────────────────────────────────────────────────────

export async function reactivateMaterialAction(
  id: string,
): Promise<MaterialActionState> {
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

  const { data, error } = await admin
    .from("materials")
    .update({
      activo: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .select("id")
    .maybeSingle();

  if (error) {
    return {
      error: "Error al reactivar el material",
      success: false,
    };
  }

  if (!data) {
    return {
      error: "No se encontró el material",
      success: false,
    };
  }

  revalidatePath("/materiales");

  return {
    error: null,
    success: true,
  };
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { getCurrentTenantId } from "@/lib/tenant/context";

export interface TenantActionState {
  error: string | null;
  success: boolean;
}

const updateTenantSchema = z.object({
  nombre_legal: z
    .string()
    .trim()
    .min(2, "El nombre legal debe tener al menos 2 caracteres")
    .max(150, "El nombre legal es demasiado largo")
    .optional(),

  nombre_comercial: z
    .string()
    .trim()
    .max(150, "El nombre comercial es demasiado largo")
    .optional(),

  tipo_entidad: z.enum(["autonomo", "empresa"]).optional(),

  nif: z
    .string()
    .trim()
    .max(30, "El NIF es demasiado largo")
    .optional(),

  direccion: z
    .string()
    .trim()
    .max(200, "La dirección es demasiado larga")
    .optional(),

  codigo_postal: z
    .string()
    .trim()
    .max(20, "El código postal es demasiado largo")
    .optional(),

  ciudad: z
    .string()
    .trim()
    .max(100, "La ciudad es demasiado larga")
    .optional(),

  provincia: z
    .string()
    .trim()
    .max(100, "La provincia es demasiado larga")
    .optional(),

  pais: z
    .string()
    .trim()
    .max(100, "El país es demasiado largo")
    .optional(),

  telefono: z
    .string()
    .trim()
    .max(30, "El teléfono es demasiado largo")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Introduce un email válido")
    .max(150, "El email es demasiado largo")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .max(200, "El sitio web es demasiado largo")
    .optional(),
});


export async function updateTenantAction(
  _prevState: TenantActionState,
  formData: FormData,
): Promise<TenantActionState> {
  const raw = Object.fromEntries(
    Array.from(formData.keys()).map((key) => [
      key,
      key === "tipo_entidad"
        ? String(formData.get(key) ?? "")
        : String(formData.get(key) ?? "").trim(),
    ]),
  );

  const parsed = updateTenantSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
      success: false,
    };
  }

  const tenantId = await getCurrentTenantId();

  if (!tenantId) {
    return {
      error: "No se encontró el negocio asociado",
      success: false,
    };
  }

  const updateData = parsed.data;

  if (Object.keys(updateData).length === 0) {
    return {
      error: "No hay cambios para guardar",
      success: false,
    };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("tenants")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", tenantId);

  if (error) {
    return {
      error: "No se pudo actualizar la información de la empresa",
      success: false,
    };
  }

  revalidatePath("/empresa");

  return {
    error: null,
    success: true,
  };
}

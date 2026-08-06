"use server";

// ─────────────────────────────────────────────────────────────
// Imports
// ─────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

import { revalidatePath } from "next/cache";
import { z } from "zod";

// ─────────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────────
import type { Project } from "@/types";

export type ProjectActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};
// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────
//

const projectSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio."),
  reference: z.string().trim().optional(),
  client_name: z.string().trim().min(2, "El cliente es obligatorio."),
  client_phone: z.string().trim().optional(),
  client_email: z
    .string()
    .trim()
    .email("Correo electrónico inválido.")
    .optional()
    .or(z.literal("")),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  postal_code: z.string().trim().optional(),
  planned_start_date: z.string().optional(),
  planned_end_date: z.string().optional(),
  approved_budget: z.union([
    z.literal(""),
    z.coerce.number().min(0),
  ]),
  notes: z.string().trim().optional(),
});



// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
//
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
//

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as Project[];
}

export async function getProjectById(
  id: string,
): Promise<Project | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Project;
}


// ─────────────────────────────────────────────────────────────
// Server Actions
// ─────────────────────────────────────────────────────────────

export async function createProjectAction(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const getField = (name: string) =>
    String(formData.get(name) ?? "");

  const raw = {
    name: getField("name"),
    reference: getField("reference"),
    client_name: getField("client_name"),
    client_phone: getField("client_phone"),
    client_email: getField("client_email"),
    address: getField("address"),
    city: getField("city"),
    postal_code: getField("postal_code"),
    planned_start_date: getField("planned_start_date"),
    planned_end_date: getField("planned_end_date"),
    approved_budget: getField("approved_budget"),
    notes: getField("notes"),
  };

  const parsed = projectSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0].message,
    };
  }

  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      success: false,
      message: "No se encontró el negocio asociado.",
    };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("projects")
    .insert({
      tenant_id: tenantId,
      lead_id: null,

      name: parsed.data.name,
      reference: parsed.data.reference || null,

      client_name: parsed.data.client_name,
      client_phone: parsed.data.client_phone || null,
      client_email: parsed.data.client_email || null,

      address: parsed.data.address || null,
      city: parsed.data.city || null,
      postal_code: parsed.data.postal_code || null,

      planned_start_date:
        parsed.data.planned_start_date || null,

      planned_end_date:
        parsed.data.planned_end_date || null,

      approved_budget:
        parsed.data.approved_budget === ""
          ? null
          : parsed.data.approved_budget,

      actual_start_date: null,
      actual_end_date: null,

      status: "planned",

      notes: parsed.data.notes || null,

    });

  if (error) {
    return {
      success: false,
      message: "Error al crear la obra.",
    };
  }

  revalidatePath("/obras");

  return {
    success: true,
    message: "Obra creada correctamente.",
  };
}

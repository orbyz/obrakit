"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { requireActiveSubscription } from "@/lib/subscription/access";
import { requireProjectCapacity } from "@/lib/subscription/limits";

import {
  PROJECT_STATUS_TRANSITIONS,
} from "@/lib/constants/project-status";

import type { Project, ProjectStatus } from "@/types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export type ProjectActionState = {
  success: boolean;
  message: string;
  projectId?: string;
  errors?: Record<string, string[]>;
};

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const projectSchema = z.object({
  name: z.string().trim().min(2, "El nombre es obligatorio."),
  reference: z.string().trim().optional(),

  client_name: z
    .string()
    .trim()
    .min(2, "El cliente es obligatorio."),

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

const projectStatusSchema = z.enum([
  "draft",
  "planned",
  "in_progress",
  "paused",
  "completed",
  "cancelled",
]);

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

function getFormField(
  formData: FormData,
  name: string,
): string {
  return String(formData.get(name) ?? "");
}

// ─────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────

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

export async function getProjectByLeadId(
  leadId: string,
): Promise<Project | null> {
  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("lead_id", leadId)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Project;
}

// ─────────────────────────────────────────────────────────────
// Update project status
// ─────────────────────────────────────────────────────────────

export async function updateProjectStatusAction(
  projectId: string,
  nextStatus: ProjectStatus,
): Promise<ProjectActionState> {
  const parsedStatus =
    projectStatusSchema.safeParse(nextStatus);

  if (!parsedStatus.success) {
    return {
      success: false,
      message: "El estado seleccionado no es válido.",
    };
  }

  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      success: false,
      message: "No se encontró el negocio asociado.",
    };
  }

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      success: false,
      message: subscription.error ?? "Suscripción no activa.",
    };
  }

  const admin = createAdminClient();

  const { data: project, error: projectError } =
    await admin
      .from("projects")
      .select("id, status")
      .eq("id", projectId)
      .eq("tenant_id", tenantId)
      .single();

  if (projectError || !project) {
    return {
      success: false,
      message: "No se encontró la obra.",
    };
  }

  const currentStatus =
    projectStatusSchema.safeParse(project.status);

  if (!currentStatus.success) {
    return {
      success: false,
      message: "El estado actual de la obra no es válido.",
    };
  }

  const currentProjectStatus = currentStatus.data;
  const targetStatus = parsedStatus.data;

  if (
    !PROJECT_STATUS_TRANSITIONS[
      currentProjectStatus
    ].includes(targetStatus)
  ) {
    return {
      success: false,
      message: "La transición de estado no está permitida.",
    };
  }

  const update: {
    status: ProjectStatus;
    updated_at: string;
    actual_start_date?: string;
    actual_end_date?: string;
  } = {
    status: targetStatus,
    updated_at: new Date().toISOString(),
  };

  const today = new Date()
    .toISOString()
    .split("T")[0];

  if (
    currentProjectStatus !== "in_progress" &&
    targetStatus === "in_progress"
  ) {
    update.actual_start_date = today;
  }

  if (
    currentProjectStatus !== "completed" &&
    targetStatus === "completed"
  ) {
    update.actual_end_date = today;
  }

  const { error } = await admin
    .from("projects")
    .update(update)
    .eq("id", projectId)
    .eq("tenant_id", tenantId);

  if (error) {
    return {
      success: false,
      message: "No se pudo actualizar el estado de la obra.",
    };
  }

  revalidatePath("/obras");
  revalidatePath(`/obras/${projectId}`);

  return {
    success: true,
    message: "Estado actualizado correctamente.",
  };
}

// ─────────────────────────────────────────────────────────────
// Generate project from CRM lead
// ─────────────────────────────────────────────────────────────

export async function generateProjectFromLeadAction(
  leadId: string,
): Promise<ProjectActionState> {
  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      success: false,
      message: "No se encontró el negocio asociado.",
    };
  }

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      success: false,
      message: subscription.error ?? "Suscripción no activa.",
    };
  }

  const admin = createAdminClient();

  const { data: lead, error: leadError } = await admin
    .from("leads")
    .select(
      `
        id,
        tenant_id,
        nombre,
        telefono,
        email,
        direccion,
        zona,
        estado,
        importe_cerrado,
        fecha_inicio,
        fecha_fin_estimada,
        notas
      `,
    )
    .eq("id", leadId)
    .eq("tenant_id", tenantId)
    .single();

  if (leadError || !lead) {
    return {
      success: false,
      message: "No se encontró el lead.",
    };
  }

  if (lead.estado !== "cerrado") {
    return {
      success: false,
      message: "Solo se puede generar una obra desde un lead cerrado.",
    };
  }

  if (
    lead.importe_cerrado === null ||
    lead.importe_cerrado === undefined
  ) {
    return {
      success: false,
      message: "El lead cerrado no tiene un importe cerrado.",
    };
  }

  const { data: existingProject, error: existingProjectError } =
    await admin
      .from("projects")
      .select("id")
      .eq("lead_id", lead.id)
      .eq("tenant_id", tenantId)
      .maybeSingle();

  if (existingProjectError) {
    return {
      success: false,
      message: "No se pudo comprobar si el lead ya tiene una obra.",
    };
  }

  if (existingProject) {
    return {
      success: false,
      message: "Este lead ya tiene una obra generada.",
      projectId: existingProject.id,
    };
  }

  const projectCapacity = await requireProjectCapacity();

  if (!projectCapacity.allowed) {
    return {
      success: false,
      message:
        projectCapacity.error ?? "Has alcanzado el límite de obras activas.",
    };
  }

  const { data: project, error: projectError } = await admin
    .from("projects")
    .insert({
      tenant_id: tenantId,
      lead_id: lead.id,

      name: lead.nombre,
      reference: null,

      client_name: lead.nombre,
      client_phone: lead.telefono,
      client_email: lead.email,

      address: lead.direccion,
      city: lead.zona,
      postal_code: null,

      planned_start_date: lead.fecha_inicio,
      planned_end_date: lead.fecha_fin_estimada,

      approved_budget: lead.importe_cerrado,

      actual_start_date: null,
      actual_end_date: null,

      status: "planned",

      notes: lead.notas,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    return {
      success: false,
      message: "No se pudo generar la obra.",
    };
  }

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
  revalidatePath("/obras");
  revalidatePath(`/obras/${project.id}`);

  return {
    success: true,
    message: "Obra generada correctamente.",
    projectId: project.id,
  };
}

// ─────────────────────────────────────────────────────────────
// Create project
// ─────────────────────────────────────────────────────────────

export async function createProjectAction(
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const raw = {
    name: getFormField(formData, "name"),
    reference: getFormField(formData, "reference"),
    client_name: getFormField(formData, "client_name"),
    client_phone: getFormField(formData, "client_phone"),
    client_email: getFormField(formData, "client_email"),
    address: getFormField(formData, "address"),
    city: getFormField(formData, "city"),
    postal_code: getFormField(formData, "postal_code"),
    planned_start_date: getFormField(
      formData,
      "planned_start_date",
    ),
    planned_end_date: getFormField(
      formData,
      "planned_end_date",
    ),
    approved_budget: getFormField(
      formData,
      "approved_budget",
    ),
    notes: getFormField(formData, "notes"),
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

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      success: false,
      message: subscription.error ?? "Suscripción no activa.",
    };
  }

  const projectCapacity = await requireProjectCapacity();

  if (!projectCapacity.allowed) {
    return {
      success: false,
      message:
        projectCapacity.error ?? "Has alcanzado el límite de obras activas.",
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


// ─────────────────────────────────────────────────────────────
// Update project
// ─────────────────────────────────────────────────────────────

export async function updateProjectAction(
  projectId: string,
  _prevState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const raw = {
    name: getFormField(formData, "name"),
    reference: getFormField(formData, "reference"),
    client_name: getFormField(formData, "client_name"),
    client_phone: getFormField(formData, "client_phone"),
    client_email: getFormField(formData, "client_email"),
    address: getFormField(formData, "address"),
    city: getFormField(formData, "city"),
    postal_code: getFormField(formData, "postal_code"),
    planned_start_date: getFormField(
      formData,
      "planned_start_date",
    ),
    planned_end_date: getFormField(
      formData,
      "planned_end_date",
    ),
    approved_budget: getFormField(
      formData,
      "approved_budget",
    ),
    notes: getFormField(formData, "notes"),
  };

  const parsed = projectSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ??
        "Los datos de la obra no son válidos.",
    };
  }

  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      success: false,
      message: "No se encontró el negocio asociado.",
    };
  }

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      success: false,
      message: subscription.error ?? "Suscripción no activa.",
    };
  }

  const admin = createAdminClient();

  const { data: project, error } = await admin
    .from("projects")
    .update({
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
      notes: parsed.data.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .eq("tenant_id", tenantId)
    .select("id")
    .single();

  if (error || !project) {
    return {
      success: false,
      message: "No se pudo actualizar la obra.",
    };
  }

  revalidatePath("/obras");
  revalidatePath(`/obras/${projectId}`);
  revalidatePath("/");

  return {
    success: true,
    message: "Obra actualizada correctamente.",
    projectId: project.id,
  };
}

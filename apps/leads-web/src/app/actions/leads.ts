"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { EstadoLead, Lead, Project } from "@/types";
import { requireActiveSubscription } from "@/lib/subscription/access";

// ── Schemas ────────────────────────────────────────────────────────

const createLeadSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  telefono: z.string().optional(),
  email: z.string().optional(),
  direccion: z.string().optional(),
  zona: z.string().optional(),
  tipo_obra: z
    .enum(["bano", "cocina", "pintura", "integral", "otro"])
    .optional()
    .or(z.literal("")),
  origen: z
    .enum(["whatsapp", "instagram", "recomendacion", "web", "otro"])
    .optional()
    .or(z.literal("")),
  fecha_inicio: z.string().optional(),
  dias_estimados: z.coerce.number().int().positive().optional(),
});

// ── Tipos ──────────────────────────────────────────────────────────

export interface LeadActionState {
  error: string | null;
  success: boolean;
}

export type CRMOpportunity = Lead & {
  project: Project | null;
};

// ── Helper — obtener tenant del usuario actual ─────────────────────

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

// ── Obtener leads agrupados por estado ────────────────────────────

export async function getLeads(): Promise<Record<EstadoLead, Lead[]>> {
  const supabase = await createClient();

  const empty: Record<EstadoLead, Lead[]> = {
    nuevo: [],
    en_curso: [],
    cerrado: [],
  };

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return empty;

  return data.reduce((acc, lead) => {
    const estado = lead.estado as EstadoLead;
    acc[estado] = [...(acc[estado] ?? []), lead];
    return acc;
  }, empty);
}

// ── Obtener oportunidades CRM con su obra asociada ────────────────

export async function getCRMOpportunities(): Promise<CRMOpportunity[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*, project:projects(*)")
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map(({ project, ...lead }) => ({
    ...lead,
    project: Array.isArray(project) ? (project[0] ?? null) : (project ?? null),
  })) as CRMOpportunity[];
}

// ── Crear lead ────────────────────────────────────────────────────

export async function createLeadAction(
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const raw = {
    nombre: formData.get("nombre") as string,
    telefono: formData.get("telefono") as string,
    email: formData.get("email") as string,
    direccion: formData.get("direccion") as string,
    zona: formData.get("zona") as string,
    tipo_obra: formData.get("tipo_obra") as string,
    origen: formData.get("origen") as string,
    fecha_inicio: formData.get("fecha_inicio") as string,
    dias_estimados: formData.get("dias_estimados") as string,
  };

  const parsed = createLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const tenantId = await getMyTenantId();
  if (!tenantId) {
    return { error: "No se encontró el negocio asociado", success: false };
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

  const fechaInicio = parsed.data.fecha_inicio || null;

  const fechaFinEstimada =
    fechaInicio && parsed.data.dias_estimados
      ? (() => {
          const date = new Date(`${fechaInicio}T00:00:00`);
          date.setDate(date.getDate() + parsed.data.dias_estimados);
          return date.toISOString().split("T")[0];
        })()
      : null;

  const { error } = await admin.from("leads").insert({
    nombre: parsed.data.nombre,
    telefono: parsed.data.telefono || null,
    email: parsed.data.email || null,
    direccion: parsed.data.direccion || null,
    zona: parsed.data.zona || null,
    tipo_obra: parsed.data.tipo_obra || null,
    origen: parsed.data.origen || null,

    fecha_inicio: fechaInicio,
    dias_estimados: parsed.data.dias_estimados ?? null,
    fecha_fin_estimada: fechaFinEstimada,

    tenant_id: tenantId,
    created_by: user!.id,
    estado: "nuevo",
  });

  if (error) {
    return { error: "Error al crear el lead", success: false };
  }

  revalidatePath("/leads");
  return { error: null, success: true };
}

// ── Cambiar estado de un lead ─────────────────────────────────────

export async function updateLeadEstadoAction(
  leadId: string,
  estado: EstadoLead,
): Promise<void> {
  const tenantId = await getMyTenantId();


  if (!tenantId) {
    return;
  }

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return;
  }

  const admin = createAdminClient();

  await admin
    .from("leads")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", leadId)
    .eq("tenant_id", tenantId);

  revalidatePath("/leads");
}

// ── Obtener lead por ID ───────────────────────────────────────────

export async function getLeadById(id: string): Promise<Lead | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Lead;
}

// ── Actualizar campos del lead ────────────────────────────────────

export interface UpdateLeadState {
  error: string | null;
  success: boolean;
}

const updateLeadSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  telefono: z.string().optional(),
  email: z.string().optional(),
  direccion: z.string().optional(),
  zona: z.string().optional(),
  tipo_obra: z
    .enum(["bano", "cocina", "pintura", "integral", "otro"])
    .optional()
    .or(z.literal("")),
  origen: z
    .enum(["whatsapp", "instagram", "recomendacion", "web", "otro"])
    .optional()
    .or(z.literal("")),
  estado: z.enum(["nuevo", "en_curso", "cerrado"]),
  importe_ofertado: z.string().optional(),
  importe_cerrado: z.string().optional(),
  motivo_perdida: z.string().optional(),
  notas: z.string().optional(),
  fecha_inicio: z.string().optional(),
  dias_estimados: z.string().optional(),
});

export async function updateLeadAction(
  id: string,
  _prevState: UpdateLeadState,
  formData: FormData,
): Promise<UpdateLeadState> {
  const raw = {
    nombre: formData.get("nombre") as string,
    telefono: formData.get("telefono") as string,
    email: formData.get("email") as string,
    direccion: formData.get("direccion") as string,
    zona: formData.get("zona") as string,
    tipo_obra: formData.get("tipo_obra") as string,
    origen: formData.get("origen") as string,
    estado: formData.get("estado") as string,
    importe_ofertado: formData.get("importe_ofertado") as string,
    importe_cerrado: formData.get("importe_cerrado") as string,
    motivo_perdida: formData.get("motivo_perdida") as string,
    notas: formData.get("notas") as string,
    fecha_inicio: formData.get("fecha_inicio") as string,
    dias_estimados: formData.get("dias_estimados") as string,
  };

  const parsed = updateLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return { error: "No se pudo identificar el tenant", success: false };
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
    .from("leads")
    .update({
      nombre: parsed.data.nombre,
      telefono: parsed.data.telefono || null,
      email: parsed.data.email || null,
      direccion: parsed.data.direccion || null,
      zona: parsed.data.zona || null,
      tipo_obra: parsed.data.tipo_obra || null,
      origen: parsed.data.origen || null,
      estado: parsed.data.estado,
      importe_ofertado: parsed.data.importe_ofertado
        ? parseFloat(parsed.data.importe_ofertado)
        : null,
      importe_cerrado: parsed.data.importe_cerrado
        ? parseFloat(parsed.data.importe_cerrado)
        : null,
      motivo_perdida: parsed.data.motivo_perdida || null,
      notas: parsed.data.notas || null,
      fecha_inicio: parsed.data.fecha_inicio || null,
      dias_estimados: parsed.data.dias_estimados
        ? parseInt(parsed.data.dias_estimados)
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId)

  if (error) {
    return { error: "Error al actualizar el lead", success: false };
  }

  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  return { error: null, success: true };
}

// ── Extender plazo de obra ────────────────────────────────────────

export async function extenderPlazoAction(
  leadId: string,
  diasExtra: number,
): Promise<void> {
  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return;
  }

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return;
  }

  const admin = createAdminClient();

  const { data: lead } = await admin
    .from("leads")
    .select("dias_estimados")
    .eq("id", leadId)
    .eq("tenant_id", tenantId)
    .single();

  if (!lead) return;

  const nuevosDias = (lead.dias_estimados ?? 0) + diasExtra;

  await admin
    .from("leads")
    .update({
      dias_estimados: nuevosDias,
      updated_at: new Date().toISOString(),
    })
    .eq("id", leadId)
    .eq("tenant_id", tenantId);

  revalidatePath("/leads");
  revalidatePath(`/leads/${leadId}`);
}

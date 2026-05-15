"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { EstadoLead, Lead } from "@/types";

// ── Schemas ────────────────────────────────────────────────────────

const createLeadSchema = z.object({
  nombre: z.string().min(2, "El nombre es obligatorio"),
  telefono: z.string().optional(),
  zona: z.string().optional(),
  tipo_obra: z.enum(["bano", "cocina", "pintura", "integral", "otro"]),
  origen: z.enum(["whatsapp", "instagram", "recomendacion", "web", "otro"]),
});

// ── Tipos ──────────────────────────────────────────────────────────

export interface LeadActionState {
  error: string | null;
  success: boolean;
}

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
    contactado: [],
    visita: [],
    presupuesto: [],
    cerrado: [],
    perdido: [],
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

// ── Crear lead ────────────────────────────────────────────────────

export async function createLeadAction(
  _prevState: LeadActionState,
  formData: FormData,
): Promise<LeadActionState> {
  const raw = {
    nombre: formData.get("nombre") as string,
    telefono: formData.get("telefono") as string,
    zona: formData.get("zona") as string,
    tipo_obra: formData.get("tipo_obra") as string,
    origen: formData.get("origen") as string,
  };

  const parsed = createLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message, success: false };
  }

  const tenantId = await getMyTenantId();
  if (!tenantId) {
    return { error: "No se encontró el negocio asociado", success: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { error } = await admin.from("leads").insert({
    ...parsed.data,
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
  const admin = createAdminClient();

  await admin
    .from("leads")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", leadId);

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
  zona: z.string().optional(),
  tipo_obra: z.enum(["bano", "cocina", "pintura", "integral", "otro"]),
  origen: z.enum(["whatsapp", "instagram", "recomendacion", "web", "otro"]),
  estado: z.enum([
    "nuevo",
    "contactado",
    "visita",
    "presupuesto",
    "cerrado",
    "perdido",
  ]),
  importe_ofertado: z.string().optional(),
  importe_cerrado: z.string().optional(),
  motivo_perdida: z.string().optional(),
  notas: z.string().optional(),
});

export async function updateLeadAction(
  id: string,
  _prevState: UpdateLeadState,
  formData: FormData,
): Promise<UpdateLeadState> {
  const raw = {
    nombre: formData.get("nombre") as string,
    telefono: formData.get("telefono") as string,
    zona: formData.get("zona") as string,
    tipo_obra: formData.get("tipo_obra") as string,
    origen: formData.get("origen") as string,
    estado: formData.get("estado") as string,
    importe_ofertado: formData.get("importe_ofertado") as string,
    importe_cerrado: formData.get("importe_cerrado") as string,
    motivo_perdida: formData.get("motivo_perdida") as string,
    notas: formData.get("notas") as string,
  };

  const parsed = updateLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message, success: false };
  }

  const admin = createAdminClient();

  const { error } = await admin
    .from("leads")
    .update({
      ...parsed.data,
      importe_ofertado: parsed.data.importe_ofertado
        ? parseFloat(parsed.data.importe_ofertado)
        : null,
      importe_cerrado: parsed.data.importe_cerrado
        ? parseFloat(parsed.data.importe_cerrado)
        : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: "Error al actualizar el lead", success: false };
  }

  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  return { error: null, success: true };
}

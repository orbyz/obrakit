"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Seguimiento } from "@/types";

// ── Schema ─────────────────────────────────────────────────────────

const createSeguimientoSchema = z.object({
  tipo: z.enum(["llamada", "whatsapp", "visita", "presupuesto", "nota"]),
  descripcion: z.string().min(1, "Escribe una nota o descripción"),
});

// ── Tipos ──────────────────────────────────────────────────────────

export interface SeguimientoActionState {
  error: string | null;
  success: boolean;
}

// ── Obtener seguimientos de un lead ───────────────────────────────

export async function getSeguimientos(leadId: string): Promise<Seguimiento[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("seguimientos")
    .select("*")
    .eq("lead_id", leadId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as Seguimiento[];
}

// ── Crear seguimiento ─────────────────────────────────────────────

export async function createSeguimientoAction(
  leadId: string,
  _prevState: SeguimientoActionState,
  formData: FormData,
): Promise<SeguimientoActionState> {
  const raw = {
    tipo: formData.get("tipo") as string,
    descripcion: formData.get("descripcion") as string,
  };

  const parsed = createSeguimientoSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message, success: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado", success: false };

  // Obtener tenant_id del lead
  const { data: lead } = await supabase
    .from("leads")
    .select("tenant_id")
    .eq("id", leadId)
    .single();

  if (!lead) return { error: "Lead no encontrado", success: false };

  const admin = createAdminClient();

  const { error } = await admin.from("seguimientos").insert({
    lead_id: leadId,
    tenant_id: lead.tenant_id,
    created_by: user.id,
    tipo: parsed.data.tipo,
    descripcion: parsed.data.descripcion,
  });

  if (error) {
    return { error: "Error al guardar el seguimiento", success: false };
  }

  revalidatePath(`/leads/${leadId}`);
  return { error: null, success: true };
}

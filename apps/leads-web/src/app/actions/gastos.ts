"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { Gasto } from "@/types";

// ── Schema ─────────────────────────────────────────────────────────

const gastoSchema = z.object({
  material: z.string().min(1, "El material es obligatorio"),
  importe: z.string().min(1, "El importe es obligatorio"),
  proveedor: z.string().optional(),
  categoria: z.enum([
    "ceramica",
    "fontaneria",
    "electricidad",
    "pintura",
    "herramientas",
    "otro",
  ]),
  cantidad: z.string().optional(),
  unidad: z
    .enum(["m2", "ml", "kg", "ud", "sacos", "litros", "otro"])
    .optional(),
  obra_nombre: z.string().nullable().optional(),
  lead_id: z.string().optional(),
  notas: z.string().optional(),
  fecha: z.string().optional(),
});

// ── Tipos ──────────────────────────────────────────────────────────

export interface GastoActionState {
  error: string | null;
  success: boolean;
}

// ── Obtener todos los gastos ───────────────────────────────────────

export async function getGastos(): Promise<Gasto[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .order("fecha", { ascending: false });

  if (error || !data) return [];
  return data as Gasto[];
}

// ── Obtener gastos de un lead ──────────────────────────────────────

export async function getGastosByLead(leadId: string): Promise<Gasto[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gastos")
    .select("*")
    .eq("lead_id", leadId)
    .order("fecha", { ascending: false });

  if (error || !data) return [];
  return data as Gasto[];
}

// ── Obtener resumen financiero ─────────────────────────────────────

export async function getResumenGastos(): Promise<{
  totalMes: number;
  totalAnio: number;
  porCategoria: Record<string, number>;
  porObra: { nombre: string; total: number }[];
}> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("gastos").select("*");

  if (error || !data) {
    return { totalMes: 0, totalAnio: 0, porCategoria: {}, porObra: [] };
  }

  const now = new Date();
  const mesActual = now.getMonth();
  const anioActual = now.getFullYear();

  const totalMes = data
    .filter((g) => {
      const fecha = new Date(g.fecha);
      return (
        fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual
      );
    })
    .reduce((acc, g) => acc + Number(g.importe), 0);

  const totalAnio = data
    .filter((g) => new Date(g.fecha).getFullYear() === anioActual)
    .reduce((acc, g) => acc + Number(g.importe), 0);

  const porCategoria = data.reduce(
    (acc, g) => {
      const cat = g.categoria ?? "otro";
      acc[cat] = (acc[cat] ?? 0) + Number(g.importe);
      return acc;
    },
    {} as Record<string, number>,
  );

  // Agrupar por obra (lead o nombre libre)
  const obraMap = data.reduce(
    (acc, g) => {
      const nombre = g.obra_nombre ?? "Sin obra";
      acc[nombre] = (acc[nombre] ?? 0) + Number(g.importe);
      return acc;
    },
    {} as Record<string, number>,
  );

  const porObra = Object.entries(obraMap)
    .map(([nombre, total]) => ({ nombre, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return { totalMes, totalAnio, porCategoria, porObra };
}

// ── Crear gasto ────────────────────────────────────────────────────

export async function createGastoAction(
  _prevState: GastoActionState,
  formData: FormData,
): Promise<GastoActionState> {
  const raw = {
    material: formData.get("material") as string,
    importe: formData.get("importe") as string,
    proveedor: formData.get("proveedor") as string,
    categoria: formData.get("categoria") as string,
    cantidad: formData.get("cantidad") as string,
    unidad: formData.get("unidad") as string,
    obra_nombre: formData.get("obra_nombre") as string,
    lead_id: formData.get("lead_id") as string,
    notas: formData.get("notas") as string,
    fecha: formData.get("fecha") as string,
  };

  const parsed = gastoSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "No autenticado", success: false };

  // Obtener tenant_id
  const { data: member } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  if (!member) return { error: "No se encontró el negocio", success: false };

  // Determinar obra_nombre si hay lead_id
  let obraNombreFinal = parsed.data.obra_nombre || null;

  if (parsed.data.lead_id) {
    const { data: lead } = await supabase
      .from("leads")
      .select("nombre")
      .eq("id", parsed.data.lead_id)
      .single();

    if (lead) {
      obraNombreFinal = lead.nombre;
    }
  }

  const admin = createAdminClient();

  const { error } = await admin.from("gastos").insert({
    tenant_id: member.tenant_id,
    created_by: user.id,
    material: parsed.data.material,
    importe: parseFloat(parsed.data.importe),
    proveedor: parsed.data.proveedor || null,
    categoria: parsed.data.categoria,
    cantidad: parsed.data.cantidad ? parseFloat(parsed.data.cantidad) : null,
    unidad: parsed.data.unidad || null,
    obra_nombre: obraNombreFinal,
    lead_id: parsed.data.lead_id || null,
    notas: parsed.data.notas || null,
    fecha: parsed.data.fecha || new Date().toISOString().split("T")[0],
  });

  if (error) {
    return { error: "Error al guardar el gasto", success: false };
  }

  revalidatePath("/materiales");
  return { error: null, success: true };
}

// ── Eliminar gasto ─────────────────────────────────────────────────

export async function deleteGastoAction(id: string): Promise<void> {
  const admin = createAdminClient();
  await admin.from("gastos").delete().eq("id", id);
  revalidatePath("/materiales");
}

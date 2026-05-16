"use server";

import { createClient } from "@/lib/supabase/server";

// ── Tipos ──────────────────────────────────────────────────────────

export interface RentabilidadPorTipo {
  tipo: string;
  cerrados: number;
  facturado: number;
  gastado: number;
  margen: number;
}

export interface RentabilidadPorOrigen {
  origen: string;
  total: number;
  cerrados: number;
  tasaCierre: number;
  ticketMedio: number;
}

export interface ResumenGeneral {
  totalFacturado: number;
  totalGastado: number;
  margenNeto: number;
  leadsCerrados: number;
  tasaCierreGlobal: number;
}

// ── Obtener resumen general ────────────────────────────────────────

export async function getResumenGeneral(): Promise<ResumenGeneral> {
  const supabase = await createClient();

  // Leads
  const { data: leads } = await supabase.from("leads").select("*");
  if (!leads)
    return {
      totalFacturado: 0,
      totalGastado: 0,
      margenNeto: 0,
      leadsCerrados: 0,
      tasaCierreGlobal: 0,
    };

  const leadsCerrados = leads.filter((l) => l.estado === "cerrado");
  const totalFacturado = leadsCerrados.reduce(
    (acc, l) => acc + Number(l.importe_cerrado || 0),
    0,
  );

  // Gastos
  const { data: gastos } = await supabase.from("gastos").select("*");
  const totalGastado = gastos
    ? gastos.reduce((acc, g) => acc + Number(g.importe), 0)
    : 0;

  const margenNeto = totalFacturado - totalGastado;
  const tasaCierreGlobal =
    leads.length > 0
      ? Math.round((leadsCerrados.length / leads.length) * 100)
      : 0;

  return {
    totalFacturado,
    totalGastado,
    margenNeto,
    leadsCerrados: leadsCerrados.length,
    tasaCierreGlobal,
  };
}

// ── Rentabilidad por tipo de obra ──────────────────────────────────

export async function getRentabilidadPorTipo(): Promise<RentabilidadPorTipo[]> {
  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("estado", "cerrado");

  if (!leads || leads.length === 0) return [];

  const { data: gastos } = await supabase.from("gastos").select("*");

  // Agrupar por tipo de obra
  const tipoMap: Record<
    string,
    {
      cerrados: number;
      facturado: number;
      leadIds: string[];
    }
  > = {};

  leads.forEach((l) => {
    const tipo = l.tipo_obra ?? "otro";
    if (!tipoMap[tipo]) {
      tipoMap[tipo] = { cerrados: 0, facturado: 0, leadIds: [] };
    }
    tipoMap[tipo].cerrados++;
    tipoMap[tipo].facturado += Number(l.importe_cerrado || 0);
    tipoMap[tipo].leadIds.push(l.id);
  });

  // Sumar gastos por tipo
  const result: RentabilidadPorTipo[] = Object.entries(tipoMap).map(
    ([tipo, data]) => {
      const gastado = gastos
        ? gastos
            .filter((g) => data.leadIds.includes(g.lead_id ?? ""))
            .reduce((acc, g) => acc + Number(g.importe), 0)
        : 0;

      return {
        tipo,
        cerrados: data.cerrados,
        facturado: data.facturado,
        gastado,
        margen: data.facturado - gastado,
      };
    },
  );

  return result.sort((a, b) => b.margen - a.margen);
}

// ── Rentabilidad por origen ────────────────────────────────────────

export async function getRentabilidadPorOrigen(): Promise<
  RentabilidadPorOrigen[]
> {
  const supabase = await createClient();

  const { data: leads } = await supabase.from("leads").select("*");
  if (!leads || leads.length === 0) return [];

  // Agrupar por origen
  const origenMap: Record<
    string,
    {
      total: number;
      cerrados: number;
      facturadoTotal: number;
    }
  > = {};

  leads.forEach((l) => {
    const origen = l.origen ?? "otro";
    if (!origenMap[origen]) {
      origenMap[origen] = { total: 0, cerrados: 0, facturadoTotal: 0 };
    }
    origenMap[origen].total++;
    if (l.estado === "cerrado") {
      origenMap[origen].cerrados++;
      origenMap[origen].facturadoTotal += Number(l.importe_cerrado || 0);
    }
  });

  const result: RentabilidadPorOrigen[] = Object.entries(origenMap).map(
    ([origen, data]) => ({
      origen,
      total: data.total,
      cerrados: data.cerrados,
      tasaCierre:
        data.total > 0 ? Math.round((data.cerrados / data.total) * 100) : 0,
      ticketMedio: data.cerrados > 0 ? data.facturadoTotal / data.cerrados : 0,
    }),
  );

  return result.sort((a, b) => b.tasaCierre - a.tasaCierre);
}

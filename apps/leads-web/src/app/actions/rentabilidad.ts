"use server";

import { createClient } from "@/lib/supabase/server";

import { getProjects } from "./projects";
import { getProjectDashboard } from "./project-dashboard";

export interface RentabilidadPorTipo {
  tipo: string;
  cerrados: number;
  facturado: number;
  gastado: number;
  margen: number;
}

export interface ResumenGeneral {
  totalFacturado: number;
  totalGastado: number;
  margenNeto: number;
  leadsCerrados: number;
  tasaCierreGlobal: number;
}

export interface RentabilidadPorObra {
  id: string;
  nombre: string;
  facturado: number;
  gastado: number;
  margen: number;
  margenPorcentaje: number;
}

interface ProjectProfitabilityContext {
  id: string;
  name: string;
  leadId: string | null;
  revenue: number;
  totalCost: number;
  grossProfit: number;
  margin: number;
}

async function getCompletedProjects() {
  const projects = await getProjects();

  const completedProjects = projects.filter(
    (project) => project.status === "completed",
  );

  const dashboards = await Promise.all(
    completedProjects.map((project) =>
      getProjectDashboard(project.id),
    ),
  );

  return completedProjects
    .map((project, index) => {
      const dashboard = dashboards[index];

      if (!dashboard) {
        return null;
      }

      return {
        id: project.id,
        name: project.name,
        leadId: project.lead_id,
        revenue: dashboard.profitability.revenue,
        totalCost: dashboard.profitability.totalCost,
        grossProfit: dashboard.profitability.grossProfit,
        margin: dashboard.profitability.margin,
      } satisfies ProjectProfitabilityContext;
    })
    .filter(
      (project): project is ProjectProfitabilityContext =>
        project !== null,
    );
}

// ── Resumen general ────────────────────────────────────────────────

export async function getResumenGeneral(): Promise<ResumenGeneral> {
  const [projects, allProjects] = await Promise.all([
    getCompletedProjects(),
    getProjects(),
  ]);

  const totalFacturado = projects.reduce(
    (total, project) => total + project.revenue,
    0,
  );

  const totalGastado = projects.reduce(
    (total, project) => total + project.totalCost,
    0,
  );

  const margenNeto = projects.reduce(
    (total, project) => total + project.grossProfit,
    0,
  );

  return {
    totalFacturado,
    totalGastado,
    margenNeto,
    leadsCerrados: projects.length,
    tasaCierreGlobal:
      allProjects.length > 0
        ? Math.round((projects.length / allProjects.length) * 100)
        : 0,
  };
}

// ── Rentabilidad por tipo de obra ──────────────────────────────────

export async function getRentabilidadPorTipo(): Promise<
  RentabilidadPorTipo[]
> {
  const projects = await getCompletedProjects();

  if (projects.length === 0) {
    return [];
  }

  const leadIds = projects
    .map((project) => project.leadId)
    .filter((id): id is string => id !== null);

  const supabase = await createClient();

  const { data: leads } = await supabase
    .from("leads")
    .select("id, tipo_obra")
    .in("id", leadIds);

  const tipoByLeadId = new Map(
    (leads ?? []).map((lead) => [
      lead.id,
      lead.tipo_obra ?? "otro",
    ]),
  );

  const tipoMap: Record<
    string,
    {
      cerrados: number;
      facturado: number;
      gastado: number;
    }
  > = {};

  for (const project of projects) {
    const tipo = tipoByLeadId.get(project.leadId ?? "") ?? "otro";

    if (!tipoMap[tipo]) {
      tipoMap[tipo] = {
        cerrados: 0,
        facturado: 0,
        gastado: 0,
      };
    }

    tipoMap[tipo].cerrados += 1;
    tipoMap[tipo].facturado += project.revenue;
    tipoMap[tipo].gastado += project.totalCost;
  }

  return Object.entries(tipoMap)
    .map(([tipo, data]) => ({
      tipo,
      cerrados: data.cerrados,
      facturado: data.facturado,
      gastado: data.gastado,
      margen: data.facturado - data.gastado,
    }))
    .sort((a, b) => b.margen - a.margen);
}

// ── Rentabilidad por obra ──────────────────────────────────────────

export async function getRentabilidadPorObra(): Promise<
  RentabilidadPorObra[]
> {
  const projects = await getCompletedProjects();

  return projects
    .map((project) => ({
      id: project.id,
      nombre: project.name,
      facturado: project.revenue,
      gastado: project.totalCost,
      margen: project.grossProfit,
      margenPorcentaje: project.margin,
    }))
    .sort((a, b) => b.margen - a.margen);
}

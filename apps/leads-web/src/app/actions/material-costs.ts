"use server";

// ─────────────────────────────────────────────────────────────
// Imports
// ─────────────────────────────────────────────────────────────

import { createClient } from "@/lib/supabase/server";

import type {
  MaterialConsumption,
  MaterialCostSummary,
  MaterialCostByMaterial,
  ProjectMaterialCost,
} from "@/types";

// ─────────────────────────────────────────────────────────────
// Tipos auxiliares
// ─────────────────────────────────────────────────────────────

interface MaterialConsumptionRow extends MaterialConsumption {
  project: {
    id: string;
    name: string;
  } | null;
}

// ─────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────

async function getConsumptionRows(): Promise<
  MaterialConsumptionRow[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("material_consumptions")
    .select(`
      *,
      project:projects(
        id,
        name
      )
    `)
    .order("fecha", { ascending: false });

  if (error) {
    throw new Error(
      `Error al obtener consumos de materiales: ${error.message}`,
    );
  }

  return (data ?? []) as MaterialConsumptionRow[];
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function sumTotalCost(
  consumptions: MaterialConsumption[],
): number {
  return consumptions.reduce(
    (total, consumption) => total + consumption.importe_total,
    0,
  );
}

function sumTotalQuantity(
  consumptions: MaterialConsumption[],
): number {
  return consumptions.reduce(
    (total, consumption) => total + consumption.cantidad,
    0,
  );
}

// ─────────────────────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────────────────────

export async function getProjectMaterialCost(
  projectId: string,
): Promise<ProjectMaterialCost | null> {
  const consumptions = (await getConsumptionRows()).filter(
    (consumption) => consumption.project_id === projectId,
  );

  if (consumptions.length === 0) {
    return null;
  }

  return {
    project_id: projectId,
    project_name: consumptions[0].project?.name ?? "Obra",
    total_consumptions: consumptions.length,
    total_cost: sumTotalCost(consumptions),
  };
}

export async function getMaterialCostSummary(): Promise<MaterialCostSummary> {
  const consumptions = await getConsumptionRows();

  return {
    total_consumptions: consumptions.length,
    total_quantity: sumTotalQuantity(consumptions),
    total_cost: sumTotalCost(consumptions),
    consumptions,
  };
}

export async function getMaterialCostsByProject(): Promise<
  ProjectMaterialCost[]
> {
  const consumptions = await getConsumptionRows();

  const projects = new Map<string, ProjectMaterialCost>();

  for (const consumption of consumptions) {
    const current = projects.get(consumption.project_id);

    if (current) {
      current.total_consumptions += 1;
      current.total_cost += consumption.importe_total;
      continue;
    }

    projects.set(consumption.project_id, {
      project_id: consumption.project_id,
      project_name: consumption.project?.name ?? "Obra",
      total_consumptions: 1,
      total_cost: consumption.importe_total,
    });
  }

  return [...projects.values()].sort(
    (a, b) => b.total_cost - a.total_cost,
  );
}

export async function getMaterialCostsByMaterial(): Promise<
  MaterialCostByMaterial[]
> {
  const consumptions = await getConsumptionRows();

  const materials = new Map<string, MaterialCostByMaterial>();

  for (const consumption of consumptions) {
    const current = materials.get(consumption.material_id);

    if (current) {
      current.total_quantity += consumption.cantidad;
      current.total_cost += consumption.importe_total;
      continue;
    }

    materials.set(consumption.material_id, {
      material_id: consumption.material_id,
      material_name: consumption.material_nombre_snapshot,
      total_quantity: consumption.cantidad,
      total_cost: consumption.importe_total,
    });
  }

  return [...materials.values()].sort(
    (a, b) => b.total_cost - a.total_cost,
  );
}

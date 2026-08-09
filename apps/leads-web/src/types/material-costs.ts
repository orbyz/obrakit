import type { MaterialConsumption } from "./material-consumptions";

// ── Resumen de costes de materiales ──────────────────────────────

export interface MaterialCostSummary {
  total_consumptions: number;

  total_quantity: number;

  total_cost: number;

  consumptions: MaterialConsumption[];
}

// ── Resumen por proyecto ─────────────────────────────────────────

export interface ProjectMaterialCost {
  project_id: string;

  project_name: string;

  total_consumptions: number;

  total_cost: number;
}

// ── Resumen por material ─────────────────────────────────────────

export interface MaterialCostByMaterial {
  material_id: string;

  material_name: string;

  total_quantity: number;

  total_cost: number;
}

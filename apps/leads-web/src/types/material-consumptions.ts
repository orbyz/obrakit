// ── Modelo principal ──────────────────────────────────────────────

import type { MaterialUnit } from "./materials";

export interface MaterialConsumption {
  id: string;

  tenant_id: string;

  project_id: string;

  material_id: string;

  material_nombre_snapshot: string;

  cantidad: number;

  unidad_snapshot: MaterialUnit;

  precio_snapshot: number;

  importe_total: number;

  fecha: string;

  notas: string | null;

  created_by: string | null;

  created_at: string;

  updated_at: string;
}

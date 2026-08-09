// ── Tipos auxiliares ──────────────────────────────────────────────

export type MaterialCategory =
  | "albanileria"
  | "ceramica"
  | "fontaneria"
  | "electricidad"
  | "pintura"
  | "carpinteria"
  | "ferreteria"
  | "aislamiento"
  | "cubiertas"
  | "yesos"
  | "hormigon"
  | "otro";

export type MaterialUnit =
  | "und"
  | "m2"
  | "ml"
  | "kg"
  | "lt"
  | "sacos"
  | "m3"
  | "rollos"
  | "cajas"
  | "palets";

// ── Modelo principal ──────────────────────────────────────────────

export interface Material {
  id: string;

  tenant_id: string;

  nombre: string;

  descripcion: string | null;

  categoria: MaterialCategory;

  unidad_base: MaterialUnit;

  precio_habitual: number;

  marca: string | null;

  referencia: string | null;

  activo: boolean;

  created_at: string;

  updated_at: string;
}

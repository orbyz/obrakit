export type TipoObra = "bano" | "cocina" | "pintura" | "integral" | "otro";
export type OrigenLead =
  | "whatsapp"
  | "instagram"
  | "recomendacion"
  | "web"
  | "otro";
export type EstadoLead = "nuevo" | "en_curso" | "cerrado";
export type RolMiembro = "owner" | "admin" | "viewer";
export type Plan = "free" | "pro";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tenant {
  id: string;
  nombre: string;
  plan: Plan;
  created_at: string;
}

export interface TenantMember {
  id: string;
  tenant_id: string;
  user_id: string;
  role: RolMiembro;
  created_at: string;
}

export interface Lead {
  id: string;
  tenant_id: string;
  created_by: string | null;
  nombre: string;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  zona: string | null;
  tipo_obra: TipoObra | null;
  origen: OrigenLead | null;
  estado: EstadoLead;
  importe_ofertado: number | null;
  importe_cerrado: number | null;
  motivo_perdida: string | null;
  notas: string | null;
  fecha_visita: string | null;
  fecha_inicio: string | null;
  dias_estimados: number | null;
  fecha_fin_estimada: string | null;
  created_at: string;
  updated_at: string;
}

export interface Seguimiento {
  id: string;
  lead_id: string;
  tenant_id: string;
  created_by: string | null;
  tipo: "llamada" | "whatsapp" | "visita" | "presupuesto" | "nota";
  descripcion: string | null;
  created_at: string;
}

export type CategoriaGasto =
  | "ceramica"
  | "fontaneria"
  | "electricidad"
  | "pintura"
  | "herramientas"
  | "otro";

export type UnidadGasto =
  | "m2"
  | "ml"
  | "kg"
  | "ud"
  | "sacos"
  | "litros"
  | "otro";

export interface Gasto {
  id: string;
  tenant_id: string;
  created_by: string | null;
  lead_id: string | null;
  obra_nombre: string | null;
  proveedor: string | null;
  material: string;
  importe: number;
  cantidad: number | null;
  unidad: UnidadGasto | null;
  categoria: CategoriaGasto | null;
  notas: string | null;
  fecha: string;
  created_at: string;
}

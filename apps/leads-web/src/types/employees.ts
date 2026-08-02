// ── Tipos auxiliares ──────────────────────────────────────────────

export type EstadoEmpleado =
  | "activo"
  | "vacaciones"
  | "baja"
  | "inactivo";

export type TipoContrato =
  | "empleado"
  | "autonomo"
  | "temporal"
  | "subcontrata";

export type EmployeePricingModel = "hourly" | "daily" | "monthly" | "fixed";

// ── Modelo principal ──────────────────────────────────────────────

export interface Employee {
  id: string;

  tenant_id: string;

  created_by: string | null;

  nombre: string;

  apellidos: string | null;

  telefono: string | null;

  email: string | null;

  direccion: string | null;

  foto_url: string | null;

  especialidad: string | null;

  tipo_contrato: TipoContrato;

  estado: EstadoEmpleado;

  fecha_alta: string | null;

  /** @deprecated Use hourly_rate with pricing_model instead. */
  coste_hora: number | null;

  pricing_model: EmployeePricingModel;

  hourly_rate: number | null;

  daily_rate: number | null;

  monthly_salary: number | null;

  fixed_rate: number | null;

  salario_mensual: number | null;

  notas: string | null;

  created_at: string;

  updated_at: string;
}

import type { EmployeePricingModel } from "./employees";

export interface EmployeeWorkLog {
  id: string;
  tenant_id: string;
  assignment_id: string;
  employee_id: string;
  project_id: string;
  work_date: string;
  start_time: string;
  end_time: string;
  break_minutes: number;
  worked_minutes: number;
  pricing_model_snapshot: EmployeePricingModel | null;
  pricing_value_snapshot: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateEmployeeWorkLogInput {
  assignment_id: string;
  work_date: string;
  start_time: string;
  end_time: string;
  break_minutes: number;
  notes?: string;
}

export interface UpdateEmployeeWorkLogInput {
  work_date?: string;
  start_time?: string;
  end_time?: string;
  break_minutes?: number;
  notes?: string | null;
}

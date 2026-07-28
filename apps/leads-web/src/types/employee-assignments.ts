export type EmployeeAssignmentStatus =
  | "planned"
  | "active"
  | "paused"
  | "finished"
  | "cancelled";

export interface EmployeeAssignmentLead {
  nombre: string;
}

export interface EmployeeAssignment {
  id: string;
  tenant_id: string;
  employee_id: string;
  project_id: string;
  lead: EmployeeAssignmentLead | null;
  role: string;
  status: EmployeeAssignmentStatus;
  start_date: string;
  end_date: string | null;
  hourly_rate_snapshot: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

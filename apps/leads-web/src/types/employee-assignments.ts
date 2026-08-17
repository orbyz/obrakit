export type EmployeeAssignmentStatus =
  | "planned"
  | "active"
  | "paused"
  | "finished"
  | "cancelled";

export interface EmployeeAssignmentProject {
  name: string;
}

export interface EmployeeAssignment {
  id: string;
  tenant_id: string;
  employee_id: string;
  project_id: string;
  project: EmployeeAssignmentProject | null;
  role: string;
  status: EmployeeAssignmentStatus;
  start_date: string;
  end_date: string | null;
  work_days: number[];
  default_start_time: string | null;
  default_end_time: string | null;
  default_break_minutes: number;
  hourly_rate_snapshot: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

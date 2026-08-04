export type ProjectStatus =
  | "draft"
  | "planned"
  | "in_progress"
  | "paused"
  | "completed"
  | "cancelled";

export interface Project {
  id: string;
  tenant_id: string;
  lead_id: string | null;
  name: string;
  reference: string | null;
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  planned_start_date: string | null;
  planned_end_date: string | null;
  actual_start_date: string | null;
  actual_end_date: string | null;
  approved_budget: number | null;
  status: ProjectStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

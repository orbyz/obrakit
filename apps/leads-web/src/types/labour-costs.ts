import type { EmployeePricingModel } from "./employees";

export interface LabourCostProject {
  id: string;
  nombre: string;
}

export interface LabourCostWorkLog {
  id: string;
  fecha: string;
  horas: number;
  coste: number | null;
  pricing_model: EmployeePricingModel | null;
  obra: LabourCostProject | null;
}

export interface LabourCostSummary {
  total_minutes: number;
  total_hours: number;
  total_cost: number | null;
  worklogs: LabourCostWorkLog[];
}

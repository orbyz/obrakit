import type { EmployeePricingModel } from "./employees";

export type ProjectCostCategory = "material" | "labor" | "expense";

export interface ProjectRevenue {
  amount: number;
}

export interface ProjectCost {
  category: ProjectCostCategory;
  description: string;
  quantity: number;
  unitCost: number;
  totalCost: number;

  sourceId?: string;
  employeeId?: string;
  materialId?: string;
  expenseId?: string;

  pricingModel?: EmployeePricingModel | null;
}

export interface ProjectFinancialData {
  revenue: ProjectRevenue;
  costs: ProjectCost[];
}

export interface ProjectProfitability {
  revenue: number;
  materialCost: number;
  laborCost: number;
  expenseCost: number;
  totalCost: number;
  grossProfit: number;
  margin: number;
}

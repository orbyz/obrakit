import type {
  EmployeeWorkLog,
  Gasto,
  MaterialConsumption,
  Project,
} from "@/types";

import type {
  ProjectCost,
  ProjectFinancialData,
  ProjectRevenue,
} from "@/types/profitability";

function isValidAmount(value: number | null | undefined): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0
  );
}

function roundCurrency(value: number): number {
  return Number(value.toFixed(2));
}

export function mapProjectRevenue(
  project: Project,
): ProjectRevenue {
  return {
    amount: isValidAmount(project.approved_budget)
      ? project.approved_budget
      : 0,
  };
}

export function mapMaterialConsumptionToProjectCost(
  consumption: MaterialConsumption,
): ProjectCost {
  const quantity = isValidAmount(consumption.cantidad)
    ? consumption.cantidad
    : 0;

  const unitCost = isValidAmount(consumption.precio_snapshot)
    ? consumption.precio_snapshot
    : 0;

  const totalCost = isValidAmount(consumption.importe_total)
    ? consumption.importe_total
    : roundCurrency(quantity * unitCost);

  return {
    category: "material",
    description: consumption.material_nombre_snapshot,
    quantity,
    unitCost,
    totalCost,
    sourceId: consumption.id,
    materialId: consumption.material_id,
  };
}

export function mapEmployeeWorkLogToProjectCost(
  workLog: EmployeeWorkLog,
): ProjectCost | null {
  if (
    !isValidAmount(workLog.worked_minutes) ||
    !isValidAmount(workLog.pricing_value_snapshot)
  ) {
    return null;
  }

  const pricingModel = workLog.pricing_model_snapshot;

  if (pricingModel === "hourly") {
    const hours = workLog.worked_minutes / 60;
    const unitCost = workLog.pricing_value_snapshot;

    return {
      category: "labor",
      description: "Mano de obra",
      quantity: hours,
      unitCost,
      totalCost: roundCurrency(hours * unitCost),
      sourceId: workLog.id,
      employeeId: workLog.employee_id,
      pricingModel,
    };
  }

  if (pricingModel === "daily") {
    return {
      category: "labor",
      description: "Mano de obra",
      quantity: 1,
      unitCost: workLog.pricing_value_snapshot,
      totalCost: roundCurrency(workLog.pricing_value_snapshot),
      sourceId: workLog.id,
      employeeId: workLog.employee_id,
      pricingModel,
    };
  }

  return null;
}

export function mapExpenseToProjectCost(
  expense: Gasto,
): ProjectCost {
  const totalCost = isValidAmount(expense.importe)
    ? expense.importe
    : 0;

  const quantity =
    isValidAmount(expense.cantidad) && expense.cantidad > 0
      ? expense.cantidad
      : 1;

  const unitCost =
    quantity > 0
      ? roundCurrency(totalCost / quantity)
      : totalCost;

  return {
    category: "expense",
    description: expense.material,
    quantity,
    unitCost,
    totalCost,
    sourceId: expense.id,
    expenseId: expense.id,
  };
}

export function buildProjectFinancialData(
  project: Project,
  materialConsumptions: MaterialConsumption[],
  workLogs: EmployeeWorkLog[],
  expenses: Gasto[],
): ProjectFinancialData {
  const materialCosts = materialConsumptions.map(
    mapMaterialConsumptionToProjectCost,
  );

  const laborCosts = workLogs
    .map(mapEmployeeWorkLogToProjectCost)
    .filter((cost): cost is ProjectCost => cost !== null);

  const expenseCosts = expenses.map(mapExpenseToProjectCost);

  return {
    revenue: mapProjectRevenue(project),
    costs: [
      ...materialCosts,
      ...laborCosts,
      ...expenseCosts,
    ],
  };
}

import type {
  ProjectCost,
  ProjectFinancialData,
  ProjectProfitability,
} from "@/types/profitability";

function normalizeAmount(value: number): number {
  return Number.isFinite(value) && value >= 0 ? value : 0;
}

function calculateCostTotal(cost: ProjectCost): number {
  if (Number.isFinite(cost.totalCost)) {
    return cost.totalCost;
  }

  const quantity = normalizeAmount(cost.quantity);
  const unitCost = normalizeAmount(cost.unitCost);

  return quantity * unitCost;
}

export function calculateProjectProfitability(
  financialData: ProjectFinancialData,
): ProjectProfitability {
  const revenue = normalizeAmount(
    financialData.revenue.amount,
  );

  let materialCost = 0;
  let laborCost = 0;
  let expenseCost = 0;

  for (const cost of financialData.costs) {
    const totalCost = calculateCostTotal(cost);

    switch (cost.category) {
      case "material":
        materialCost += totalCost;
        break;

      case "labor":
        laborCost += totalCost;
        break;

      case "expense":
        expenseCost += totalCost;
        break;
    }
  }

  const totalCost =
    materialCost +
    laborCost +
    expenseCost;

  const grossProfit = revenue - totalCost;

  const margin =
    revenue > 0
      ? (grossProfit / revenue) * 100
      : 0;

  return {
    revenue: Number(revenue.toFixed(2)),
    materialCost: Number(materialCost.toFixed(2)),
    laborCost: Number(laborCost.toFixed(2)),
    expenseCost: Number(expenseCost.toFixed(2)),
    totalCost: Number(totalCost.toFixed(2)),
    grossProfit: Number(grossProfit.toFixed(2)),
    margin: Number(margin.toFixed(2)),
  };
}

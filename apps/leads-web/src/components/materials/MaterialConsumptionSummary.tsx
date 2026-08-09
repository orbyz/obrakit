import { formatCurrency } from "@/lib/formatters/currency";

import type { MaterialConsumption } from "@/types";
import { calculateMaterialMetrics } from "@/lib/materials/material-metrics";

interface MaterialConsumptionSummaryProps {
  consumptions: MaterialConsumption[];
}

export function MaterialConsumptionSummary({
  consumptions,
}: MaterialConsumptionSummaryProps) {
  const {
    totalConsumptions,
    uniqueMaterials,
    totalCost,
  } = calculateMaterialMetrics(consumptions);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <SummaryCard
        title="Consumos"
        value={totalConsumptions.toString()}
      />

      <SummaryCard
        title="Materiales"
        value={uniqueMaterials.toString()}
      />

      <SummaryCard
        title="Coste total"
        value={formatCurrency(totalCost)}
      />
    </div>
  );
}

interface SummaryCardProps {
  title: string;
  value: string;
}

function SummaryCard({
  title,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="text-sm text-muted">
        {title}
      </p>

      <p className="mt-2 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}

import type { MaterialConsumption } from "@/types";

export function calculateMaterialMetrics(
  consumptions: MaterialConsumption[],
) {
  const totalConsumptions = consumptions.length;

  const uniqueMaterials = new Set(
    consumptions.map(
      (consumption) => consumption.material_id,
    ),
  ).size;

  const totalCost = consumptions.reduce(
    (total, consumption) =>
      total + consumption.importe_total,
    0,
  );

  return {
    totalConsumptions,
    uniqueMaterials,
    totalCost,
  };
}

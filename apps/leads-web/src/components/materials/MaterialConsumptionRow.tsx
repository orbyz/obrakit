"use client";

import type { MaterialConsumption } from "@/types";
import { formatDate } from "@/lib/formatters/date";
import { formatCurrency } from "@/lib/formatters/currency";

import { DeleteMaterialConsumptionDialog } from "./DeleteMaterialConsumptionDialog";
import { EditMaterialConsumptionDialog } from "./EditMaterialConsumptionDialog";

interface MaterialConsumptionRowProps {
  consumption: MaterialConsumption;
}

export function MaterialConsumptionRow({
  consumption,
}: MaterialConsumptionRowProps) {
  return (
    <tr className="border-b">
      <td className="p-4">
        {formatDate(consumption.fecha)}
      </td>

      <td className="p-4">
        {consumption.material_nombre_snapshot}
      </td>

      <td className="p-4">
        {consumption.cantidad} {consumption.unidad_snapshot}
      </td>

      <td className="px-4 py-3 text-right">
        {formatCurrency(consumption.precio_snapshot)}
      </td>

      <td className="px-4 py-3 text-right">
        {formatCurrency(consumption.importe_total)}
      </td>

      <td className="p-4">
        <div className="flex gap-2">
          <EditMaterialConsumptionDialog
            consumption={consumption}
          />

          <DeleteMaterialConsumptionDialog
            consumption={consumption}
          />
        </div>
      </td>
    </tr>
  );
}

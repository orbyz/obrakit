"use client";

import type { MaterialConsumption } from "@/types";
import { formatDate } from "@/lib/formatters/date";
import { formatCurrency } from "@/lib/formatters/currency";

import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

import { DeleteMaterialConsumptionDialog } from "./DeleteMaterialConsumptionDialog";
import { EditMaterialConsumptionDialog } from "./EditMaterialConsumptionDialog";

interface MaterialConsumptionRowProps {
  consumption: MaterialConsumption;
}

export function MaterialConsumptionRow({
  consumption,
}: MaterialConsumptionRowProps) {
  return (
    <TableRow>
      <TableCell>
        {formatDate(consumption.fecha)}
      </TableCell>

      <TableCell className="font-medium">
        {consumption.material_nombre_snapshot}
      </TableCell>

      <TableCell>
        {consumption.cantidad} {consumption.unidad_snapshot}
      </TableCell>

      <TableCell className="text-right">
        {formatCurrency(consumption.precio_snapshot)}
      </TableCell>

      <TableCell className="text-right font-medium">
        {formatCurrency(consumption.importe_total)}
      </TableCell>

      <TableCell>
        <div className="flex gap-2">
          <EditMaterialConsumptionDialog
            consumption={consumption}
          />

          <DeleteMaterialConsumptionDialog
            consumption={consumption}
          />
        </div>
      </TableCell>
    </TableRow>
  );
}

import type { MaterialConsumption } from "@/types";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MaterialConsumptionRow } from "./MaterialConsumptionRow";

interface MaterialConsumptionTableProps {
  consumptions: MaterialConsumption[];
}

export function MaterialConsumptionTable({
  consumptions,
}: MaterialConsumptionTableProps) {
  if (consumptions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
        <h3 className="text-base font-semibold text-text">
          Aún no hay consumos registrados
        </h3>

        <p className="mt-2 text-sm text-muted">
          Cuando registres materiales utilizados en esta obra,
          aparecerán aquí.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Material</TableHead>
          <TableHead>Cantidad</TableHead>
          <TableHead className="text-right">Precio</TableHead>
          <TableHead className="text-right">Importe</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {consumptions.map((consumption) => (
          <MaterialConsumptionRow
            key={consumption.id}
            consumption={consumption}
          />
        ))}
      </TableBody>
    </Table>
  );
}

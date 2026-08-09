import type { MaterialConsumption } from "@/types";

import { MaterialConsumptionRow } from "./MaterialConsumptionRow";

interface MaterialConsumptionTableProps {
  consumptions: MaterialConsumption[];
}

export function MaterialConsumptionTable({
  consumptions,
}: MaterialConsumptionTableProps) {
  if (consumptions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <h3 className="text-lg font-medium">
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
    <div className="rounded-xl border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Fecha
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Material
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Cantidad
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Precio
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Importe
            </th>

            <th className="px-4 py-3 text-left text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {consumptions.length === 0 ? (
            <tr>
              <td
                colSpan={6}
                className="p-8 text-center text-muted-foreground"
              >
                No hay consumos registrados para esta obra.
              </td>
            </tr>
          ) : (
            consumptions.map((consumption) => (
              <MaterialConsumptionRow
                key={consumption.id}
                consumption={consumption}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

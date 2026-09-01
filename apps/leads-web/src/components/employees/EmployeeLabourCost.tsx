import type { LabourCostSummary } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EmployeeLabourCostProps {
  summary: LabourCostSummary;
}

function formatWorkedHours(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
}

function formatHours(hours: number) {
  return `${hours.toLocaleString("es-ES", {
    maximumFractionDigits: 2,
  })} h`;
}

function formatCost(cost: number) {
  return `${cost.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

export function EmployeeLabourCost({ summary }: EmployeeLabourCostProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">Horas trabajadas</p>
          <p className="mt-1 text-2xl font-semibold">
            {formatWorkedHours(summary.total_minutes)}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">Coste acumulado</p>
          <p className="mt-1 text-2xl font-semibold">
            {summary.total_cost === null ? "-" : formatCost(summary.total_cost)}
          </p>
        </div>
      </div>

      {summary.worklogs.length === 0 ? (
        <p className="text-sm text-muted">
          No existen jornadas con una duración válida para este empleado.
        </p>
      ) : (
        <Table className="min-w-[640px] table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">Fecha</TableHead>
              <TableHead className="w-[40%]">Obra</TableHead>
              <TableHead className="w-[20%]">Horas</TableHead>
              <TableHead className="w-[20%]">Coste</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {summary.worklogs.map((workLog) => (
              <TableRow key={workLog.id}>
                <TableCell className="whitespace-nowrap">
                  {workLog.fecha}
                </TableCell>

                <TableCell
                  className="max-w-0 truncate"
                  title={workLog.obra?.nombre}
                >
                  {workLog.obra?.nombre ?? "Obra no disponible"}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {formatHours(workLog.horas)}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {workLog.coste === null ? "-" : formatCost(workLog.coste)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

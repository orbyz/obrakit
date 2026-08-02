import type { LabourCostSummary } from "@/types";

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
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full table-fixed">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted">
                <th className="w-[20%] p-3 font-medium">Fecha</th>
                <th className="w-[40%] p-3 font-medium">Obra</th>
                <th className="w-[20%] p-3 font-medium">Horas</th>
                <th className="w-[20%] p-3 font-medium">Coste</th>
              </tr>
            </thead>

            <tbody>
              {summary.worklogs.map((workLog) => (
                <tr
                  key={workLog.id}
                  className="border-b border-border last:border-0"
                >
                  <td className="whitespace-nowrap p-3 text-sm">
                    {workLog.fecha}
                  </td>
                  <td
                    className="max-w-0 truncate p-3 text-sm"
                    title={workLog.obra?.nombre}
                  >
                    {workLog.obra?.nombre ?? "Obra no disponible"}
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm">
                    {formatHours(workLog.horas)}
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm">
                    {workLog.coste === null ? "-" : formatCost(workLog.coste)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

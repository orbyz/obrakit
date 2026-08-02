import type { EmployeeWorkLog } from "@/types";

import { DeleteEmployeeWorkLogDialog } from "./DeleteEmployeeWorkLogDialog";
import { EditEmployeeWorkLogDialog } from "./EditEmployeeWorkLogDialog";

interface EmployeeWorkLogsTableProps {
  workLogs: EmployeeWorkLog[];
}

function formatWorkedMinutes(workedMinutes: number) {
  const hours = Math.floor(workedMinutes / 60);
  const minutes = workedMinutes % 60;

  return `${hours} h ${minutes.toString().padStart(2, "0")} min`;
}

export function EmployeeWorkLogsTable({
  workLogs,
}: EmployeeWorkLogsTableProps) {
  const totalWorkedMinutes = workLogs.reduce(
    (total, workLog) => total + workLog.worked_minutes,
    0,
  );

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">Jornadas registradas</p>
          <p className="mt-1 text-2xl font-semibold">{workLogs.length}</p>
        </div>

        <div className="rounded-xl border border-border bg-background p-4">
          <p className="text-sm text-muted">Horas trabajadas</p>
          <p className="mt-1 text-2xl font-semibold">
            {formatWorkedMinutes(totalWorkedMinutes)}
          </p>
        </div>
      </div>

      {workLogs.length === 0 ? (
        <p className="text-sm text-muted">No existen jornadas para este empleado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full table-fixed">
            <thead>
              <tr className="border-b border-border text-left text-sm text-muted">
                <th className="w-[12%] p-3 font-medium">Fecha</th>
                <th className="w-[10%] p-3 font-medium">Inicio</th>
                <th className="w-[10%] p-3 font-medium">Fin</th>
                <th className="w-[12%] p-3 font-medium">Descanso</th>
                <th className="w-[14%] p-3 font-medium">Horas</th>
                <th className="w-[24%] p-3 font-medium">Observaciones</th>
                <th className="w-[18%] p-3 font-medium">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {workLogs.map((workLog) => (
                <tr
                  key={workLog.id}
                  className="border-b border-border transition-colors hover:bg-background last:border-0"
                >
                  <td className="whitespace-nowrap p-3 text-sm">
                    {workLog.work_date}
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm">
                    {workLog.start_time}
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm">
                    {workLog.end_time}
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm">
                    {workLog.break_minutes} min
                  </td>
                  <td className="whitespace-nowrap p-3 text-sm">
                    {formatWorkedMinutes(workLog.worked_minutes)}
                  </td>
                  <td
                    className="max-w-0 truncate p-3 text-sm"
                    title={workLog.notes ?? undefined}
                  >
                    {workLog.notes ?? "-"}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <EditEmployeeWorkLogDialog workLog={workLog} />
                      <DeleteEmployeeWorkLogDialog workLogId={workLog.id} />
                    </div>
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

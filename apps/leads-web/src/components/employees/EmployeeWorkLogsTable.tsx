import type { EmployeeWorkLog } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
        <Table className="min-w-[900px] table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[12%]">Fecha</TableHead>
              <TableHead className="w-[10%]">Inicio</TableHead>
              <TableHead className="w-[10%]">Fin</TableHead>
              <TableHead className="w-[12%]">Descanso</TableHead>
              <TableHead className="w-[14%]">Horas</TableHead>
              <TableHead className="w-[24%]">Observaciones</TableHead>
              <TableHead className="w-[18%]">Acciones</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {workLogs.map((workLog) => (
              <TableRow key={workLog.id}>
                <TableCell className="whitespace-nowrap">
                  {workLog.work_date}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {workLog.start_time}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {workLog.end_time}
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {workLog.break_minutes} min
                </TableCell>

                <TableCell className="whitespace-nowrap">
                  {formatWorkedMinutes(workLog.worked_minutes)}
                </TableCell>

                <TableCell
                  className="max-w-0 truncate"
                  title={workLog.notes ?? undefined}
                >
                  {workLog.notes ?? "-"}
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <EditEmployeeWorkLogDialog workLog={workLog} />
                    <DeleteEmployeeWorkLogDialog workLogId={workLog.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

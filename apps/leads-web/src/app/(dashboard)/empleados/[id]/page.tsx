import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getEmployeeAssignments,
  getProjectsForSelect,
} from "@/app/actions/employee-assignments";
import { getEmployeeById } from "@/app/actions/employees";
import { getEmployeeLabourCost } from "@/app/actions/labour-costs";
import { getEmployeeWorkLogs } from "@/app/actions/employee-worklogs";
import {
  AssignmentStatusActions,
  EmployeeFeedbackProvider,
  EmployeeLabourCost,
  EmployeeWorkLogDialog,
  EmployeeWorkLogsTable,
  NewEmployeeAssignmentDialog,
} from "@/components/employees";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { assignmentStatusConfig } from "@/lib/constants/assignment-status";

interface EmployeeDetailPageProps {
  params: Promise<{ id: string }>;
}

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function EmployeeDetailPage({
  params,
}: EmployeeDetailPageProps) {
  const { id } = await params;
  const employee = await getEmployeeById(id);

  if (!employee) notFound();

  const [assignments, projects, workLogs, labourCost] = await Promise.all([
    getEmployeeAssignments(employee.id),
    getProjectsForSelect(),
    getEmployeeWorkLogs(employee.id),
    getEmployeeLabourCost(employee.id),
  ]);

  const fullName = [employee.nombre, employee.apellidos]
    .filter(Boolean)
    .join(" ");
  const formattedStartDate = formatDate(employee.fecha_alta);
  const employeeDescription = [
    employee.especialidad ?? "-",
    employee.tipo_contrato,
  ].join(" · ");

  return (
    <EmployeeFeedbackProvider>
      <div className="max-w-6xl mx-auto">
        <PageHeader
          title={fullName}
          description={employeeDescription}
          actions={
            <Link
              href="/empleados"
              className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-white px-3 text-sm font-medium transition-all hover:bg-slate-50"
            >
              Volver a empleados
            </Link>
          }
        />

        <Card className="mb-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Resumen</h2>
          </div>

          <dl className="grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted">Especialidad</dt>
              <dd className="mt-1 font-medium">{employee.especialidad ?? "-"}</dd>
            </div>

            <div>
              <dt className="text-sm text-muted">Estado</dt>
              <dd className="mt-1">
                <Badge variant={employee.estado === "activo" ? "success" : "neutral"}>
                  {employee.estado}
                </Badge>
              </dd>
            </div>

            <div>
              <dt className="text-sm text-muted">Tipo de contrato</dt>
              <dd className="mt-1 capitalize">{employee.tipo_contrato}</dd>
            </div>

            <div>
              <dt className="text-sm text-muted">Fecha de alta</dt>
              <dd className="mt-1 font-medium">{formattedStartDate}</dd>
            </div>
          </dl>
        </Card>

        <Card className="mb-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Asignaciones</h2>
            <NewEmployeeAssignmentDialog employeeId={employee.id} projects={projects} />
          </div>

          {assignments.length === 0 ? (
            <EmptyState title="No existen asignaciones." />
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[800px] w-full table-fixed">
                <thead>
                  <tr className="border-b border-border text-left text-sm text-muted">
                    <th className="w-[24%] p-3 font-medium">Obra</th>
                    <th className="w-[18%] p-3 font-medium">Rol</th>
                    <th className="w-[14%] p-3 font-medium">Estado</th>
                    <th className="w-[14%] p-3 font-medium">Fecha inicio</th>
                    <th className="w-[14%] p-3 font-medium">Fecha fin</th>
                    <th className="w-[16%] p-3 font-medium">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {assignments.map((assignment) => (
                    <tr
                      key={assignment.id}
                      className="border-b border-border transition-colors hover:bg-background last:border-0"
                    >
                      <td className="max-w-0 truncate p-3 text-sm" title={assignment.project?.name}>
                        {assignment.project?.name ?? "Obra no disponible"}
                      </td>
                      <td className="max-w-0 truncate p-3 text-sm" title={assignment.role}>
                        {assignment.role}
                      </td>
                      <td className="p-3">
                        <Badge variant={assignmentStatusConfig[assignment.status].badgeVariant}>
                          {assignmentStatusConfig[assignment.status].label}
                        </Badge>
                      </td>
                      <td className="whitespace-nowrap p-3 text-sm">
                        {formatDate(assignment.start_date)}
                      </td>
                      <td className="whitespace-nowrap p-3 text-sm">
                        {formatDate(assignment.end_date)}
                      </td>
                      <td className="p-3">
                        <AssignmentStatusActions
                          assignmentId={assignment.id}
                          status={assignment.status}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {labourCost && (
          <Card className="mb-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">Coste de mano de obra</h2>
            </div>

            {labourCost.worklogs.length === 0 ? (
              <EmptyState title="No existen costes registrados." />
            ) : (
              <EmployeeLabourCost summary={labourCost} />
            )}
          </Card>
        )}

        <Card>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">WorkLogs</h2>
            <EmployeeWorkLogDialog assignments={assignments} />
          </div>

          {workLogs.length === 0 ? (
            <EmptyState title="No existen jornadas registradas." />
          ) : (
            <EmployeeWorkLogsTable workLogs={workLogs} />
          )}
        </Card>
      </div>
    </EmployeeFeedbackProvider>
  );
}

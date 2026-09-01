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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
            <Table className="min-w-[800px] table-fixed">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[24%]">Obra</TableHead>
                  <TableHead className="w-[18%]">Rol</TableHead>
                  <TableHead className="w-[14%]">Estado</TableHead>
                  <TableHead className="w-[14%]">Fecha inicio</TableHead>
                  <TableHead className="w-[14%]">Fecha fin</TableHead>
                  <TableHead className="w-[16%]">Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {assignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell
                      className="max-w-0 truncate"
                      title={assignment.project?.name}
                    >
                      {assignment.project?.name ?? "Obra no disponible"}
                    </TableCell>

                    <TableCell
                      className="max-w-0 truncate"
                      title={assignment.role}
                    >
                      {assignment.role}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          assignmentStatusConfig[assignment.status].badgeVariant
                        }
                      >
                        {assignmentStatusConfig[assignment.status].label}
                      </Badge>
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDate(assignment.start_date)}
                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {formatDate(assignment.end_date)}
                    </TableCell>

                    <TableCell>
                      <AssignmentStatusActions
                        assignmentId={assignment.id}
                        status={assignment.status}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

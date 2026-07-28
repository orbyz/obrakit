import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getEmployeeAssignments,
  getProjectsForSelect,
} from "@/app/actions/employee-assignments";
import { getEmployeeById } from "@/app/actions/employees";
import {
  EmployeeFeedbackProvider,
  NewEmployeeAssignmentDialog,
} from "@/components/employees";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

  const [assignments, projects] = await Promise.all([
    getEmployeeAssignments(employee.id),
    getProjectsForSelect(),
  ]);

  const fullName = [employee.nombre, employee.apellidos]
    .filter(Boolean)
    .join(" ");
  const formattedStartDate = formatDate(employee.fecha_alta);

  return (
    <EmployeeFeedbackProvider>
      <div className="max-w-3xl space-y-6">
      <Link
        href="/empleados"
        className="text-sm text-muted transition-colors hover:text-text"
      >
        ← Volver a empleados
      </Link>

      <Card>
        <h1 className="mb-6 text-3xl font-bold">{fullName}</h1>

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

        <Card>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">Asignaciones</h2>
            <NewEmployeeAssignmentDialog employeeId={employee.id} projects={projects} />
          </div>

        {assignments.length === 0 ? (
          <p className="text-sm text-muted">
            No existen asignaciones para este empleado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[680px] w-full table-fixed">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted">
                  <th className="w-[30%] p-3 font-medium">Obra</th>
                  <th className="w-[24%] p-3 font-medium">Rol</th>
                  <th className="w-[16%] p-3 font-medium">Estado</th>
                  <th className="w-[15%] p-3 font-medium">Fecha inicio</th>
                  <th className="w-[15%] p-3 font-medium">Fecha fin</th>
                </tr>
              </thead>

              <tbody>
                {assignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="border-b border-border transition-colors hover:bg-background last:border-0"
                  >
                    <td className="max-w-0 truncate p-3 text-sm" title={assignment.lead?.nombre}>
                      {assignment.lead?.nombre ?? "Obra no disponible"}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </Card>
      </div>
    </EmployeeFeedbackProvider>
  );
}

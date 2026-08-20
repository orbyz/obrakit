import Link from "next/link";

import { Card } from "@/components/ui/card";

import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import { getProjectAssignments } from "@/app/actions/employees";
import { AssignEmployeeForm } from "./AssignEmployeeForm";

interface EmployeeAssignmentsCardProps {
  projectId: string;

  employees: {
    id: string;
    nombre: string;
    apellidos: string | null;
  }[];
}

export async function EmployeeAssignmentsCard({
  projectId,
  employees,
}: EmployeeAssignmentsCardProps) {

  const assignments = await getProjectAssignments(projectId);

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          Empleados asignados
        </h2>

        <AssignEmployeeForm
          projectId={projectId}
          employees={employees}
        />
      </div>

      {assignments.length === 0 ? (
        <EmptyState
          title="No hay empleados asignados."
          description="Asigna empleados para comenzar el seguimiento de la obra."
        />
      ) : (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {assignment.employee.nombre}{" "}
                    {assignment.employee.apellidos ?? ""}
                  </p>

                  <p className="text-sm text-muted">
                    {assignment.employee.especialidad ?? "-"}
                  </p>
                    <Link
                      href={`/empleados/${assignment.employee.id}`}
                      className="text-sm font-medium text-primary hover:underline justify-end"
                    >
                      Ver empleado
                    </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  );
}

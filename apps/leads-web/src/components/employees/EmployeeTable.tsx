import type { Employee } from "@/types";

import { EmployeeRow } from "./EmployeeRow";

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({
  employees,
}: EmployeeTableProps) {
  return (
    <div className="rounded-xl border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">
              Nombre
            </th>

            <th className="p-4 text-left">
              Especialidad
            </th>

            <th className="p-4 text-left">
              Estado
            </th>

            <th className="p-4 text-left">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="p-8 text-center text-muted-foreground"
              >
                No hay empleados registrados.
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <EmployeeRow
                key={employee.id}
                employee={employee}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

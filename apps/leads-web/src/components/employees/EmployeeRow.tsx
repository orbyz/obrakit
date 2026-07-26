import type { Employee } from "@/types";

import { EditEmployeeDialog } from "./EditEmployeeDialog";

interface EmployeeRowProps {
  employee: Employee;
}

export function EmployeeRow({
  employee,
}: EmployeeRowProps) {
  return (
    <tr className="border-b">
      <td className="p-4">
        {employee.nombre}
      </td>

      <td className="p-4">
        {employee.especialidad ?? "-"}
      </td>

      <td className="p-4 capitalize">
        {employee.estado}
      </td>

      <td className="p-4">
        <EditEmployeeDialog employee={employee} />
      </td>
    </tr>
  );
}

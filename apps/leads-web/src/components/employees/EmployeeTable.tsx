import type { Employee } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { EmployeeRow } from "./EmployeeRow";

interface EmployeeTableProps {
  employees: Employee[];
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Especialidad</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {employees.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="py-8 text-center text-muted"
            >
              No hay empleados registrados.
            </TableCell>
          </TableRow>
        ) : (
          employees.map((employee) => (
            <EmployeeRow
              key={employee.id}
              employee={employee}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}

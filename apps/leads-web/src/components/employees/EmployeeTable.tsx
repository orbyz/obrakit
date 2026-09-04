import type { Employee } from "@/types";

import {
  Table,
  TableBody,
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
         {employees.map((employee) => (
           <EmployeeRow
             key={employee.id}
             employee={employee}
           />
         ))}
       </TableBody>
    </Table>
  );
}

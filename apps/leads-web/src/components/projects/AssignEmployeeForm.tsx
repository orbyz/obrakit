"use client";

import { useState, useTransition } from "react";

import { assignEmployeeToProject } from "@/app/actions/employees";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/forms";

interface EmployeeOption {
  id: string;
  nombre: string;
  apellidos: string | null;
}

interface AssignEmployeeFormProps {
  projectId: string;
  employees: EmployeeOption[];
}

export function AssignEmployeeForm({
  projectId,
  employees,
}: AssignEmployeeFormProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAssign = () => {
    if (!employeeId) return;

    startTransition(async () => {
      await assignEmployeeToProject(
        projectId,
        employeeId,
      );
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Select
        value={employeeId}
        onChange={(event) =>
          setEmployeeId(event.target.value)
        }
        className="min-w-72"
      >
        <option value="">
          Selecciona un empleado...
        </option>

        {employees.map((employee) => (
          <option
            key={employee.id}
            value={employee.id}
          >
            {employee.nombre} {employee.apellidos ?? ""}
          </option>
        ))}
      </Select>

      <Button
        type="button"
        disabled={!employeeId || isPending}
        onClick={handleAssign}
      >
        {isPending
          ? "Asignando..."
          : "Asignar"}
      </Button>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useTransition } from "react";

import { reactivateEmployeeAction } from "@/app/actions/employees";
import { Button } from "@/components/ui/button";
import type { Employee } from "@/types";

import { DeactivateEmployeeDialog } from "./DeactivateEmployeeDialog";
import { EditEmployeeDialog } from "./EditEmployeeDialog";
import { useEmployeeFeedback } from "./EmployeeFeedback";

interface EmployeeRowProps {
  employee: Employee;
}

export function EmployeeRow({
  employee,
}: EmployeeRowProps) {
  const [pending, startTransition] = useTransition();
  const { showError, showSuccess } = useEmployeeFeedback();

  function handleReactivate() {
    startTransition(async () => {
      const result = await reactivateEmployeeAction(employee.id);

      if (result.success) {
        showSuccess("Empleado reactivado correctamente.");
        return;
      }

      showError(result.error ?? "Error al reactivar el empleado.");
    });
  }

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
        <div className="flex gap-2">
          <Link
            href={`/empleados/${employee.id}`}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-white px-3 text-sm font-medium transition-all hover:bg-slate-50"
          >
            Ver
          </Link>

          {employee.estado === "activo" && (
            <>
              <EditEmployeeDialog employee={employee} />
              <DeactivateEmployeeDialog employee={employee} />
            </>
          )}

          {employee.estado === "inactivo" && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={pending}
              onClick={handleReactivate}
            >
              {pending ? "Reactivando..." : "Reactivar"}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

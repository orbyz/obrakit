"use client";

import Link from "next/link";
import { useTransition } from "react";

import { reactivateEmployeeAction } from "@/app/actions/employees";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";

import type { Employee } from "@/types";

import { DeactivateEmployeeDialog } from "./DeactivateEmployeeDialog";
import { EditEmployeeDialog } from "./EditEmployeeDialog";
import { useEmployeeFeedback } from "./EmployeeFeedback";

interface EmployeeRowProps {
  employee: Employee;
}

const STATUS_CONFIG = {
  activo: {
    label: "Activo",
    variant: "success",
  },
  inactivo: {
    label: "Inactivo",
    variant: "neutral",
  },
  vacaciones: {
    label: "Vacaciones",
    variant: "warning",
  },
  baja: {
    label: "Baja",
    variant: "danger",
  },
} as const;

export function EmployeeRow({ employee }: EmployeeRowProps) {
  const [pending, startTransition] = useTransition();
  const { showError, showSuccess } = useEmployeeFeedback();

  const status = STATUS_CONFIG[employee.estado];

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
    <TableRow>
      <TableCell>
        <Link
          href={`/empleados/${employee.id}`}
          className="font-medium text-text transition-colors hover:text-primary"
        >
          {employee.nombre} {employee.apellidos ?? ""}
        </Link>
      </TableCell>

      <TableCell>
        <span className="text-muted">
          {employee.especialidad ?? "-"}
        </span>
      </TableCell>

      <TableCell>
        <Badge variant={status.variant}>
          {status.label}
        </Badge>
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-2">
          <Link
            href={`/empleados/${employee.id}`}
            className="inline-flex h-9 items-center justify-center rounded-xl border border-border bg-surface px-3 text-sm font-medium text-text transition-colors hover:bg-background"
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
              variant="secondary"
              size="sm"
              type="button"
              disabled={pending}
              onClick={handleReactivate}
            >
              {pending ? "Reactivando..." : "Reactivar"}
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

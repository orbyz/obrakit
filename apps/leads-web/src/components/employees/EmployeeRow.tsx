"use client";

import Link from "next/link";
import { useTransition } from "react";

import { reactivateEmployeeAction } from "@/app/actions/employees";

import { Eye, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast/toast";

import type { Employee } from "@/types";

import { DeactivateEmployeeDialog } from "./DeactivateEmployeeDialog";
import { EditEmployeeDialog } from "./EditEmployeeDialog";

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

  const status = STATUS_CONFIG[employee.estado];

  function handleReactivate() {
    startTransition(async () => {
      const result = await reactivateEmployeeAction(employee.id);

      if (result.success) {
        toast.success("Empleado reactivado correctamente.");
        return;
      }

      toast.error(result.error ?? "Error al reactivar el empleado.");
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
            aria-label={`Ver empleado ${employee.nombre}`}
            title="Ver empleado"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-text transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
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
              aria-label={`Reactivar empleado ${employee.nombre}`}
              title="Reactivar empleado"
              className="h-9 w-9 p-0"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

"use client";

import { useState, useTransition } from "react";

import { deactivateEmployeeAction } from "@/app/actions/employees";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Employee } from "@/types";

import { useEmployeeFeedback } from "./EmployeeFeedback";

interface DeactivateEmployeeDialogProps {
  employee: Employee;
}

export function DeactivateEmployeeDialog({
  employee,
}: DeactivateEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { showError, showSuccess } = useEmployeeFeedback();

  function handleDeactivate() {
    startTransition(async () => {
      const result = await deactivateEmployeeAction(employee.id);

      if (result.success) {
        showSuccess("Empleado desactivado correctamente.");
        setOpen(false);
        return;
      }

      showError(result.error ?? "Error al desactivar el empleado.");
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button variant="danger" size="sm">
          Desactivar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Desactivar empleado</DialogTitle>
          <DialogDescription>
            ¿Deseas desactivar este empleado?
          </DialogDescription>
        </DialogHeader>


        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={pending}>
              Cancelar
            </Button>
          </DialogClose>

          <Button
            variant="danger"
            type="button"
            disabled={pending}
            onClick={handleDeactivate}
          >
            {pending ? "Desactivando..." : "Desactivar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

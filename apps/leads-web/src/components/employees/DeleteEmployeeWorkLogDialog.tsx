"use client";

import { useState, useTransition } from "react";

import { deleteEmployeeWorkLogAction } from "@/app/actions/employee-worklogs";
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

import { useEmployeeFeedback } from "./EmployeeFeedback";

interface DeleteEmployeeWorkLogDialogProps {
  workLogId: string;
}

export function DeleteEmployeeWorkLogDialog({
  workLogId,
}: DeleteEmployeeWorkLogDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { showError, showSuccess } = useEmployeeFeedback();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteEmployeeWorkLogAction(workLogId);

      if (result.success) {
        showSuccess("Jornada eliminada correctamente.");
        setOpen(false);
        return;
      }

      showError(result.error ?? "Error al eliminar la jornada.");
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="danger" size="sm">
          Eliminar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar jornada</DialogTitle>
          <DialogDescription>
            ¿Deseas eliminar esta jornada? Esta acción no se puede deshacer.
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
            onClick={handleDelete}
          >
            {pending ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

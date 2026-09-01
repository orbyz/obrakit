"use client";

import { useState, useTransition } from "react";

import { deactivateMaterialAction } from "@/app/actions/materials";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Material } from "@/types";

import { useEmployeeFeedback } from "../employees/EmployeeFeedback";

import { Ban } from "lucide-react";

interface DeactivateMaterialDialogProps {
  material: Material;
}

export function DeactivateMaterialDialog({
  material,
}: DeactivateMaterialDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const { showError, showSuccess } = useEmployeeFeedback();

  function handleDeactivate() {
    startTransition(async () => {
      const result = await deactivateMaterialAction(material.id);

      if (result.success) {
        showSuccess("Material desactivado correctamente.");
        setOpen(false);
        return;
      }

      showError(result.error ?? "Error al desactivar el material.");
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="danger"
          size="sm"
          className="h-9 w-9 p-0"
          aria-label={`Desactivar material ${material.nombre}`}
          title="Desactivar material"
        >
          <Ban className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Desactivar material
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          ¿Deseas desactivar el material{" "}
          <strong>{material.nombre}</strong>?
        </p>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            disabled={pending}
            onClick={handleDeactivate}
          >
            {pending
              ? "Desactivando..."
              : "Desactivar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

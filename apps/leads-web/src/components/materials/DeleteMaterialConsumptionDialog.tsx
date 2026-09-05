"use client";

import { useState, useTransition } from "react";

import { deleteMaterialConsumptionAction } from "@/app/actions/material-consumptions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { MaterialConsumption } from "@/types";

import { Trash2 } from "lucide-react";

import { toast } from "@/components/ui/toast/toast";


interface DeleteMaterialConsumptionDialogProps {
  consumption: MaterialConsumption;
}

export function DeleteMaterialConsumptionDialog({
  consumption,
}: DeleteMaterialConsumptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteMaterialConsumptionAction(
        consumption.id,
      );

      if (result.success) {
        toast.success(
          "Consumo eliminado correctamente.",
        );

        setOpen(false);
        return;
      }

      toast.error(
        result.error ??
          "No se pudo eliminar el consumo.",
      );
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
          aria-label={`Eliminar consumo de ${consumption.material_nombre_snapshot}`}
          title="Eliminar consumo"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Eliminar consumo
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground">
          ¿Seguro que deseas eliminar el consumo de{" "}
          <strong>
            {consumption.material_nombre_snapshot}
          </strong>
          ?
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
            onClick={handleDelete}
          >
            {pending
              ? "Eliminando..."
              : "Eliminar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

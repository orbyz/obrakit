"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Pencil } from "lucide-react";

import type { MaterialConsumption } from "@/types";

import { MaterialConsumptionForm } from "./MaterialConsumptionForm";

interface EditMaterialConsumptionDialogProps {
  consumption: MaterialConsumption;
}

export function EditMaterialConsumptionDialog({
  consumption,
}: EditMaterialConsumptionDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 w-9 p-0"
          aria-label={`Editar consumo de ${consumption.material_nombre_snapshot}`}
          title="Editar consumo"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Editar consumo de material
          </DialogTitle>
        </DialogHeader>

        <MaterialConsumptionForm
          mode="edit"
          projectId={consumption.project_id}
          consumption={consumption}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

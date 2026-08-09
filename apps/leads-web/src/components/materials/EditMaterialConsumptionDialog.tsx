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
        >
          Editar
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

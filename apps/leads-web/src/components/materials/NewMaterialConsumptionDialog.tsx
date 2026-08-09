"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { Material } from "@/types";

import { MaterialConsumptionForm } from "./MaterialConsumptionForm";

interface NewMaterialConsumptionDialogProps {
  projectId: string;
  materials: Material[];
}

export function NewMaterialConsumptionDialog({
  projectId,
  materials,
}: NewMaterialConsumptionDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          Añadir material
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Registrar consumo de material
          </DialogTitle>
        </DialogHeader>

        <MaterialConsumptionForm
          mode="create"
          projectId={projectId}
          materials={materials}
          onSuccess={() => {
            setOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

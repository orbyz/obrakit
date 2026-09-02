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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}

export function NewMaterialConsumptionDialog({
  projectId,
  materials,
  open,
  onOpenChange,
  hideTrigger = false,
}: NewMaterialConsumptionDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const dialogOpen = open ?? uncontrolledOpen;
  const setDialogOpen = onOpenChange ?? setUncontrolledOpen;
  const router = useRouter();

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button>Añadir material</Button>
        </DialogTrigger>
      )}

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
            setDialogOpen(false);
            router.refresh();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

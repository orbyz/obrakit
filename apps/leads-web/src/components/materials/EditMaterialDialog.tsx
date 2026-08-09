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

import type { Material } from "@/types";

import { MaterialForm } from "./MaterialForm";

interface EditMaterialDialogProps {
  material: Material;
}

export function EditMaterialDialog({
  material,
}: EditMaterialDialogProps) {
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
            Editar material
          </DialogTitle>
        </DialogHeader>

        <MaterialForm
          mode="edit"
          material={material}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

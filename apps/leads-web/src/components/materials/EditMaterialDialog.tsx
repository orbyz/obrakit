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

import { Pencil } from "lucide-react";

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
          className="h-9 w-9 p-0"
          aria-label={`Editar material ${material.nombre}`}
          title="Editar material"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
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

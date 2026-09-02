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

import { MaterialForm } from "./MaterialForm";

interface NewMaterialDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  hideTrigger?: boolean;
}

export function NewMaterialDialog({
  open,
  onOpenChange,
  onSuccess,
  hideTrigger = false,
}: NewMaterialDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const dialogOpen = open ?? uncontrolledOpen;
  const setDialogOpen = onOpenChange ?? setUncontrolledOpen;

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={setDialogOpen}
    >
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button>Nuevo material</Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Nuevo material
          </DialogTitle>
        </DialogHeader>

        <MaterialForm
          onSuccess={() => {
            setDialogOpen(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

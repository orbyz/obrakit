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

import { EmployeeForm } from "./EmployeeForm";

interface NewEmployeeDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  hideTrigger?: boolean;
}

export function NewEmployeeDialog({
  open,
  onOpenChange,
  onSuccess,
  hideTrigger = false,
}: NewEmployeeDialogProps) {
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
          <Button>Nuevo empleado</Button>
        </DialogTrigger>
      )}

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Nuevo empleado
          </DialogTitle>
        </DialogHeader>

        <EmployeeForm
          onSuccess={() => {
            setDialogOpen(false);
            onSuccess?.();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

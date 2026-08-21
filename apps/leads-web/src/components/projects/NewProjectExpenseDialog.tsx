"use client";

import { useState } from "react";

import GastoForm from "@/components/gastos/GastoForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NewProjectExpenseDialogProps {
  projectId: string;
  onSuccess?: () => void | Promise<void>;
}

export function NewProjectExpenseDialog({
  projectId,
  onSuccess,
}: NewProjectExpenseDialogProps) {
  const [open, setOpen] = useState(false);

  async function handleSuccess() {
    await onSuccess?.();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nuevo gasto</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar gasto</DialogTitle>
        </DialogHeader>

        <GastoForm
          projectIdFijo={projectId}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}

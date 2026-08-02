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
import type { EmployeeWorkLog } from "@/types";

import { EmployeeWorkLogForm } from "./EmployeeWorkLogForm";

interface EditEmployeeWorkLogDialogProps {
  workLog: EmployeeWorkLog;
}

export function EditEmployeeWorkLogDialog({
  workLog,
}: EditEmployeeWorkLogDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Editar
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar jornada</DialogTitle>
        </DialogHeader>

        <EmployeeWorkLogForm
          mode="edit"
          workLog={workLog}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

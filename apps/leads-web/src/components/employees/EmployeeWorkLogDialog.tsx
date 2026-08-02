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
import type { EmployeeAssignment } from "@/types";

import { EmployeeWorkLogForm } from "./EmployeeWorkLogForm";

interface EmployeeWorkLogDialogProps {
  assignments: EmployeeAssignment[];
}

export function EmployeeWorkLogDialog({
  assignments,
}: EmployeeWorkLogDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Registrar jornada</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar jornada</DialogTitle>
        </DialogHeader>

        <EmployeeWorkLogForm
          mode="create"
          assignments={assignments}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

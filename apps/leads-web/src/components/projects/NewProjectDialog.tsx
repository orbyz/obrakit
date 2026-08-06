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

import { ProjectForm } from "./ProjectForm";

export function NewProjectDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button>
          Crear nueva obra
        </Button>
      </DialogTrigger>

      <DialogContent
        className="
          w-full
          sm:max-w-2xl
          lg:max-w-4xl
          max-h-[90vh]
          overflow-y-auto
        "
      >
        <DialogHeader>
          <DialogTitle>
            Nueva Obra
          </DialogTitle>
        </DialogHeader>

        <ProjectForm
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

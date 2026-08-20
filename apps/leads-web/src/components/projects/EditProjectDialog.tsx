"use client";

import { useState } from "react";

import type { Project } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ProjectForm } from "./ProjectForm";

interface EditProjectDialogProps {
  project: Project;
}

export function EditProjectDialog({
  project,
}: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          Editar obra
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
            Editar obra
          </DialogTitle>
        </DialogHeader>

        <ProjectForm
          mode="edit"
          project={project}
          onSuccess={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

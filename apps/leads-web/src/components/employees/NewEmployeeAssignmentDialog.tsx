"use client";

import { useActionState, useEffect, useState } from "react";

import {
  createEmployeeAssignmentAction,
  type EmployeeAssignmentActionState,
} from "@/app/actions/employee-assignments";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/forms/Input";
import { Select } from "@/components/ui/forms/Select";
import { assignmentStatusConfig } from "@/lib/constants/assignment-status";

import { useEmployeeFeedback } from "./EmployeeFeedback";

interface NewEmployeeAssignmentDialogProps {
  employeeId: string;
  projects: Array<{ id: string; name: string }>;
}

const initialState: EmployeeAssignmentActionState = {
  error: null,
  success: false,
};

export function NewEmployeeAssignmentDialog({
  employeeId,
  projects,
}: NewEmployeeAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const { showError, showSuccess } = useEmployeeFeedback();
  const [state, formAction, pending] = useActionState(
    createEmployeeAssignmentAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      showSuccess("Asignación creada correctamente.");

      queueMicrotask(() => {
        setOpen(false);
      });

      return;
    }

    if (state.error) showError(state.error);
  }, [showError, showSuccess, state.error, state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nueva asignación</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva asignación</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="employee_id" value={employeeId} />

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="project_id">
              Obra
            </label>
            <Select id="project_id" name="project_id" required defaultValue="">
              <option value="" disabled>
                Selecciona una obra
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="role">
              Rol
            </label>
            <Input id="role" name="role" required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="status">
              Estado
            </label>
            <Select id="status" name="status" defaultValue="planned">
              <option value="planned">
                {assignmentStatusConfig.planned.label}
              </option>
              <option value="active">
                {assignmentStatusConfig.active.label}
              </option>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="start_date">
              Fecha inicio
            </label>
            <Input id="start_date" name="start_date" type="date" required />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="end_date">
              Fecha fin
            </label>
            <Input id="end_date" name="end_date" type="date" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Guardando..." : "Crear asignación"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

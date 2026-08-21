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

import { useEmployeeFeedback } from "@/components/employees/EmployeeFeedback";

interface NewProjectAssignmentDialogProps {
  projectId: string;
  employees: Array<{
    id: string;
    nombre: string;
    apellidos: string | null;
  }>;
}

const initialState: EmployeeAssignmentActionState = {
  error: null,
  success: false,
};

const workDayOptions = [
  { value: "1", label: "L" },
  { value: "2", label: "M" },
  { value: "3", label: "X" },
  { value: "4", label: "J" },
  { value: "5", label: "V" },
  { value: "6", label: "S" },
  { value: "7", label: "D" },
];

export function NewProjectAssignmentDialog({
  projectId,
  employees,
}: NewProjectAssignmentDialogProps) {
  const [open, setOpen] = useState(false);
  const { showError, showSuccess } = useEmployeeFeedback();

  const [state, formAction, pending] = useActionState(
    createEmployeeAssignmentAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      showSuccess("Empleado asignado correctamente.");

      queueMicrotask(() => {
        setOpen(false);
      });

      return;
    }

    if (state.error) {
      showError(state.error);
    }
  }, [showError, showSuccess, state.error, state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Nueva asignación</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar empleado a la obra</DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="project_id" value={projectId} />

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="employee_id"
            >
              Empleado
            </label>

            <Select
              id="employee_id"
              name="employee_id"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Selecciona un empleado
              </option>

              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.nombre} {employee.apellidos ?? ""}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="role"
            >
              Rol
            </label>

            <Input id="role" name="role" required />
          </div>

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="status"
            >
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="start_date"
              >
                Fecha inicio
              </label>

              <Input
                id="start_date"
                name="start_date"
                type="date"
                required
              />
            </div>

            <div>
              <label
                className="mb-1 block text-sm font-medium"
                htmlFor="end_date"
              >
                Fecha fin
              </label>

              <Input
                id="end_date"
                name="end_date"
                type="date"
              />
            </div>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="text-sm font-medium">Jornada habitual</p>

            <p className="mt-1 text-xs text-muted">
              Se usará para registrar semanas más rápido. No crea jornadas
              automáticamente.
            </p>

            <div className="mt-4 space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium">
                  Días habituales
                </p>

                <div className="flex flex-wrap gap-2">
                  {workDayOptions.map((day) => (
                    <label
                      key={day.value}
                      className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        name="work_days"
                        value={day.value}
                        defaultChecked={["1", "2", "3", "4", "5"].includes(
                          day.value,
                        )}
                        className="h-4 w-4"
                      />

                      {day.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label
                    className="mb-1 block text-sm font-medium"
                    htmlFor="default_start_time"
                  >
                    Inicio
                  </label>

                  <Input
                    id="default_start_time"
                    name="default_start_time"
                    type="time"
                    defaultValue="08:00"
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-sm font-medium"
                    htmlFor="default_end_time"
                  >
                    Fin
                  </label>

                  <Input
                    id="default_end_time"
                    name="default_end_time"
                    type="time"
                    defaultValue="17:00"
                  />
                </div>

                <div>
                  <label
                    className="mb-1 block text-sm font-medium"
                    htmlFor="default_break_minutes"
                  >
                    Descanso
                  </label>

                  <Input
                    id="default_break_minutes"
                    name="default_break_minutes"
                    type="number"
                    min="0"
                    defaultValue="60"
                  />
                </div>
              </div>
            </div>
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

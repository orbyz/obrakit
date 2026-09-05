"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createEmployeeWorkLogAction,
  type EmployeeWorkLogActionState,
  updateEmployeeWorkLogAction,
} from "@/app/actions/employee-worklogs";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/forms/Input";
import { Select } from "@/components/ui/forms/Select";
import { Textarea } from "@/components/ui/forms/Textarea";
import { toast } from "@/components/ui/toast/toast";
import type { EmployeeAssignment, EmployeeWorkLog } from "@/types";



interface EmployeeWorkLogFormProps {
  assignments?: EmployeeAssignment[];
  mode: "create" | "edit";
  onSuccess: () => void;
  workLog?: EmployeeWorkLog;
}

const initialState: EmployeeWorkLogActionState = {
  error: null,
  success: false,
};

function formatTime(time: string) {
  return time.slice(0, 5);
}

export function EmployeeWorkLogForm({
  assignments = [],
  mode,
  onSuccess,
  workLog,
}: EmployeeWorkLogFormProps) {
  const action =
    mode === "edit" && workLog
      ? updateEmployeeWorkLogAction.bind(null, workLog.id)
      : createEmployeeWorkLogAction;
  const [state, formAction, pending] = useActionState(action, initialState);
  const activeAssignments = assignments.filter(
    (assignment) => assignment.status === "active",
  );

  const lastNotifiedState = useRef<string | null>(null);
  useEffect(() => {
    const notificationKey = `${state.success}:${state.error ?? ""}`;

    if (lastNotifiedState.current === notificationKey) {
      return;
    }

    if (state.success) {
      lastNotifiedState.current = notificationKey;

      toast.success(
        mode === "edit"
          ? "Jornada actualizada correctamente."
          : "Jornada registrada correctamente.",
      );

      onSuccess();
      return;
    }

    if (state.error) {
      lastNotifiedState.current = notificationKey;
      toast.error(state.error);
    }
  }, [mode, onSuccess, state.error, state.success]);

  return (
    <form action={formAction} className="space-y-4">
      {mode === "create" && (
        <>
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="assignment_id"
            >
              Asignación
            </label>
            <Select id="assignment_id" name="assignment_id" required defaultValue="">
              <option value="" disabled>
                Selecciona una asignación
              </option>
              {activeAssignments.map((assignment) => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.project?.name ?? "Obra sin nombre"} · {assignment.role}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium" htmlFor="work_date">
              Fecha
            </label>
            <Input id="work_date" name="work_date" type="date" required />
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="start_time">
            Inicio
          </label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={workLog ? formatTime(workLog.start_time) : ""}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium" htmlFor="end_time">
            Fin
          </label>
          <Input
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={workLog ? formatTime(workLog.end_time) : ""}
            required
          />
        </div>
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium"
          htmlFor="break_minutes"
        >
          Descanso (minutos)
        </label>
        <Input
          id="break_minutes"
          name="break_minutes"
          type="number"
          min="0"
          defaultValue={workLog?.break_minutes ?? 0}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor="notes">
          Observaciones
        </label>
        <Textarea id="notes" name="notes" defaultValue={workLog?.notes ?? ""} />
      </div>

      <DialogFooter>
        <Button type="submit" disabled={pending}>
          {pending
            ? "Guardando..."
            : mode === "edit"
              ? "Guardar cambios"
              : "Registrar jornada"}
        </Button>
      </DialogFooter>
    </form>
  );
}

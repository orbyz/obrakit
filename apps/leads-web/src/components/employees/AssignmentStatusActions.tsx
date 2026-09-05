"use client";

import { useTransition } from "react";

import { updateEmployeeAssignmentStatusAction } from "@/app/actions/employee-assignments";
import { Button } from "@/components/ui/button";
import type { EmployeeAssignmentStatus } from "@/types";

import { toast } from "@/components/ui/toast/toast";

interface AssignmentStatusActionsProps {
  assignmentId: string;
  status: EmployeeAssignmentStatus;
}

interface AssignmentAction {
  label: string;
  nextStatus: EmployeeAssignmentStatus;
  successMessage: string;
  variant?: "primary" | "outline" | "danger";
}

const statusActions: Record<EmployeeAssignmentStatus, AssignmentAction[]> = {
  planned: [
    {
      label: "Activar",
      nextStatus: "active",
      successMessage: "Asignación activada correctamente.",
    },
  ],
  active: [
    {
      label: "Pausar",
      nextStatus: "paused",
      successMessage: "Asignación pausada correctamente.",
      variant: "outline",
    },
    {
      label: "Finalizar",
      nextStatus: "finished",
      successMessage: "Asignación finalizada correctamente.",
      variant: "outline",
    },
  ],
  paused: [
    {
      label: "Reanudar",
      nextStatus: "active",
      successMessage: "Asignación reanudada correctamente.",
    },
  ],
  finished: [],
  cancelled: [],
};

export function AssignmentStatusActions({
  assignmentId,
  status,
}: AssignmentStatusActionsProps) {
  const [pending, startTransition] = useTransition();
  const actions = statusActions[status];

  if (actions.length === 0) return null;

  function handleStatusChange(action: AssignmentAction) {
    startTransition(async () => {
      const result = await updateEmployeeAssignmentStatusAction(
        assignmentId,
        action.nextStatus,
      );

      if (result.success) {
        toast.success(action.successMessage);
        return;
      }

      toast.error(result.error ?? "Error al actualizar la asignación.");
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <Button
          key={action.nextStatus}
          type="button"
          size="sm"
          variant={action.variant}
          disabled={pending}
          onClick={() => handleStatusChange(action)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}

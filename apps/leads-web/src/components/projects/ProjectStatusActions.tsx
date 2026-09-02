"use client";

import { useState, useTransition } from "react";

import { updateProjectStatusAction } from "@/app/actions/projects";
import {
  PROJECT_STATUS,
  PROJECT_STATUS_TRANSITIONS,
} from "@/lib/constants/project-status";
import type { ProjectStatus } from "@/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  projectId: string;
  status: ProjectStatus;
};

const STATUS_ACTION_LABELS: Record<
  ProjectStatus,
  string
> = {
  draft: "Planificar obra",
  planned: "Iniciar obra",
  in_progress: "Continuar obra",
  paused: "Pausar obra",
  completed: "Finalizada",
  cancelled: "Cancelada",
};

export function ProjectStatusActions({
  projectId,
  status,
}: Props) {
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableStatuses =
    PROJECT_STATUS_TRANSITIONS[status];

  const handleStatusChange = (
    nextStatus: ProjectStatus,
  ) => {
    setError(null);
    setIsOpen(false);

    startTransition(async () => {
      const result =
        await updateProjectStatusAction(
          projectId,
          nextStatus,
        );

      if (!result.success) {
        setError(result.message);
      }
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={PROJECT_STATUS[status].variant}>
          {PROJECT_STATUS[status].label}
        </Badge>

        {availableStatuses.length > 0 && (
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() =>
                setIsOpen((current) => !current)
              }
            >
              {isPending
                ? "Actualizando..."
                : "Cambiar estado"}
            </Button>

            {isOpen && (
              <div className="absolute right-0 z-20 mt-2 min-w-48 overflow-hidden rounded-md border border-border bg-surface p-1 shadow-md">
                <div className="px-3 py-2 text-xs font-medium text-muted">
                  Cambiar estado
                </div>

                {availableStatuses.map(
                  (nextStatus) => (
                    <button
                      key={nextStatus}
                      type="button"
                      className="
                        flex w-full items-center
                        rounded-sm
                        px-3 py-2
                        text-left text-sm
                        text-text
                        transition-colors
                        hover:bg-surface-muted
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-primary/20
                      "
                      onClick={() => handleStatusChange(nextStatus)}
                    >

                      {nextStatus === "cancelled"
                        ? "Cancelar obra"
                        : STATUS_ACTION_LABELS[
                            nextStatus
                          ]}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

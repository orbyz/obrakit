import type { ProjectStatus } from "@/types";

export const PROJECT_STATUS: Record<
  ProjectStatus,
  {
    label: string;
    variant:
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | "neutral";
  }
> = {
  draft: {
    label: "Borrador",
    variant: "neutral",
  },

  planned: {
    label: "Planificada",
    variant: "warning",
  },

  in_progress: {
    label: "En curso",
    variant: "primary",
  },

  paused: {
    label: "Pausada",
    variant: "secondary",
  },

  completed: {
    label: "Finalizada",
    variant: "success",
  },

  cancelled: {
    label: "Cancelada",
    variant: "danger",
  },
};

export const PROJECT_STATUS_TRANSITIONS: Record<
  ProjectStatus,
  ProjectStatus[]
> = {
  draft: ["planned", "cancelled"],
  planned: ["in_progress", "cancelled"],
  in_progress: ["paused", "completed", "cancelled"],
  paused: ["in_progress", "cancelled"],
  completed: [],
  cancelled: [],
};

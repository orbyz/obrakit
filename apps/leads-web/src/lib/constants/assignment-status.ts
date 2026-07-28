import type { EmployeeAssignmentStatus } from "@/types";

export type AssignmentStatusBadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

interface AssignmentStatusPresentation {
  label: string;
  badgeVariant: AssignmentStatusBadgeVariant;
  icon?: string;
}

export const assignmentStatusConfig: Record<
  EmployeeAssignmentStatus,
  AssignmentStatusPresentation
> = {
  planned: {
    label: "Planificada",
    badgeVariant: "neutral",
  },
  active: {
    label: "Activa",
    badgeVariant: "success",
  },
  paused: {
    label: "Pausada",
    badgeVariant: "warning",
  },
  finished: {
    label: "Finalizada",
    badgeVariant: "primary",
  },
  cancelled: {
    label: "Cancelada",
    badgeVariant: "danger",
  },
};

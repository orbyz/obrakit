"use client";

import type { EmployeeAssignment } from "@/types";

import { EmployeeWorkWeekDialog } from "./EmployeeWorkWeekDialog";

interface EmployeeWorkLogDialogProps {
  assignments: EmployeeAssignment[];
}

export function EmployeeWorkLogDialog({
  assignments,
}: EmployeeWorkLogDialogProps) {
  return <EmployeeWorkWeekDialog assignments={assignments} />;
}

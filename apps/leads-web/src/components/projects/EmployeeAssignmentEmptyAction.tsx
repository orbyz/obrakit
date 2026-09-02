"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { NewEmployeeDialog } from "@/components/employees/NewEmployeeDialog";
import { Button } from "@/components/ui/button";

import { NewProjectAssignmentDialog } from "./NewProjectAssignmentDialog";

interface EmployeeAssignmentEmptyActionProps {
  projectId: string;
  employees: {
    id: string;
    nombre: string;
    apellidos: string | null;
  }[];
}

export function EmployeeAssignmentEmptyAction({
  projectId,
  employees,
}: EmployeeAssignmentEmptyActionProps) {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [assignmentOpen, setAssignmentOpen] = useState(false);
  const [continueToAssignment, setContinueToAssignment] = useState(false);

  const hasEmployees = employees.length > 0;
  const assignmentDialogOpen =
    assignmentOpen || (continueToAssignment && hasEmployees);
  const handleAssignmentOpenChange = useCallback((open: boolean) => {
    setAssignmentOpen(open);
    if (!open) setContinueToAssignment(false);
  }, []);

  return (
    <>
      <Button
        onClick={() => {
          if (hasEmployees) {
            setAssignmentOpen(true);
          } else {
            setCreateOpen(true);
          }
        }}
      >
        {hasEmployees ? "Asignar empleado" : "Crear empleado"}
      </Button>

      <NewEmployeeDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        hideTrigger
        onSuccess={() => {
          setContinueToAssignment(true);
          router.refresh();
        }}
      />

      <NewProjectAssignmentDialog
        projectId={projectId}
        employees={employees}
        open={assignmentDialogOpen}
        onOpenChange={handleAssignmentOpenChange}
        hideTrigger
      />
    </>
  );
}

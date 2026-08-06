import { getAvailableEmployees } from "@/app/actions/employees";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface AssignEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
}

export async function AssignEmployeeDialog({
  open,
  onOpenChange,
  projectId,
}: AssignEmployeeDialogProps) {
  const employees = await getAvailableEmployees();

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            Asignar empleado
          </DialogTitle>
        </DialogHeader>

        <select
          className="w-full rounded-xl border border-border p-3"
        >
          <option value="">
            Selecciona un empleado
          </option>

          {employees.map((employee) => (
            <option
              key={employee.id}
              value={employee.id}
            >
              {employee.nombre} {employee.apellidos ?? ""}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-3">

          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>

          <Button>
            Asignar
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}

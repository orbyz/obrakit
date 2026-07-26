"use client";

import { useActionState, useEffect } from "react";

import { Alert } from "../ui/alert";
import { Input } from "../ui/forms/Input";


import {
  createEmployeeAction,
  type EmployeeActionState,
  updateEmployeeAction,
} from "@/app/actions/employees";
import type { Employee } from "@/types";

const initialState: EmployeeActionState = {
  error: null,
  success: false,
};

interface EmployeeFormProps {
  mode?: "create" | "edit";
  employee?: Employee;
  onSuccess?: () => void;
}

export function EmployeeForm({
  mode = "create",
  employee,
  onSuccess,
}: EmployeeFormProps) {
  const action =
    mode === "edit" && employee
      ? updateEmployeeAction.bind(null, employee.id)
      : createEmployeeAction;

  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">

      <div>
        <label className="mb-1 block text-sm font-medium">
          Nombre
        </label>

        <Input
          name="nombre"
          defaultValue={employee?.nombre ?? ""}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Apellidos
        </label>

        <Input
          name="apellidos"
          defaultValue={employee?.apellidos ?? ""}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Especialidad
        </label>

        <Input
          name="especialidad"
          defaultValue={employee?.especialidad ?? ""}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Tipo de contrato
        </label>

        <select
          name="tipo_contrato"
          className="w-full rounded-lg border px-3 py-2"
          defaultValue={employee?.tipo_contrato ?? "empleado"}
        >
          <option value="empleado">Empleado</option>
          <option value="autonomo">Autónomo</option>
          <option value="temporal">Temporal</option>
          <option value="subcontrata">Subcontrata</option>
        </select>
      </div>

      {state.error && (
        <Alert variant="error">
          {state.error}
        </Alert>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Guardando..." : "Guardar empleado"}
      </button>

    </form>
  );
}

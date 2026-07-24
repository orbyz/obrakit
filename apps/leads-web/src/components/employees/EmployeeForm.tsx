"use client";

import { useActionState, useEffect } from "react";

import { Alert } from "../ui/alert";


import {
  createEmployeeAction,
  type EmployeeActionState,
} from "@/app/actions/employees";

const initialState: EmployeeActionState = {
  error: null,
  success: false,
};

interface EmployeeFormProps {
  onSuccess?: () => void;
}

export function EmployeeForm({
  onSuccess,
}: EmployeeFormProps) {
  const [state, formAction, pending] = useActionState(
    createEmployeeAction,
    initialState,
  );

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

        <input
          name="nombre"
          className="w-full rounded-lg border px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Apellidos
        </label>

        <input
          name="apellidos"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Especialidad
        </label>

        <input
          name="especialidad"
          className="w-full rounded-lg border px-3 py-2"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Tipo de contrato
        </label>

        <select
          name="tipo_contrato"
          className="w-full rounded-lg border px-3 py-2"
          defaultValue="empleado"
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

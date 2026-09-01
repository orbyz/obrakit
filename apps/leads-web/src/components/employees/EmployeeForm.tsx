"use client";

import { useActionState, useEffect, useState } from "react";

import { Input } from "../ui/forms/Input";
import { Button } from "@/components/ui/button";


import {
  createEmployeeAction,
  type EmployeeActionState,
  updateEmployeeAction,
} from "@/app/actions/employees";
import type { Employee, EmployeePricingModel } from "@/types";

import { useEmployeeFeedback } from "./EmployeeFeedback";

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
  const { showError, showSuccess } = useEmployeeFeedback();
  const action =
    mode === "edit" && employee
      ? updateEmployeeAction.bind(null, employee.id)
      : createEmployeeAction;

  const [state, formAction, pending] = useActionState(action, initialState);
  const [pricingModel, setPricingModel] = useState<EmployeePricingModel>(
    employee?.pricing_model ?? "hourly",
  );

  const pricingField = {
    hourly: {
      defaultValue: employee?.hourly_rate ?? employee?.coste_hora ?? "",
      label: "€/hora",
      name: "hourly_rate",
    },
    daily: {
      defaultValue: employee?.daily_rate ?? "",
      label: "€/día",
      name: "daily_rate",
    },
    monthly: {
      defaultValue: employee?.monthly_salary ?? "",
      label: "Salario mensual",
      name: "monthly_salary",
    },
    fixed: {
      defaultValue: employee?.fixed_rate ?? "",
      label: "Precio fijo",
      name: "fixed_rate",
    },
  }[pricingModel];

  useEffect(() => {
    if (state.success) {
      showSuccess(
        mode === "edit"
          ? "Empleado actualizado correctamente."
          : "Empleado creado correctamente.",
      );
      onSuccess?.();
      return;
    }

    if (state.error) showError(state.error);
  }, [mode, onSuccess, showError, showSuccess, state.error, state.success]);

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


      <div>
        <label className="mb-1 block text-sm font-medium">
          Modelo de tarificación
        </label>

        <select
          name="pricing_model"
          className="w-full rounded-lg border px-3 py-2"
          value={pricingModel}
          onChange={(event) =>
            setPricingModel(event.target.value as EmployeePricingModel)
          }
        >
          <option value="hourly">Por hora</option>
          <option value="daily">Por día</option>
          <option value="monthly">Mensual</option>
          <option value="fixed">Precio fijo</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          {pricingField.label}
        </label>

        <Input
          key={pricingField.name}
          name={pricingField.name}
          type="number"
          min="0"
          step="0.01"
          defaultValue={pricingField.defaultValue}
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full"
      >
        {pending ? "Guardando..." : "Guardar empleado"}
      </Button>

    </form>
  );
}

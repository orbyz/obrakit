"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { Input, Label, Select } from "@/components/ui/forms";
import { Button } from "@/components/ui/button";

import { toast } from "@/components/ui/toast/toast";

import {
  createEmployeeAction,
  type EmployeeActionState,
  updateEmployeeAction,
} from "@/app/actions/employees";
import type { Employee, EmployeePricingModel } from "@/types";

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

  const lastNotifiedState = useRef<string | null>(null);

  useEffect(() => {
    const notificationKey = `${state.success}:${state.error ?? ""}`;

    if (lastNotifiedState.current === notificationKey) {
      return;
    }

    if (state.success) {
      lastNotifiedState.current = notificationKey;

      toast.success(
        mode === "edit"
          ? "Empleado actualizado correctamente."
          : "Empleado creado correctamente.",
      );

      onSuccess?.();
      return;
    }

    if (state.error) {
      lastNotifiedState.current = notificationKey;
      toast.error(state.error);
    }
  }, [mode, onSuccess, state.error, state.success]);

  return (
    <form action={formAction} className="space-y-4">

      <div>
        <Label htmlFor="nombre">Nombre</Label>

        <Input
          id="nombre"
          name="nombre"
          defaultValue={employee?.nombre ?? ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="apellidos">Apellidos</Label>

        <Input
          id="apellidos"
          name="apellidos"
          defaultValue={employee?.apellidos ?? ""}
          required
        />
      </div>

      <div>
        <Label htmlFor="especialidad">Especialidad</Label>

        <Input
          id="especialidad"
          name="especialidad"
          defaultValue={employee?.especialidad ?? ""}
        />
      </div>

      <div>
        <Label htmlFor="tipo_contrato">Tipo de contrato</Label>

        <Select
          id="tipo_contrato"
          name="tipo_contrato"
          defaultValue={employee?.tipo_contrato ?? "empleado"}
        >
          <option value="empleado">Empleado</option>
          <option value="autonomo">Autónomo</option>
          <option value="temporal">Temporal</option>
          <option value="subcontrata">Subcontrata</option>
        </Select>
      </div>

      <div>
        <Label htmlFor="pricing_model">
          Modelo de tarificación
        </Label>

        <Select
          id="pricing_model"
          name="pricing_model"
          value={pricingModel}
          onChange={(event) =>
            setPricingModel(event.target.value as EmployeePricingModel)
          }
        >
          <option value="hourly">Por hora</option>
          <option value="daily">Por día</option>
          <option value="monthly">Mensual</option>
          <option value="fixed">Precio fijo</option>
        </Select>
      </div>

      <div>
        <Label htmlFor={pricingField.name}>
          {pricingField.label}
        </Label>

        <Input
          id={pricingField.name}
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

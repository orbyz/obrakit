"use client";

import { useActionState, useEffect, useRef } from "react";

import {
  createMaterialConsumptionAction,
  type MaterialConsumptionActionState,
  updateMaterialConsumptionAction,
} from "@/app/actions/material-consumptions";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/forms/Input";
import { Select } from "@/components/ui/forms/Select";
import { Textarea } from "@/components/ui/forms/Textarea";

import type {
  Material,
  MaterialConsumption,
} from "@/types";

import { toast } from "@/components/ui/toast/toast";

interface MaterialConsumptionFormProps {
  projectId: string;
  materials?: Material[];
  mode: "create" | "edit";
  onSuccess: () => void;
  consumption?: MaterialConsumption;
}

const initialState: MaterialConsumptionActionState = {
  error: null,
  success: false,
};

export function MaterialConsumptionForm({
  projectId,
  materials = [],
  mode,
  onSuccess,
  consumption,
}: MaterialConsumptionFormProps) {

  const action =
    mode === "edit" && consumption
      ? updateMaterialConsumptionAction.bind(null, consumption.id)
      : createMaterialConsumptionAction;

  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  const activeMaterials = materials.filter(
    (material) => material.activo,
  );

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
          ? "Consumo actualizado correctamente."
          : "Material agregado correctamente.",
      );

      onSuccess();
      return;
    }

    if (state.error) {
      lastNotifiedState.current = notificationKey;
      toast.error(state.error);
    }
  }, [
    mode,
    onSuccess,
    state.error,
    state.success,
  ]);

  if (
    mode === "create" &&
    activeMaterials.length === 0
  ) {
    return (
      <p className="text-sm text-muted">
        Debes tener al menos un material activo para registrar un consumo.
      </p>
    );
  }
  return (
    <form action={formAction} className="space-y-4">
      {mode === "create" && (
        <>
      <input
        type="hidden"
        name="project_id"
        value={projectId}
      />

          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="material_id"
            >
              Material
            </label>

            <Select
              id="material_id"
              name="material_id"
              required
              defaultValue=""
            >
              <option value="" disabled>
                Selecciona un material
              </option>

              {activeMaterials.map((material) => (
                <option
                  key={material.id}
                  value={material.id}
                >
                  {material.nombre}
                </option>
              ))}
            </Select>
          </div>
        </>
      )}
          <div>
            <label
              className="mb-1 block text-sm font-medium"
              htmlFor="fecha"
            >
              Fecha
            </label>

            <Input
              id="fecha"
              name="fecha"
              type="date"
              defaultValue={
                consumption?.fecha ??
                new Date().toISOString().split("T")[0]
              }
              required
            />
          </div>



      <div>
        <label
          className="mb-1 block text-sm font-medium"
          htmlFor="cantidad"
        >
          Cantidad
        </label>

        <Input
          id="cantidad"
          name="cantidad"
          type="number"
          min="0.01"
          step="0.01"
          defaultValue={consumption?.cantidad ?? ""}
          required
        />
      </div>

      <div>
        <label
          className="mb-1 block text-sm font-medium"
          htmlFor="notas"
        >
          Observaciones
        </label>

        <Textarea
          id="notas"
          name="notas"
          defaultValue={consumption?.notas ?? ""}
        />
      </div>

      <DialogFooter>
        <Button
          type="submit"
          disabled={pending}
        >
          {pending
            ? "Guardando..."
            : mode === "edit"
              ? "Guardar cambios"
              : "Registrar consumo"}
        </Button>
      </DialogFooter>
    </form>
  );
}

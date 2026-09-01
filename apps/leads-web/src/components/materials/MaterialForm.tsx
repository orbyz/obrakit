"use client";

import { useActionState, useEffect } from "react";

import { Input } from "../ui/forms/Input";
import { Button } from "@/components/ui/button";

import {
  createMaterialAction,
  type MaterialActionState,
  updateMaterialAction,
} from "@/app/actions/materials";

import type {
  Material,
  MaterialCategory,
  MaterialUnit,
} from "@/types";

import { useEmployeeFeedback } from "../employees/EmployeeFeedback";

const initialState: MaterialActionState = {
  error: null,
  success: false,
};

interface MaterialFormProps {
  mode?: "create" | "edit";
  material?: Material;
  onSuccess?: () => void;
}

const categories: {
  value: MaterialCategory;
  label: string;
}[] = [
  { value: "albanileria", label: "Albañilería" },
  { value: "ceramica", label: "Cerámica" },
  { value: "fontaneria", label: "Fontanería" },
  { value: "electricidad", label: "Electricidad" },
  { value: "pintura", label: "Pintura" },
  { value: "carpinteria", label: "Carpintería" },
  { value: "ferreteria", label: "Ferretería" },
  { value: "aislamiento", label: "Aislamiento" },
  { value: "cubiertas", label: "Cubiertas" },
  { value: "yesos", label: "Yesos" },
  { value: "hormigon", label: "Hormigón" },
  { value: "otro", label: "Otro" },
];

const units: {
  value: MaterialUnit;
  label: string;
}[] = [
  { value: "und", label: "Unidad" },
  { value: "m2", label: "m²" },
  { value: "ml", label: "Metro lineal" },
  { value: "kg", label: "Kilogramo" },
  { value: "lt", label: "Litro" },
  { value: "sacos", label: "Sacos" },
  { value: "m3", label: "m³" },
  { value: "rollos", label: "Rollos" },
  { value: "cajas", label: "Cajas" },
  { value: "palets", label: "Palets" },
];

export function MaterialForm({
  mode = "create",
  material,
  onSuccess,
}: MaterialFormProps) {
  const { showError, showSuccess } = useEmployeeFeedback();

  const action =
    mode === "edit" && material
      ? updateMaterialAction.bind(null, material.id)
      : createMaterialAction;

  const [state, formAction, pending] = useActionState(
    action,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      showSuccess(
        mode === "edit"
          ? "Material actualizado correctamente."
          : "Material creado correctamente.",
      );

      onSuccess?.();
      return;
    }

    if (state.error) {
      showError(state.error);
    }
  }, [
    mode,
    onSuccess,
    showError,
    showSuccess,
    state.error,
    state.success,
  ]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium">
          Nombre
        </label>

        <Input
          name="nombre"
          defaultValue={material?.nombre ?? ""}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Descripción
        </label>

        <Input
          name="descripcion"
          defaultValue={material?.descripcion ?? ""}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Categoría
        </label>

        <select
          name="categoria"
          className="w-full rounded-lg border px-3 py-2"
          defaultValue={material?.categoria ?? "otro"}
        >
          {categories.map((category) => (
            <option
              key={category.value}
              value={category.value}
            >
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Unidad
        </label>

        <select
          name="unidad_base"
          className="w-full rounded-lg border px-3 py-2"
          defaultValue={material?.unidad_base ?? "und"}
        >
          {units.map((unit) => (
            <option
              key={unit.value}
              value={unit.value}
            >
              {unit.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Precio habitual (€)
        </label>

        <Input
          name="precio_habitual"
          type="number"
          min="0"
          step="0.01"
          defaultValue={material?.precio_habitual ?? ""}
          required
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Marca
        </label>

        <Input
          name="marca"
          defaultValue={material?.marca ?? ""}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Referencia
        </label>

        <Input
          name="referencia"
          defaultValue={material?.referencia ?? ""}
        />
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="w-full"
      >
        {pending
          ? "Guardando..."
          : mode === "edit"
            ? "Actualizar material"
            : "Guardar material"}
      </Button>
    </form>
  );
}

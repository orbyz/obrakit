"use client";

import { useTransition } from "react";

import { reactivateMaterialAction } from "@/app/actions/materials";
import { Button } from "@/components/ui/button";
import type { Material } from "@/types";

import { DeactivateMaterialDialog } from "./DeactivateMaterialDialog";
import { EditMaterialDialog } from "./EditMaterialDialog";
import { useEmployeeFeedback } from "../employees/EmployeeFeedback";

interface MaterialRowProps {
  material: Material;
}

export function MaterialRow({
  material,
}: MaterialRowProps) {
  const [pending, startTransition] = useTransition();
  const { showError, showSuccess } = useEmployeeFeedback();

  function handleReactivate() {
    startTransition(async () => {
      const result = await reactivateMaterialAction(material.id);

      if (result.success) {
        showSuccess("Material reactivado correctamente.");
        return;
      }

      showError(result.error ?? "Error al reactivar el material.");
    });
  }

  return (
    <tr className="border-b">
      <td className="p-4 font-medium">
        {material.nombre}
      </td>

      <td className="p-4 capitalize">
        {material.categoria.replaceAll("_", " ")}
      </td>

      <td className="p-4">
        {material.unidad_base}
      </td>

      <td className="p-4">
        € {material.precio_habitual.toFixed(2)}
      </td>

      <td className="p-4">
        <div className="flex gap-2">
          {material.activo ? (
            <>
              <EditMaterialDialog material={material} />

              <DeactivateMaterialDialog material={material} />
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={pending}
              onClick={handleReactivate}
            >
              {pending ? "Reactivando..." : "Reactivar"}
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}

"use client";

import { useTransition } from "react";

import { reactivateMaterialAction } from "@/app/actions/materials";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TableCell,
  TableRow,
} from "@/components/ui/table";
import { RotateCcw } from "lucide-react";

import type { Material } from "@/types";

import { useEmployeeFeedback } from "../employees/EmployeeFeedback";
import { DeactivateMaterialDialog } from "./DeactivateMaterialDialog";
import { EditMaterialDialog } from "./EditMaterialDialog";

interface MaterialRowProps {
  material: Material;
}

export function MaterialRow({ material }: MaterialRowProps) {
  const [pending, startTransition] = useTransition();
  const { showError, showSuccess } = useEmployeeFeedback();

  function handleReactivate() {
    startTransition(async () => {
      const result = await reactivateMaterialAction(material.id);

      if (result.success) {
        showSuccess("Material reactivado correctamente.");
        return;
      }

      showError(
        result.error ?? "Error al reactivar el material.",
      );
    });
  }

  return (
    <TableRow>
      <TableCell>
        <span className="font-medium text-text">
          {material.nombre}
        </span>
      </TableCell>

      <TableCell>
        <span className="capitalize text-muted">
          {material.categoria.replaceAll("_", " ")}
        </span>
      </TableCell>

      <TableCell>
        {material.unidad_base}
      </TableCell>

      <TableCell className="text-right font-medium whitespace-nowrap">
        {material.precio_habitual.toLocaleString("es-ES", {
          style: "currency",
          currency: "EUR",
          minimumFractionDigits: 2,
        })}
      </TableCell>

      <TableCell>
        <div className="flex flex-wrap gap-2">
          {material.activo ? (
            <>
              <EditMaterialDialog material={material} />
              <DeactivateMaterialDialog material={material} />
            </>
          ) : (
            <>
              <Badge variant="neutral">
                Inactivo
              </Badge>

              <Button
                variant="outline"
                size="sm"
                type="button"
                disabled={pending}
                onClick={handleReactivate}
                className="h-9 w-9 p-0"
                aria-label={`Reactivar material ${material.nombre}`}
                title="Reactivar material"
              >
                <RotateCcw
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              </Button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

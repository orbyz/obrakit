"use client";

import { useState } from "react";

import { deleteGastoAction } from "@/app/actions/gastos";
import GastoForm from "./GastoForm";
import type { Gasto } from "@/types";

import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/button/Button";
import { Badge } from "@/components/ui/badge/Badge";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import { toast } from "@/components/ui/toast/toast";

import {
  Building2,
  Package,
  Calendar,
  Store,
  Trash2,
  Pencil,
} from "lucide-react";

const CATEGORIA_CONFIG = {
  combustible: {
    label: "Combustible",
  },
  transporte: {
    label: "Transporte",
  },
  dietas: {
    label: "Dietas",
  },
  contenedores: {
    label: "Contenedores",
  },
  herramientas: {
    label: "Herramientas",
  },
  alquiler: {
    label: "Alquiler",
  },
  peajes: {
    label: "Peajes",
  },
  otros: {
    label: "Otros",
  },
};

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface GastosListProps {
  gastos: Gasto[];
  onDeleted?: () => void | Promise<void>;
}

export default function GastosList({
  gastos,
  onDeleted,
}: GastosListProps) {
  const [editingGastoId, setEditingGastoId] = useState<string | null>(null);

  if (gastos.length === 0) {
    return (
      <EmptyState
        title="Sin gastos registrados"
        description="Añade tu primer gasto de materiales."
      />
    );
  }

  return (
    <div className="space-y-4">
      {gastos.map((gasto) => {
        const categoria =
          CATEGORIA_CONFIG[gasto.categoria ?? "otros"];

        const importe = Number(gasto.importe);

        const cantidad =
          typeof gasto.cantidad === "number" && gasto.cantidad > 0
            ? gasto.cantidad
            : null;

        const hasQuantity = cantidad !== null && Boolean(gasto.unidad);

        const total = hasQuantity
          ? importe * cantidad
          : importe;

        return (
          <div key={gasto.id}>
            <Card className="flex items-start justify-between gap-6">
              {/* Información */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-base font-semibold text-text">
                      {gasto.material}
                    </h3>

                    <div className="mt-2">
                      <Badge variant="neutral">
                        {categoria.label}
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold text-primary">
                      {total.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </p>

                    {hasQuantity && (
                      <p className="mt-1 text-xs text-muted">
                        {cantidad} {gasto.unidad} ×{" "}
                        {importe.toLocaleString("es-ES", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                  {gasto.proveedor && (
                    <div className="flex items-center gap-2">
                      <Store size={15} />
                      {gasto.proveedor}
                    </div>
                  )}

                  {gasto.obra_nombre && (
                    <div className="flex items-center gap-2">
                      <Building2 size={15} />
                      {gasto.obra_nombre}
                    </div>
                  )}

                  {gasto.cantidad && gasto.unidad && (
                    <div className="flex items-center gap-2">
                      <Package size={15} />
                      {gasto.cantidad} {gasto.unidad}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Calendar size={15} />
                    {formatFecha(gasto.fecha)}
                  </div>
                </div>

                {gasto.notas && (
                  <p className="mt-4 text-sm text-muted italic">
                    {gasto.notas}
                  </p>
                )}
              </div>

              {/* Acciones */}
              <div className="flex shrink-0 items-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setEditingGastoId(
                      editingGastoId === gasto.id
                        ? null
                        : gasto.id,
                    )
                  }
                  aria-label="Editar gasto"
                  title="Editar gasto"
                  className="h-9 w-9 p-0"
                >
                  <Pencil size={14} />
                </Button>

                <Button
                  size="sm"
                  variant="danger"
                  onClick={async () => {
                    if (!confirm("¿Eliminar este gasto?")) {
                      return;
                    }

                    const result = await deleteGastoAction(gasto.id);

                    if (result.success) {
                      toast.success("Gasto eliminado correctamente.");
                      await onDeleted?.();
                      return;
                    }

                    toast.error(
                      result.error ?? "No se pudo eliminar el gasto.",
                    );
                  }}
                  aria-label="Eliminar gasto"
                  title="Eliminar gasto"
                  className="h-9 w-9 p-0"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </Card>

            {/* Formulario de edición */}
            {editingGastoId === gasto.id && (
              <Card className="mt-3">
                <GastoForm
                  gasto={gasto}
                  projectIdFijo={gasto.project_id ?? undefined}
                  onSuccess={async () => {
                    setEditingGastoId(null);
                    await onDeleted?.();
                  }}
                />
              </Card>
            )}
          </div>
        );
      })}
    </div>
  );
}

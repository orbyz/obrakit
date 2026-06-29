"use client";

import { deleteGastoAction } from "@/app/actions/gastos";
import type { Gasto } from "@/types";

import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/button/Button";
import { Badge } from "@/components/ui/badge/Badge";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";

import { Building2, Package, Calendar, Store, Trash2 } from "lucide-react";

const CATEGORIA_CONFIG: Record<
  string,
  {
    label: string;
    variant:
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | "neutral"
      | "outline";
  }
> = {
  ceramica: {
    label: "Cerámica",
    variant: "warning",
  },

  fontaneria: {
    label: "Fontanería",
    variant: "primary",
  },

  electricidad: {
    label: "Electricidad",
    variant: "secondary",
  },

  pintura: {
    label: "Pintura",
    variant: "success",
  },

  herramientas: {
    label: "Herramientas",
    variant: "neutral",
  },

  otro: {
    label: "Otro",
    variant: "outline",
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
}

export default function GastosList({ gastos }: GastosListProps) {
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
        const categoria = CATEGORIA_CONFIG[gasto.categoria ?? "otro"];

        return (
          <Card
            key={gasto.id}
            className="flex items-start justify-between gap-6"
          >
            {/* Información */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="text-base font-semibold text-text">
                    {gasto.material}
                  </h3>

                  <div className="mt-2">
                    <Badge variant={categoria.variant}>{categoria.label}</Badge>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-xl font-bold text-primary">
                    {Number(gasto.importe).toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                    })}{" "}
                    €
                  </p>
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
                <p className="mt-4 text-sm text-muted italic">{gasto.notas}</p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex shrink-0 items-end">
              <Button
                size="sm"
                variant="danger"
                onClick={async () => {
                  if (confirm("¿Eliminar este gasto?")) {
                    await deleteGastoAction(gasto.id);
                  }
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

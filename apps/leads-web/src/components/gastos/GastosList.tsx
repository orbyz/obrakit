"use client";

import { deleteGastoAction } from "@/app/actions/gastos";
import type { Gasto } from "@/types";

const CATEGORIA_CONFIG: Record<string, { icon: string; color: string }> = {
  ceramica: { icon: "🪵", color: "bg-amber-50 text-amber-700" },
  fontaneria: { icon: "🚿", color: "bg-blue-50 text-blue-700" },
  electricidad: { icon: "⚡", color: "bg-yellow-50 text-yellow-700" },
  pintura: { icon: "🎨", color: "bg-purple-50 text-purple-700" },
  herramientas: { icon: "🔧", color: "bg-gray-50 text-gray-700" },
  otro: { icon: "📦", color: "bg-gray-50 text-gray-700" },
};

function formatFecha(fecha: string): string {
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
      <div className="text-center py-12">
        <p className="text-gray-400 text-sm">Sin gastos registrados</p>
        <p className="text-gray-300 text-xs mt-1">
          Añade tu primer gasto de materiales
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {gastos.map((gasto) => {
        const config = CATEGORIA_CONFIG[gasto.categoria ?? "otro"];
        return (
          <div
            key={gasto.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {/* Categoría badge */}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium shrink-0 ${config.color}`}
              >
                {config.icon} {gasto.categoria ?? "otro"}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {gasto.material}
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
                  {gasto.proveedor && (
                    <span className="text-xs text-gray-500">
                      🏪 {gasto.proveedor}
                    </span>
                  )}
                  {gasto.obra_nombre && (
                    <span className="text-xs text-gray-500">
                      🏗️ {gasto.obra_nombre}
                    </span>
                  )}
                  {gasto.cantidad && gasto.unidad && (
                    <span className="text-xs text-gray-500">
                      📦 {gasto.cantidad} {gasto.unidad}
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    📅 {formatFecha(gasto.fecha)}
                  </span>
                </div>
                {gasto.notas && (
                  <p className="text-xs text-gray-400 mt-1 truncate">
                    {gasto.notas}
                  </p>
                )}
              </div>
            </div>

            {/* Importe + eliminar */}
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-sm font-bold text-gray-900">
                {Number(gasto.importe).toLocaleString("es-ES", {
                  minimumFractionDigits: 2,
                })}{" "}
                €
              </span>
              <button
                onClick={async () => {
                  if (confirm("¿Eliminar este gasto?")) {
                    await deleteGastoAction(gasto.id);
                  }
                }}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

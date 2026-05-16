"use client";

import { useState } from "react";
import type { Gasto } from "@/types";
import GastoForm from "./GastoForm";
import GastosList from "./GastosList";

interface GastosClientProps {
  gastos: Gasto[];
  leads: { id: string; nombre: string }[];
  resumen: {
    totalMes: number;
    totalAnio: number;
    porCategoria: Record<string, number>;
    porObra: { nombre: string; total: number }[];
  };
}

export default function GastosClient({
  gastos,
  leads,
  resumen,
}: GastosClientProps) {
  const [showForm, setShowForm] = useState(false);
  const [vistaActiva, setVistaActiva] = useState<
    "lista" | "porObra" | "porCategoria"
  >("lista");

  return (
    <>
      {/* Botón nuevo gasto */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          {showForm ? "✕ Cerrar" : "+ Nuevo gasto"}
        </button>
      </div>

      {/* Formulario inline */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Registrar gasto
          </h2>
          <GastoForm leads={leads} onSuccess={() => setShowForm(false)} />
        </div>
      )}

      {/* Tabs de vista */}
      <div className="flex gap-2 mb-4 border-b border-gray-200">
        {[
          { key: "lista", label: "📋 Lista" },
          { key: "porObra", label: "🏗️ Por obra" },
          { key: "porCategoria", label: "📦 Por categoría" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setVistaActiva(tab.key as typeof vistaActiva)}
            className={`text-sm px-4 py-2 border-b-2 transition-colors ${
              vistaActiva === tab.key
                ? "border-orange-500 text-orange-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Vista Lista */}
      {vistaActiva === "lista" && <GastosList gastos={gastos} />}

      {/* Vista Por Obra */}
      {vistaActiva === "porObra" && (
        <div className="space-y-3">
          {resumen.porObra.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-12">
              Sin datos aún
            </p>
          ) : (
            resumen.porObra.map((obra) => (
              <div
                key={obra.nombre}
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">🏗️</span>
                  <span className="text-sm font-medium text-gray-900">
                    {obra.nombre}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {obra.total.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  €
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Vista Por Categoría */}
      {vistaActiva === "porCategoria" && (
        <div className="space-y-3">
          {Object.entries(resumen.porCategoria)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, total]) => {
              const totalGeneral = Object.values(resumen.porCategoria).reduce(
                (a, b) => a + b,
                0,
              );
              const porcentaje =
                totalGeneral > 0 ? Math.round((total / totalGeneral) * 100) : 0;

              return (
                <div
                  key={cat}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {cat}
                    </span>
                    <span className="text-sm font-bold text-gray-900">
                      {total.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-orange-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${porcentaje}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {porcentaje}% del total
                  </p>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}

"use client";

import { useState } from "react";
import type { Lead, Seguimiento, Gasto } from "@/types";
import LeadInfo from "./LeadInfo";
import SeguimientoForm from "./SeguimientoForm";
import SeguimientoList from "./SeguimientoList";
import GastoForm from "../gastos/GastoForm";
import GastosList from "../gastos/GastosList";

interface LeadDetailClientProps {
  lead: Lead;
  seguimientos: Seguimiento[];
  gastos: Gasto[];
}

export default function LeadDetailClient({
  lead,
  seguimientos,
  gastos,
}: LeadDetailClientProps) {
  const [tab, setTab] = useState<"seguimientos" | "gastos">("seguimientos");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Columna izquierda — Info del lead */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Información del lead
        </h2>
        <LeadInfo lead={lead} />
      </div>

      {/* Columna derecha — Tabs */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setTab("seguimientos")}
            className={`text-sm px-4 py-2 border-b-2 transition-colors ${
              tab === "seguimientos"
                ? "border-orange-500 text-orange-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            📝 Seguimientos ({seguimientos.length})
          </button>
          <button
            onClick={() => setTab("gastos")}
            className={`text-sm px-4 py-2 border-b-2 transition-colors ${
              tab === "gastos"
                ? "border-orange-500 text-orange-600 font-medium"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            🧱 Gastos ({gastos.length})
          </button>
        </div>

        {/* Contenido según tab */}
        {tab === "seguimientos" ? (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Añadir seguimiento
              </h2>
              <SeguimientoForm leadId={lead.id} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Historial
              </h2>
              <SeguimientoList seguimientos={seguimientos} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Añadir gasto
              </h2>
              <GastoForm leadIdFijo={lead.id} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Gastos registrados
              </h2>
              <GastosList gastos={gastos} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

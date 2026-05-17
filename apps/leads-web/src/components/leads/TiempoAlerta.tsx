"use client";

import { useState } from "react";
import { extenderPlazoAction } from "@/app/actions/leads";

interface TiempoAlertaProps {
  leadId: string;
  fechaFinEstimada: string;
  diasEstimados: number;
}

export default function TiempoAlerta({
  leadId,
  fechaFinEstimada,
  diasEstimados,
}: TiempoAlertaProps) {
  const [extending, setExtending] = useState(false);

  const hoy = new Date();
  const fin = new Date(fechaFinEstimada);
  const diffTime = fin.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  async function handleExtender() {
    const extension = Math.ceil(diasEstimados * 0.5); // 50% más de tiempo
    if (confirm(`¿Extender la obra ${extension} días más?`)) {
      setExtending(true);
      await extenderPlazoAction(leadId, extension);
      setExtending(false);
    }
  }

  if (diasRestantes < 0) {
    return (
      <div className="mt-2 px-2 py-1.5 bg-red-50 border border-red-200 rounded">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-red-700">
            ⚠️ Vencido hace {Math.abs(diasRestantes)} días
          </span>
          <button
            onClick={handleExtender}
            disabled={extending}
            className="text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
          >
            {extending ? "..." : "Extender"}
          </button>
        </div>
      </div>
    );
  }

  if (diasRestantes <= 3) {
    return (
      <div className="mt-2 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-amber-700">
            ⏰ {diasRestantes} día{diasRestantes !== 1 ? "s" : ""}
          </span>
          <button
            onClick={handleExtender}
            disabled={extending}
            className="text-xs text-amber-600 hover:text-amber-800 font-medium disabled:opacity-50"
          >
            {extending ? "..." : "Extender"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}

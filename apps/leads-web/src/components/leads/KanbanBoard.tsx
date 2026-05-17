"use client";

import { useState } from "react";
import type { EstadoLead, Lead } from "@/types";
import KanbanColumn from "./KanbanColumn";
import NewLeadModal from "./NewLeadModal";

const ESTADOS: EstadoLead[] = [
  "nuevo",
  "contactado",
  "visita",
  "presupuesto",
  "cerrado",
  "perdido",
];

interface KanbanBoardProps {
  leads: Record<EstadoLead, Lead[]>;
}

export default function KanbanBoard({ leads }: KanbanBoardProps) {
  const [showModal, setShowModal] = useState(false);

  const totalLeads = Object.values(leads).flat().length;
  const cerrados = leads.cerrado.length;
  const enPresupuesto = leads.presupuesto.length;

  return (
    <>
      {/* Stats rápidas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Obras activas</p>
          <p className="text-2xl font-bold text-gray-900">{totalLeads}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">En presupuesto</p>
          <p className="text-2xl font-bold text-amber-500">{enPresupuesto}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Cerrados</p>
          <p className="text-2xl font-bold text-green-500">{cerrados}</p>
        </div>
      </div>

      {/* Botón nuevo lead */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          + Nueva obra
        </button>
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="grid grid-cols-6 gap-4 min-w-[1200px]">
          {ESTADOS.map((estado) => (
            <KanbanColumn key={estado} estado={estado} leads={leads[estado]} />
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && <NewLeadModal onClose={() => setShowModal(false)} />}
    </>
  );
}

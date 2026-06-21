"use client";

import { useState } from "react";
import type { EstadoLead, Lead } from "@/types";
import KanbanColumn from "./KanbanColumn";
import NewLeadModal from "./NewLeadModal";
import { Button } from "@/components/ui/button/Button";

const ESTADOS: EstadoLead[] = ["nuevo", "en_curso", "cerrado"];

interface KanbanBoardProps {
  leads: Record<EstadoLead, Lead[]>;
}

export default function KanbanBoard({ leads }: KanbanBoardProps) {
  const [showModal, setShowModal] = useState(false);

  const totalLeads = Object.values(leads).flat().length;
  const cerrados = leads.cerrado.length;
  const enCurso = leads.en_curso.length;

  return (
    <>
      {/* Botón nuevo lead */}
      <div className="flex justify-end mb-4">
        <Button variant="secondary" onClick={() => setShowModal(true)}>
          + Nueva obra
        </Button>
      </div>

      {/* Kanban */}
      <div className="overflow-x-auto pb-4 -mx-4 px-4">
        <div className="grid grid-cols-3 gap-4 min-w-[900px]">
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

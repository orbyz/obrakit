"use client";

import { useState } from "react";

import type { CRMOpportunity } from "@/app/actions/leads";
import type { EstadoLead } from "@/types";

import { Button } from "@/components/ui/button/Button";

import CRMColumn from "./CRMColumn";
import NewLeadModal from "./NewLeadModal";

const ESTADOS: EstadoLead[] = [
  "nuevo",
  "en_curso",
  "cerrado",
];

interface CRMBoardProps {
  opportunities: CRMOpportunity[];
}

export default function CRMBoard({
  opportunities,
}: CRMBoardProps) {
  const [showModal, setShowModal] = useState(false);
  const opportunitiesByEstado = opportunities.reduce<
    Record<EstadoLead, CRMOpportunity[]>
  >(
    (acc, opportunity) => {
      acc[opportunity.estado].push(opportunity);
      return acc;
    },
    { nuevo: [], en_curso: [], cerrado: [] },
  );

  return (
    <>
      <div className="mb-6 flex justify-end">
        <Button
          variant="secondary"
          onClick={() => setShowModal(true)}
        >
          + Nueva oportunidad
        </Button>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="grid min-w-[900px] grid-cols-3 gap-6">
          {ESTADOS.map((estado) => (
            <CRMColumn
              key={estado}
              estado={estado}
              opportunities={opportunitiesByEstado[estado]}
            />
          ))}
        </div>
      </div>

      {showModal && (
        <NewLeadModal
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

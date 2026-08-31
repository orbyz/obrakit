"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

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
    {
      nuevo: [],
      en_curso: [],
      cerrado: [],
    },
  );

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-text">
            Oportunidades
          </h2>

          <p className="mt-1 text-sm text-muted">
            Gestiona tus oportunidades comerciales por estado.
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={() => setShowModal(true)}
          className="w-full sm:w-auto"
        >
          <Plus size={18} />
          Nueva oportunidad
        </Button>
      </div>

      <div className="w-full overflow-x-auto overscroll-x-contain pb-4">
        <div className="grid min-w-[900px] grid-cols-3 gap-4 sm:gap-5">
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

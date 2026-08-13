"use client";

import type { CRMOpportunity } from "@/app/actions/leads";
import type { EstadoLead } from "@/types";

import OpportunityCard from "./OpportunityCard";

interface CRMColumnProps {
  estado: EstadoLead;
  opportunities: CRMOpportunity[];
}

const COLUMN_CONFIG: Record<
  EstadoLead,
  {
    label: string;
    description: string;
  }
> = {
  nuevo: {
    label: "Nuevas",
    description: "Oportunidades recién recibidas",
  },
  en_curso: {
    label: "En curso",
    description: "Oportunidades en seguimiento",
  },
  cerrado: {
    label: "Cerradas",
    description: "Oportunidades cerradas",
  },
};

export default function CRMColumn({
  estado,
  opportunities,
}: CRMColumnProps) {
  const config = COLUMN_CONFIG[estado];

  return (
    <section className="min-w-0">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-text">
            {config.label}
          </h2>

          <p className="text-xs text-muted-foreground">
            {config.description}
          </p>
        </div>

        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {opportunities.length}
        </span>
      </div>

      <div className="space-y-3">
        {opportunities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted-foreground">
              No hay oportunidades
            </p>
          </div>
        ) : (
          opportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
            />
          ))
        )}
      </div>
    </section>
  );
}

import type { CRMOpportunity } from "@/app/actions/leads";
import type { EstadoLead } from "@/types";

import { Badge } from "@/components/ui/badge/Badge";
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
    variant: "primary" | "warning" | "success";
  }
> = {
  nuevo: {
    label: "Nuevas",
    description: "Oportunidades recién recibidas",
    variant: "primary",
  },
  en_curso: {
    label: "En curso",
    description: "Oportunidades en seguimiento",
    variant: "warning",
  },
  cerrado: {
    label: "Cerradas",
    description: "Oportunidades cerradas",
    variant: "success",
  },
};

export default function CRMColumn({
  estado,
  opportunities,
}: CRMColumnProps) {
  const config = COLUMN_CONFIG[estado];

  return (
    <section className="min-w-0 rounded-2xl border border-border bg-background/50 p-3 sm:p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-text">{config.label}</h2>

            <Badge variant={config.variant} size="sm">
              {opportunities.length}
            </Badge>
          </div>

          <p className="mt-1 text-xs leading-5 text-muted">
            {config.description}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {opportunities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-8 text-center">
            <p className="text-sm text-muted">No hay oportunidades</p>
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

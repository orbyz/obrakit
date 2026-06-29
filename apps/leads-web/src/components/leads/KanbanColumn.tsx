import type { EstadoLead, Lead } from "@/types";

import LeadCard from "./LeadCard";

import { EmptyState } from "@/components/ui/empty-state/EmptyState";

const COLUMN_CONFIG: Record<
  EstadoLead,
  {
    label: string;
    color: string;
  }
> = {
  nuevo: {
    label: "Nuevo",
    color: "bg-accent",
  },

  en_curso: {
    label: "En curso",
    color: "bg-primary",
  },

  cerrado: {
    label: "Finalizadas",
    color: "bg-success",
  },
};

interface KanbanColumnProps {
  estado: EstadoLead;
  leads: Lead[];
}

export default function KanbanColumn({ estado, leads }: KanbanColumnProps) {
  const { label, color } = COLUMN_CONFIG[estado];

  return (
    <div className="flex min-w-[280px] flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center gap-3">
        <span className={`h-3 w-3 rounded-full ${color}`} />

        <h3 className="font-semibold text-text">{label}</h3>

        <span className="ml-auto rounded-full bg-background px-3 py-1 text-xs font-medium text-muted">
          {leads.length}
        </span>
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-3">
        {leads.length === 0 ? (
          <EmptyState
            icon="🏗️"
            title="Sin obras"
            description="Todavía no hay proyectos en esta fase."
          />
        ) : (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        )}
      </div>
    </div>
  );
}

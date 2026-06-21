import type { EstadoLead, Lead } from "@/types";
import LeadCard from "./LeadCard";

const COLUMN_CONFIG = {
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
  const config = COLUMN_CONFIG[estado];

  return (
    <div className="flex flex-col min-w-[200px] w-full">
      {/* Header columna */}
      <div className="mb-4 flex items-center gap-3">
        <div className={`h-3 w-3 rounded-full ${config.color}`} />
        <span className="font-semibold text-text">{config.label}</span>
        <span className="ml-auto rounded-full bg-background px-3 py-1 text-xs font-medium text-muted">
          {leads.length}
        </span>
      </div>

      {/* Tarjetas */}
      <div className="flex flex-col gap-2 min-h-[100px]">
        {leads.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-border p-6 text-center">
            <p className="text-sm text-muted">Sin obras</p>
          </div>
        ) : (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        )}
      </div>
    </div>
  );
}

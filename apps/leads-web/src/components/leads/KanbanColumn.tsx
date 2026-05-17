import type { EstadoLead, Lead } from "@/types";
import LeadCard from "./LeadCard";

const COLUMN_CONFIG: Record<EstadoLead, { label: string; color: string }> = {
  nuevo: { label: "📥 Nuevo", color: "bg-gray-400" },
  en_curso: { label: "⚙️ En Curso", color: "bg-blue-400" },
  cerrado: { label: "✅ Cerrado", color: "bg-green-500" },
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
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {config.label}
        </span>
        <span className="ml-auto text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
          {leads.length}
        </span>
      </div>

      {/* Tarjetas */}
      <div className="flex flex-col gap-2 min-h-[100px]">
        {leads.length === 0 ? (
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-400">Sin obras</p>
          </div>
        ) : (
          leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
        )}
      </div>
    </div>
  );
}

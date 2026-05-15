import { notFound } from "next/navigation";
import Link from "next/link";
import { getLeadById } from "@/app/actions/leads";
import { getSeguimientos } from "@/app/actions/seguimientos";
import LeadInfo from "@/components/leads/LeadInfo";
import SeguimientoForm from "@/components/leads/SeguimientoForm";
import SeguimientoList from "@/components/leads/SeguimientoList";

const ESTADO_CONFIG: Record<string, { label: string; color: string }> = {
  nuevo: { label: "📥 Nuevo", color: "bg-gray-100 text-gray-700" },
  contactado: { label: "📞 Contactado", color: "bg-blue-100 text-blue-700" },
  visita: { label: "🏠 Visita", color: "bg-purple-100 text-purple-700" },
  presupuesto: {
    label: "📄 Presupuesto",
    color: "bg-amber-100 text-amber-700",
  },
  cerrado: { label: "🤝 Cerrado", color: "bg-green-100 text-green-700" },
  perdido: { label: "❌ Perdido", color: "bg-red-100 text-red-700" },
};

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const [lead, seguimientos] = await Promise.all([
    getLeadById(id),
    getSeguimientos(id),
  ]);

  if (!lead) notFound();

  const estadoConfig = ESTADO_CONFIG[lead.estado];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/leads"
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm flex items-center gap-1"
        >
          ← Volver
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{lead.nombre}</h1>
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-full ${estadoConfig.color}`}
          >
            {estadoConfig.label}
          </span>
        </div>
        <p className="text-xs text-gray-400">
          Creado{" "}
          {new Date(lead.created_at).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Layout 2 columnas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna izquierda — Info del lead */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
            Información del lead
          </h2>
          <LeadInfo lead={lead} />
        </div>

        {/* Columna derecha — Seguimientos */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Añadir seguimiento
            </h2>
            <SeguimientoForm leadId={lead.id} />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Historial ({seguimientos.length})
            </h2>
            <SeguimientoList seguimientos={seguimientos} />
          </div>
        </div>
      </div>
    </div>
  );
}

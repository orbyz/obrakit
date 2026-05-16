import { notFound } from "next/navigation";
import Link from "next/link";
import { getLeadById } from "@/app/actions/leads";
import { getSeguimientos } from "@/app/actions/seguimientos";
import { getGastosByLead } from "@/app/actions/gastos";
import LeadDetailClient from "@/components/leads/LeadDetailClient";

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
  const [lead, seguimientos, gastos] = await Promise.all([
    getLeadById(id),
    getSeguimientos(id),
    getGastosByLead(id),
  ]);

  if (!lead) notFound();

  const estadoConfig = ESTADO_CONFIG[lead.estado];
  const totalGastos = gastos.reduce((acc, g) => acc + Number(g.importe), 0);

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

      {/* Stats rápidas */}
      {totalGastos > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-700">
              🧱 Total gastado en materiales
            </span>
            <span className="text-lg font-bold text-orange-900">
              {totalGastos.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
              })}{" "}
              €
            </span>
          </div>
        </div>
      )}

      <LeadDetailClient
        lead={lead}
        seguimientos={seguimientos}
        gastos={gastos}
      />
    </div>
  );
}

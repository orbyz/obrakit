"use client";

import { updateLeadEstadoAction } from "@/app/actions/leads";
import type { EstadoLead, Lead } from "@/types";
import Link from "next/link";
import TiempoAlerta from "./TiempoAlerta";

const ESTADOS: { value: EstadoLead; label: string }[] = [
  { value: "nuevo", label: "📥 Nuevo" },
  { value: "en_curso", label: "⚙️ En Curso" },
  { value: "cerrado", label: "✅ Cerrado" },
];

const TIPO_OBRA_LABEL: Record<string, string> = {
  bano: "🚿 Baño",
  cocina: "🍳 Cocina",
  pintura: "🎨 Pintura",
  integral: "🏗️ Integral",
  otro: "🔧 Otro",
};

const ORIGEN_LABEL: Record<string, string> = {
  whatsapp: "💬 WhatsApp",
  instagram: "📸 Instagram",
  recomendacion: "👥 Recomendación",
  web: "🌐 Web",
  otro: "📌 Otro",
};

interface LeadCardProps {
  lead: Lead;
}

export default function LeadCard({ lead }: LeadCardProps) {
  async function handleEstadoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    await updateLeadEstadoAction(lead.id, e.target.value as EstadoLead);
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Nombre */}
      <Link href={`/leads/${lead.id}`}>
        <p className="font-medium text-gray-900 text-sm mb-2 truncate hover:text-orange-500 transition-colors cursor-pointer">
          {lead.nombre}
        </p>
      </Link>

      {/* Badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {lead.tipo_obra && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {TIPO_OBRA_LABEL[lead.tipo_obra]}
          </span>
        )}
        {lead.origen && (
          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
            {ORIGEN_LABEL[lead.origen]}
          </span>
        )}
      </div>

      {/* Zona y teléfono */}
      {lead.zona && (
        <p className="text-xs text-gray-500 mb-1">📍 {lead.zona}</p>
      )}
      {lead.telefono && (
        <p className="text-xs text-gray-500 mb-2">📱 {lead.telefono}</p>
      )}

      {/* Importe */}
      {lead.importe_ofertado && (
        <p className="text-xs font-medium text-gray-700 mb-2">
          💰 {lead.importe_ofertado.toLocaleString("es-ES")} €
        </p>
      )}

      {/* Alerta de tiempo */}
      {lead.fecha_fin_estimada &&
        lead.estado !== "cerrado" &&
        lead.dias_estimados && (
          <TiempoAlerta
            leadId={lead.id}
            fechaFinEstimada={lead.fecha_fin_estimada}
            diasEstimados={lead.dias_estimados}
          />
        )}

      {/* Cambiar estado */}
      <select
        defaultValue={lead.estado}
        onChange={handleEstadoChange}
        className="w-full text-xs border border-gray-200 rounded px-2 py-1 text-gray-600 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-orange-500 mt-1"
      >
        {ESTADOS.map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>
    </div>
  );
}

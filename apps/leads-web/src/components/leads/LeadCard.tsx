"use client";

import { updateLeadEstadoAction } from "@/app/actions/leads";
import type { EstadoLead, Lead } from "@/types";
import Link from "next/link";
import TiempoAlerta from "./TiempoAlerta";
import { MapPin, Phone, Euro } from "lucide-react";

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
    <div
      className="
      bg-surface
      border
      border-border
      rounded-2xl
      p-4
      shadow-card
      hover:shadow-elevated
      transition-all
    "
    >
      {/* Nombre */}
      <Link href={`/leads/${lead.id}`}>
        <h3 className="text-base font-semibold text-text mb-3 truncate hover:text-orange-500 transition-colors cursor-pointer">
          {lead.nombre}
        </h3>
      </Link>

      {/* Importe */}
      {lead.importe_ofertado && (
        <div className="flex items-center gap-2 text-sm font-semibold text-primary mb-3">
          <Euro size={14} />
          {lead.importe_ofertado?.toLocaleString("es-ES")} €
        </div>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-1 mb-2">
        {lead.tipo_obra && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {TIPO_OBRA_LABEL[lead.tipo_obra]}
          </span>
        )}
        {lead.origen && (
          <span className="text-xs bg-accent/10 text-primary px-2 py-0.5 rounded-full">
            {ORIGEN_LABEL[lead.origen]}
          </span>
        )}
      </div>

      {/* Zona y teléfono */}
      {lead.zona && (
        <div className="flex items-center gap-2 text-sm text-muted mb-1">
          <MapPin size={14} />
          {lead.zona}
        </div>
      )}
      {lead.telefono && (
        <div className="flex items-center gap-2 text-sm text-muted mb-2">
          <Phone size={14} />
          {lead.telefono}
        </div>
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
        className="
        w-full
        rounded-xl
        border
        border-border
        bg-surface
        px-3
        py-2
        text-sm
        text-text
        focus:outline-none
        focus:ring-2
        focus:ring-primary/20
        "
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

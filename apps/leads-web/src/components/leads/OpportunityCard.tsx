"use client";

import Link from "next/link";

import type { CRMOpportunity } from "@/app/actions/leads";

interface OpportunityCardProps {
  opportunity: CRMOpportunity;
}

const TIPO_OBRA_LABEL: Record<string, string> = {
  bano: "Baño",
  cocina: "Cocina",
  pintura: "Pintura",
  integral: "Integral",
  otro: "Otro",
};

const ORIGEN_LABEL: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  recomendacion: "Recomendación",
  web: "Web",
  otro: "Otro",
};

function formatCurrency(value: number | null) {
  if (value === null) {
    return "Sin presupuesto";
  }

  return `${value.toLocaleString("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} €`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
  });
}

export default function OpportunityCard({
  opportunity: lead,
}: OpportunityCardProps) {
  return (
    <Link
      href={`/leads/${lead.id}`}
      className="block rounded-xl border border-border bg-surface p-4 transition hover:border-primary/40 hover:shadow-card"
    >
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-text">
            {lead.nombre}
          </h3>

          <p className="text-sm text-muted-foreground">
            {lead.tipo_obra
              ? TIPO_OBRA_LABEL[lead.tipo_obra] ?? lead.tipo_obra
              : "Tipo de obra pendiente"}
          </p>
        </div>

        <div>
          <p className="text-lg font-bold text-text">
            {formatCurrency(
              lead.estado === "cerrado"
                ? lead.importe_cerrado
                : lead.importe_ofertado,
            )}
          </p>

          <p className="text-xs text-muted-foreground">
            {lead.estado === "cerrado"
              ? "Presupuesto cerrado"
              : "Presupuesto ofertado"}
          </p>
        </div>

        {lead.estado === "cerrado" && (
          <p className="text-xs text-muted-foreground">
            {lead.project
              ? "Obra generada"
              : "Pendiente de generar obra"}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>
            {lead.origen
              ? ORIGEN_LABEL[lead.origen] ?? lead.origen
              : "Origen pendiente"}
          </span>

          <span>{formatDate(lead.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}

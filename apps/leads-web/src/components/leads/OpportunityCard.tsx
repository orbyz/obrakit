"use client";

import Link from "next/link";
import {
  CalendarDays,
  CircleDollarSign,
  MessageCircle,
  Globe,
  Users,
  MapPin,
  Wrench,
} from "lucide-react";

import type { CRMOpportunity } from "@/app/actions/leads";
import { Badge } from "@/components/ui/badge";

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

const ORIGEN_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
  }
> = {
  whatsapp: {
    label: "WhatsApp",
    icon: <MessageCircle size={14} />,
  },
  instagram: {
    label: "Instagram",
    icon: <Globe size={14} />,
  },
  recomendacion: {
    label: "Recomendación",
    icon: <Users size={14} />,
  },
  web: {
    label: "Web",
    icon: <Globe size={14} />,
  },
  otro: {
    label: "Otro",
    icon: <Wrench size={14} />,
  },
};

function formatCurrency(value: number | null) {
  if (value === null) {
    return "Sin presupuesto";
  }

  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
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
  const origin = lead.origen
    ? ORIGEN_CONFIG[lead.origen]
    : null;

  const projectType = lead.tipo_obra
    ? TIPO_OBRA_LABEL[lead.tipo_obra] ?? lead.tipo_obra
    : null;

  const amount =
    lead.estado === "cerrado"
      ? lead.importe_cerrado
      : lead.importe_ofertado;

  return (
    <Link
      href={`/leads/${lead.id}`}
      className="
        group block rounded-xl border border-border
        bg-surface p-4
        transition-all duration-200
        hover:-translate-y-0.5
        hover:border-primary/30
        hover:shadow-card
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-primary/30
      "
    >
      <div className="space-y-4">
        {/* Cliente */}
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-text group-hover:text-primary">
            {lead.nombre}
          </h3>

          <div className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
            <Wrench size={14} className="shrink-0" />

            <span className="truncate">
              {projectType ?? "Tipo de obra pendiente"}
            </span>
          </div>
        </div>

        {/* Presupuesto */}
        <div className="rounded-lg bg-background px-3 py-2.5">
          <div className="flex items-center gap-2">
            <CircleDollarSign
              size={16}
              className="shrink-0 text-primary"
            />

            <span className="truncate text-xs font-medium text-muted">
              {lead.estado === "cerrado"
                ? "Presupuesto cerrado"
                : "Presupuesto ofertado"}
            </span>
          </div>

          <p className="mt-1 whitespace-nowrap text-lg font-bold tracking-tight text-text">
            {formatCurrency(amount)}
          </p>
        </div>

        {/* Conversión */}
        {lead.estado === "cerrado" && (
          <Badge
            variant={lead.project ? "success" : "warning"}
            size="sm"
          >
            {lead.project
              ? "Obra generada"
              : "Pendiente de generar obra"}
          </Badge>
        )}

        {/* Metadata */}
        <div className="flex items-center justify-between gap-3 border-t border-border pt-3 text-xs text-muted">
          <span className="flex min-w-0 items-center gap-1.5">
            {origin?.icon ?? <MapPin size={14} />}

            <span className="truncate">
              {origin?.label ?? "Origen pendiente"}
            </span>
          </span>

          <span className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
            <CalendarDays size={14} />
            {formatDate(lead.created_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}

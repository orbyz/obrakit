"use client";

import type { Seguimiento } from "@/types";

import { Badge } from "@/components/ui/badge/Badge";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";

import {
  CalendarDays,
  Phone,
  MessageCircle,
  House,
  FileText,
  NotebookPen,
} from "lucide-react";

const TIPO_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ReactNode;
    variant:
      | "primary"
      | "secondary"
      | "success"
      | "warning"
      | "danger"
      | "neutral";
  }
> = {
  llamada: {
    label: "Llamada",
    icon: <Phone size={14} />,
    variant: "primary",
  },

  whatsapp: {
    label: "WhatsApp",
    icon: <MessageCircle size={14} />,
    variant: "success",
  },

  visita: {
    label: "Visita",
    icon: <House size={14} />,
    variant: "secondary",
  },

  presupuesto: {
    label: "Presupuesto",
    icon: <FileText size={14} />,
    variant: "warning",
  },

  nota: {
    label: "Nota",
    icon: <NotebookPen size={14} />,
    variant: "neutral",
  },
};

function formatFecha(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface SeguimientoListProps {
  seguimientos: Seguimiento[];
}

export default function SeguimientoList({
  seguimientos,
}: SeguimientoListProps) {
  if (seguimientos.length === 0) {
    return (
      <EmptyState
        title="Sin seguimientos"
        description="Añade el primer seguimiento para comenzar el historial."
      />
    );
  }

  return (
    <div className="divide-y divide-border overflow-hidden rounded-xl border border-border">
      {seguimientos.map((seguimiento) => {
        const tipo = TIPO_CONFIG[seguimiento.tipo ?? "nota"];

        return (
          <div
            key={seguimiento.id}
            className="p-4 transition-colors hover:bg-background/60"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <Badge
                  variant={tipo.variant}
                  className="inline-flex items-center gap-1"
                >
                  {tipo.icon}
                  {tipo.label}
                </Badge>

                <p className="mt-3 text-sm leading-relaxed text-text">
                  {seguimiento.descripcion}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 text-xs text-muted">
                <CalendarDays size={14} />
                <span>{formatFecha(seguimiento.created_at)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import type { Seguimiento } from "@/types";

import { Card } from "@/components/ui/card/Card";
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
      | "neutral"
      | "outline";
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
    <div className="space-y-4">
      {seguimientos.map((seguimiento) => {
        const tipo = TIPO_CONFIG[seguimiento.tipo ?? "nota"];

        return (
          <Card key={seguimiento.id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="mb-3 flex items-center gap-3">
                  <Badge variant="neutral" className="flex items-center gap-1">
                    {tipo.icon}
                    {tipo.label}
                  </Badge>
                </div>

                <p className="text-sm leading-relaxed text-text">
                  {seguimiento.descripcion}
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted shrink-0">
                <CalendarDays size={14} />
                {formatFecha(seguimiento.created_at)}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

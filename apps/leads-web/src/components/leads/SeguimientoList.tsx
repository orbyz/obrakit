import type { Seguimiento } from "@/types";

const TIPO_CONFIG: Record<string, { icon: string; color: string }> = {
  llamada: { icon: "📞", color: "bg-blue-50 border-blue-200" },
  whatsapp: { icon: "💬", color: "bg-green-50 border-green-200" },
  visita: { icon: "🏠", color: "bg-purple-50 border-purple-200" },
  presupuesto: { icon: "📄", color: "bg-amber-50 border-amber-200" },
  nota: { icon: "📝", color: "bg-gray-50 border-gray-200" },
};

function formatFecha(dateStr: string): string {
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
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">
          Todavía no hay actividad registrada.
        </p>
        <p className="text-gray-300 text-xs mt-1">
          Añade el primer seguimiento para comenzar el historial.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {seguimientos.map((s) => {
        const config = TIPO_CONFIG[s.tipo ?? "nota"];
        return (
          <div
            key={s.id}
            className={`border border-border rounded-2xl p-3 ${config.color}`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-text">
                {config.icon} {s.tipo?.charAt(0).toUpperCase()}
                {s.tipo?.slice(1)}
              </span>
              <span className="text-xs text-muted">
                {formatFecha(s.created_at)}
              </span>
            </div>
            <p className="text-sm text-gray-600">{s.descripcion}</p>
          </div>
        );
      })}
    </div>
  );
}

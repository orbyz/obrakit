"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateLeadAction, type UpdateLeadState } from "@/app/actions/leads";
import type { Lead } from "@/types";
import { Button } from "@/components/ui/button/Button";

const initialState: UpdateLeadState = {
  error: null,
  success: false,
};

const inputClass = `
w-full
rounded-xl
border
border-border
bg-surface
px-3
py-2.5
text-sm
text-text
placeholder:text-muted
focus:outline-none
focus:ring-2
focus:ring-primary/20
`;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="secondary"
      disabled={pending}
      className="w-full"
    >
      {pending ? "Guardando..." : "Guardar cambios"}
    </Button>
  );
}

interface LeadInfoProps {
  lead: Lead;
}

export default function LeadInfo({ lead }: LeadInfoProps) {
  const updateAction = updateLeadAction.bind(null, lead.id);
  const [state, formAction] = useActionState(updateAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="p-3 border-danger/20 bg-danger/10 text-danger">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="p-3 border-success/20 bg-success/10 text-success">
          ✅ Cambios guardados
        </div>
      )}

      <h3 className="text-sm font-semibold text-text border-b border-border pb-2">
        Cliente
      </h3>

      {/* Nombre */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Nombre
        </label>
        <input
          name="nombre"
          defaultValue={lead.nombre}
          className={inputClass}
        />
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Teléfono
        </label>
        <input
          name="telefono"
          defaultValue={lead.telefono ?? ""}
          className={inputClass}
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          defaultValue={lead.email ?? ""}
          className={inputClass}
        />
      </div>

      <h3 className="pt-4 text-sm font-semibold text-text border-b border-border pb-2">
        Obra
      </h3>

      {/* Dirección */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Dirección
        </label>
        <input
          name="direccion"
          defaultValue={lead.direccion ?? ""}
          className={inputClass}
        />
      </div>

      {/* Zona */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Zona
        </label>
        <input
          name="zona"
          defaultValue={lead.zona ?? ""}
          className={inputClass}
        />
      </div>

      {/* Estado */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Estado
        </label>
        <select name="estado" defaultValue={lead.estado} className={inputClass}>
          <option value="nuevo">Nuevo</option>
          <option value="en_curso">En curso</option>
          <option value="cerrado">Finalizado</option>
        </select>
      </div>

      {/* Tipo de obra */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Tipo de obra
        </label>
        <select
          name="tipo_obra"
          defaultValue={lead.tipo_obra ?? ""}
          className={inputClass}
        >
          <option value="bano">Baño</option>
          <option value="cocina">Cocina</option>
          <option value="pintura">Pintura</option>
          <option value="integral">Integral</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* Origen */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Origen
        </label>
        <select
          name="origen"
          defaultValue={lead.origen ?? ""}
          className={inputClass}
        >
          <option value="whatsapp">WhatsApp</option>
          <option value="instagram">Instagram</option>
          <option value="recomendacion">Recomendación</option>
          <option value="web">Web</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      <h3 className="pt-4 text-sm font-semibold text-text border-b border-border pb-2">
        Planificación
      </h3>

      {/* Fecha de inicio */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Fecha de inicio
        </label>
        <input
          name="fecha_inicio"
          type="date"
          defaultValue={lead.fecha_inicio ?? ""}
          className={inputClass}
        />
      </div>

      {/* Días estimados */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Días estimados de obra
        </label>
        <input
          name="dias_estimados"
          type="number"
          min="1"
          defaultValue={lead.dias_estimados ?? ""}
          placeholder="15"
          className={inputClass}
        />
        {lead.fecha_fin_estimada && (
          <p className="text-xs text-gray-500 mt-1">
            Finalización estimada:{" "}
            {new Date(lead.fecha_fin_estimada).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <h3 className="pt-4 text-sm font-semibold text-text border-b border-border pb-2">
        Finanzas
      </h3>

      {/* Importe ofertado */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Importe ofertado (€)
        </label>
        <input
          name="importe_ofertado"
          type="number"
          step="0.01"
          defaultValue={lead.importe_ofertado ?? ""}
          placeholder="0.00"
          className={inputClass}
        />
      </div>

      {/* Importe cerrado */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Importe cerrado (€)
        </label>
        <input
          name="importe_cerrado"
          type="number"
          step="0.01"
          defaultValue={lead.importe_cerrado ?? ""}
          placeholder="0.00"
          className={inputClass}
        />
      </div>

      {/* Motivo pérdida */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Motivo pérdida
        </label>
        <input
          name="motivo_perdida"
          defaultValue={lead.motivo_perdida ?? ""}
          placeholder="Precio, tardanza..."
          className={inputClass}
        />
      </div>

      <h3 className="pt-4 text-sm font-semibold text-text border-b border-border pb-2">
        Observaciones
      </h3>

      {/* Notas */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Notas
        </label>
        <textarea
          name="notas"
          defaultValue={lead.notas ?? ""}
          rows={3}
          placeholder="Notas generales de la obra..."
          className={inputClass}
        />
      </div>

      <SubmitButton />
    </form>
  );
}

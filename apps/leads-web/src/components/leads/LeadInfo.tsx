"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updateLeadAction, type UpdateLeadState } from "@/app/actions/leads";
import type { Lead } from "@/types";

const initialState: UpdateLeadState = {
  error: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
    >
      {pending ? "Guardando..." : "Guardar cambios"}
    </button>
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
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
          ✅ Cambios guardados
        </div>
      )}

      {/* Nombre */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Nombre
        </label>
        <input
          name="nombre"
          defaultValue={lead.nombre}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Estado */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Estado
        </label>
        <select
          name="estado"
          defaultValue={lead.estado}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="nuevo">📥 Nuevo</option>
          <option value="contactado">📞 Contactado</option>
          <option value="visita">🏠 Visita</option>
          <option value="presupuesto">📄 Presupuesto</option>
          <option value="cerrado">🤝 Cerrado</option>
          <option value="perdido">❌ Perdido</option>
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="bano">🚿 Baño</option>
          <option value="cocina">🍳 Cocina</option>
          <option value="pintura">🎨 Pintura</option>
          <option value="integral">🏗️ Integral</option>
          <option value="otro">🔧 Otro</option>
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="whatsapp">💬 WhatsApp</option>
          <option value="instagram">📸 Instagram</option>
          <option value="recomendacion">👥 Recomendación</option>
          <option value="web">🌐 Web</option>
          <option value="otro">📌 Otro</option>
        </select>
      </div>

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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Notas */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          Notas
        </label>
        <textarea
          name="notas"
          defaultValue={lead.notas ?? ""}
          rows={3}
          placeholder="Notas generales del lead..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

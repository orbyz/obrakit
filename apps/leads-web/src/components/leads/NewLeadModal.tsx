"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createLeadAction, type LeadActionState } from "@/app/actions/leads";

const initialState: LeadActionState = {
  error: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
    >
      {pending ? "Guardando..." : "Crear obra"}
    </button>
  );
}

interface NewLeadModalProps {
  onClose: () => void;
}

export default function NewLeadModal({ onClose }: NewLeadModalProps) {
  const [state, formAction] = useActionState(createLeadAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const direccionRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onClose();
    }
  }, [state.success, onClose]);

  function handleOpenMaps() {
    const direccion = direccionRef.current?.value;
    if (direccion) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;
      window.open(url, "_blank");
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Nueva obra</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} action={formAction} className="p-6 space-y-4">
          {state.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {state.error}
            </div>
          )}

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del cliente <span className="text-red-500">*</span>
            </label>
            <input
              name="nombre"
              type="text"
              placeholder="Carmen López"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono de contacto
            </label>
            <input
              name="telefono"
              type="tel"
              placeholder="600 000 000"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="cliente@email.com"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Dirección con botón Maps */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección de la obra
            </label>
            <div className="flex gap-2">
              <input
                ref={direccionRef}
                name="direccion"
                type="text"
                placeholder="Calle ejemplo 123, Valencia"
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleOpenMaps}
                className="px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-colors shrink-0"
                title="Abrir en Google Maps"
              >
                🗺️
              </button>
            </div>
          </div>

          {/* Zona */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zona / Municipio
            </label>
            <input
              name="zona"
              type="text"
              placeholder="Valencia, Bétera..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>

          {/* Tipo de obra (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de obra{" "}
              <span className="text-xs text-gray-400">(opcional)</span>
            </label>
            <select
              name="tipo_obra"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="">No especificado</option>
              <option value="bano">🚿 Baño</option>
              <option value="cocina">🍳 Cocina</option>
              <option value="pintura">🎨 Pintura</option>
              <option value="integral">🏗️ Integral</option>
              <option value="otro">🔧 Otro</option>
            </select>
          </div>

          {/* Origen (opcional, colapsable) */}
          <details className="border border-gray-200 rounded-lg">
            <summary className="px-3 py-2 text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50">
              📊 ¿Cómo llegó? (opcional, para análisis)
            </summary>
            <div className="p-3 pt-0">
              <select
                name="origen"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
              >
                <option value="">No especificado</option>
                <option value="whatsapp">💬 WhatsApp</option>
                <option value="instagram">📸 Instagram</option>
                <option value="recomendacion">👥 Recomendación</option>
                <option value="web">🌐 Web</option>
                <option value="otro">📌 Otro</option>
              </select>
            </div>
          </details>

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}

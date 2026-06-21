"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createLeadAction, type LeadActionState } from "@/app/actions/leads";
import { X, MapPinned } from "lucide-react";
import { Button } from "@/components/ui/button/Button";

const initialState: LeadActionState = {
  error: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="secondary"
      disabled={pending}
      className="w-full"
    >
      {pending ? "Guardando..." : "Crear obra"}
    </Button>
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
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/20 backdrop-blur-sm p-4">
      <div
        className="
        w-full
        max-w-lg
        max-h-[90vh]
        overflow-y-auto
        rounded-2xl
        border
        border-border
        bg-surface
        shadow-elevated
      "
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-border bg-surface px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-text">Crear nueva obra</h2>

            <p className="mt-1 text-sm text-muted">
              Registra un nuevo cliente o proyecto.
            </p>
          </div>

          <button
            onClick={onClose}
            className="
              rounded-xl
              p-2
              text-muted
              hover:bg-background
              hover:text-text
              transition-all
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form ref={formRef} action={formAction} className="space-y-5 p-6">
          {state.error && (
            <div
              className="
            rounded-xl
            border
            border-danger/20
            bg-danger/10
            p-3
            text-sm
            text-danger
            "
            >
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
              className={inputClass}
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
              className={inputClass}
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
              className={inputClass}
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
                className="
                  shrink-0
                  rounded-xl
                  bg-primary
                  px-3
                  text-white
                  hover:bg-primary-light
                  transition-all
                "
              >
                <MapPinned size={18} />
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
              className={inputClass}
            />
          </div>

          {/* Tipo de obra (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de obra{" "}
              <span className="text-xs text-gray-400">(opcional)</span>
            </label>
            <select name="tipo_obra" className={inputClass}>
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
              <select name="origen" className={inputClass}>
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

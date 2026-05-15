"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  createSeguimientoAction,
  type SeguimientoActionState,
} from "@/app/actions/seguimientos";

const initialState: SeguimientoActionState = {
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
      {pending ? "Guardando..." : "Añadir"}
    </button>
  );
}

interface SeguimientoFormProps {
  leadId: string;
}

export default function SeguimientoForm({ leadId }: SeguimientoFormProps) {
  const createAction = createSeguimientoAction.bind(null, leadId);
  const [state, formAction] = useActionState(createAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {state.error}
        </div>
      )}

      {/* Tipo */}
      <select
        name="tipo"
        required
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
      >
        <option value="">Tipo de contacto...</option>
        <option value="llamada">📞 Llamada</option>
        <option value="whatsapp">💬 WhatsApp</option>
        <option value="visita">🏠 Visita</option>
        <option value="presupuesto">📄 Presupuesto enviado</option>
        <option value="nota">📝 Nota</option>
      </select>

      {/* Descripción */}
      <textarea
        name="descripcion"
        required
        rows={3}
        placeholder="¿Qué pasó? Ej: Llamé y quedamos en visitar el martes..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
      />

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

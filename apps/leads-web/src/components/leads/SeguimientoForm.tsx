"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  createSeguimientoAction,
  type SeguimientoActionState,
} from "@/app/actions/seguimientos";
import { Button } from "@/components/ui/button/Button";

const initialState: SeguimientoActionState = {
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
    <Button type="submit" variant="secondary" disabled={pending}>
      {pending ? "Guardando..." : "Añadir seguimiento"}
    </Button>
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
        <div className="p-3 border-danger/20 bg-danger/10 text-danger">
          {state.error}
        </div>
      )}

      {/* Tipo */}
      <select name="tipo" required className={inputClass}>
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
        placeholder="Ej: Se realizó visita, presupuesto enviado por WhatsApp y pendiente de respuesta."
        className={`${inputClass} resize-none`}
      />

      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}

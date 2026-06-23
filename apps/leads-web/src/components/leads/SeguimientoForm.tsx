"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  createSeguimientoAction,
  type SeguimientoActionState,
} from "@/app/actions/seguimientos";
import { Button } from "@/components/ui/button/Button";
import { Select } from "@/components/ui/forms/Select";
import { Textarea } from "@/components/ui/forms/Textarea";
import { Alert } from "@/components/ui/forms/Alert";

const initialState: SeguimientoActionState = {
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
      {state.error && <Alert variant="error">{state.error}</Alert>}

      {/* Tipo */}
      <Select name="tipo" required>
        <option value="">Tipo de contacto...</option>
        <option value="llamada">📞 Llamada</option>
        <option value="whatsapp">💬 WhatsApp</option>
        <option value="visita">🏠 Visita</option>
        <option value="presupuesto">📄 Presupuesto enviado</option>
        <option value="nota">📝 Nota</option>
      </Select>

      {/* Descripción */}
      <Textarea
        name="descripcion"
        required
        rows={3}
        placeholder="Ej: Se realizó visita, presupuesto enviado por WhatsApp y pendiente de respuesta."
        className="resize-none"
      />

      <SubmitButton />
    </form>
  );
}

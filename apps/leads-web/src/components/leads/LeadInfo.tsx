"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { updateLeadAction, type UpdateLeadState } from "@/app/actions/leads";

import type { Lead } from "@/types";

import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Textarea } from "@/components/ui/forms/Textarea";
import { Select } from "@/components/ui/forms/Select";
import { FormSection } from "@/components/ui/forms/FormSection";
import { Alert } from "@/components/ui/forms/Alert";

const initialState: UpdateLeadState = {
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
    <form action={formAction} className="space-y-8">
      {state.error && <Alert variant="error">{state.error}</Alert>}

      {state.success && (
        <Alert variant="success">Cambios guardados correctamente</Alert>
      )}

      <FormSection title="Cliente">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Nombre
          </label>
          <Input name="nombre" defaultValue={lead.nombre} />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Teléfono
          </label>
          <Input name="telefono" defaultValue={lead.telefono ?? ""} />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Email
          </label>
          <Input name="email" type="email" defaultValue={lead.email ?? ""} />
        </div>
      </FormSection>

      <FormSection title="Obra">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Dirección
          </label>
          <Input name="direccion" defaultValue={lead.direccion ?? ""} />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Zona
          </label>
          <Input name="zona" defaultValue={lead.zona ?? ""} />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Estado
          </label>

          <Select name="estado" defaultValue={lead.estado}>
            <option value="nuevo">Nuevo</option>
            <option value="en_curso">En curso</option>
            <option value="cerrado">Finalizado</option>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Tipo de obra
          </label>

          <Select name="tipo_obra" defaultValue={lead.tipo_obra ?? ""}>
            <option value="bano">Baño</option>
            <option value="cocina">Cocina</option>
            <option value="pintura">Pintura</option>
            <option value="integral">Integral</option>
            <option value="otro">Otro</option>
          </Select>
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Origen
          </label>

          <Select name="origen" defaultValue={lead.origen ?? ""}>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="recomendacion">Recomendación</option>
            <option value="web">Web</option>
            <option value="otro">Otro</option>
          </Select>
        </div>
      </FormSection>

      <FormSection title="Planificación">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Fecha de inicio
          </label>

          <Input
            name="fecha_inicio"
            type="date"
            defaultValue={lead.fecha_inicio ?? ""}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Días estimados
          </label>

          <Input
            name="dias_estimados"
            type="number"
            min="1"
            defaultValue={lead.dias_estimados ?? ""}
          />

          {lead.fecha_fin_estimada && (
            <p className="mt-2 text-xs text-muted">
              Finalización estimada:{" "}
              {new Date(lead.fecha_fin_estimada).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      </FormSection>

      <FormSection title="Finanzas">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Importe ofertado (€)
          </label>

          <Input
            name="importe_ofertado"
            type="number"
            step="0.01"
            defaultValue={lead.importe_ofertado ?? ""}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Importe cerrado (€)
          </label>

          <Input
            name="importe_cerrado"
            type="number"
            step="0.01"
            defaultValue={lead.importe_cerrado ?? ""}
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Motivo pérdida
          </label>

          <Input
            name="motivo_perdida"
            defaultValue={lead.motivo_perdida ?? ""}
          />
        </div>
      </FormSection>

      <FormSection title="Observaciones">
        <div>
          <label className="block text-xs font-medium text-muted mb-1">
            Notas
          </label>

          <Textarea name="notas" rows={4} defaultValue={lead.notas ?? ""} />
        </div>
      </FormSection>

      <SubmitButton />
    </form>
  );
}

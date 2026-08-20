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

      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Fecha de inicio
        </label>

        <Input
          name="fecha_inicio"
          type="date"
          defaultValue={lead.fecha_inicio ?? ""}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-muted">
          Días estimados
        </label>

        <Input
          name="dias_estimados"
          type="number"
          min="1"
          step="1"
          defaultValue={lead.dias_estimados ?? ""}
        />
      </div>

      <FormSection title="Cliente">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Nombre
            </label>
            <Input name="nombre" defaultValue={lead.nombre} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Teléfono
            </label>
            <Input name="telefono" defaultValue={lead.telefono ?? ""} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Email
            </label>
            <Input name="email" type="email" defaultValue={lead.email ?? ""} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Zona
            </label>
            <Input name="zona" defaultValue={lead.zona ?? ""} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            Dirección
          </label>
          <Input name="direccion" defaultValue={lead.direccion ?? ""} />
        </div>
      </FormSection>

      <FormSection title="Oportunidad">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Estado
            </label>

            <Select name="estado" defaultValue={lead.estado}>
              <option value="nuevo">Nuevo</option>
              <option value="en_curso">En curso</option>
              <option value="cerrado">Cerrado</option>
            </Select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
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
            <label className="mb-1 block text-xs font-medium text-muted">
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

          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
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
            <label className="mb-1 block text-xs font-medium text-muted">
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
            <label className="mb-1 block text-xs font-medium text-muted">
              Motivo de pérdida
            </label>

            <Input
              name="motivo_perdida"
              defaultValue={lead.motivo_perdida ?? ""}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted">
            Notas
          </label>

          <Textarea name="notas" rows={4} defaultValue={lead.notas ?? ""} />
        </div>
      </FormSection>

      <SubmitButton />
    </form>
  );
}

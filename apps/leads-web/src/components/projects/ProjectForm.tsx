"use client";

import { useActionState, useEffect } from "react";

import {
  createProjectAction,
  type ProjectActionState,
} from "@/app/actions/projects";


import { Button } from "@/components/ui/button";
import {
  FormSection,
  Input,
  Label,
  Textarea,
} from "@/components/ui/forms";


interface ProjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const initialState: ProjectActionState = {
  success: false,
  message: "",
};

export function ProjectForm({
  onSuccess,
  onCancel,
}: ProjectFormProps) {
  const [state, formAction] = useActionState(
    createProjectAction,
    initialState,
  );
  useEffect(() => {
    if (state.success) {
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  return (
    <form className="space-y-10" action={formAction}>

      <FormSection title="Información general">
        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <Label htmlFor="name">Nombre de la obra *</Label>
            <Input
              id="name"
              name="name"
              required
            />
          </div>

          <div>
            <Label htmlFor="reference">Referencia</Label>
            <Input
              id="reference"
              name="reference"
            />
          </div>

          <div>
            <Label htmlFor="client_name">Cliente *</Label>
            <Input
              id="client_name"
              name="client_name"
              required
            />
          </div>

          <div>
            <Label htmlFor="client_phone">Teléfono</Label>
            <Input
              id="client_phone"
              name="client_phone"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="client_email">
              Correo electrónico
            </Label>

            <Input
              id="client_email"
              name="client_email"
              type="email"
            />
          </div>

        </div>
      </FormSection>

      <FormSection title="Ubicación">
        <div className="grid gap-4 md:grid-cols-2">

          <div className="md:col-span-2">
            <Label htmlFor="address">Dirección</Label>

            <Input
              id="address"
              name="address"
            />
          </div>

          <div>
            <Label htmlFor="city">Ciudad</Label>

            <Input
              id="city"
              name="city"
            />
          </div>

          <div>
            <Label htmlFor="postal_code">
              Código postal
            </Label>

            <Input
              id="postal_code"
              name="postal_code"
            />
          </div>

        </div>
      </FormSection>

      <FormSection title="Planificación">
        <div className="grid gap-4 md:grid-cols-2">

          <div>
            <Label htmlFor="planned_start_date">
              Inicio previsto
            </Label>

            <Input
              id="planned_start_date"
              name="planned_start_date"
              type="date"
            />
          </div>

          <div>
            <Label htmlFor="planned_end_date">
              Fin previsto
            </Label>

            <Input
              id="planned_end_date"
              name="planned_end_date"
              type="date"
            />
          </div>

          <div>
            <Label htmlFor="approved_budget">
              Presupuesto aprobado
            </Label>

            <Input
              id="approved_budget"
              name="approved_budget"
              type="number"
              min="0"
              step="0.01"
            />
          </div>

        </div>
      </FormSection>

      <FormSection title="Observaciones">

        <Label htmlFor="notes">
          Notas
        </Label>

        <Textarea
          id="notes"
          name="notes"
          rows={4}
        />

      </FormSection>

      <div className="flex justify-end gap-3">

        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancelar
        </Button>

        <Button type="submit">
          Crear obra
        </Button>

      </div>

    </form>
  );
}

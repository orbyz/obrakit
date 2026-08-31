"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  ChevronDown,
  MapPinned,
  X,
} from "lucide-react";

import {
  createLeadAction,
  type LeadActionState,
} from "@/app/actions/leads";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";

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
      {pending ? "Guardando..." : "Crear Oportunidad"}
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
    const direccion = direccionRef.current?.value.trim();

    if (direccion) {
      const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        direccion,
      )}`;

      window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    if (!navigator.geolocation) {
      window.open("https://www.google.com/maps", "_blank");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${coords.latitude},${coords.longitude}`;

        window.open(url, "_blank", "noopener,noreferrer");
      },
      () => {
        window.open("https://www.google.com/maps", "_blank");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div
        className="
          flex w-full max-w-lg flex-col
          max-h-[calc(100vh-2rem)]
          overflow-hidden
          rounded-2xl border border-border
          bg-surface shadow-elevated
        "
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-text sm:text-xl">
              Crear nueva oportunidad
            </h2>

            <p className="mt-1 text-sm text-muted">
              Registra un nuevo cliente o proyecto.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="
              shrink-0 rounded-lg p-2
              text-muted
              transition-colors
              hover:bg-background
              hover:text-text
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary/30
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          ref={formRef}
          action={formAction}
          className="overflow-y-auto p-5 sm:p-6"
        >
          <div className="space-y-5">
            {state.error && (
              <Alert variant="error">
                {state.error}
              </Alert>
            )}

            {/* Nombre */}
            <div className="space-y-1.5">
              <Label
                htmlFor="lead-nombre"
                className="text-sm font-medium text-text"
              >
                Nombre del cliente
                <span className="ml-1 text-danger">*</span>
              </Label>

              <Input
                id="lead-nombre"
                name="nombre"
                type="text"
                placeholder="Carmen López"
                required
              />
            </div>

            {/* Teléfono */}
            <div className="space-y-1.5">
              <Label
                htmlFor="lead-telefono"
                className="text-sm font-medium text-text"
              >
                Teléfono de contacto
              </Label>

              <Input
                id="lead-telefono"
                name="telefono"
                type="tel"
                placeholder="600 000 000"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="lead-email"
                className="text-sm font-medium text-text"
              >
                Email
              </Label>

              <Input
                id="lead-email"
                name="email"
                type="email"
                placeholder="cliente@email.com"
              />
            </div>

            {/* Dirección */}
            <div className="space-y-1.5">
              <Label
                htmlFor="lead-direccion"
                className="text-sm font-medium text-text"
              >
                Dirección de la obra
              </Label>

              <div className="flex gap-2">
                <Input
                  id="lead-direccion"
                  ref={direccionRef}
                  name="direccion"
                  type="text"
                  placeholder="Calle ejemplo 123, Valencia"
                  className="min-w-0 flex-1"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={handleOpenMaps}
                  aria-label="Abrir ubicación en Google Maps"
                  title="Abrir dirección o ubicación actual en Google Maps"
                  className="shrink-0 px-3"
                >
                  <MapPinned size={18} />
                </Button>
              </div>
            </div>

            {/* Zona */}
            <div className="space-y-1.5">
              <Label
                htmlFor="lead-zona"
                className="text-sm font-medium text-text"
              >
                Zona / Municipio
              </Label>

              <Input
                id="lead-zona"
                name="zona"
                type="text"
                placeholder="Valencia, Bétera..."
              />
            </div>

            {/* Fecha + días */}
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label
                  htmlFor="lead-fecha-inicio"
                  className="text-sm font-medium text-text"
                >
                  Fecha de inicio
                </Label>

                <Input
                  id="lead-fecha-inicio"
                  name="fecha_inicio"
                  type="date"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="lead-dias-estimados"
                  className="text-sm font-medium text-text"
                >
                  Días estimados
                </Label>

                <Input
                  id="lead-dias-estimados"
                  name="dias_estimados"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ej. 30"
                />
              </div>
            </div>

            {/* Tipo de obra */}
            <div className="space-y-1.5">
              <Label
                htmlFor="lead-tipo-obra"
                className="text-sm font-medium text-text"
              >
                Tipo de obra
                <span className="ml-1 text-xs font-normal text-muted">
                  (opcional)
                </span>
              </Label>

              <div className="relative">
                <select
                  id="lead-tipo-obra"
                  name="tipo_obra"
                  className="
                    h-11 w-full appearance-none
                    rounded-xl border border-border
                    bg-surface px-3 pr-10
                    text-sm text-text
                    transition-colors
                    focus:border-primary
                    focus:outline-none
                    focus:ring-2 focus:ring-primary/20
                  "
                >
                  <option value="">No especificado</option>
                  <option value="bano">Baño</option>
                  <option value="cocina">Cocina</option>
                  <option value="pintura">Pintura</option>
                  <option value="integral">Integral</option>
                  <option value="otro">Otro</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                />
              </div>
            </div>

            {/* Origen */}
            <details className="group rounded-xl border border-border bg-background/40">
              <summary
                className="
                  flex cursor-pointer list-none
                  items-center justify-between
                  px-4 py-3
                  text-sm font-medium text-text
                  transition-colors
                  hover:bg-background
                  [&::-webkit-details-marker]:hidden
                "
              >
                <span>
                  ¿Cómo llegó?
                  <span className="ml-1 text-xs font-normal text-muted">
                    (opcional)
                  </span>
                </span>

                <ChevronDown
                  size={16}
                  className="text-muted transition-transform group-open:rotate-180"
                />
              </summary>

              <div className="border-t border-border p-4">
                <div className="relative">
                  <select
                    name="origen"
                    className="
                      h-11 w-full appearance-none
                      rounded-xl border border-border
                      bg-surface px-3 pr-10
                      text-sm text-text
                      transition-colors
                      focus:border-primary
                      focus:outline-none
                      focus:ring-2 focus:ring-primary/20
                    "
                  >
                    <option value="">No especificado</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                    <option value="recomendacion">
                      Recomendación
                    </option>
                    <option value="web">Web</option>
                    <option value="otro">Otro</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
                  />
                </div>
              </div>
            </details>

            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}

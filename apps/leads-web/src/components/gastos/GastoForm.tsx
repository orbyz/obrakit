"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

import {
  createGastoAction,
  updateGastoAction,
  type GastoActionState,
} from "@/app/actions/gastos";

import type { Gasto } from "@/types";

import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Select } from "@/components/ui/forms/Select";
import { Textarea } from "@/components/ui/forms/Textarea";
import { toast } from "@/components/ui/toast/toast";

import { ChevronDown, ChevronUp } from "lucide-react";

const initialState: GastoActionState = {
  error: null,
  success: false,
};

interface GastoFormProps {
  projects?: { id: string; name: string }[];
  projectIdFijo?: string;
  gasto?: Gasto;
  onSuccess?: () => void;
}

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full"
    >
      {pending
        ? editing
          ? "Guardando..."
          : "Registrando..."
        : editing
          ? "Guardar cambios"
          : "Registrar gasto"}
    </Button>
  );
}

export default function GastoForm({
  projects = [],
  projectIdFijo,
  gasto,
  onSuccess,
}: GastoFormProps) {
  const editing = Boolean(gasto);

  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(
      gasto?.proveedor ||
        gasto?.cantidad ||
        gasto?.unidad ||
        gasto?.notas,
    ),
  );

  const [selectedProject, setSelectedProject] = useState(
    gasto?.project_id ?? "",
  );

  const [obraNombre, setObraNombre] = useState(
    gasto?.obra_nombre ?? "",
  );

  const action = gasto
    ? updateGastoAction.bind(null, gasto.id)
    : createGastoAction;

  const [state, formAction] = useActionState(
    action,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const lastNotifiedState = useRef<string | null>(null);

  useEffect(() => {
    const notificationKey = `${state.success}:${state.error ?? ""}`;

    if (lastNotifiedState.current === notificationKey) {
      return;
    }

    if (state.success) {
      lastNotifiedState.current = notificationKey;

      toast.success(
        editing
          ? "Gasto actualizado correctamente."
          : "Gasto registrado correctamente.",
      );

      formRef.current?.reset();
      onSuccess?.();

      return;
    }

    if (state.error) {
      lastNotifiedState.current = notificationKey;

      toast.error(state.error);
    }
  }, [
    editing,
    onSuccess,
    state.error,
    state.success,
  ]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-6"
    >

      {/* Información principal */}
      <div className="space-y-5">
        <div>
          <label
            htmlFor="material"
            className="mb-1.5 block text-sm font-medium"
          >
            ¿Qué has gastado?
          </label>

          <Input
            id="material"
            name="material"
            type="text"
            placeholder="Ej. Café para el equipo"
            defaultValue={gasto?.material ?? ""}
            required
            autoFocus
          />
        </div>

        <div>
          <label
            htmlFor="categoria"
            className="mb-1.5 block text-sm font-medium"
          >
            Categoría
          </label>

          <Select
            id="categoria"
            name="categoria"
            defaultValue={gasto?.categoria ?? ""}
            required
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>

            <option value="combustible">
              ⛽ Combustible
            </option>
            <option value="transporte">
              🚚 Transporte
            </option>
            <option value="dietas">
              🍽 Dietas
            </option>
            <option value="contenedores">
              🗑 Contenedores
            </option>
            <option value="herramientas">
              🔧 Herramientas
            </option>
            <option value="alquiler">
              🏗 Alquiler
            </option>
            <option value="peajes">
              🛣 Peajes
            </option>
            <option value="otros">
              📦 Otros
            </option>
          </Select>
        </div>

        <div>
          <label
            htmlFor="importe"
            className="mb-1.5 block text-sm font-medium"
          >
            Importe
          </label>

          <div className="relative">
            <Input
              id="importe"
              name="importe"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              defaultValue={gasto?.importe ?? ""}
              required
              className="pr-10 text-lg font-medium"
            />

            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">
              €
            </span>
          </div>
        </div>

        <div>
          <label
            htmlFor="fecha"
            className="mb-1.5 block text-sm font-medium"
          >
            Fecha
          </label>

          <Input
            id="fecha"
            name="fecha"
            type="date"
            defaultValue={gasto?.fecha ?? today}
          />
        </div>
      </div>

      {/* Obra */}
      {projectIdFijo ? (
        <input
          type="hidden"
          name="project_id"
          value={projectIdFijo}
        />
      ) : (
        <div className="rounded-xl border border-border bg-background p-4">
          <label
            htmlFor="project_id"
            className="mb-1.5 block text-sm font-medium"
          >
            Obra
          </label>

          {projects.length > 0 ? (
            <>
              <Select
                id="project_id"
                name="project_id"
                value={selectedProject}
                onChange={(event) => {
                  setSelectedProject(event.target.value);

                  if (event.target.value) {
                    setObraNombre("");
                  }
                }}
              >
                <option value="">
                  Selecciona una obra...
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name}
                  </option>
                ))}
              </Select>

              <p className="py-2 text-center text-xs text-muted">
                — o —
              </p>

              <Input
                name="obra_nombre"
                placeholder="Escribe el nombre de la obra..."
                value={obraNombre}
                disabled={Boolean(selectedProject)}
                onChange={(event) => {
                  setObraNombre(event.target.value);

                  if (event.target.value) {
                    setSelectedProject("");
                  }
                }}
              />
            </>
          ) : (
            <Input
              id="obra_nombre"
              name="obra_nombre"
              placeholder="Escribe el nombre de la obra..."
              defaultValue={gasto?.obra_nombre ?? ""}
            />
          )}
        </div>
      )}

      {/* Información avanzada */}
      <div className="border-t border-border pt-4">
        <button
          type="button"
          onClick={() =>
            setShowAdvanced((current) => !current)
          }
          className="flex w-full items-center justify-between text-sm font-medium"
        >
          <span>Más información</span>

          {showAdvanced ? (
            <ChevronUp size={18} />
          ) : (
            <ChevronDown size={18} />
          )}
        </button>

        {showAdvanced && (
          <div className="mt-4 space-y-5 rounded-xl border border-border bg-background p-4">
            <div>
              <label
                htmlFor="proveedor"
                className="mb-1.5 block text-sm font-medium"
              >
                Proveedor
              </label>

              <Input
                id="proveedor"
                name="proveedor"
                type="text"
                placeholder="Opcional"
                defaultValue={gasto?.proveedor ?? ""}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="cantidad"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Cantidad
                </label>

                <Input
                  id="cantidad"
                  name="cantidad"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Opcional"
                  defaultValue={gasto?.cantidad ?? ""}
                />
              </div>

              <div>
                <label
                  htmlFor="unidad"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Unidad
                </label>

                <Select
                  id="unidad"
                  name="unidad"
                  defaultValue={gasto?.unidad ?? ""}
                >
                  <option value="">
                    Sin unidad
                  </option>

                  <option value="m2">m²</option>
                  <option value="ml">ml</option>
                  <option value="kg">kg</option>
                  <option value="ud">ud</option>
                  <option value="sacos">sacos</option>
                  <option value="litros">litros</option>
                  <option value="otro">otro</option>
                </Select>
              </div>
            </div>

            <div>
              <label
                htmlFor="notas"
                className="mb-1.5 block text-sm font-medium"
              >
                Notas
              </label>

              <Textarea
                id="notas"
                name="notas"
                placeholder="Información adicional..."
                defaultValue={gasto?.notas ?? ""}
              />
            </div>
          </div>
        )}
      </div>

      <SubmitButton editing={editing} />
    </form>
  );
}

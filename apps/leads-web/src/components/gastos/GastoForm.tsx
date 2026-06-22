"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createGastoAction, type GastoActionState } from "@/app/actions/gastos";
import { Button } from "@/components/ui/button/Button";

const initialState: GastoActionState = {
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
    <Button
      type="submit"
      variant="secondary"
      disabled={pending}
      className="w-full"
    >
      {pending ? "Guardando..." : "Guardar gasto"}
    </Button>
  );
}

interface GastoFormProps {
  leads?: { id: string; nombre: string }[];
  leadIdFijo?: string;
  onSuccess?: () => void;
}

export default function GastoForm({
  leads = [],
  leadIdFijo,
  onSuccess,
}: GastoFormProps) {
  const [state, formAction] = useActionState(createGastoAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.error && (
        <div className="p-3 border-danger/20 bg-danger/10 text-danger">
          {state.error}
        </div>
      )}
      {state.success && (
        <div className="p-3 border-success/20 bg-success/10 text-success">
          ✅ Gasto guardado
        </div>
      )}

      {/* Material */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Material <span className="text-red-500">*</span>
        </label>
        <input
          name="material"
          type="text"
          placeholder="Azulejos baño, cemento cola..."
          required
          className={inputClass}
        />
      </div>

      {/* Importe */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Importe (€) <span className="text-red-500">*</span>
        </label>
        <input
          name="importe"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Proveedor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Proveedor
        </label>
        <input
          name="proveedor"
          type="text"
          placeholder="Leroy Merlin, Ferretería X..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Categoría */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Categoría <span className="text-red-500">*</span>
        </label>
        <select
          name="categoria"
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value="">Selecciona...</option>
          <option value="ceramica">🪵 Cerámica</option>
          <option value="fontaneria">🚿 Fontanería</option>
          <option value="electricidad">⚡ Electricidad</option>
          <option value="pintura">🎨 Pintura</option>
          <option value="herramientas">🔧 Herramientas</option>
          <option value="otro">📦 Otro</option>
        </select>
      </div>

      {/* Cantidad y Unidad */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad
          </label>
          <input
            name="cantidad"
            type="number"
            step="0.01"
            min="0"
            placeholder="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unidad
          </label>
          <select
            name="unidad"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            <option value="">—</option>
            <option value="ud">ud</option>
            <option value="m2">m²</option>
            <option value="ml">ml</option>
            <option value="kg">kg</option>
            <option value="sacos">sacos</option>
            <option value="litros">litros</option>
            <option value="otro">otro</option>
          </select>
        </div>
      </div>

      {/* Obra — lead o nombre libre */}
      {leadIdFijo ? (
        <input type="hidden" name="lead_id" value={leadIdFijo} />
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Obra
          </label>
          {leads.length > 0 ? (
            <>
              <select
                id="lead_select"
                name="lead_id"
                onChange={(e) => {
                  const input = document.getElementById(
                    "obra_nombre_input",
                  ) as HTMLInputElement;
                  if (e.target.value && input) {
                    input.value = "";
                    input.disabled = true;
                  } else if (input) {
                    input.disabled = false;
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="">Selecciona un lead...</option>
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 my-2 text-center">— o —</p>
              <input
                id="obra_nombre_input"
                name="obra_nombre"
                type="text"
                placeholder="Escribe el nombre de la obra..."
                onChange={(e) => {
                  const select = document.getElementById(
                    "lead_select",
                  ) as HTMLSelectElement;
                  if (e.target.value && select) {
                    select.value = "";
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </>
          ) : (
            <input
              name="obra_nombre"
              type="text"
              placeholder="Escribe el nombre de la obra..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}
        </div>
      )}

      {/* Fecha */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fecha
        </label>
        <input
          name="fecha"
          type="date"
          defaultValue={today}
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notas
        </label>
        <textarea
          name="notas"
          rows={2}
          placeholder="Ticket nº 1234, compra urgente..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
        />
      </div>

      <SubmitButton />
    </form>
  );
}

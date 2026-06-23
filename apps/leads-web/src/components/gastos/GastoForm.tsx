"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { createGastoAction, type GastoActionState } from "@/app/actions/gastos";
import { Button } from "@/components/ui/button/Button";
import { Input } from "@/components/ui/forms/Input";
import { Select } from "@/components/ui/forms/Select";
import { Textarea } from "@/components/ui/forms/Textarea";
import { Alert } from "@/components/ui/forms/Alert";
import { FormSection } from "@/components/ui/forms/FormSection";

const initialState: GastoActionState = {
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
  const [selectedLead, setSelectedLead] = useState("");
  const [obraNombre, setObraNombre] = useState("");

  const [state, formAction] = useActionState(createGastoAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();

      setSelectedLead("");
      setObraNombre("");

      onSuccess?.();
    }
  }, [state.success, onSuccess]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      {state.error && <Alert variant="error">{state.error}</Alert>}

      {state.success && (
        <Alert variant="success">Gasto guardado correctamente</Alert>
      )}

      <FormSection title="Material">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Material <span className="text-red-500">*</span>
          </label>

          <Input
            name="material"
            type="text"
            placeholder="Azulejos baño, cemento cola..."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoría <span className="text-red-500">*</span>
          </label>

          <Select name="categoria" required>
            <option value="">Selecciona...</option>
            <option value="ceramica">🪵 Cerámica</option>
            <option value="fontaneria">🚿 Fontanería</option>
            <option value="electricidad">⚡ Electricidad</option>
            <option value="pintura">🎨 Pintura</option>
            <option value="herramientas">🔧 Herramientas</option>
            <option value="otro">📦 Otro</option>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Proveedor
          </label>

          <Input
            name="proveedor"
            type="text"
            placeholder="Leroy Merlin, Ferretería X..."
          />
        </div>
      </FormSection>

      <FormSection title="Compra">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Importe (€) <span className="text-red-500">*</span>
            </label>

            <Input
              name="importe"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>

            <Input
              name="cantidad"
              type="number"
              step="0.01"
              min="0"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad
            </label>

            <Select name="unidad">
              <option value="">—</option>
              <option value="ud">ud</option>
              <option value="m2">m²</option>
              <option value="ml">ml</option>
              <option value="kg">kg</option>
              <option value="sacos">sacos</option>
              <option value="litros">litros</option>
              <option value="otro">otro</option>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>

            <Input name="fecha" type="date" defaultValue={today} />
          </div>
        </div>
      </FormSection>

      <FormSection title="Obra">
        {leadIdFijo ? (
          <Input type="hidden" name="lead_id" value={leadIdFijo} />
        ) : (
          <>
            {leads.length > 0 ? (
              <>
                <Select
                  name="lead_id"
                  value={selectedLead}
                  onChange={(e) => {
                    setSelectedLead(e.target.value);

                    if (e.target.value) {
                      setObraNombre("");
                    }
                  }}
                >
                  <option value="">Selecciona una obra...</option>

                  {leads.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nombre}
                    </option>
                  ))}
                </Select>

                <p className="text-xs text-center text-muted py-2">— o —</p>

                <Input
                  name="obra_nombre"
                  placeholder="Escribe el nombre de la obra..."
                  value={obraNombre}
                  disabled={!!selectedLead}
                  onChange={(e) => {
                    setObraNombre(e.target.value);

                    if (e.target.value) {
                      setSelectedLead("");
                    }
                  }}
                />
              </>
            ) : (
              <Input
                name="obra_nombre"
                placeholder="Escribe el nombre de la obra..."
              />
            )}
          </>
        )}
      </FormSection>

      <FormSection title="Observaciones">
        <Textarea
          name="notas"
          rows={3}
          placeholder="Ticket nº 1234, compra urgente..."
          className="resize-none"
        />
      </FormSection>

      <SubmitButton />
    </form>
  );
}

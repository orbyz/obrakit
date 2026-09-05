"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  updateTenantAction,
  type TenantActionState,
} from "@/app/actions/tenant";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast/toast";
import type { Tenant } from "@/types";

const initialState: TenantActionState = {
  error: null,
  success: false,
};

interface EmpresaFormProps {
  tenant: Tenant;
}

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({
  title,
  description,
  children,
}: SectionProps) {
  return (
    <section className="rounded-lg border border-border bg-surface p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text">{title}</h2>
        <p className="mt-1 text-sm text-muted">{description}</p>
      </div>

      {children}
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : "Guardar cambios"}
    </Button>
  );
}

function useTenantToast(state: TenantActionState) {
  const previousState = useRef(state);

  useEffect(() => {
    if (state === previousState.current) {
      return;
    }

    previousState.current = state;

    if (state.error) {
      toast.error(state.error);
      return;
    }

    if (state.success) {
      toast.success("Los cambios se han guardado correctamente.");
    }
  }, [state]);
}


const inputClassName =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClassName =
  "mb-2 block text-sm font-medium text-text";

export default function EmpresaForm({ tenant }: EmpresaFormProps) {
  const [businessState, businessAction] = useActionState(
    updateTenantAction,
    initialState,
  );

  const [fiscalState, fiscalAction] = useActionState(
    updateTenantAction,
    initialState,
  );

  const [contactState, contactAction] = useActionState(
    updateTenantAction,
    initialState,
  );

  useTenantToast(businessState);
  useTenantToast(fiscalState);
  useTenantToast(contactState);

  return (
    <div className="space-y-6">
      <Section
        title="Información del negocio"
        description="Define cómo se identifica tu negocio dentro de ObraKit."
      >
        <form action={businessAction} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="nombre_legal" className={labelClassName}>
                Nombre legal
              </label>

              <input
                id="nombre_legal"
                name="nombre_legal"
                type="text"
                defaultValue={tenant.nombre_legal ?? tenant.nombre}
                autoComplete="organization"
                maxLength={150}
                required
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="nombre_comercial" className={labelClassName}>
                Nombre comercial
              </label>

              <input
                id="nombre_comercial"
                name="nombre_comercial"
                type="text"
                defaultValue={tenant.nombre_comercial ?? ""}
                autoComplete="organization"
                maxLength={150}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label htmlFor="tipo_entidad" className={labelClassName}>
              Tipo de entidad
            </label>

            <select
              id="tipo_entidad"
              name="tipo_entidad"
              defaultValue={tenant.tipo_entidad ?? "autonomo"}
              className={inputClassName}
            >
              <option value="autonomo">Autónomo</option>
              <option value="empresa">Empresa</option>
            </select>
          </div>


          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </Section>

      <Section
        title="Datos fiscales"
        description="Información que podrá utilizar ObraKit en documentos y reportes."
      >
        <form action={fiscalAction} className="space-y-6">
          <div>
            <label htmlFor="nif" className={labelClassName}>
              NIF
            </label>

            <input
              id="nif"
              name="nif"
              type="text"
              defaultValue={tenant.nif ?? ""}
              autoComplete="off"
              maxLength={30}
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="direccion" className={labelClassName}>
              Dirección fiscal
            </label>

            <input
              id="direccion"
              name="direccion"
              type="text"
              defaultValue={tenant.direccion ?? ""}
              autoComplete="street-address"
              maxLength={200}
              className={inputClassName}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="codigo_postal" className={labelClassName}>
                Código postal
              </label>

              <input
                id="codigo_postal"
                name="codigo_postal"
                type="text"
                defaultValue={tenant.codigo_postal ?? ""}
                autoComplete="postal-code"
                maxLength={20}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="ciudad" className={labelClassName}>
                Ciudad
              </label>

              <input
                id="ciudad"
                name="ciudad"
                type="text"
                defaultValue={tenant.ciudad ?? ""}
                autoComplete="address-level2"
                maxLength={100}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="provincia" className={labelClassName}>
                Provincia
              </label>

              <input
                id="provincia"
                name="provincia"
                type="text"
                defaultValue={tenant.provincia ?? ""}
                autoComplete="address-level1"
                maxLength={100}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="pais" className={labelClassName}>
                País
              </label>

              <input
                id="pais"
                name="pais"
                type="text"
                defaultValue={tenant.pais ?? "España"}
                autoComplete="country-name"
                maxLength={100}
                className={inputClassName}
              />
            </div>
          </div>


          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </Section>

      <Section
        title="Datos de contacto"
        description="Información de contacto de tu negocio."
      >
        <form action={contactAction} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="telefono" className={labelClassName}>
                Teléfono
              </label>

              <input
                id="telefono"
                name="telefono"
                type="tel"
                defaultValue={tenant.telefono ?? ""}
                autoComplete="tel"
                maxLength={30}
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelClassName}>
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                defaultValue={tenant.email ?? ""}
                autoComplete="email"
                maxLength={150}
                className={inputClassName}
              />
            </div>
          </div>

          <div>
            <label htmlFor="website" className={labelClassName}>
              Sitio web
            </label>

            <input
              id="website"
              name="website"
              type="url"
              defaultValue={tenant.website ?? ""}
              autoComplete="url"
              placeholder="https://"
              maxLength={200}
              className={inputClassName}
            />
          </div>


          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </Section>
    </div>
  );
}

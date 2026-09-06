"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import {
  updateEmailAction,
  updatePasswordAction,
  updateProfileAction,
  type UserActionState,
} from "@/app/actions/user";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast/toast";
import type { Profile } from "@/types";

const initialState: UserActionState = {
  error: null,
  success: null,
};

interface UserFormProps {
  profile: Profile;
  email: string;
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

function SubmitButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : children}
    </Button>
  );
}

function useUserToast(state: UserActionState) {
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
      toast.success(state.success);
    }
  }, [state]);
}

const inputClassName =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

const labelClassName =
  "mb-2 block text-sm font-medium text-text";

export default function UserForm({
  profile,
  email,
}: UserFormProps) {
  const [profileState, profileAction] = useActionState(
    updateProfileAction,
    initialState,
  );

  const [emailState, emailAction] = useActionState(
    updateEmailAction,
    initialState,
  );

  const [passwordState, passwordAction] = useActionState(
    updatePasswordAction,
    initialState,
  );

  useUserToast(profileState);
  useUserToast(emailState);
  useUserToast(passwordState);

  return (
    <div className="space-y-6">
      <Section
        title="Información personal"
        description="Actualiza los datos personales asociados a tu cuenta."
      >
        <form action={profileAction} className="space-y-6">
          <div>
            <label htmlFor="full_name" className={labelClassName}>
              Nombre completo
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              defaultValue={profile.full_name ?? ""}
              autoComplete="name"
              maxLength={150}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="phone" className={labelClassName}>
              Teléfono móvil
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={profile.phone ?? ""}
              autoComplete="tel"
              maxLength={30}
              className={inputClassName}
            />
          </div>

          <div className="flex justify-end">
            <SubmitButton>Guardar cambios</SubmitButton>
          </div>
        </form>
      </Section>

      <Section
        title="Cuenta"
        description="Gestiona la dirección de email asociada a tu cuenta."
      >
        <form action={emailAction} className="space-y-6">
          <div>
            <label
              htmlFor="current_email"
              className={labelClassName}
            >
              Email actual
            </label>

            <input
              id="current_email"
              type="email"
              value={email}
              disabled
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClassName}>
              Nuevo email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              defaultValue={email}
              autoComplete="email"
              maxLength={254}
              required
              className={inputClassName}
            />
          </div>

          <div className="flex justify-end">
            <SubmitButton>Actualizar email</SubmitButton>
          </div>
        </form>
      </Section>

      <Section
        title="Seguridad"
        description="Cambia la contraseña utilizada para acceder a tu cuenta."
      >
        <form action={passwordAction} className="space-y-6">
          <div>
            <label htmlFor="password" className={labelClassName}>
              Nueva contraseña
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className={labelClassName}
            >
              Confirmar contraseña
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              className={inputClassName}
            />
          </div>

          <div className="flex justify-end">
            <SubmitButton>Cambiar contraseña</SubmitButton>
          </div>
        </form>
      </Section>
    </div>
  );
}

"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  LockKeyhole,
  Mail,
  Phone,
  User,
} from "lucide-react";

import {
  registerAction,
  type ActionState,
} from "@/app/actions/auth";

const initialState: ActionState = {
  error: null,
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="group flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-[#F19A06] px-6 text-base font-semibold text-[#1C2A43] transition-all duration-200 hover:bg-[#F19A06]/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Creando cuenta..." : "Crear cuenta"}

      {!pending && (
        <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </button>
  );
}

const inputClassName =
  "h-14 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-12 pr-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#F19A06]/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#F19A06]/10";

function Field({
  id,
  label,
  type,
  placeholder,
  autoComplete,
  icon: Icon,
  required = false,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  autoComplete?: string;
  icon: typeof User;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-white"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45"
        />

        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={inputClassName}
        />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(
    registerAction,
    initialState,
  );

  return (
    <>
      {/* Heading */}
      <div className="mb-9 text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
          Crea tu cuenta
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-white/60 sm:text-lg">
          Empieza a gestionar tus obras de forma más sencilla y
          organizada.
        </p>
      </div>

      {/* Trial */}
      <div className="mb-7 rounded-xl border border-[#F19A06]/20 bg-[#F19A06]/[0.06] px-5 py-4 text-center">
        <p className="text-sm font-semibold text-[#F19A06]">
          14 días de prueba gratis
        </p>

        <p className="mt-1 text-sm text-white/50">
          Sin compromiso. Descubre ObraKit antes de elegir tu plan.
        </p>
      </div>

      {/* Error */}
      {state.error && (
        <div className="mb-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-5">
        <Field
          id="full_name"
          label="Tu nombre"
          type="text"
          placeholder="Paco García"
          autoComplete="name"
          icon={User}
          required
        />

        <Field
          id="phone"
          label="Teléfono"
          type="tel"
          placeholder="600 000 000"
          autoComplete="tel"
          icon={Phone}
        />

        <Field
          id="nombre_negocio"
          label="Nombre de tu negocio"
          type="text"
          placeholder="Reformas García"
          autoComplete="organization"
          icon={Building2}
          required
        />

        <Field
          id="email"
          label="Email"
          type="email"
          placeholder="paco@reformasgarcia.com"
          autoComplete="email"
          icon={Mail}
          required
        />

        <Field
          id="password"
          label="Contraseña"
          type="password"
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          icon={LockKeyhole}
          required
        />

        <div className="pt-2">
          <SubmitButton />
        </div>
      </form>

      {/* Login */}
      <div className="my-9 flex items-center gap-5">
        <div className="h-px flex-1 bg-white/10" />

        <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          ¿Ya tienes cuenta?
        </span>

        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="text-center text-base text-white/80">
        ¿Ya estás registrado?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#F19A06] transition-colors hover:text-[#F19A06]/80 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>

      {/* Legal */}
      <p className="mx-auto mt-9 max-w-lg text-center text-sm leading-6 text-white/35">
        Al crear tu cuenta aceptas nuestros{" "}
        <Link
          href="/terms"
          className="text-[#F19A06]/80 transition-colors hover:text-[#F19A06]"
        >
          términos
        </Link>{" "}
        y{" "}
        <Link
          href="/privacy"
          className="text-[#F19A06]/80 transition-colors hover:text-[#F19A06]"
        >
          política de privacidad
        </Link>
        .
      </p>
    </>
  );
}

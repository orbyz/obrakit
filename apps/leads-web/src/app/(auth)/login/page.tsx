"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import { loginAction, type ActionState } from "@/app/actions/auth";

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
      {pending ? "Iniciando sesión..." : "Iniciar sesión"}

      {!pending && (
        <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
      )}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {/* Heading */}
      <div className="mb-9 text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.035em] text-white sm:text-5xl">
          Iniciar sesión
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-white/60 sm:text-lg">
          Accede a tu espacio de trabajo y continúa gestionando tus obras.
        </p>
      </div>

      {/* Error */}
      {state.error && (
        <div className="mb-6 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
          {state.error}
        </div>
      )}

      {/* Form */}
      <form action={formAction} className="space-y-6">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Email
          </label>

          <div className="relative">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45"
            />

            <input
              id="email"
              name="email"
              type="email"
              placeholder="paco@reformasgarcia.com"
              autoComplete="email"
              required
              className="h-14 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-12 pr-4 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#F19A06]/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#F19A06]/10"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-white"
          >
            Contraseña
          </label>

          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/45"
            />

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Tu contraseña"
              autoComplete="current-password"
              required
              className="h-14 w-full rounded-lg border border-white/10 bg-white/[0.03] pl-12 pr-12 text-base text-white outline-none transition placeholder:text-white/35 focus:border-[#F19A06]/60 focus:bg-white/[0.05] focus:ring-2 focus:ring-[#F19A06]/10"
            />

            <button
              type="button"
              aria-label={
                showPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-1">
          <SubmitButton />
        </div>
      </form>

      {/* Register */}
      <div className="my-9 flex items-center gap-5">
        <div className="h-px flex-1 bg-white/10" />

        <span className="whitespace-nowrap text-xs font-medium uppercase tracking-[0.2em] text-white/50">
          ¿Nuevo en ObraKit?
        </span>

        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="text-center text-base text-white/80">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#F19A06] transition-colors hover:text-[#F19A06]/80 hover:underline"
        >
          Crea tu cuenta gratis
        </Link>
      </p>

      {/* Legal */}
      <p className="mx-auto mt-9 max-w-md text-center text-sm leading-6 text-white/35">
        Al acceder aceptas nuestros{" "}
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

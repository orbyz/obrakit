"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { registerAction, type ActionState } from "@/app/actions/auth";

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
      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
    >
      {pending ? "Creando cuenta..." : "Crear cuenta"}
    </button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(registerAction, initialState);

  return (
    <>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Crea tu cuenta
      </h2>

      {state.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="full_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tu nombre
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            placeholder="Paco García"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Teléfono
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="600 000 000"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="nombre_negocio"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre de tu negocio
          </label>
          <input
            id="nombre_negocio"
            name="nombre_negocio"
            type="text"
            placeholder="Reformas García"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="paco@reformasgarcia.com"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Contraseña
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        <SubmitButton />
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="text-orange-500 hover:underline font-medium"
        >
          Inicia sesión
        </Link>
      </p>
    </>
  );
}

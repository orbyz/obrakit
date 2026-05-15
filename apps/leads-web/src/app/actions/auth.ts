"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { z } from "zod";

// ── Schemas de validación ──────────────────────────────────────────

const registerSchema = z.object({
  full_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  nombre_negocio: z.string().min(2, "El nombre del negocio es obligatorio"),
  email: z.string().email("Email no válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

const loginSchema = z.object({
  email: z.string().email("Email no válido"),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

// ── Tipos de respuesta ─────────────────────────────────────────────

export interface ActionState {
  error: string | null;
  success: boolean;
}

// ── Register ───────────────────────────────────────────────────────

export async function registerAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    full_name: formData.get("full_name") as string,
    nombre_negocio: formData.get("nombre_negocio") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  // Validar
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.errors[0].message,
      success: false,
    };
  }

  const { full_name, nombre_negocio, email, password } = parsed.data;
  const supabase = await createClient();

  // 1. Crear usuario en auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
    },
  });

  if (authError || !authData.user) {
    return {
      error: authError?.message ?? "Error al crear la cuenta",
      success: false,
    };
  }

  const userId = authData.user.id;

  // 2. Crear tenant (el negocio del autónomo)
  const { data: tenantData, error: tenantError } = await supabase
    .from("tenants")
    .insert({ nombre: nombre_negocio })
    .select("id")
    .single();

  if (tenantError || !tenantData) {
    return {
      error: "Error al crear el negocio",
      success: false,
    };
  }

  // 3. Vincular usuario como owner del tenant
  const { error: memberError } = await supabase.from("tenant_members").insert({
    tenant_id: tenantData.id,
    user_id: userId,
    role: "owner",
  });

  if (memberError) {
    return {
      error: "Error al configurar el acceso",
      success: false,
    };
  }

  redirect("/leads");
}

// ── Login ──────────────────────────────────────────────────────────

export async function loginAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      error: parsed.error.errors[0].message,
      success: false,
    };
  }

  const { email, password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      error: "Email o contraseña incorrectos",
      success: false,
    };
  }

  redirect("/leads");
}

// ── Logout ─────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

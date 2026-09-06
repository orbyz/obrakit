"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export interface UserActionState {
  error: string | null;
  success: string | null;
}

const initialProfileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(150, "El nombre es demasiado largo."),
  phone: z
    .string()
    .trim()
    .max(30, "El teléfono es demasiado largo.")
    .optional(),
});

const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Introduce un email válido."),
});

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

export async function updateProfileAction(
  _prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const parsed = initialProfileSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Datos inválidos.",
      success: null,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "No se ha podido identificar al usuario.",
      success: null,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      phone: parsed.data.phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return {
      error: "No se ha podido actualizar tu información.",
      success: null,
    };
  }

  revalidatePath("/usuario");

  return {
    error: null,
    success: "Información personal actualizada correctamente.",
  };
}

export async function updateEmailAction(
  _prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const parsed = emailSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Email inválido.",
      success: null,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "No se ha podido identificar al usuario.",
      success: null,
    };
  }

  if (parsed.data.email.toLowerCase() === user.email?.toLowerCase()) {
    return {
      error: "El nuevo email es igual al actual.",
      success: null,
    };
  }

  const { error } = await supabase.auth.updateUser({
    email: parsed.data.email,
  });

  if (error) {
    return {
      error: "No se ha podido actualizar el email.",
      success: null,
    };
  }

  return {
    error: null,
    success:
      "Solicitud enviada. Revisa tu correo para confirmar el cambio de email.",
  };
}

export async function updatePasswordAction(
  _prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const parsed = passwordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Contraseña inválida.",
      success: null,
    };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      error: "No se ha podido identificar al usuario.",
      success: null,
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return {
      error: "No se ha podido actualizar la contraseña.",
      success: null,
    };
  }

  return {
    error: null,
    success: "Contraseña actualizada correctamente.",
  };
}

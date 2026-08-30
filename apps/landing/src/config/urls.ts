const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://obrakit.vercel.app";

export const APP_ROUTES = {
  login: `${APP_URL}/login`,
  register: `${APP_URL}/register`,
} as const;

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between mb-2 md:mb-0">
          <span className="font-bold text-gray-900">🏗️ ObraKit</span>
          <div className="md:hidden flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {user.email?.split("@")[0]}
            </span>
            <form action={logoutAction}>
              <button className="text-xs text-red-500">Salir</button>
            </form>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-x-auto">
            <Link
              href="/leads"
              className="text-xs md:text-sm text-gray-600 hover:text-orange-500 whitespace-nowrap"
            >
              🏗️ Obras
            </Link>
            <Link
              href="/materiales"
              className="text-xs md:text-sm text-gray-600 hover:text-orange-500 whitespace-nowrap"
            >
              🧱 Materiales
            </Link>
            <Link
              href="/rentabilidad"
              className="text-xs md:text-sm text-gray-600 hover:text-orange-500 whitespace-nowrap"
            >
              📊 Rentabilidad
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <form action={logoutAction}>
              <button className="text-sm text-gray-100 rounded-md bg-red-400 px-2 py-2 hover:bg-red-500">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}

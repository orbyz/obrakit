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
      <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-gray-900">🏗️ ObraKit</span>
          <div className="flex items-center gap-4">
            <Link
              href="/leads"
              className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
            >
              📋 Leads
            </Link>
            <Link
              href="/materiales"
              className="text-sm text-gray-600 hover:text-orange-500 transition-colors"
            >
              🧱 Materiales
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user.email}</span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </nav>
      <main className="p-4">{children}</main>
    </div>
  );
}

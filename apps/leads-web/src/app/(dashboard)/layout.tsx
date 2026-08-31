
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import { SessionManager } from "@/components/core/SessionManager";
import { Sidebar } from "@/components/layout/sidebar/Sidebar";
import { Button } from "@/components/ui/button/Button";

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
    <div className="flex min-h-screen bg-background">
      <SessionManager />
      <Sidebar email={user.email} />

      <div className="min-w-0 flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div>
            <h2 className="font-semibold text-text">Bienvenido</h2>
          </div>

          <form action={logoutAction}>
            <Button variant="danger">Cerrar sesión</Button>
          </form>
        </header>

        <main className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:p-6 md:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
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
      <Sidebar email={user.email} />

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">
          <div>
            <h2 className="font-semibold text-text">Bienvenido</h2>
          </div>

          <form action={logoutAction}>
            <Button variant="danger">Cerrar sesión</Button>
          </form>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

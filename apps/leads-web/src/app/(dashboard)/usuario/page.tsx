import { UserRound } from "lucide-react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { createClient } from "@/lib/supabase/server";

import UserForm from "@/components/user/UserForm";

export default async function UsuarioPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Usuario"
          description="Gestiona tu información personal y los datos de acceso a tu cuenta."
        />

        <Card>
          <div className="flex items-center gap-3 text-sm text-muted">
            <UserRound className="h-5 w-5 shrink-0" />
            No se pudo cargar la información del usuario.
          </div>
        </Card>
      </div>
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Usuario"
          description="Gestiona tu información personal y los datos de acceso a tu cuenta."
        />

        <Card>
          <div className="flex items-center gap-3 text-sm text-muted">
            <UserRound className="h-5 w-5 shrink-0" />
            No se pudo cargar la información del usuario.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Usuario"
        description="Gestiona tu información personal y los datos de acceso a tu cuenta."
      />

      <UserForm
        profile={profile}
        email={user.email ?? ""}
      />
    </div>
  );
}

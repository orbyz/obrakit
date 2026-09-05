import { Building2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { getCurrentTenant } from "@/lib/tenant/context";

import EmpresaForm from "@/components/empresa/EmpresaForm";

export default async function EmpresaPage() {
  const tenant = await getCurrentTenant();

  if (!tenant) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Empresa"
          description="Gestiona la información de tu negocio."
        />

        <Card>
          <div className="flex items-center gap-3 text-sm text-muted">
            <Building2 className="h-5 w-5 shrink-0" />
            No se pudo cargar la información de la empresa.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Empresa"
        description="Gestiona la información de tu negocio."
      />

      <EmpresaForm tenant={tenant} />
    </div>
  );
}

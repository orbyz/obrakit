import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header/PageHeader";

import { getProjectById } from "@/app/actions/projects";
import { getProjectDashboard } from "@/app/actions/project-dashboard";
import { EmployeeAssignmentsCard } from "@/components/projects/EmployeeAssignmentsCard";
import { getAvailableEmployees } from "@/app/actions/employees";


import { getMaterialConsumptions } from "@/app/actions/material-consumptions";
import { getMaterials } from "@/app/actions/materials";
import { MaterialConsumptionsCard } from "@/components/projects/MaterialConsumptionsCard";



type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const dashboard = await getProjectDashboard(id);

  if (!dashboard) {
    notFound();
  }

  const project = dashboard.project;

  if (!project) {
    notFound();
  }

  const [employees, materials, consumptions] = await Promise.all([
    getAvailableEmployees(),
    getMaterials(),
    getMaterialConsumptions(project.id),
  ]);

  console.log("PROJECT ID:", project.id);
  console.log("CONSUMPTIONS:", consumptions);

  if (!project) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">

      <Link href="/obras">
        <Button variant="outline">
          ← Volver a Obras
        </Button>
      </Link>

      <PageHeader
        title={project.name}
        description={project.client_name ?? "Sin cliente"}
      />

      <div className="grid gap-4 md:grid-cols-4">

        <Card className="space-y-2">
          <p className="text-sm text-muted">
            Cliente
          </p>

          <p className="font-semibold">
            {project.client_name ?? "-"}
          </p>
        </Card>

        <Card className="space-y-2">
          <p className="text-sm text-muted">
            Presupuesto
          </p>

          <p className="font-semibold">
            {project.approved_budget != null
              ? `${project.approved_budget.toLocaleString("es-ES")} €`
              : "-"}
          </p>
        </Card>

        <Card className="space-y-2">
          <p className="text-sm text-muted">
            Inicio previsto
          </p>

          <p className="font-semibold">
            {project.planned_start_date ?? "-"}
          </p>
        </Card>

        <Card className="space-y-2">
          <p className="text-sm text-muted">
            Estado
          </p>

          <Badge>
            {project.status}
          </Badge>
        </Card>

      </div>

      <Card className="space-y-6">

        <h2 className="text-lg font-semibold">
          Información de la obra
        </h2>

        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <p className="text-sm text-muted">
              Dirección
            </p>

            <p>
              {project.address ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted">
              Ciudad
            </p>

            <p>
              {project.city ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted">
              Código Postal
            </p>

            <p>
              {project.postal_code ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-muted">
              Referencia
            </p>

            <p>
              {project.reference ?? "-"}
            </p>
          </div>

        </div>

        <div>

          <p className="mb-2 text-sm text-muted">
            Observaciones
          </p>

          <p>
            {project.notes ?? "Sin observaciones."}
          </p>

        </div>

      </Card>



      <EmployeeAssignmentsCard
        projectId={project.id}
        employees={employees}
      />

      <MaterialConsumptionsCard
        projectId={project.id}
        materials={materials}
        consumptions={consumptions}
      />


    </div>
  );
}

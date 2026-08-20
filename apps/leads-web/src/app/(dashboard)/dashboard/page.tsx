import Link from "next/link";

import { getDashboardData } from "@/app/actions/dashboard";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import StatCard from "@/components/ui/stat-card/StatCard";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";

function formatCurrency(value: number) {
  return `${value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

const PROJECT_STATUS_LABELS = {
  draft: "Borrador",
  planned: "Planificada",
  in_progress: "En curso",
  paused: "Pausada",
  completed: "Completada",
  cancelled: "Cancelada",
} as const;

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <PageHeader
          title="Dashboard"
          description="Resumen general de la actividad de tu negocio."
        />
      </div>

      {/* Comercial */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-text">
          Actividad comercial
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Oportunidades"
            value={dashboard.leads.total}
          />
          <StatCard
            label="Nuevas"
            value={dashboard.leads.new}
          />
          <StatCard
            label="En curso"
            value={dashboard.leads.inProgress}
          />
          <StatCard
            label="Cerradas"
            value={dashboard.leads.closed}
          />
        </div>
      </section>

      {/* Obras */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-text">
          Obras
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total"
            value={dashboard.projects.total}
          />
          <StatCard
            label="Activas"
            value={dashboard.projects.active}
          />
          <StatCard
            label="En curso"
            value={dashboard.projects.inProgress}
          />
          <StatCard
            label="Finalizadas"
            value={dashboard.projects.completed}
          />
        </div>
      </section>

      {/* Finanzas */}
      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">
            Resumen financiero
          </h2>

          <Link
            href="/rentabilidad"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver rentabilidad
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Presupuesto aprobado"
            value={formatCurrency(dashboard.financial.revenue)}
          />
          <StatCard
            label="Costes"
            value={formatCurrency(dashboard.financial.costs)}
          />
          <StatCard
            label="Beneficio bruto"
            value={formatCurrency(dashboard.financial.profit)}
          />
          <StatCard
            label="Margen"
            value={`${dashboard.financial.margin.toLocaleString("es-ES", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })} %`}
          />
        </div>
      </section>

      {/* Obras activas */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">
            Obras activas
          </h2>

          <Link
            href="/obras"
            className="text-sm font-medium text-primary hover:underline"
          >
            Ver todas
          </Link>
        </div>

        <Card>
          {dashboard.activeProjects.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              No hay obras activas actualmente.
            </p>
          ) : (
            <div className="divide-y divide-border">
              {dashboard.activeProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/obras/${project.id}`}
                  className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-text">
                      {project.name}
                    </p>

                    {project.clientName && (
                      <p className="mt-1 text-sm text-muted">
                        {project.clientName}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="neutral">
                      {PROJECT_STATUS_LABELS[project.status]}
                    </Badge>

                    {project.budget !== null && (
                      <span className="text-sm font-medium text-text">
                        {formatCurrency(project.budget)}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}

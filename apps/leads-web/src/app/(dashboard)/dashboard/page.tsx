import Link from "next/link";
import {
  BarChart3,
  Building2,
  CircleDollarSign,
  HardHat,
  Package,
  TrendingUp,
  Users,
} from "lucide-react";

import { getDashboardData } from "@/app/actions/dashboard";
import { Badge } from "@/components/ui/badge/Badge";
import { Card } from "@/components/ui/card/Card";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import StatCard from "@/components/ui/stat-card/StatCard";
import { PageHeader } from "@/components/ui/page-header/PageHeader";

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

      {/* Resumen principal */}
      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-text">
            Resumen general
          </h2>
          <p className="mt-1 text-sm text-muted">
            Así marcha tu empresa.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Facturación"
            value={formatCurrency(dashboard.financial.revenue)}
            icon={<CircleDollarSign size={18} />}
            variant="primary"
          />

          <StatCard
            label="Obras activas"
            value={dashboard.projects.active}
            icon={<Building2 size={18} />}
            variant="warning"
          />

          <StatCard
            label="Equipo"
            value={dashboard.team.active}
            icon={<Users size={18} />}
            variant="neutral"
          />

          <StatCard
            label="Beneficio bruto"
            value={formatCurrency(dashboard.financial.profit)}
            icon={<TrendingUp size={18} />}
            variant="success"
          />
        </div>
      </section>

      {/* Resumen financiero */}
      <section className="mb-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-text">
              Resumen financiero
            </h2>
            <p className="mt-1 text-sm text-muted">
              Una visión rápida de la situación económica de tus obras.
            </p>
          </div>

          <Link
            href="/rentabilidad"
            className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary-light hover:underline"
          >
            Ver rentabilidad
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Presupuesto aprobado"
            value={formatCurrency(dashboard.financial.revenue)}
            icon={<CircleDollarSign size={18} />}
            variant="neutral"
          />

          <StatCard
            label="Costes"
            value={formatCurrency(dashboard.financial.costs)}
            icon={<BarChart3 size={18} />}
            variant="warning"
          />

          <StatCard
            label="Beneficio bruto"
            value={formatCurrency(dashboard.financial.profit)}
            icon={<TrendingUp size={18} />}
            variant="success"
          />

          <StatCard
            label="Margen"
            value={`${dashboard.financial.margin.toLocaleString("es-ES", {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            })} %`}
            icon={<BarChart3 size={18} />}
            variant={
              dashboard.financial.margin >= 30
                ? "success"
                : dashboard.financial.margin >= 15
                  ? "warning"
                  : "neutral"
            }
          />
        </div>
      </section>

      {/* Obras activas */}
      <section className="mb-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-text">
              Obras activas
            </h2>
            <p className="mt-1 text-sm text-muted">
              Obras actualmente en planificación, ejecución o pausa.
            </p>
          </div>

          <Link
            href="/obras"
            className="shrink-0 text-sm font-medium text-primary transition-colors hover:text-primary-light hover:underline"
          >
            Ver todas
          </Link>
        </div>

        <Card className="p-4 sm:p-6">
          {dashboard.activeProjects.length === 0 ? (
            <EmptyState
              icon={<HardHat size={22} />}
              title="No hay obras activas"
              description="Las obras actualmente activas aparecerán aquí."
            />
          ) : (
            <div className="divide-y divide-border">
              {dashboard.activeProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/obras/${project.id}`}
                  className="flex flex-col gap-3 py-4 transition-colors first:pt-0 last:pb-0 hover:bg-background/50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text">
                      {project.name}
                    </p>

                    {project.clientName && (
                      <p className="mt-1 truncate text-sm text-muted">
                        {project.clientName}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center justify-between gap-4 sm:justify-end">
                    <Badge variant="neutral">
                      {PROJECT_STATUS_LABELS[project.status]}
                    </Badge>

                    {project.budget !== null && (
                      <span className="whitespace-nowrap text-sm font-medium text-text">
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

      {/* Accesos rápidos */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-text">
            Accesos rápidos
          </h2>
          <p className="mt-1 text-sm text-muted">
            Accede rápidamente a las áreas principales de ObraKit.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/leads" className="group">
            <Card className="flex h-full items-center gap-4 p-4 transition-colors hover:border-primary/30 hover:bg-background/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users size={19} />
              </div>

              <div className="min-w-0">
                <p className="font-medium text-text group-hover:text-primary">
                  CRM
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  Gestiona tus oportunidades
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/obras" className="group">
            <Card className="flex h-full items-center gap-4 p-4 transition-colors hover:border-primary/30 hover:bg-background/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Building2 size={19} />
              </div>

              <div className="min-w-0">
                <p className="font-medium text-text group-hover:text-primary">
                  Obras
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  Gestiona tus obras
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/materiales" className="group">
            <Card className="flex h-full items-center gap-4 p-4 transition-colors hover:border-primary/30 hover:bg-background/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package size={19} />
              </div>

              <div className="min-w-0">
                <p className="font-medium text-text group-hover:text-primary">
                  Materiales
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  Controla tus materiales
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/rentabilidad" className="group">
            <Card className="flex h-full items-center gap-4 p-4 transition-colors hover:border-primary/30 hover:bg-background/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp size={19} />
              </div>

              <div className="min-w-0">
                <p className="font-medium text-text group-hover:text-primary">
                  Finanzas
                </p>
                <p className="mt-0.5 text-sm text-muted">
                  Consulta tu rentabilidad
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  );
}

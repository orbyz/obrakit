"use client";

import Link from "next/link";

import type { Lead, Project, Seguimiento } from "@/types";
import { Button } from "@/components/ui/button";

import LeadInfo from "./LeadInfo";
import SeguimientoForm from "./SeguimientoForm";
import SeguimientoList from "./SeguimientoList";
import { GenerateProjectButton } from "./GenerateProjectButton";

import { Card } from "@/components/ui/card/Card";
import { PageSection } from "@/components/ui/page-section/PageSection";

function formatCurrency(value: number | null) {
  if (value === null) return "No informado";

  return `${value.toLocaleString("es-ES", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} €`;
}

interface LeadDetailClientProps {
  lead: Lead;
  seguimientos: Seguimiento[];
  project: Project | null;
}

export default function LeadDetailClient({
  lead,
  seguimientos,
  project,
}: LeadDetailClientProps) {
  const isClosed = lead.estado === "cerrado";

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
      <div className="space-y-6">
        <PageSection
          title="Resumen comercial"
          description="Información principal de la oportunidad."
        >
          <dl className="grid gap-4 sm:grid-cols-2">
            {isClosed && (
              <div>
                <dt className="text-xs font-medium text-muted">
                  Importe cerrado
                </dt>
                <dd className="mt-1 text-lg font-semibold text-text">
                  {formatCurrency(lead.importe_cerrado)}
                </dd>
              </div>
            )}

            {(!isClosed || lead.importe_ofertado !== null) && (
              <div>
                <dt className="text-xs font-medium text-muted">
                  Importe ofertado
                </dt>
                <dd className="mt-1 text-lg font-semibold text-text">
                  {formatCurrency(lead.importe_ofertado)}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-xs font-medium text-muted">Tipo de obra</dt>
              <dd className="mt-1 text-sm text-text">
                {lead.tipo_obra ?? "Pendiente de definir"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-muted">Origen</dt>
              <dd className="mt-1 text-sm text-text">
                {lead.origen ?? "Pendiente de definir"}
              </dd>
            </div>
          </dl>
        </PageSection>

        <PageSection
          title="Cliente y oportunidad"
          description="Actualiza los datos de contacto y comerciales."
        >
          <LeadInfo lead={lead} />
        </PageSection>

        {isClosed && (
          <PageSection
            title="Conversión a obra"
            description={
              project
                ? "Esta oportunidad ya se ha convertido en una obra."
                : "Genera la obra para continuar con su gestión operativa."
            }
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-text">
                {project ? "Obra generada" : "Pendiente de generar obra"}
              </p>

              {project ? (
                <Link href={`/obras/${project.id}`}>
                  <Button type="button">Ver obra</Button>
                </Link>
              ) : (
                <GenerateProjectButton leadId={lead.id} />
              )}
            </div>
          </PageSection>
        )}
      </div>

      <Card>
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-text">
              Actividad comercial
            </h2>
            <p className="mt-1 text-sm text-muted">
              Registra y consulta el seguimiento de la oportunidad.
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-text">
              Nuevo seguimiento
            </h3>
            <div className="mt-4">
              <SeguimientoForm leadId={lead.id} />
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-text">Historial</h3>
            <div className="mt-4">
              <SeguimientoList seguimientos={seguimientos} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

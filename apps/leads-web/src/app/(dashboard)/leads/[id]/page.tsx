import { notFound } from "next/navigation";
import Link from "next/link";
import { getLeadById } from "@/app/actions/leads";
import { getSeguimientos } from "@/app/actions/seguimientos";
import { getProjectByLeadId } from "@/app/actions/projects";

import LeadDetailClient from "@/components/leads/LeadDetailClient";
import { Badge } from "@/components/ui/badge/Badge";

const ESTADO_CONFIG = {
  nuevo: { label: "Nuevo", variant: "neutral" },
  en_curso: { label: "En curso", variant: "primary" },
  cerrado: { label: "Cerrado", variant: "success" },
} as const;

interface LeadDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const [lead, seguimientos, project] = await Promise.all([
    getLeadById(id),
    getSeguimientos(id),
    getProjectByLeadId(id),
  ]);

  if (!lead) notFound();

  const estadoConfig = ESTADO_CONFIG[lead.estado];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-8">
        <Link
          href="/leads"
          className="inline-flex text-sm text-muted transition-colors hover:text-text"
        >
          ← Volver al CRM
        </Link>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-text">{lead.nombre}</h1>
              <Badge variant={estadoConfig.variant}>
                {estadoConfig.label}
              </Badge>
            </div>

            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <span>{lead.tipo_obra ?? "Tipo de obra pendiente"}</span>
              <span>{lead.origen ?? "Origen pendiente"}</span>
            </div>
          </div>

          <p className="text-xs text-muted">
            Creado{" "}
            {new Date(lead.created_at).toLocaleDateString("es-ES", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </header>

      <LeadDetailClient
        lead={lead}
        seguimientos={seguimientos}
        project={project}
      />
    </div>
  );
}

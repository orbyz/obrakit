"use client";

import { useState } from "react";

import type { Gasto, Lead, Seguimiento } from "@/types";

import LeadInfo from "./LeadInfo";
import SeguimientoForm from "./SeguimientoForm";
import SeguimientoList from "./SeguimientoList";

import GastoForm from "../gastos/GastoForm";
import GastosList from "../gastos/GastosList";

import { Card } from "@/components/ui/card/Card";
import { PageSection } from "@/components/ui/page-section/PageSection";
import { Tabs } from "@/components/ui/tabs/Tabs";

interface LeadDetailClientProps {
  lead: Lead;
  seguimientos: Seguimiento[];
  gastos: Gasto[];
}

const TABS = [
  {
    value: "seguimientos",
    label: "📝 Seguimientos",
  },
  {
    value: "gastos",
    label: "🧱 Gastos",
  },
] as const;

export default function LeadDetailClient({
  lead,
  seguimientos,
  gastos,
}: LeadDetailClientProps) {
  const [tab, setTab] = useState<"seguimientos" | "gastos">("seguimientos");

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Información */}
      <PageSection
        title="Información de la obra"
        description="Datos generales del cliente y del proyecto."
      >
        <LeadInfo lead={lead} />
      </PageSection>

      {/* Actividad */}
      <Card className="p-6">
        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            {
              value: "seguimientos",
              label: `📝 Seguimientos (${seguimientos.length})`,
            },
            {
              value: "gastos",
              label: `🧱 Gastos (${gastos.length})`,
            },
          ]}
        />

        {tab === "seguimientos" ? (
          <div className="space-y-8">
            <PageSection
              title="Nuevo seguimiento"
              description="Registra llamadas, visitas o notas."
            >
              <SeguimientoForm leadId={lead.id} />
            </PageSection>

            <PageSection
              title="Historial"
              description="Actividad registrada para esta obra."
            >
              <SeguimientoList seguimientos={seguimientos} />
            </PageSection>
          </div>
        ) : (
          <div className="space-y-8">
            <PageSection
              title="Nuevo gasto"
              description="Añade un material o compra."
            >
              <GastoForm leadIdFijo={lead.id} />
            </PageSection>

            <PageSection
              title="Gastos registrados"
              description="Listado de compras asociadas."
            >
              <GastosList gastos={gastos} />
            </PageSection>
          </div>
        )}
      </Card>
    </div>
  );
}

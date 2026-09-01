"use client";

import { useMemo, useState } from "react";
import type { Gasto } from "@/types";

import { Button } from "@/components/ui/button/Button";
import { FormSection } from "@/components/ui/forms/FormSection";

import GastoForm from "./GastoForm";
import GastosList from "./GastosList";
import { Card } from "../ui/card/Card";

import {
  Building2,
  ClipboardList,
  Package,
  Plus,
  X,
} from "lucide-react";

interface GastosClientProps {
  gastos: Gasto[];
  projects: { id: string; name: string }[];
  resumen: {
    totalMes: number;
    totalAnio: number;
    porCategoria: Record<string, number>;
    porObra: { nombre: string; total: number }[];
  };
}

const TABS = [
  {
    key: "lista",
    label: "Lista",
    icon: ClipboardList,
  },
  {
    key: "porObra",
    label: "Por obra",
    icon: Building2,
  },
  {
    key: "porCategoria",
    label: "Categorías",
    icon: Package,
  },
] as const;

export default function GastosClient({
  gastos,
  projects,
  resumen,
}: GastosClientProps) {
  const [showForm, setShowForm] = useState(false);

  const [vistaActiva, setVistaActiva] = useState<
    "lista" | "porObra" | "porCategoria"
  >("lista");

  const totalCategorias = useMemo(
    () =>
      Object.values(resumen.porCategoria).reduce(
        (total, actual) => total + actual,
        0,
      ),
    [resumen.porCategoria],
  );

  return (
    <>
      {/* Toolbar */}
      <div className="mb-6 flex justify-end">
        <Button
          variant="secondary"
          onClick={() => setShowForm((value) => !value)}
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" aria-hidden="true" />
              Cerrar
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" aria-hidden="true" />
              Nuevo gasto
            </>
          )}
        </Button>
      </div>

      {/* Formulario */}
      {showForm && (
        <Card className="mb-8 rounded-2xl border border-border bg-surface p-6 shadow-card">
          <FormSection title="Registrar gasto">
            <GastoForm
              projects={projects}
              onSuccess={() => setShowForm(false)}
            />
          </FormSection>
        </Card>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-border">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setVistaActiva(tab.key)}
            className={`
              border-b-2
              px-4
              py-3
              text-sm
              font-medium
              transition-all

              ${
                vistaActiva === tab.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted hover:text-text"
              }
            `}
          >
            <span className="inline-flex items-center gap-2">
              <tab.icon className="h-4 w-4" aria-hidden="true" />
              {tab.label}
            </span>
          </button>
        ))}
      </div>

      {/* Lista */}
      {vistaActiva === "lista" && <GastosList gastos={gastos} />}

      {/* Por obra */}
      {vistaActiva === "porObra" && (
        <div className="space-y-3">
          {resumen.porObra.length === 0 ? (
            <Card className="rounded-2xl border border-border bg-surface py-12 text-center text-muted shadow-card">
              Sin datos todavía
            </Card>
          ) : (
            resumen.porObra.map((obra) => (
              <div
                key={obra.nombre}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-border
                  bg-surface
                  p-5
                  shadow-card
                "
              >
                <div className="flex items-center gap-3">
                  <Building2
                    className="h-5 w-5 text-muted"
                    aria-hidden="true"
                  />

                  <span className="font-medium text-text">{obra.nombre}</span>
                </div>

                <span className="text-lg font-semibold text-primary">
                  {obra.total.toLocaleString("es-ES", {
                    minimumFractionDigits: 2,
                  })}
                  {" €"}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Categorías */}
      {vistaActiva === "porCategoria" && (
        <div className="space-y-4">
          {Object.entries(resumen.porCategoria)
            .sort((a, b) => b[1] - a[1])
            .map(([categoria, total]) => {
              const porcentaje =
                totalCategorias === 0
                  ? 0
                  : Math.round((total / totalCategorias) * 100);

              return (
                <div
                  key={categoria}
                  className="
                    rounded-2xl
                    border
                    border-border
                    bg-surface
                    p-5
                    shadow-card
                  "
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-medium capitalize text-text">
                      {categoria}
                    </span>

                    <span className="font-semibold text-primary">
                      {total.toLocaleString("es-ES", {
                        minimumFractionDigits: 2,
                      })}
                      {" €"}
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${porcentaje}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-muted">
                    {porcentaje}% del gasto total
                  </p>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
}

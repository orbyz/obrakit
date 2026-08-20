"use client";

import { useState } from "react";

import { getGastosByProject } from "@/app/actions/gastos";
import GastoForm from "@/components/gastos/GastoForm";
import GastosList from "@/components/gastos/GastosList";
import { Button } from "@/components/ui/button/Button";
import { Card } from "@/components/ui/card/Card";
import type { Gasto } from "@/types";

interface ProjectExpensesCardProps {
  projectId: string;
  initialGastos: Gasto[];
}

export function ProjectExpensesCard({
  projectId,
  initialGastos,
}: ProjectExpensesCardProps) {
  const [gastos, setGastos] = useState(initialGastos);
  const [showForm, setShowForm] = useState(false);

  async function refreshGastos() {
    const updatedGastos = await getGastosByProject(projectId);
    setGastos(updatedGastos);
  }

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Gastos de la obra</h2>
          <p className="text-sm text-muted">
            Registra y consulta los gastos asociados a esta obra.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={() => setShowForm((current) => !current)}
        >
          {showForm ? "Cancelar" : "Nuevo gasto"}
        </Button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-border bg-background p-4">
          <GastoForm
            projectIdFijo={projectId}
            onSuccess={async () => {
              await refreshGastos();
              setShowForm(false);
            }}
          />
        </div>
      )}

      <GastosList
        gastos={gastos}
        onDeleted={refreshGastos}
      />
    </Card>
  );
}

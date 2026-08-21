"use client";

import { useState } from "react";

import { getGastosByProject } from "@/app/actions/gastos";
import GastosList from "@/components/gastos/GastosList";
import { Card } from "@/components/ui/card/Card";
import type { Gasto } from "@/types";

import { NewProjectExpenseDialog } from "./NewProjectExpenseDialog";

interface ProjectExpensesCardProps {
  projectId: string;
  initialGastos: Gasto[];
}

export function ProjectExpensesCard({
  projectId,
  initialGastos,
}: ProjectExpensesCardProps) {
  const [gastos, setGastos] = useState(initialGastos);

  async function refreshGastos() {
    const updatedGastos = await getGastosByProject(projectId);
    setGastos(updatedGastos);
  }

  return (
    <Card className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Gastos de la obra
          </h2>

          <p className="text-sm text-muted">
            Registra y consulta los gastos asociados a esta obra.
          </p>
        </div>

        <NewProjectExpenseDialog
          projectId={projectId}
          onSuccess={refreshGastos}
        />
      </div>

      <GastosList
        gastos={gastos}
        onDeleted={refreshGastos}
      />
    </Card>
  );
}

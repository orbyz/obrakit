"use client";

import { Card } from "@/components/ui/card";
import { MaterialConsumptionSummary } from "../materials/MaterialConsumptionSummary";

import type {
  Material,
  MaterialConsumption,
} from "@/types";

import { MaterialConsumptionTable } from "../materials/MaterialConsumptionTable";
import { NewMaterialConsumptionDialog } from "../materials/NewMaterialConsumptionDialog";
import { EmployeeFeedbackProvider } from "../employees/EmployeeFeedback";

interface MaterialConsumptionsCardProps {
  projectId: string;
  materials: Material[];
  consumptions: MaterialConsumption[];
}

export function MaterialConsumptionsCard({
  projectId,
  materials,
  consumptions,
}: MaterialConsumptionsCardProps) {
  return (
    <EmployeeFeedbackProvider>
      <Card className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">
              Materiales consumidos
            </h2>

          <p className="text-sm text-muted">
            Gestiona todos los materiales utilizados en esta obra.
          </p>
        </div>

        <NewMaterialConsumptionDialog
          projectId={projectId}
          materials={materials}
        />
      </div>

      <MaterialConsumptionSummary
        consumptions={consumptions}
      />

      <MaterialConsumptionTable
        consumptions={consumptions}
      />
    </Card>
  </EmployeeFeedbackProvider>
  );
}

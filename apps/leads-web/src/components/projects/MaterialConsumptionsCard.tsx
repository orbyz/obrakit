"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";
import { NewMaterialDialog } from "@/components/materials/NewMaterialDialog";
import { MaterialConsumptionSummary } from "../materials/MaterialConsumptionSummary";

import type {
  Material,
  MaterialConsumption,
} from "@/types";

import { MaterialConsumptionTable } from "../materials/MaterialConsumptionTable";
import { NewMaterialConsumptionDialog } from "../materials/NewMaterialConsumptionDialog";

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
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [consumptionOpen, setConsumptionOpen] = useState(false);
  const [continueToConsumption, setContinueToConsumption] = useState(false);
  const activeMaterials = materials.filter((material) => material.activo);

  const consumptionDialogOpen =
    consumptionOpen || (continueToConsumption && activeMaterials.length > 0);
  const handlePrimaryAction = () => {
    if (activeMaterials.length > 0) {
      setConsumptionOpen(true);
    } else {
      setCreateOpen(true);
    }
  };

  return (
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

        {consumptions.length > 0 && (
          <Button onClick={handlePrimaryAction}>
            {activeMaterials.length > 0 ? "Añadir material" : "Crear material"}
          </Button>
        )}
      </div>

      <MaterialConsumptionSummary
        consumptions={consumptions}
      />

      {consumptions.length === 0 ? (
        <EmptyState
          title={
            activeMaterials.length === 0
              ? "Aún no tienes materiales activos."
              : "Aún no hay consumos registrados."
          }
          description={
            activeMaterials.length === 0
              ? "Crea un material para registrar su consumo en esta obra."
              : "Registra los materiales utilizados en esta obra."
          }
          action={
            <Button onClick={handlePrimaryAction}>
              {activeMaterials.length > 0
                ? "Registrar consumo"
                : "Crear material"}
            </Button>
          }
        />
      ) : (
        <MaterialConsumptionTable consumptions={consumptions} />
      )}

      <NewMaterialDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        hideTrigger
        onSuccess={() => {
          setContinueToConsumption(true);
          router.refresh();
        }}
      />

      <NewMaterialConsumptionDialog
        projectId={projectId}
        materials={materials}
        open={consumptionDialogOpen}
        onOpenChange={(open) => {
          setConsumptionOpen(open);
          if (!open) setContinueToConsumption(false);
        }}
        hideTrigger
      />
    </Card>
  );
}

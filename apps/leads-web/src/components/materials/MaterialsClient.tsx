"use client";

import type { Material } from "@/types";

import { EmployeeFeedbackProvider } from "../employees/EmployeeFeedback";
import { MaterialTable } from "./MaterialTable";
import { NewMaterialDialog } from "./NewMaterialDialog";

interface MaterialsClientProps {
  materials: Material[];
}

function MaterialsContent({
  materials,
}: MaterialsClientProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Materiales
          </h1>

          <p className="text-muted-foreground">
            Catálogo de materiales de la empresa.
          </p>
        </div>

        <NewMaterialDialog />
      </div>

      <MaterialTable materials={materials} />
    </div>
  );
}

export function MaterialsClient({
  materials,
}: MaterialsClientProps) {
  return (
    <EmployeeFeedbackProvider>
      <MaterialsContent materials={materials} />
    </EmployeeFeedbackProvider>
  );
}

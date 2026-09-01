"use client";

import type { Material } from "@/types";

import { EmployeeFeedbackProvider } from "../employees/EmployeeFeedback";
import { PageHeader } from "../ui/page-header/PageHeader";
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
      <PageHeader
        title="Materiales"
        description="Catálogo de materiales de la empresa."
        actions={<NewMaterialDialog />}
      />

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

import { getMaterials } from "@/app/actions/materials";
import { MaterialsClient } from "@/components/materials/MaterialsClient";

export default async function MaterialsPage() {
  const materials = await getMaterials();

  return (
    <main className="max-w-6xl mx-auto">
      <MaterialsClient materials={materials} />
    </main>
  );
}

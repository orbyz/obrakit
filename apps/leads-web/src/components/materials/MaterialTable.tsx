import type { Material } from "@/types";

import { MaterialRow } from "./MaterialRow";

interface MaterialTableProps {
  materials: Material[];
}

export function MaterialTable({
  materials,
}: MaterialTableProps) {
  return (
    <div className="rounded-xl border">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left">
              Nombre
            </th>

            <th className="p-4 text-left">
              Categoría
            </th>

            <th className="p-4 text-left">
              Unidad
            </th>

            <th className="p-4 text-left">
              Precio habitual
            </th>

            <th className="p-4 text-left">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {materials.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="p-8 text-center text-muted-foreground"
              >
                No hay materiales registrados.
              </td>
            </tr>
          ) : (
            materials.map((material) => (
              <MaterialRow
                key={material.id}
                material={material}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

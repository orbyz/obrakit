import type { Material } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MaterialRow } from "./MaterialRow";

interface MaterialTableProps {
  materials: Material[];
}

export function MaterialTable({ materials }: MaterialTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Categoría</TableHead>
          <TableHead>Unidad</TableHead>
          <TableHead className="text-right">
            Precio habitual
          </TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {materials.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={5}
              className="py-8 text-center text-muted"
            >
              No hay materiales registrados.
            </TableCell>
          </TableRow>
        ) : (
          materials.map((material) => (
            <MaterialRow
              key={material.id}
              material={material}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
}

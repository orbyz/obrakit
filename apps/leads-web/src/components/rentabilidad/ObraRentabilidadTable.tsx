import Link from "next/link";

import type { RentabilidadPorObra } from "@/app/actions/rentabilidad";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";

interface ObraRentabilidadTableProps {
  data: RentabilidadPorObra[];
}

export default function ObraRentabilidadTable({
  data,
}: ObraRentabilidadTableProps) {
  if (data.length === 0) {
    return <EmptyState title="Sin obras cerradas aún" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Obra</TableHead>
          <TableHead className="text-right">Facturado</TableHead>
          <TableHead className="text-right">Gastado</TableHead>
          <TableHead className="whitespace-nowrap text-right">
            Margen €
          </TableHead>
          <TableHead className="whitespace-nowrap text-right">
            Margen %
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <Link
                href={`/obras/${row.id}`}
                className="font-medium text-primary hover:underline"
              >
                {row.nombre}
              </Link>

              {row.hasUncalculatedLaborCost && (
                <p className="mt-1 text-xs text-muted">
                  Coste laboral incompleto
                </p>
              )}
            </TableCell>

            <TableCell className="whitespace-nowrap text-right">
              {row.facturado.toLocaleString("es-ES", {
                minimumFractionDigits: 0,
              })}{" "}
              €
            </TableCell>

            <TableCell className="whitespace-nowrap text-right text-warning">
              {row.gastado.toLocaleString("es-ES", {
                minimumFractionDigits: 0,
              })}{" "}
              €
            </TableCell>

            <TableCell
              className={`whitespace-nowrap text-right font-semibold ${
                row.margen >= 0 ? "text-success" : "text-danger"
              }`}
            >
              {row.margen.toLocaleString("es-ES", {
                minimumFractionDigits: 0,
              })}{" "}
              €
            </TableCell>

            <TableCell
              className={`whitespace-nowrap text-right font-semibold ${
                row.margenPorcentaje >= 30
                  ? "text-success"
                  : row.margenPorcentaje >= 15
                    ? "text-warning"
                    : "text-danger"
              }`}
            >
              {row.margenPorcentaje}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

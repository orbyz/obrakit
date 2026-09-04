import type { RentabilidadPorTipo } from "@/app/actions/rentabilidad";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state/EmptyState";

const TIPO_LABEL: Record<string, string> = {
  bano: "Baño",
  cocina: "Cocina",
  pintura: "Pintura",
  integral: "Integral",
  otro: "Otro",
};

interface TipoObraTableProps {
  data: RentabilidadPorTipo[];
}

export default function TipoObraTable({ data }: TipoObraTableProps) {
  if (data.length === 0) {
    return <EmptyState title="Sin obras cerradas aún" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tipo de obra</TableHead>
          <TableHead className="text-right">Cerrados</TableHead>
          <TableHead className="text-right">Facturado</TableHead>
          <TableHead className="text-right">Gastado</TableHead>
          <TableHead className="whitespace-nowrap text-right">
            Margen €
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((row) => (
          <TableRow key={row.tipo}>
            <TableCell className="font-medium">
              {TIPO_LABEL[row.tipo] ?? row.tipo}
            </TableCell>

            <TableCell className="text-right text-muted">
              {row.cerrados}
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
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

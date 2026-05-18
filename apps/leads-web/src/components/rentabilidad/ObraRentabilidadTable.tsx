import Link from "next/link";
import type { RentabilidadPorObra } from "@/app/actions/rentabilidad";

interface ObraRentabilidadTableProps {
  data: RentabilidadPorObra[];
}

export default function ObraRentabilidadTable({
  data,
}: ObraRentabilidadTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">Sin obras cerradas aún</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Obra
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Facturado
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Gastado
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Margen €
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Margen %
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <Link
                  href={`/leads/${row.id}`}
                  className="font-medium text-orange-600 hover:text-orange-700 hover:underline"
                >
                  {row.nombre}
                </Link>
              </td>
              <td className="py-3 px-4 text-right text-gray-900">
                {row.facturado.toLocaleString("es-ES", {
                  minimumFractionDigits: 0,
                })}{" "}
                €
              </td>
              <td className="py-3 px-4 text-right text-orange-600">
                {row.gastado.toLocaleString("es-ES", {
                  minimumFractionDigits: 0,
                })}{" "}
                €
              </td>
              <td
                className={`py-3 px-4 text-right font-bold ${
                  row.margen >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {row.margen.toLocaleString("es-ES", {
                  minimumFractionDigits: 0,
                })}{" "}
                €
              </td>
              <td
                className={`py-3 px-4 text-right font-bold ${
                  row.margenPorcentaje >= 30
                    ? "text-green-600"
                    : row.margenPorcentaje >= 15
                      ? "text-amber-600"
                      : "text-red-600"
                }`}
              >
                {row.margenPorcentaje}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

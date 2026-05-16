import type { RentabilidadPorTipo } from "@/app/actions/rentabilidad";

const TIPO_LABEL: Record<string, string> = {
  bano: "🚿 Baño",
  cocina: "🍳 Cocina",
  pintura: "🎨 Pintura",
  integral: "🏗️ Integral",
  otro: "🔧 Otro",
};

interface TipoObraTableProps {
  data: RentabilidadPorTipo[];
}

export default function TipoObraTable({ data }: TipoObraTableProps) {
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
              Tipo de obra
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Cerrados
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Facturado
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Gastado
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Margen
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.tipo}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4 font-medium text-gray-900">
                {TIPO_LABEL[row.tipo] ?? row.tipo}
              </td>
              <td className="py-3 px-4 text-right text-gray-600">
                {row.cerrados}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

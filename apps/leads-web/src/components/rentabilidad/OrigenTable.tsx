import type { RentabilidadPorOrigen } from "@/app/actions/rentabilidad";

const ORIGEN_LABEL: Record<string, string> = {
  whatsapp: "💬 WhatsApp",
  instagram: "📸 Instagram",
  recomendacion: "👥 Recomendación",
  web: "🌐 Web",
  otro: "📌 Otro",
};

interface OrigenTableProps {
  data: RentabilidadPorOrigen[];
}

export default function OrigenTable({ data }: OrigenTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400 text-sm">Sin leads cerrados aún</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">
              Origen
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Total
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Cerrados
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              % Cierre
            </th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">
              Ticket medio
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.origen}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4 font-medium text-gray-900">
                {ORIGEN_LABEL[row.origen] ?? row.origen}
              </td>
              <td className="py-3 px-4 text-right text-gray-600">
                {row.total}
              </td>
              <td className="py-3 px-4 text-right text-gray-900">
                {row.cerrados}
              </td>
              <td
                className={`py-3 px-4 text-right font-bold ${
                  row.tasaCierre >= 50 ? "text-green-600" : "text-gray-600"
                }`}
              >
                {row.tasaCierre}%
              </td>
              <td className="py-3 px-4 text-right text-gray-900">
                {row.ticketMedio.toLocaleString("es-ES", {
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

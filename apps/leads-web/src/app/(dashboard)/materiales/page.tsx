import { getGastos, getResumenGastos } from "@/app/actions/gastos";
import { getLeads } from "@/app/actions/leads";
import GastosClient from "@/components/gastos/GastosClient";

export default async function MaterialesPage() {
  const [gastos, resumen, leadsPorEstado] = await Promise.all([
    getGastos(),
    getResumenGastos(),
    getLeads(),
  ]);

  // Aplanar leads de todos los estados para el selector
  const leads = Object.values(leadsPorEstado)
    .flat()
    .map((l) => ({ id: l.id, nombre: l.nombre }));

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            🧱 Gastos de Materiales
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Controla lo que gastas en cada proyecto
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Este mes</p>
          <p className="text-2xl font-bold text-gray-900">
            {resumen.totalMes.toLocaleString("es-ES", {
              minimumFractionDigits: 0,
            })}{" "}
            €
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Este año</p>
          <p className="text-2xl font-bold text-gray-900">
            {resumen.totalAnio.toLocaleString("es-ES", {
              minimumFractionDigits: 0,
            })}{" "}
            €
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Total gastos</p>
          <p className="text-2xl font-bold text-gray-900">{gastos.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-xs text-gray-500 mb-1">Mayor categoría</p>
          <p className="text-sm font-bold text-orange-500 mt-1 truncate">
            {Object.entries(resumen.porCategoria).sort(
              (a, b) => b[1] - a[1],
            )[0]?.[0] ?? "—"}
          </p>
        </div>
      </div>

      <GastosClient gastos={gastos} leads={leads} resumen={resumen} />
    </div>
  );
}

import {
  getResumenGeneral,
  getRentabilidadPorTipo,
  getRentabilidadPorOrigen,
} from "@/app/actions/rentabilidad";
import StatCard from "@/components/rentabilidad/StatCard";
import TipoObraTable from "@/components/rentabilidad/TipoObraTable";
import OrigenTable from "@/components/rentabilidad/OrigenTable";

export default async function RentabilidadPage() {
  const [resumen, porTipo, porOrigen] = await Promise.all([
    getResumenGeneral(),
    getRentabilidadPorTipo(),
    getRentabilidadPorOrigen(),
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📊 Rentabilidad</h1>
        <p className="text-sm text-gray-500 mt-1">
          Descubre qué obras y canales te dan más dinero
        </p>
      </div>

      {/* Stats generales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard
          icon="💰"
          label="Total facturado"
          value={`${resumen.totalFacturado.toLocaleString("es-ES", { minimumFractionDigits: 0 })} €`}
          color="blue"
        />
        <StatCard
          icon="🧱"
          label="Total gastado"
          value={`${resumen.totalGastado.toLocaleString("es-ES", { minimumFractionDigits: 0 })} €`}
          color="orange"
        />
        <StatCard
          icon="📈"
          label="Margen neto"
          value={`${resumen.margenNeto.toLocaleString("es-ES", { minimumFractionDigits: 0 })} €`}
          color={resumen.margenNeto >= 0 ? "green" : "gray"}
        />
        <StatCard
          icon="🤝"
          label="Obras cerradas"
          value={resumen.leadsCerrados}
          color="gray"
        />
        <StatCard
          icon="🎯"
          label="Tasa cierre"
          value={`${resumen.tasaCierreGlobal}%`}
          color={resumen.tasaCierreGlobal >= 50 ? "green" : "gray"}
        />
      </div>

      {/* Rentabilidad por tipo de obra */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          💡 Rentabilidad por tipo de obra
        </h2>
        <TipoObraTable data={porTipo} />
      </div>

      {/* Rentabilidad por origen */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          📍 Rendimiento por canal
        </h2>
        <OrigenTable data={porOrigen} />
      </div>

      {/* Insights automáticos */}
      {porTipo.length > 0 && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Insight:</span> Tu obra más
            rentable es <span className="font-bold">{porTipo[0].tipo}</span> con{" "}
            {porTipo[0].margen.toLocaleString("es-ES", {
              minimumFractionDigits: 0,
            })}{" "}
            € de margen promedio.
          </p>
        </div>
      )}

      {porOrigen.length > 0 && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900">
            <span className="font-semibold">🎯 Insight:</span> Tu mejor canal es{" "}
            <span className="font-bold">{porOrigen[0].origen}</span> con{" "}
            {porOrigen[0].tasaCierre}% de tasa de cierre.
          </p>
        </div>
      )}
    </div>
  );
}

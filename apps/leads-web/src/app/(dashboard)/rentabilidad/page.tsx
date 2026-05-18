import {
  getResumenGeneral,
  getRentabilidadPorTipo,
  getRentabilidadPorObra,
} from "@/app/actions/rentabilidad";
import StatCard from "@/components/rentabilidad/StatCard";
import TipoObraTable from "@/components/rentabilidad/TipoObraTable";
import ObraRentabilidadTable from "@/components/rentabilidad/ObraRentabilidadTable";

export default async function RentabilidadPage() {
  const [resumen, porTipo, porObra] = await Promise.all([
    getResumenGeneral(),
    getRentabilidadPorTipo(),
    getRentabilidadPorObra(),
  ]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📊 Rentabilidad</h1>
        <p className="text-sm text-gray-500 mt-1">
          Descubre qué obras te dan más dinero
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

      {/* Obras cerradas individuales */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          🏗️ Obras cerradas
        </h2>
        <ObraRentabilidadTable data={porObra} />
      </div>

      {/* Rentabilidad por tipo de obra */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          💡 Rentabilidad por tipo de obra
        </h2>
        <TipoObraTable data={porTipo} />
      </div>
    </div>
  );
}

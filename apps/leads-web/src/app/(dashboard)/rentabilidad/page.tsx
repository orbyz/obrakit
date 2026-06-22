import {
  getResumenGeneral,
  getRentabilidadPorTipo,
  getRentabilidadPorObra,
} from "@/app/actions/rentabilidad";
import StatCard from "@/components/ui/stat-card/StatCard";
import TipoObraTable from "@/components/rentabilidad/TipoObraTable";
import ObraRentabilidadTable from "@/components/rentabilidad/ObraRentabilidadTable";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import { Euro, Package, TrendingUp, Handshake, Target } from "lucide-react";

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
        <PageHeader
          title="Rentabilidad"
          description="Descubre qué obras generan más beneficio"
        />
      </div>

      {/* Stats generales */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard
          icon={<Euro size={18} />}
          label="Total facturado"
          value={`${resumen.totalFacturado.toLocaleString("es-ES")} €`}
          variant="primary"
        />
        <StatCard
          icon={<Package size={18} />}
          label="Total gastado"
          value={`${resumen.totalGastado.toLocaleString("es-ES", { minimumFractionDigits: 0 })} €`}
          variant="warning"
        />
        <StatCard
          icon={<TrendingUp size={18} />}
          label="Margen neto"
          value={`${resumen.margenNeto.toLocaleString("es-ES", { minimumFractionDigits: 0 })} €`}
          variant={resumen.margenNeto >= 0 ? "success" : "neutral"}
        />
        <StatCard
          icon={<Handshake size={18} />}
          label="Obras cerradas"
          value={resumen.leadsCerrados}
          variant="neutral"
        />
        <StatCard
          icon={<Target size={18} />}
          label="Tasa cierre"
          value={`${resumen.tasaCierreGlobal}%`}
          variant={resumen.tasaCierreGlobal >= 50 ? "success" : "neutral"}
        />
      </div>

      {/* Obras cerradas individuales */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-card mb-6">
        <h2 className="text-lg font-semibold text-text mb-4">Obras cerradas</h2>
        <ObraRentabilidadTable data={porObra} />
      </div>

      {/* Rentabilidad por tipo de obra */}
      <div className="bg-surface border border-border rounded-2xl p-6 shadow-card">
        <h2 className="text-lg font-semibold text-text mb-4">
          Rentabilidad por tipo de obra
        </h2>
        <TipoObraTable data={porTipo} />
      </div>
    </div>
  );
}

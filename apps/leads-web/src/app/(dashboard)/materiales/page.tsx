import { getGastos, getResumenGastos } from "@/app/actions/gastos";
import { getLeads } from "@/app/actions/leads";
import GastosClient from "@/components/gastos/GastosClient";
import { PageHeader } from "@/components/ui/page-header/PageHeader";
import StatCard from "@/components/ui/stat-card/StatCard";

export default async function MaterialesPage() {
  const [gastos, resumen, leadsPorEstado] = await Promise.all([
    getGastos(),
    getResumenGastos(),
    getLeads(),
  ]);

  const leads = Object.values(leadsPorEstado)
    .flat()
    .map((lead) => ({
      id: lead.id,
      nombre: lead.nombre,
    }));

  const categoriaPrincipal =
    Object.entries(resumen.porCategoria).sort((a, b) => b[1] - a[1])[0]?.[0] ??
    "—";

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader
        title="Materiales"
        description="Controla compras y gastos asociados a cada proyecto."
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
        <StatCard
          icon="📅"
          label="Este mes"
          value={`${resumen.totalMes.toLocaleString("es-ES")} €`}
          variant="primary"
        />

        <StatCard
          icon="🗓️"
          label="Este año"
          value={`${resumen.totalAnio.toLocaleString("es-ES")} €`}
          variant="warning"
        />

        <StatCard
          icon="🧱"
          label="Gastos registrados"
          value={gastos.length}
          variant="neutral"
        />

        <StatCard
          icon="📦"
          label="Categoría principal"
          value={categoriaPrincipal}
          variant="success"
        />
      </div>

      <GastosClient gastos={gastos} leads={leads} resumen={resumen} />
    </div>
  );
}

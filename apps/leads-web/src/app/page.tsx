import Link from "next/link";
import { Building2, Package, TrendingUp, AlertTriangle } from "lucide-react";

import StatCard from "@/components/ui/stat-card/StatCard";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-primary p-8 text-white shadow-elevated">
        <h1 className="text-3xl font-bold">Bienvenido a ObraKit</h1>

        <p className="mt-2 text-white/80">
          Gestiona tus obras, materiales y rentabilidad desde un único lugar.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Obras activas"
          value="8"
          variant="primary"
          icon={<Building2 size={18} />}
        />

        <StatCard
          label="Materiales"
          value="€2.300"
          variant="warning"
          icon={<Package size={18} />}
        />

        <StatCard
          label="Rentabilidad"
          value="34%"
          variant="success"
          icon={<TrendingUp size={18} />}
        />

        <StatCard
          label="Alertas"
          value="3"
          variant="neutral"
          icon={<AlertTriangle size={18} />}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-text">
          Acciones rápidas
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/leads"
            className="rounded-2xl border border-border bg-surface p-6 shadow-card hover:shadow-elevated"
          >
            <h3 className="font-semibold text-primary">Obras</h3>
          </Link>

          <Link
            href="/materiales"
            className="rounded-2xl border border-border bg-surface p-6 shadow-card hover:shadow-elevated"
          >
            <h3 className="font-semibold text-primary">Materiales</h3>
          </Link>

          <Link
            href="/rentabilidad"
            className="rounded-2xl border border-border bg-surface p-6 shadow-card hover:shadow-elevated"
          >
            <h3 className="font-semibold text-primary">Rentabilidad</h3>
          </Link>
        </div>
      </section>
    </div>
  );
}

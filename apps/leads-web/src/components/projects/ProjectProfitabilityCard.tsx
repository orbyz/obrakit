import { Card } from "@/components/ui/card";
import type { ProjectProfitability } from "@/types/profitability";

interface ProjectProfitabilityCardProps {
  profitability: ProjectProfitability;
}

function formatCurrency(value: number): string {
  return value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatPercentage(value: number): string {
  return value.toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function ProjectProfitabilityCard({
  profitability,
}: ProjectProfitabilityCardProps) {
  const isProfitable = profitability.grossProfit >= 0;

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">
          Rentabilidad
        </h2>

        <p className="text-sm text-muted">
          Resumen económico de la obra
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <p className="text-sm text-muted">
            Presupuesto
          </p>

          <p className="text-xl font-semibold">
            {formatCurrency(profitability.revenue)} €
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted">
            Coste actual
          </p>

          <p className="text-xl font-semibold">
            {formatCurrency(profitability.totalCost)} €
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted">
            Beneficio
          </p>

          <p
            className={`text-xl font-semibold ${
              isProfitable
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formatCurrency(profitability.grossProfit)} €
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm text-muted">
            Margen
          </p>

          <p
            className={`text-xl font-semibold ${
              isProfitable
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {formatPercentage(profitability.margin)} %
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <p className="mb-3 text-sm font-medium">
          Desglose de costes
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted">
              Materiales
            </p>

            <p className="mt-2 text-lg font-semibold">
              {formatCurrency(profitability.materialCost)} €
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted">
              Mano de obra
            </p>

            <p className="mt-2 text-lg font-semibold">
              {formatCurrency(profitability.laborCost)} €
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <p className="text-sm text-muted">
              Gastos
            </p>

            <p className="mt-2 text-lg font-semibold">
              {formatCurrency(profitability.expenseCost)} €
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

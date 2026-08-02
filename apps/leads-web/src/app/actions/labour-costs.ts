"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  EmployeePricingModel,
  LabourCostProject,
  LabourCostSummary,
  LabourCostWorkLog,
} from "@/types";

interface LabourCostWorkLogRow {
  id: string;
  work_date: string;
  worked_minutes: number;
  pricing_model_snapshot: EmployeePricingModel | null;
  pricing_value_snapshot: number | null;
  obra: LabourCostProject | null;
}

function hasValidWorkedMinutes(workedMinutes: unknown): workedMinutes is number {
  return (
    typeof workedMinutes === "number" &&
    Number.isFinite(workedMinutes) &&
    workedMinutes > 0
  );
}

function hasValidPricingValue(pricingValue: unknown): pricingValue is number {
  return (
    typeof pricingValue === "number" &&
    Number.isFinite(pricingValue) &&
    pricingValue >= 0
  );
}

export async function getEmployeeLabourCost(
  employeeId: string,
): Promise<LabourCostSummary | null> {
  const supabase = await createClient();
  const { data: workLogData, error } = await supabase
    .from("employee_worklogs")
    .select(
      "id, work_date, worked_minutes, pricing_model_snapshot, pricing_value_snapshot, obra:leads(id, nombre)",
    )
    .eq("employee_id", employeeId)
    .order("work_date", { ascending: false });

  if (error) {
    return null;
  }

  const worklogs = ((workLogData ?? []) as unknown as LabourCostWorkLogRow[])
    .filter((workLog) => hasValidWorkedMinutes(workLog.worked_minutes))
    .map<LabourCostWorkLog>((workLog) => {
      const horas = workLog.worked_minutes / 60;
      const pricingValue = workLog.pricing_value_snapshot;
      const canCalculateCost =
        workLog.pricing_model_snapshot === "hourly" &&
        hasValidPricingValue(pricingValue);

      return {
        id: workLog.id,
        fecha: workLog.work_date,
        horas,
        coste: canCalculateCost ? horas * pricingValue : null,
        pricing_model: workLog.pricing_model_snapshot,
        obra: workLog.obra,
      };
    });
  const totalMinutes = worklogs.reduce(
    (total, workLog) => total + workLog.horas * 60,
    0,
  );
  const hasUncalculatedCost = worklogs.some((workLog) => workLog.coste === null);

  return {
    total_minutes: totalMinutes,
    total_hours: totalMinutes / 60,
    total_cost: hasUncalculatedCost
      ? null
      : worklogs.reduce((total, workLog) => total + (workLog.coste ?? 0), 0),
    worklogs,
  };
}

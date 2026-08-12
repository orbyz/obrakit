"use server";

import { getGastosByProject } from "./gastos";
import { getEmployeeAssignmentsByProject } from "./employee-assignments";
import { getEmployeeWorkLogsByProject } from "./employee-worklogs";
import { getMaterialConsumptions } from "./material-consumptions";
import { getProjectById } from "./projects";

import { calculateProjectProfitability } from "@/lib/profitability";
import { buildProjectFinancialData } from "@/lib/profitability-mappers";
import type { ProjectProfitability } from "@/types/profitability";

export interface ProjectDashboard {
  project: Awaited<ReturnType<typeof getProjectById>>;

  employeesCount: number;

  materialsCost: number;

  expensesCost: number;

  labourCost: number;

  profitability: ProjectProfitability;
}

export async function getProjectDashboard(
  id: string,
): Promise<ProjectDashboard | null> {
  const project = await getProjectById(id);

  if (!project) {
    return null;
  }

  const [
    assignments,
    materialConsumptions,
    workLogs,
    expenses,
  ] = await Promise.all([
    getEmployeeAssignmentsByProject(id),
    getMaterialConsumptions(id),
    getEmployeeWorkLogsByProject(id),
    getGastosByProject(id),
  ]);

  const financialData = buildProjectFinancialData(
    project,
    materialConsumptions,
    workLogs,
    expenses,
  );

  const profitability =
    calculateProjectProfitability(financialData);

  const employeeIds = new Set(
    assignments.map((assignment) => assignment.employee_id),
  );

  return {
    project,

    employeesCount: employeeIds.size,

    materialsCost: profitability.materialCost,

    expensesCost: profitability.expenseCost,

    labourCost: profitability.laborCost,

    profitability,
  };
}

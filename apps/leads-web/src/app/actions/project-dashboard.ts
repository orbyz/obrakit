"use server";

import { getProjectById } from "./projects";

export interface ProjectDashboard {
  project: Awaited<ReturnType<typeof getProjectById>>;

  employeesCount: number;

  materialsCost: number;

  expensesCost: number;

  labourCost: number;

  profitability: number;
}

export async function getProjectDashboard(
  id: string,
): Promise<ProjectDashboard | null> {
  const project = await getProjectById(id);

  if (!project) {
    return null;
  }

  return {
    project,

    employeesCount: 0,

    materialsCost: 0,

    expensesCost: 0,

    labourCost: 0,

    profitability: 0,
  };
}

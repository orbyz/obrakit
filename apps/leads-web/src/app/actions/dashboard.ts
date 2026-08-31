"use server";

import { getCRMOpportunities } from "./leads";
import { getProjects } from "./projects";
import { getProjectDashboard } from "./project-dashboard";
import { getEmployees } from "./employees";

import type { ProjectStatus } from "@/types/projects";

export interface DashboardData {
  leads: {
    total: number;
    new: number;
    inProgress: number;
    closed: number;
  };

  projects: {
    total: number;
    active: number;
    draft: number;
    planned: number;
    inProgress: number;
    paused: number;
    completed: number;
    cancelled: number;
  };

  team: {
     active: number;
   };

  financial: {
    revenue: number;
    costs: number;
    profit: number;
    margin: number;
  };

  activeProjects: Array<{
    id: string;
    name: string;
    clientName: string | null;
    status: ProjectStatus;
    budget: number | null;
  }>;
}

export async function getDashboardData(): Promise<DashboardData> {
  const [opportunities, projects, employees] = await Promise.all([
    getCRMOpportunities(),
    getProjects(),
    getEmployees(),
  ]);

  const leads = {
    total: opportunities.length,
    new: opportunities.filter(
      (opportunity) => opportunity.estado === "nuevo",
    ).length,
    inProgress: opportunities.filter(
      (opportunity) => opportunity.estado === "en_curso",
    ).length,
    closed: opportunities.filter(
      (opportunity) => opportunity.estado === "cerrado",
    ).length,
  };

  const projectsByStatus = {
    draft: projects.filter((project) => project.status === "draft").length,
    planned: projects.filter((project) => project.status === "planned").length,
    inProgress: projects.filter(
      (project) => project.status === "in_progress",
    ).length,
    paused: projects.filter((project) => project.status === "paused").length,
    completed: projects.filter(
      (project) => project.status === "completed",
    ).length,
    cancelled: projects.filter(
      (project) => project.status === "cancelled",
    ).length,
  };

  const activeEmployees = employees.filter(
    (employee) => employee.estado === "activo",
  ).length;

  const activeProjects = projects
    .filter(
      (project) =>
        project.status === "planned" ||
        project.status === "in_progress" ||
        project.status === "paused",
    )
    .map((project) => ({
      id: project.id,
      name: project.name,
      clientName: project.client_name,
      status: project.status,
      budget: project.approved_budget,
    }));

  const projectDashboards = await Promise.all(
    projects.map((project) => getProjectDashboard(project.id)),
  );

  const financial = projectDashboards
    .filter((dashboard) => dashboard !== null)
    .reduce(
      (summary, dashboard) => ({
        revenue: summary.revenue + dashboard.profitability.revenue,
        costs: summary.costs + dashboard.profitability.totalCost,
        profit: summary.profit + dashboard.profitability.grossProfit,
      }),
      {
        revenue: 0,
        costs: 0,
        profit: 0,
      },
    );

  return {
    leads,

    projects: {
      total: projects.length,
      active:
        projectsByStatus.planned +
        projectsByStatus.inProgress +
        projectsByStatus.paused,
      ...projectsByStatus,
    },
    team: {
      active: activeEmployees,
    },

    financial: {
      ...financial,
      margin:
        financial.revenue > 0
          ? (financial.profit / financial.revenue) * 100
          : 0,
    },

    activeProjects,
  };
}

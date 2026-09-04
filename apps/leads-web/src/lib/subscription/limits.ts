import { createClient } from "@/lib/supabase/server";
import { getCurrentPlan } from "@/lib/subscription/access";
import { getCurrentTenantId } from "@/lib/tenant/context";

export interface PlanLimits {
  activeProjects: number | null;
  activeEmployees: number | null;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  evaluation: {
    activeProjects: null,
    activeEmployees: null,
  },
  free: {
    activeProjects: null,
    activeEmployees: null,
  },
  starter: {
    activeProjects: 3,
    activeEmployees: 3,
  },
  pro: {
    activeProjects: 10,
    activeEmployees: 15,
  },
};

export async function getCurrentPlanLimits(): Promise<PlanLimits> {
  const plan = await getCurrentPlan();

  if (!plan) {
    return {
      activeProjects: 0,
      activeEmployees: 0,
    };
  }

  return (
    PLAN_LIMITS[plan.slug] ?? {
      activeProjects: 0,
      activeEmployees: 0,
    }
  );
}

export async function getActiveProjectsCount(): Promise<number> {
  const tenantId = await getCurrentTenantId();

  if (!tenantId) {
    return 0;
  }

  const supabase = await createClient();

  const { count, error } = await supabase
    .from("projects")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .in("status", ["draft", "planned", "in_progress", "paused"]);

  if (error) {
    throw new Error("No se pudo comprobar el límite de obras activas.");
  }

  return count ?? 0;
}

export async function getActiveEmployeesCount(): Promise<number> {
  const tenantId = await getCurrentTenantId();

  if (!tenantId) {
    return 0;
  }

  const supabase = await createClient();

  const { count, error } = await supabase
    .from("employees")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("estado", "activo");

  if (error) {
    throw new Error("No se pudo comprobar el límite de empleados activos.");
  }

  return count ?? 0;
}

export async function requireProjectCapacity() {
  const limits = await getCurrentPlanLimits();

  if (limits.activeProjects === null) {
    return {
      allowed: true,
      error: null,
    };
  }

  const activeProjects = await getActiveProjectsCount();

  if (activeProjects < limits.activeProjects) {
    return {
      allowed: true,
      error: null,
    };
  }

  return {
    allowed: false,
    error: `Has alcanzado el límite de ${limits.activeProjects} obras activas de tu plan.`,
  };
}

export async function requireEmployeeCapacity() {
  const limits = await getCurrentPlanLimits();

  if (limits.activeEmployees === null) {
    return {
      allowed: true,
      error: null,
    };
  }

  const activeEmployees = await getActiveEmployeesCount();

  if (activeEmployees < limits.activeEmployees) {
    return {
      allowed: true,
      error: null,
    };
  }

  return {
    allowed: false,
    error: `Has alcanzado el límite de ${limits.activeEmployees} empleados activos de tu plan.`,
  };
}

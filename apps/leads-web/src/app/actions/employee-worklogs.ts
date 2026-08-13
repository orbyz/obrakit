"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import type {
  Employee,
  EmployeeAssignment,
  EmployeePricingModel,
  EmployeeWorkLog,
} from "@/types";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface EmployeeWorkLogActionState {
  error: string | null;
  success: boolean;
}

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora no es válida");

const workLogTimeSchema = z.object({
  start_time: timeSchema,
  end_time: timeSchema,
  break_minutes: z.coerce
    .number()
    .int("El descanso debe ser un número entero")
    .min(0, "El descanso no puede ser negativo"),
  notes: z.string().optional(),
});

const employeeWorkLogSchema = workLogTimeSchema.extend({
  assignment_id: z.string().uuid("La asignación no es válida"),
  work_date: z.string().date("La fecha no es válida"),
});

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function getField(formData: FormData, name: string): string {
  return String(formData.get(name) ?? "");
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function getPricingSnapshot(
  employee: Pick<
    Employee,
    | "coste_hora"
    | "daily_rate"
    | "fixed_rate"
    | "hourly_rate"
    | "monthly_salary"
    | "pricing_model"
  >,
): { model: EmployeePricingModel; value: number } | null {
  const model = employee.pricing_model ?? "hourly";

  const value =
    model === "hourly"
      ? employee.hourly_rate ?? employee.coste_hora
      : model === "daily"
        ? employee.daily_rate
        : model === "monthly"
          ? employee.monthly_salary
          : employee.fixed_rate;

  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    return null;
  }

  return {
    model,
    value,
  };
}

function calculateWorkedMinutes(
  startTime: string,
  endTime: string,
  breakMinutes: number,
): { error: string | null; workedMinutes: number | null } {
  const durationMinutes =
    timeToMinutes(endTime) - timeToMinutes(startTime);

  if (durationMinutes <= 0) {
    return {
      error: "La hora de fin debe ser posterior a la hora de inicio.",
      workedMinutes: null,
    };
  }

  if (breakMinutes >= durationMinutes) {
    return {
      error: "El descanso debe ser menor que la duración de la jornada.",
      workedMinutes: null,
    };
  }

  const workedMinutes = durationMinutes - breakMinutes;

  if (workedMinutes <= 0) {
    return {
      error: "La duración trabajada debe ser mayor que cero.",
      workedMinutes: null,
    };
  }

  return {
    error: null,
    workedMinutes,
  };
}

async function getMyTenantId(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  return data?.tenant_id ?? null;
}

// ─────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────

export async function getEmployeeWorkLogs(
  employeeId: string,
): Promise<EmployeeWorkLog[]> {
  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employee_worklogs")
    .select("*")
    .eq("employee_id", employeeId)
    .eq("tenant_id", tenantId)
    .order("work_date", { ascending: false })
    .order("start_time", { ascending: false });

  if (error) {
    throw new Error(`Error al obtener jornadas: ${error.message}`);
  }

  return (data ?? []) as EmployeeWorkLog[];
}

export async function getEmployeeWorkLogsByProject(
  projectId: string,
): Promise<EmployeeWorkLog[]> {
  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employee_worklogs")
    .select("*")
    .eq("project_id", projectId)
    .eq("tenant_id", tenantId)
    .order("work_date", { ascending: false })
    .order("start_time", { ascending: false });

  if (error) {
    throw new Error(
      `Error al obtener jornadas de la obra: ${error.message}`,
    );
  }

  return (data ?? []) as EmployeeWorkLog[];
}

// ─────────────────────────────────────────────────────────────
// Create
// ─────────────────────────────────────────────────────────────

export async function createEmployeeWorkLogAction(
  _prevState: EmployeeWorkLogActionState,
  formData: FormData,
): Promise<EmployeeWorkLogActionState> {
  const parsed = employeeWorkLogSchema.safeParse({
    assignment_id: getField(formData, "assignment_id"),
    work_date: getField(formData, "work_date"),
    start_time: getField(formData, "start_time"),
    end_time: getField(formData, "end_time"),
    break_minutes: getField(formData, "break_minutes"),
    notes: getField(formData, "notes"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
      success: false,
    };
  }

  const { error: durationError, workedMinutes } =
    calculateWorkedMinutes(
      parsed.data.start_time,
      parsed.data.end_time,
      parsed.data.break_minutes,
    );

  if (durationError || workedMinutes === null) {
    return {
      error: durationError,
      success: false,
    };
  }

  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      error: "No se encontró el negocio asociado",
      success: false,
    };
  }

  const admin = createAdminClient();

  const { data: assignmentData, error: assignmentError } =
    await admin
      .from("employee_assignments")
      .select("employee_id, project_id, status")
      .eq("id", parsed.data.assignment_id)
      .eq("tenant_id", tenantId)
      .single();

  if (assignmentError || !assignmentData) {
    return {
      error: "No se encontró la asignación",
      success: false,
    };
  }

  const assignment = assignmentData as Pick<
    EmployeeAssignment,
    "employee_id" | "project_id" | "status"
  >;

  if (assignment.status !== "active") {
    return {
      error:
        "Solo se pueden registrar jornadas en asignaciones activas.",
      success: false,
    };
  }

  const { data: employeeData, error: employeeError } =
    await admin
      .from("employees")
      .select(
        "coste_hora, pricing_model, hourly_rate, daily_rate, monthly_salary, fixed_rate",
      )
      .eq("id", assignment.employee_id)
      .eq("tenant_id", tenantId)
      .single();

  if (employeeError || !employeeData) {
    return {
      error: "No se encontró el empleado",
      success: false,
    };
  }

  const pricingSnapshot = getPricingSnapshot(
    employeeData as Pick<
      Employee,
      | "coste_hora"
      | "daily_rate"
      | "fixed_rate"
      | "hourly_rate"
      | "monthly_salary"
      | "pricing_model"
    >,
  );

  if (!pricingSnapshot) {
    return {
      error: "El empleado no tiene una tarifa válida configurada.",
      success: false,
    };
  }

  const { data: duplicateWorkLogs, error: duplicateError } =
    await admin
      .from("employee_worklogs")
      .select("id")
      .eq("assignment_id", parsed.data.assignment_id)
      .eq("tenant_id", tenantId)
      .eq("work_date", parsed.data.work_date)
      .limit(1);

  if (duplicateError) {
    return {
      error: "Error al comprobar jornadas duplicadas",
      success: false,
    };
  }

  if (duplicateWorkLogs && duplicateWorkLogs.length > 0) {
    return {
      error:
        "Ya existe una jornada para esta asignación en la fecha indicada.",
      success: false,
    };
  }

  const { error } = await admin
    .from("employee_worklogs")
    .insert({
      tenant_id: tenantId,
      assignment_id: parsed.data.assignment_id,
      employee_id: assignment.employee_id,
      project_id: assignment.project_id,
      work_date: parsed.data.work_date,
      start_time: parsed.data.start_time,
      end_time: parsed.data.end_time,
      break_minutes: parsed.data.break_minutes,
      worked_minutes: workedMinutes,
      pricing_model_snapshot: pricingSnapshot.model,
      pricing_value_snapshot: pricingSnapshot.value,
      notes: parsed.data.notes || null,
    });

  if (error) {
    return {
      error: error.message,
      success: false,
    };
  }

  revalidatePath(`/empleados/${assignment.employee_id}`);
  revalidatePath(`/obras/${assignment.project_id}`);

  return {
    error: null,
    success: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Update
// ─────────────────────────────────────────────────────────────

export async function updateEmployeeWorkLogAction(
  id: string,
  _prevState: EmployeeWorkLogActionState,
  formData: FormData,
): Promise<EmployeeWorkLogActionState> {
  const parsed = workLogTimeSchema.safeParse({
    start_time: getField(formData, "start_time"),
    end_time: getField(formData, "end_time"),
    break_minutes: getField(formData, "break_minutes"),
    notes: getField(formData, "notes"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0].message,
      success: false,
    };
  }

  const { error: durationError, workedMinutes } =
    calculateWorkedMinutes(
      parsed.data.start_time,
      parsed.data.end_time,
      parsed.data.break_minutes,
    );

  if (durationError || workedMinutes === null) {
    return {
      error: durationError,
      success: false,
    };
  }

  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      error: "No se encontró el negocio asociado",
      success: false,
    };
  }

  const admin = createAdminClient();

  const { data, error: workLogError } = await admin
    .from("employee_worklogs")
    .select("employee_id, project_id")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (workLogError || !data) {
    return {
      error: "No se encontró la jornada",
      success: false,
    };
  }

  const workLog = data as Pick<
    EmployeeWorkLog,
    "employee_id" | "project_id"
  >;

  const { error } = await admin
    .from("employee_worklogs")
    .update({
      start_time: parsed.data.start_time,
      end_time: parsed.data.end_time,
      break_minutes: parsed.data.break_minutes,
      worked_minutes: workedMinutes,
      notes: parsed.data.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    return {
      error: "Error al actualizar la jornada",
      success: false,
    };
  }

  revalidatePath(`/empleados/${workLog.employee_id}`);
  revalidatePath(`/obras/${workLog.project_id}`);
  return {
    error: null,
    success: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Delete
// ─────────────────────────────────────────────────────────────

export async function deleteEmployeeWorkLogAction(
  id: string,
): Promise<EmployeeWorkLogActionState> {
  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return {
      error: "No se encontró el negocio asociado",
      success: false,
    };
  }

  const admin = createAdminClient();

  const { data, error: workLogError } = await admin
    .from("employee_worklogs")
    .select("employee_id, project_id")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (workLogError || !data) {
    return {
      error: "No se encontró la jornada",
      success: false,
    };
  }

  const workLog = data as Pick<
    EmployeeWorkLog,
    "employee_id" | "project_id"
  >;

  const { error } = await admin
    .from("employee_worklogs")
    .delete()
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    return {
      error: "Error al eliminar la jornada",
      success: false,
    };
  }

  revalidatePath(`/empleados/${workLog.employee_id}`);
  revalidatePath(`/obras/${workLog.project_id}`);

  return {
    error: null,
    success: true,
  };
}

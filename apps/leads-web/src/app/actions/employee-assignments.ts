"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { EmployeeAssignment, EmployeeAssignmentStatus } from "@/types";

import { requireActiveSubscription } from "@/lib/subscription/access";

export interface EmployeeAssignmentActionState {
  error: string | null;
  success: boolean;
}

const assignmentStatuses = [
  "planned",
  "active",
  "paused",
  "finished",
  "cancelled",
] as const;

const assignmentStatusSchema = z.enum(assignmentStatuses);

const allowedStatusTransitions: Record<
  EmployeeAssignmentStatus,
  EmployeeAssignmentStatus[]
> = {
  planned: ["active"],
  active: ["paused", "finished"],
  paused: ["active"],
  finished: [],
  cancelled: [],
};

const timeSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora no es válida");

const employeeAssignmentSchema = z
  .object({
    employee_id: z.string().uuid("El empleado no es válido"),
    project_id: z.string().uuid("La obra no es válida"),
    role: z.string().trim().min(1, "El rol es obligatorio"),
    status: z.enum(assignmentStatuses),
    start_date: z.string().date("La fecha de inicio no es válida"),
    end_date: z.string().date("La fecha de fin no es válida").or(z.literal("")),
    work_days: z
      .array(z.coerce.number().int().min(1).max(7))
      .min(1, "Selecciona al menos un día laborable"),
    default_start_time: timeSchema.or(z.literal("")),
    default_end_time: timeSchema.or(z.literal("")),
    default_break_minutes: z.coerce
      .number()
      .int("El descanso debe ser un número entero")
      .min(0, "El descanso no puede ser negativo"),
    hourly_rate_snapshot: z
      .string()
      .refine(
        (value) =>
          !value ||
          (Number.isFinite(Number(value)) && Number(value) >= 0),
        "La tarifa por hora no es válida",
      ),
    notes: z.string().optional(),
  })
  .refine(
    (data) => !data.end_date || data.end_date >= data.start_date,
    {
      message: "La fecha de fin no puede ser anterior a la fecha de inicio",
      path: ["end_date"],
    },
  )
  .refine(
    (data) =>
      (!data.default_start_time && !data.default_end_time) ||
      (Boolean(data.default_start_time) && Boolean(data.default_end_time)),
    {
      message: "Indica inicio y fin del horario habitual, o deja ambos vacíos",
      path: ["default_end_time"],
    },
  )
  .refine(
    (data) =>
      !data.default_start_time ||
      !data.default_end_time ||
      data.default_end_time > data.default_start_time,
    {
      message: "La hora de fin debe ser posterior a la hora de inicio",
      path: ["default_end_time"],
    },
  );

async function getMyTenantId(): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .single();

  return data?.tenant_id ?? null;
}

export async function getEmployeeAssignments(
  employeeId: string,
): Promise<EmployeeAssignment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employee_assignments")
    .select("*, project:projects(name)")
    .eq("employee_id", employeeId)
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(`Error al obtener asignaciones: ${error.message}`);
  }

  return (data ?? []) as EmployeeAssignment[];
}

export async function getEmployeeAssignmentsByProject(
  projectId: string,
): Promise<EmployeeAssignment[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("employee_assignments")
    .select("*, project:projects(name)")
    .eq("project_id", projectId)
    .neq("status", "cancelled")
    .order("start_date", { ascending: false });

  if (error) {
    throw new Error(
      `Error al obtener asignaciones de la obra: ${error.message}`,
    );
  }

  return (data ?? []) as EmployeeAssignment[];
}

export async function getProjectsForSelect(): Promise<
  Array<{ id: string; name: string }>
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id, name")
    .order("name", { ascending: true });

  if (error || !data) return [];

  return data as Array<{ id: string; name: string }>;
}

export async function getAssignmentById(
  id: string,
): Promise<EmployeeAssignment | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employee_assignments")
    .select("*, project:projects(name)")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  return data as EmployeeAssignment;
}

export async function createEmployeeAssignmentAction(
  _prevState: EmployeeAssignmentActionState,
  formData: FormData,
): Promise<EmployeeAssignmentActionState> {
  const getField = (name: string) => String(formData.get(name) ?? "");
  const parsed = employeeAssignmentSchema.safeParse({
    employee_id: getField("employee_id"),
    project_id: getField("project_id"),
    role: getField("role"),
    status: getField("status") || "planned",
    start_date: getField("start_date"),
    end_date: getField("end_date"),
    work_days: formData.getAll("work_days"),
    default_start_time: getField("default_start_time"),
    default_end_time: getField("default_end_time"),
    default_break_minutes: getField("default_break_minutes") || "0",
    hourly_rate_snapshot: getField("hourly_rate_snapshot"),
    notes: getField("notes"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message, success: false };
  }
  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return { error: "No se encontró el negocio asociado", success: false };
  }

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      error: subscription.error,
      success: false,
    };
  }

  const admin = createAdminClient();
  const endDate = parsed.data.end_date || null;
  const defaultStartTime = parsed.data.default_start_time || null;
  const defaultEndTime = parsed.data.default_end_time || null;

  const occupiesAssignment =
    parsed.data.status === "planned" ||
    parsed.data.status === "active" ||
    parsed.data.status === "paused";

  if (occupiesAssignment) {
    const { data, error } = await admin
      .from("employee_assignments")
      .select("start_date, end_date")
      .eq("tenant_id", tenantId)
      .eq("employee_id", parsed.data.employee_id)
      .eq("project_id", parsed.data.project_id)
      .in("status", ["planned", "active", "paused"]);

    if (error) {
      return {
        error: "Error al comprobar las asignaciones existentes",
        success: false,
      };
    }

    const existingAssignments =
      (data as Pick<
        EmployeeAssignment,
        "start_date" | "end_date"
      >[] | null) ?? [];

    const assignmentEndDate = endDate ?? "9999-12-31";

    const hasOverlap = existingAssignments.some(
      (assignment) =>
        assignment.start_date <= assignmentEndDate &&
        (assignment.end_date === null ||
          assignment.end_date >= parsed.data.start_date),
    );

    if (hasOverlap) {
      return {
        error:
          "El empleado ya tiene una asignación en esta obra durante ese periodo",
        success: false,
      };
    }
  }

  const { error } = await admin.from("employee_assignments").insert({
    tenant_id: tenantId,
    employee_id: parsed.data.employee_id,
    project_id: parsed.data.project_id,
    role: parsed.data.role,
    status: parsed.data.status,
    start_date: parsed.data.start_date,
    end_date: endDate,
    work_days: parsed.data.work_days,
    default_start_time: defaultStartTime,
    default_end_time: defaultEndTime,
    default_break_minutes: parsed.data.default_break_minutes,
    hourly_rate_snapshot: parsed.data.hourly_rate_snapshot
      ? Number(parsed.data.hourly_rate_snapshot)
      : null,
    notes: parsed.data.notes || null,
  });

  if (error) {
    return { error: "Error al crear la asignación", success: false };
  }

  revalidatePath("/empleados");
  revalidatePath(`/empleados/${parsed.data.employee_id}`);

  return { error: null, success: true };
}

export async function updateEmployeeAssignmentStatusAction(
  id: string,
  status: EmployeeAssignmentStatus,
): Promise<EmployeeAssignmentActionState> {
  const parsedStatus = assignmentStatusSchema.safeParse(status);

  if (!parsedStatus.success) {
    return { error: "El estado de asignación no es válido", success: false };
  }

  const tenantId = await getMyTenantId();

  if (!tenantId) {
    return { error: "No se encontró el negocio asociado", success: false };
  }

  const subscription = await requireActiveSubscription();

  if (!subscription.allowed) {
    return {
      error: subscription.error,
      success: false,
    };
  }

  const admin = createAdminClient();
  const { data, error: assignmentError } = await admin
    .from("employee_assignments")
    .select("employee_id, status")
    .eq("id", id)
    .eq("tenant_id", tenantId)
    .single();

  if (assignmentError || !data) {
    return { error: "No se encontró la asignación", success: false };
  }

  const assignment = data as Pick<EmployeeAssignment, "employee_id" | "status">;

  if (!allowedStatusTransitions[assignment.status].includes(parsedStatus.data)) {
    return { error: "La transición de estado no es válida", success: false };
  }

  const { error } = await admin
    .from("employee_assignments")
    .update({
      status: parsedStatus.data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("tenant_id", tenantId);

  if (error) {
    return { error: "Error al actualizar la asignación", success: false };
  }

  revalidatePath(`/empleados/${assignment.employee_id}`);

  return { error: null, success: true };
}

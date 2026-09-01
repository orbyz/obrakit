"use client";

import { useActionState, useEffect, useMemo, useState } from "react";

import {
  createEmployeeWorkWeekAction,
  type EmployeeWorkLogActionState,
} from "@/app/actions/employee-worklogs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/forms/Input";
import { Label } from "@/components/ui/forms/Label";
import { Select } from "@/components/ui/forms/Select";
import type { EmployeeAssignment } from "@/types";

import { useEmployeeFeedback } from "./EmployeeFeedback";


interface EmployeeWorkWeekDialogProps {
  assignments: EmployeeAssignment[];
  triggerLabel?: string;
}

const initialState: EmployeeWorkLogActionState = {
  error: null,
  success: false,
};

const weekDayLabels = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const shortWeekDayLabels = ["L", "M", "X", "J", "V", "S", "D"];

function parseDate(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addDays(date: string, days: number): string {
  const nextDate = parseDate(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);

  return formatDate(nextDate);
}

function getCurrentWeekStart(): string {
  const today = new Date();
  const utcDate = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const day = utcDate.getUTCDay() || 7;
  utcDate.setUTCDate(utcDate.getUTCDate() - day + 1);

  return formatDate(utcDate);
}

function formatTime(time: string | null | undefined, fallback: string): string {
  return time ? time.slice(0, 5) : fallback;
}

function formatWeekRange(weekStart: string): string {
  return `${weekStart} — ${addDays(weekStart, 6)}`;
}

function getDefaultSelectedDates(
  assignment: EmployeeAssignment | undefined,
  weekStart: string,
): string[] {
  if (!assignment) return [];

  const assignmentEndDate = assignment.end_date ?? "9999-12-31";

  return Array.from({ length: 7 }, (_, index) => {
    const date = addDays(weekStart, index);
    const isoWeekDay = index + 1;

    return {
      date,
      selected:
        assignment.work_days.includes(isoWeekDay) &&
        date >= assignment.start_date &&
        date <= assignmentEndDate,
    };
  })
    .filter((day) => day.selected)
    .map((day) => day.date);
}

function formatHabitualDays(workDays: number[]): string {
  return workDays
    .slice()
    .sort((a, b) => a - b)
    .map((day) => shortWeekDayLabels[day - 1])
    .join(" ");
}

function formatWorkedMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (remainder === 0) return `${hours} h`;

  return `${hours} h ${remainder.toString().padStart(2, "0")} min`;
}

function calculateWorkedMinutes(startTime: string, endTime: string, breakMinutes: number): number {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  return endHours * 60 + endMinutes - (startHours * 60 + startMinutes) - breakMinutes;
}

export function EmployeeWorkWeekDialog({
  assignments,
  triggerLabel = "Registrar jornada",
}: EmployeeWorkWeekDialogProps) {
  const [open, setOpen] = useState(false);
  const activeAssignments = assignments.filter(
    (assignment) => assignment.status === "active",
  );
  const [assignmentId, setAssignmentId] = useState(activeAssignments[0]?.id ?? "");
  const [weekStart, setWeekStart] = useState(getCurrentWeekStart);
  const selectedAssignment = activeAssignments.find(
    (assignment) => assignment.id === assignmentId,
  );
  const [selectedDates, setSelectedDates] = useState<string[]>(() =>
    getDefaultSelectedDates(selectedAssignment, weekStart),
  );
  const [startTime, setStartTime] = useState(() =>
    formatTime(selectedAssignment?.default_start_time, "08:00"),
  );
  const [endTime, setEndTime] = useState(() =>
    formatTime(selectedAssignment?.default_end_time, "17:00"),
  );
  const [breakMinutes, setBreakMinutes] = useState(
    () => selectedAssignment?.default_break_minutes ?? 60,
  );
  const { showError, showSuccess } = useEmployeeFeedback();
  const [state, formAction, pending] = useActionState(
    createEmployeeWorkWeekAction,
    initialState,
  );

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => ({
        date: addDays(weekStart, index),
        label: weekDayLabels[index],
      })),
    [weekStart],
  );
  const totalWorkedMinutes = Math.max(
    0,
    calculateWorkedMinutes(startTime, endTime, breakMinutes) * selectedDates.length,
  );


  useEffect(() => {
    if (state.success) {
      showSuccess("Semana registrada correctamente.");
      queueMicrotask(() => setOpen(false));
      return;
    }

    if (state.error) showError(state.error);
  }, [showError, showSuccess, state.error, state.success]);

  function toggleDate(date: string) {
    setSelectedDates((currentDates) =>
      currentDates.includes(date)
        ? currentDates.filter((currentDate) => currentDate !== date)
        : [...currentDates, date].sort(),
    );
  }

  function handleAssignmentChange(nextAssignmentId: string) {
    setAssignmentId(nextAssignmentId);

    const nextAssignment = activeAssignments.find(
      (assignment) => assignment.id === nextAssignmentId,
    );

    if (!nextAssignment) return;

    setSelectedDates(getDefaultSelectedDates(nextAssignment, weekStart));
    setStartTime(formatTime(nextAssignment.default_start_time, "08:00"));
    setEndTime(formatTime(nextAssignment.default_end_time, "17:00"));
    setBreakMinutes(nextAssignment.default_break_minutes ?? 60);
  }

  function handleWeekChange(nextWeekStart: string) {
    setWeekStart(nextWeekStart);
    setSelectedDates(getDefaultSelectedDates(selectedAssignment, nextWeekStart));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{triggerLabel}</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar jornada semanal</DialogTitle>
        </DialogHeader>

        {activeAssignments.length === 0 ? (
          <p className="text-sm text-muted">
            No existen asignaciones activas para registrar jornadas.
          </p>
        ) : (
          <form action={formAction} className="space-y-5">
            <div>
              <Label className="mb-1 block text-sm font-medium" htmlFor="assignment_id">
                Asignación
              </Label>
              <Select
                id="assignment_id"
                name="assignment_id"
                required
                value={assignmentId}
                onChange={(event) => handleAssignmentChange(event.target.value)}
              >
                {activeAssignments.map((assignment) => (
                  <option key={assignment.id} value={assignment.id}>
                    {assignment.project?.name ?? "Obra sin nombre"} · {assignment.role}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label className="mb-1 block text-sm font-medium" htmlFor="week_start">
                Semana
              </Label>
              <Input
                id="week_start"
                name="week_start"
                type="date"
                value={weekStart}
                onChange={(event) => handleWeekChange(event.target.value)}
                required
              />
              <p className="mt-1 text-xs text-muted">{formatWeekRange(weekStart)}</p>
            </div>

            {selectedAssignment && (
              <div className="rounded-xl border border-border bg-background p-4 text-sm">
                <p className="font-medium">
                  {selectedAssignment.project?.name ?? "Obra sin nombre"}
                </p>
                <p className="mt-1 text-muted">
                  {selectedAssignment.start_date} → {selectedAssignment.end_date ?? "sin fecha fin"}
                </p>
                <p className="mt-1 text-muted">
                  Días habituales: {formatHabitualDays(selectedAssignment.work_days)}
                </p>
              </div>
            )}

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="mb-1 block text-sm font-medium" htmlFor="start_time">
                  Inicio
                </Label>
                <Input
                  id="start_time"
                  name="start_time"
                  type="time"
                  value={startTime}
                  onChange={(event) => setStartTime(event.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="mb-1 block text-sm font-medium" htmlFor="end_time">
                  Fin
                </Label>
                <Input
                  id="end_time"
                  name="end_time"
                  type="time"
                  value={endTime}
                  onChange={(event) => setEndTime(event.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="mb-1 block text-sm font-medium" htmlFor="break_minutes">
                  Descanso
                </Label>
                <Input
                  id="break_minutes"
                  name="break_minutes"
                  type="number"
                  min="0"
                  value={breakMinutes}
                  onChange={(event) => setBreakMinutes(Number(event.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Días trabajados</p>
              <div className="space-y-2">
                {weekDays.map((day) => (
                  <label
                    key={day.date}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm"
                  >
                    <span>
                      {day.label} <span className="text-muted">{day.date}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-muted">
                        {selectedDates.includes(day.date) ? "Trabajado" : "No trabajado"}
                      </span>
                      <input
                        type="checkbox"
                        name="work_dates"
                        value={day.date}
                        checked={selectedDates.includes(day.date)}
                        onChange={() => toggleDate(day.date)}
                        className="h-4 w-4"
                      />
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-accent p-4 text-sm font-medium text-primary">
              Total previsto de la semana: {formatWorkedMinutes(totalWorkedMinutes)}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={pending || selectedDates.length === 0}>
                {pending ? "Registrando..." : "Confirmar semana"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

alter table public.employee_assignments
  add column if not exists work_days smallint[] not null default '{1,2,3,4,5}',
  add column if not exists default_start_time time,
  add column if not exists default_end_time time,
  add column if not exists default_break_minutes integer not null default 0;

alter table public.employee_assignments
  add constraint employee_assignments_work_days_valid
    check (
      work_days <@ array[1,2,3,4,5,6,7]::smallint[]
      and cardinality(work_days) > 0
    ),
  add constraint employee_assignments_default_time_order
    check (
      default_start_time is null
      or default_end_time is null
      or default_end_time > default_start_time
    ),
  add constraint employee_assignments_default_break_minutes_non_negative
    check (default_break_minutes >= 0);

comment on column public.employee_assignments.work_days is
  'Habitual working days for weekly worklog registration. ISO weekdays: 1 Monday through 7 Sunday.';
comment on column public.employee_assignments.default_start_time is
  'Habitual start time used to prefill weekly worklogs.';
comment on column public.employee_assignments.default_end_time is
  'Habitual end time used to prefill weekly worklogs.';
comment on column public.employee_assignments.default_break_minutes is
  'Habitual break minutes used to prefill weekly worklogs.';

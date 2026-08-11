alter table public.employee_assignments
  alter column status set default 'planned';
alter table public.employee_assignments
  add constraint employee_assignments_status_check
  check (status in ('planned', 'active', 'paused', 'finished', 'cancelled'));

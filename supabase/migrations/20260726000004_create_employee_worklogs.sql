create table public.employee_worklogs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  assignment_id uuid not null references public.employee_assignments(id) on delete restrict,
  employee_id uuid not null references public.employees(id) on delete restrict,
  project_id uuid not null references public.leads(id) on delete restrict,
  work_date date not null,
  start_time time not null,
  end_time time not null,
  break_minutes integer not null default 0,
  worked_minutes integer not null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employee_worklogs_end_time_after_start_time
    check (end_time > start_time),
  constraint employee_worklogs_break_minutes_non_negative
    check (break_minutes >= 0),
  constraint employee_worklogs_worked_minutes_positive
    check (worked_minutes > 0)
);

create index employee_worklogs_tenant_id_idx
  on public.employee_worklogs (tenant_id);
create index employee_worklogs_assignment_id_idx
  on public.employee_worklogs (assignment_id);
create index employee_worklogs_employee_id_idx
  on public.employee_worklogs (employee_id);
create index employee_worklogs_project_id_idx
  on public.employee_worklogs (project_id);
create index employee_worklogs_work_date_idx
  on public.employee_worklogs (work_date);

alter table public.employee_worklogs enable row level security;

create policy "employee_worklogs_select_same_tenant"
  on public.employee_worklogs
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = employee_worklogs.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );

create policy "employee_worklogs_insert_same_tenant"
  on public.employee_worklogs
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = employee_worklogs.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );

create policy "employee_worklogs_update_same_tenant"
  on public.employee_worklogs
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = employee_worklogs.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = employee_worklogs.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );

create policy "employee_worklogs_delete_same_tenant"
  on public.employee_worklogs
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = employee_worklogs.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );

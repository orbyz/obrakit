create table public.employee_assignments (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  employee_id uuid not null references public.employees(id) on delete restrict,
  project_id uuid not null,
  role text not null,
  status text not null default 'active',
  start_date date not null,
  end_date date,
  hourly_rate_snapshot numeric(12, 2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint employee_assignments_end_date_after_start_date
    check (end_date is null or end_date >= start_date)
);
create index employee_assignments_tenant_employee_idx
  on public.employee_assignments (tenant_id, employee_id);
create index employee_assignments_tenant_project_idx
  on public.employee_assignments (tenant_id, project_id);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  name text not null,
  reference text,
  client_name text,
  client_phone text,
  client_email text,
  address text,
  city text,
  postal_code text,
  planned_start_date date,
  planned_end_date date,
  actual_start_date date,
  actual_end_date date,
  approved_budget numeric,
  status text not null default 'draft',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_status_check
    check (status in ('draft', 'planned', 'in_progress', 'paused', 'completed', 'cancelled'))
);

create index projects_tenant_id_idx
  on public.projects (tenant_id);
create index projects_lead_id_idx
  on public.projects (lead_id);
create index projects_status_idx
  on public.projects (status);

alter table public.projects enable row level security;

create policy "projects_select_same_tenant"
  on public.projects
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = projects.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );

create policy "projects_insert_same_tenant"
  on public.projects
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = projects.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );

create policy "projects_update_same_tenant"
  on public.projects
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = projects.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = projects.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );

create policy "projects_delete_same_tenant"
  on public.projects
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = projects.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );

alter table public.employee_assignments enable row level security;
drop policy if exists "employee_assignments_select_same_tenant"
  on public.employee_assignments;
drop policy if exists "employee_assignments_insert_same_tenant"
  on public.employee_assignments;
drop policy if exists "employee_assignments_update_same_tenant"
  on public.employee_assignments;
drop policy if exists "employee_assignments_delete_same_tenant"
  on public.employee_assignments;
create policy "employee_assignments_select_same_tenant"
  on public.employee_assignments
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = employee_assignments.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );
create policy "employee_assignments_insert_same_tenant"
  on public.employee_assignments
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = employee_assignments.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );
create policy "employee_assignments_update_same_tenant"
  on public.employee_assignments
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = employee_assignments.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = employee_assignments.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );
create policy "employee_assignments_delete_same_tenant"
  on public.employee_assignments
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.tenant_members
      where tenant_members.tenant_id = employee_assignments.tenant_id
        and tenant_members.user_id = auth.uid()
    )
  );

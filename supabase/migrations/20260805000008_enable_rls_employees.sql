alter table public.employees
enable row level security;

create policy employees_select_same_tenant
on public.employees
for select
to authenticated
using (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = employees.tenant_id
          and tm.user_id = auth.uid()
    )
);

create policy employees_insert_same_tenant
on public.employees
for insert
to authenticated
with check (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = employees.tenant_id
          and tm.user_id = auth.uid()
    )
);

create policy employees_update_same_tenant
on public.employees
for update
to authenticated
using (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = employees.tenant_id
          and tm.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = employees.tenant_id
          and tm.user_id = auth.uid()
    )
);

create policy employees_delete_same_tenant
on public.employees
for delete
to authenticated
using (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = employees.tenant_id
          and tm.user_id = auth.uid()
    )
);

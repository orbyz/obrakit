alter table public.gastos
enable row level security;

create policy "gastos_select_same_tenant"
on public.gastos
for select
to authenticated
using (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = gastos.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "gastos_insert_same_tenant"
on public.gastos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = gastos.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "gastos_update_same_tenant"
on public.gastos
for update
to authenticated
using (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = gastos.tenant_id
      and tm.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = gastos.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "gastos_delete_same_tenant"
on public.gastos
for delete
to authenticated
using (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = gastos.tenant_id
      and tm.user_id = auth.uid()
  )
);

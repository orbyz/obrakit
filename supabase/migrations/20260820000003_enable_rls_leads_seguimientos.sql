alter table public.leads
enable row level security;

create policy "leads_select_same_tenant"
on public.leads
for select
to authenticated
using (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = leads.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "leads_insert_same_tenant"
on public.leads
for insert
to authenticated
with check (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = leads.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "leads_update_same_tenant"
on public.leads
for update
to authenticated
using (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = leads.tenant_id
      and tm.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = leads.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "leads_delete_same_tenant"
on public.leads
for delete
to authenticated
using (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = leads.tenant_id
      and tm.user_id = auth.uid()
  )
);


alter table public.seguimientos
enable row level security;

create policy "seguimientos_select_same_tenant"
on public.seguimientos
for select
to authenticated
using (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = seguimientos.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "seguimientos_insert_same_tenant"
on public.seguimientos
for insert
to authenticated
with check (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = seguimientos.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "seguimientos_update_same_tenant"
on public.seguimientos
for update
to authenticated
using (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = seguimientos.tenant_id
      and tm.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = seguimientos.tenant_id
      and tm.user_id = auth.uid()
  )
);

create policy "seguimientos_delete_same_tenant"
on public.seguimientos
for delete
to authenticated
using (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = seguimientos.tenant_id
      and tm.user_id = auth.uid()
  )
);

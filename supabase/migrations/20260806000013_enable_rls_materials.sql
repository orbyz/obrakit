alter table public.materials
enable row level security;

create policy materials_select_same_tenant
on public.materials
for select
to authenticated
using (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = materials.tenant_id
          and tm.user_id = auth.uid()
    )
);

create policy materials_insert_same_tenant
on public.materials
for insert
to authenticated
with check (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = materials.tenant_id
          and tm.user_id = auth.uid()
    )
);

create policy materials_update_same_tenant
on public.materials
for update
to authenticated
using (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = materials.tenant_id
          and tm.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = materials.tenant_id
          and tm.user_id = auth.uid()
    )
);

create policy materials_delete_same_tenant
on public.materials
for delete
to authenticated
using (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = materials.tenant_id
          and tm.user_id = auth.uid()
    )
);

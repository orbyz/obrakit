alter table public.material_consumptions
enable row level security;

create policy material_consumptions_select_same_tenant
on public.material_consumptions
for select
to authenticated
using (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = material_consumptions.tenant_id
          and tm.user_id = auth.uid()
    )
);

create policy material_consumptions_insert_same_tenant
on public.material_consumptions
for insert
to authenticated
with check (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = material_consumptions.tenant_id
          and tm.user_id = auth.uid()
    )
);

create policy material_consumptions_update_same_tenant
on public.material_consumptions
for update
to authenticated
using (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = material_consumptions.tenant_id
          and tm.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = material_consumptions.tenant_id
          and tm.user_id = auth.uid()
    )
);

create policy material_consumptions_delete_same_tenant
on public.material_consumptions
for delete
to authenticated
using (
    exists (
        select 1
        from public.tenant_members tm
        where tm.tenant_id = material_consumptions.tenant_id
          and tm.user_id = auth.uid()
    )
);

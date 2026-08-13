create unique index projects_tenant_lead_unique_idx
  on public.projects (tenant_id, lead_id)
  where lead_id is not null;

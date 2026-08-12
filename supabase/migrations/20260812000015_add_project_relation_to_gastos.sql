alter table public.gastos
  add column if not exists project_id uuid;

create index if not exists gastos_project_id_idx
  on public.gastos (project_id);

alter table public.gastos
  drop constraint if exists gastos_project_id_fkey;

alter table public.gastos
  add constraint gastos_project_id_fkey
  foreign key (project_id)
  references public.projects(id)
  on delete set null;

update public.gastos g
set project_id = p.id
from public.projects p
where g.project_id is null
  and g.lead_id is not null
  and p.lead_id = g.lead_id;

comment on column public.gastos.project_id is
  'Obra a la que pertenece el gasto. Los registros históricos no asociados a una obra permanecen con valor NULL.';

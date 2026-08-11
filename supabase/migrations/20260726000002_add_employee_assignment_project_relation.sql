alter table public.employee_assignments
  add constraint employee_assignments_project_id_fkey
  foreign key (project_id) references public.leads(id) on delete restrict;

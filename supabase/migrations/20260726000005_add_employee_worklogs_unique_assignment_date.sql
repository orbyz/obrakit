alter table public.employee_worklogs
  add constraint employee_worklogs_assignment_id_work_date_key
  unique (assignment_id, work_date);

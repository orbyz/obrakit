ALTER TABLE public.employee_worklogs
ADD CONSTRAINT employee_worklogs_assignment_work_date_unique
UNIQUE (assignment_id, work_date);

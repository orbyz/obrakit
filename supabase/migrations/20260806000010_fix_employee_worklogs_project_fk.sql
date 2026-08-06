ALTER TABLE employee_worklogs
DROP CONSTRAINT employee_worklogs_project_id_fkey;

ALTER TABLE employee_worklogs
ADD CONSTRAINT employee_worklogs_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES projects(id)
ON DELETE RESTRICT;

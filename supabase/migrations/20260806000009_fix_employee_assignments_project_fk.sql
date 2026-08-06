-- Eliminar la Foreign Key incorrecta
ALTER TABLE employee_assignments
DROP CONSTRAINT employee_assignments_project_id_fkey;

-- Crear la Foreign Key correcta
ALTER TABLE employee_assignments
ADD CONSTRAINT employee_assignments_project_id_fkey
FOREIGN KEY (project_id)
REFERENCES projects(id)
ON DELETE CASCADE;

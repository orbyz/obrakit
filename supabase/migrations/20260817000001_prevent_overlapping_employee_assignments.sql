create or replace function public.prevent_overlapping_employee_assignments()
returns trigger
language plpgsql
as $$
begin
  if new.status in ('planned', 'active', 'paused') then
    if exists (
      select 1
      from public.employee_assignments existing
      where existing.tenant_id = new.tenant_id
        and existing.employee_id = new.employee_id
        and existing.project_id = new.project_id
        and existing.status in ('planned', 'active', 'paused')
        and existing.id <> new.id
        and existing.start_date <= coalesce(new.end_date, '9999-12-31'::date)
        and coalesce(existing.end_date, '9999-12-31'::date) >= new.start_date
    ) then
      raise exception
        'El empleado ya tiene una asignación en esta obra durante ese periodo';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_overlapping_employee_assignments
on public.employee_assignments;

create trigger prevent_overlapping_employee_assignments
before insert or update of
  tenant_id,
  employee_id,
  project_id,
  status,
  start_date,
  end_date
on public.employee_assignments
for each row
execute function public.prevent_overlapping_employee_assignments();

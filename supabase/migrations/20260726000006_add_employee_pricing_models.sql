alter table public.employees
  add column if not exists pricing_model text,
  add column if not exists hourly_rate numeric,
  add column if not exists daily_rate numeric,
  add column if not exists monthly_salary numeric,
  add column if not exists fixed_rate numeric;

update public.employees
set
  pricing_model = coalesce(pricing_model, 'hourly'),
  hourly_rate = coalesce(hourly_rate, coste_hora);

alter table public.employees
  alter column pricing_model set default 'hourly',
  alter column pricing_model set not null,
  add constraint employees_pricing_model_check
    check (pricing_model in ('hourly', 'daily', 'monthly', 'fixed')),
  add constraint employees_pricing_rates_non_negative_check
    check (
      (hourly_rate is null or hourly_rate >= 0)
      and (daily_rate is null or daily_rate >= 0)
      and (monthly_salary is null or monthly_salary >= 0)
      and (fixed_rate is null or fixed_rate >= 0)
    );

comment on column public.employees.coste_hora is
  'Deprecated. Use pricing_model and hourly_rate instead.';

alter table public.employee_worklogs
  add column if not exists pricing_model_snapshot text,
  add column if not exists pricing_value_snapshot numeric,
  add constraint employee_worklogs_pricing_model_snapshot_check
    check (
      pricing_model_snapshot is null
      or pricing_model_snapshot in ('hourly', 'daily', 'monthly', 'fixed')
    ),
  add constraint employee_worklogs_pricing_value_snapshot_check
    check (
      pricing_value_snapshot is null or pricing_value_snapshot >= 0
    );

create or replace function public.require_employee_worklog_pricing_snapshot()
returns trigger
language plpgsql
as $$
begin
  if new.pricing_model_snapshot is null or new.pricing_value_snapshot is null then
    raise exception 'New worklogs require a pricing snapshot';
  end if;

  return new;
end;
$$;

create trigger employee_worklogs_require_pricing_snapshot
  before insert on public.employee_worklogs
  for each row
  execute function public.require_employee_worklog_pricing_snapshot();

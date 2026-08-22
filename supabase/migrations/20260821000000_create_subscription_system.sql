-- ============================================================
-- ObraKit — Subscription System
-- Migration: 20260821000000
--
-- Introduces the commercial subscription model:
--   plans → subscriptions → tenants
--
-- Existing multi-tenant architecture remains unchanged.
-- ============================================================

-- ============================================================
-- 1. Plans
-- ============================================================

create table public.plans (
  id uuid not null default gen_random_uuid(),

  slug text not null,
  nombre text not null,
  descripcion text,

  precio_mensual numeric(10, 2) not null default 0,
  precio_anual numeric(10, 2) not null default 0,

  trial_days integer not null default 0,

  activo boolean not null default true,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint plans_pkey
    primary key (id),

  constraint plans_slug_key
    unique (slug),

  constraint plans_slug_check
    check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),

  constraint plans_prices_check
    check (
      precio_mensual >= 0
      and precio_anual >= 0
    ),

  constraint plans_trial_days_check
    check (trial_days >= 0)
);

-- ============================================================
-- 2. Subscriptions
-- ============================================================

create table public.subscriptions (
  id uuid not null default gen_random_uuid(),

  tenant_id uuid not null,
  plan_id uuid not null,

  status text not null default 'trialing',
  billing_interval text,

  trial_started_at timestamptz,
  trial_ends_at timestamptz,

  current_period_start timestamptz,
  current_period_end timestamptz,

  canceled_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint subscriptions_pkey
    primary key (id),

  constraint subscriptions_tenant_id_fkey
    foreign key (tenant_id)
    references public.tenants(id)
    on delete cascade,

  constraint subscriptions_plan_id_fkey
    foreign key (plan_id)
    references public.plans(id),

  constraint subscriptions_tenant_id_key
    unique (tenant_id),

  constraint subscriptions_status_check
    check (
      status in (
        'trialing',
        'active',
        'past_due',
        'canceled',
        'expired'
      )
    ),

  constraint subscriptions_billing_interval_check
    check (
      billing_interval is null
      or billing_interval in ('monthly', 'yearly')
    ),

  constraint subscriptions_trial_dates_check
    check (
      status <> 'trialing'
      or (
        trial_started_at is not null
        and trial_ends_at is not null
        and trial_ends_at > trial_started_at
      )
    ),

  constraint subscriptions_period_dates_check
    check (
      current_period_end is null
      or (
        current_period_start is not null
        and current_period_end > current_period_start
      )
    )
);

-- ============================================================
-- 3. Indexes
-- ============================================================

create index subscriptions_plan_id_idx
  on public.subscriptions(plan_id);

create index subscriptions_status_idx
  on public.subscriptions(status);

-- ============================================================
-- 4. RLS — plans
-- ============================================================

alter table public.plans enable row level security;

create policy "plans_select_active"
on public.plans
for select
to anon, authenticated
using (
  activo = true
);

-- No INSERT / UPDATE / DELETE policies for application users.
-- Plan management remains server/admin controlled.

-- ============================================================
-- 5. RLS — subscriptions
-- ============================================================

alter table public.subscriptions enable row level security;

create policy "subscriptions_select_same_tenant"
on public.subscriptions
for select
to authenticated
using (
  exists (
    select 1
    from public.tenant_members tm
    where tm.tenant_id = subscriptions.tenant_id
      and tm.user_id = auth.uid()
  )
);

-- No direct INSERT / UPDATE / DELETE policies for authenticated
-- users. Subscription mutations will be performed server-side.

-- ============================================================
-- 6. Compatibility plan for existing tenants
-- ============================================================

insert into public.plans (
  slug,
  nombre,
  descripcion,
  precio_mensual,
  precio_anual,
  trial_days,
  activo
)
values (
  'free',
  'Free',
  'Plan técnico de compatibilidad para tenants existentes.',
  0,
  0,
  0,
  true
)
on conflict (slug) do nothing;

-- ============================================================
-- 7. Existing tenant migration
--
-- Current DEV tenant:
--   Reformas Jonathan
--   tenants.plan = free
--
-- It is NOT converted into a trial.
-- It receives an active compatibility subscription.
-- ============================================================

insert into public.subscriptions (
  tenant_id,
  plan_id,
  status
)
select
  t.id,
  p.id,
  'active'
from public.tenants t
join public.plans p
  on p.slug = 'free'
where t.plan = 'free'
on conflict (tenant_id) do nothing;

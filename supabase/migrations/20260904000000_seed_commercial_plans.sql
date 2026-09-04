-- ============================================================
-- ObraKit — Commercial Plans
-- Migration: 20260904000000
--
-- Seeds the commercial plans used for the initial launch:
--   Starter
--   Pro
--
-- Trial access remains handled by the technical evaluation plan.
-- Operational limits remain defined in the application layer.
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
values
  (
    'starter',
    'Starter',
    'Para profesionales y pequeños equipos que quieren organizar sus obras.',
    29.99,
    299.90,
    0,
    true
  ),
  (
    'pro',
    'Pro',
    'Para equipos que necesitan controlar costes, trabajo y rentabilidad.',
    59.99,
    599.90,
    0,
    true
  )
on conflict (slug) do nothing;

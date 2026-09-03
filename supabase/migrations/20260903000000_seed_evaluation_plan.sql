-- ============================================================
-- ObraKit — Evaluation Plan
-- Migration: 20260903000000
--
-- Adds the technical evaluation plan used for new tenants
-- during the trial period.
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
  'evaluation',
  'Evaluación',
  'Plan técnico utilizado durante el período de prueba.',
  0,
  0,
  7,
  true
)
on conflict (slug) do nothing;

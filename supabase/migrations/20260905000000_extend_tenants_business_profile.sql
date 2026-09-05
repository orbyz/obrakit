alter table public.tenants
  add column if not exists nombre_legal text,
  add column if not exists nombre_comercial text,
  add column if not exists tipo_entidad text,
  add column if not exists nif text,
  add column if not exists direccion text,
  add column if not exists codigo_postal text,
  add column if not exists ciudad text,
  add column if not exists provincia text,
  add column if not exists pais text,
  add column if not exists telefono text,
  add column if not exists email text,
  add column if not exists website text,
  add column if not exists updated_at timestamptz default now();

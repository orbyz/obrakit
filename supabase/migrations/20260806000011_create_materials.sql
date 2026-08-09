-- ============================================================
-- Sprint 10.2.1
-- Create Materials Catalog
-- ============================================================

create table if not exists public.materials (
    id uuid primary key default gen_random_uuid(),

    tenant_id uuid not null
        references public.tenants(id)
        on delete cascade,

    nombre text not null,

    descripcion text,

    categoria text not null
        check (
            categoria in (
                'albanileria',
                'ceramica',
                'fontaneria',
                'electricidad',
                'pintura',
                'carpinteria',
                'ferreteria',
                'aislamiento',
                'cubiertas',
                'yesos',
                'hormigon',
                'otro'
            )
        ),

    unidad_base text not null
        check (
            unidad_base in (
                'und',
                'm2',
                'ml',
                'kg',
                'lt',
                'sacos',
                'm3',
                'rollos',
                'cajas',
                'palets'
            )
        ),

    precio_habitual numeric(12,2)
        not null
        default 0
        check (precio_habitual >= 0),

    marca text,

    referencia text,

    activo boolean
        not null
        default true,

    created_at timestamptz
        not null
        default now(),

    updated_at timestamptz
        not null
        default now(),

    constraint materials_tenant_nombre_unique
        unique (tenant_id, nombre, descripcion)
);

-- ============================================================
-- Indexes
-- ============================================================

create index if not exists idx_materials_tenant
    on public.materials (tenant_id);

create index if not exists idx_materials_categoria
    on public.materials (categoria);

create index if not exists idx_materials_activo
    on public.materials (activo);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.materials
    enable row level security;

-- ============================================================
-- Sprint 10.2.2
-- Create Material Consumptions
-- ============================================================

create table if not exists public.material_consumptions (
    id uuid primary key default gen_random_uuid(),

    tenant_id uuid not null
        references public.tenants(id)
        on delete cascade,

    project_id uuid not null
        references public.projects(id)
        on delete cascade,

    material_id uuid not null
        references public.materials(id)
        on delete restrict,

    material_nombre_snapshot text not null,

    cantidad numeric(12,2)
        not null
        check (cantidad > 0),

    unidad_snapshot text not null
        check (
            unidad_snapshot in (
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

    precio_snapshot numeric(12,2)
        not null
        check (precio_snapshot >= 0),

    importe_total numeric(12,2)
        not null
        check (importe_total >= 0),

    fecha timestamptz
        not null
        default now(),

    notas text,

    created_by uuid
        references auth.users(id)
        on delete set null,

    created_at timestamptz
        not null
        default now(),

    updated_at timestamptz
        not null
        default now()
);

-- ============================================================
-- Indexes
-- ============================================================

create index if not exists idx_material_consumptions_tenant
    on public.material_consumptions (tenant_id);

create index if not exists idx_material_consumptions_project
    on public.material_consumptions (project_id);

create index if not exists idx_material_consumptions_material
    on public.material_consumptions (material_id);

create index if not exists idx_material_consumptions_fecha
    on public.material_consumptions (fecha);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.material_consumptions
    enable row level security;

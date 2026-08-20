alter table public.gastos
  drop constraint if exists gastos_categoria_check;

update public.gastos
set categoria = 'otros'
where categoria in (
  'ceramica',
  'fontaneria',
  'electricidad',
  'pintura',
  'otro'
);

alter table public.gastos
  add constraint gastos_categoria_check
  check (
    categoria is null
    or categoria = any (
      array[
        'combustible'::text,
        'transporte'::text,
        'dietas'::text,
        'contenedores'::text,
        'herramientas'::text,
        'alquiler'::text,
        'peajes'::text,
        'otros'::text
      ]
    )
  );

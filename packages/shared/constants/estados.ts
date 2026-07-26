export const ESTADOS_OBRA = ['nuevo', 'en_curso', 'cerrado'] as const;
export type EstadoObra = (typeof ESTADOS_OBRA)[number];

export const ESTADO_LABELS: Record<EstadoObra, string> = {
  nuevo: 'Nuevo',
  en_curso: 'En Curso',
  cerrado: 'Cerrado',
};

// Ajusta esta lista a las categorías reales que uses en `gastos.categoria`
export const CATEGORIAS_MATERIAL = [
  'ceramica',
  'fontaneria',
  'pintura',
  'electricidad',
  'carpinteria',
  'otros',
] as const;
export type CategoriaMaterial = (typeof CATEGORIAS_MATERIAL)[number];

// Debe coincidir exactamente con el check constraint `gastos_unidad_check` en Supabase
export const UNIDADES_GASTO = ['m2', 'ml', 'kg', 'ud', 'sacos', 'litros', 'otro'] as const;
export type UnidadGasto = (typeof UNIDADES_GASTO)[number];
export const TIPOS_OBRA = ['bano', 'cocina', 'pintura', 'integral', 'otro'] as const;
export type TipoObra = (typeof TIPOS_OBRA)[number];

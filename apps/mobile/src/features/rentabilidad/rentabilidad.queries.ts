import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export type RentabilidadObra = {
  id: string;
  nombre: string;
  tipo_obra: string | null;
  importe_cerrado: number;
  gastado: number;
  margen_eur: number;
  margen_pct: number;
};

// Si en la web este cálculo vive como vista SQL o función RPC, sustituye este
// select por `supabase.rpc('rentabilidad_por_obra')` para no duplicar lógica.
export function useRentabilidad() {
  return useQuery({
    queryKey: ['rentabilidad'],
    queryFn: async (): Promise<RentabilidadObra[]> => {
      const { data: obras, error: obrasError } = await supabase
        .from('leads')
        .select('id, nombre, tipo_obra, importe_cerrado')
        .eq('estado', 'cerrado')
        .not('importe_cerrado', 'is', null);
      if (obrasError) throw obrasError;

      const { data: gastos, error: gastosError } = await supabase
        .from('gastos')
        .select('lead_id, importe');
      if (gastosError) throw gastosError;

      return (obras ?? []).map((obra) => {
        const gastado = (gastos ?? [])
          .filter((g) => g.lead_id === obra.id)
          .reduce((sum, g) => sum + Number(g.importe), 0);
        const importe_cerrado = Number(obra.importe_cerrado ?? 0);
        const margen_eur = importe_cerrado - gastado;
        const margen_pct = importe_cerrado > 0 ? (margen_eur / importe_cerrado) * 100 : 0;
        return { ...obra, importe_cerrado, gastado, margen_eur, margen_pct };
      });
    },
  });
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export function useGastos(obraId: string) {
  return useQuery({
    queryKey: ['gastos', obraId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gastos')
        .select('*')
        .eq('lead_id', obraId)
        .order('fecha', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!obraId,
  });
}

type NuevoGasto = {
  lead_id: string;
  tenant_id: string;
  material: string;
  categoria?: string | null;
  cantidad?: number | null;
  unidad?: string | null;
  proveedor?: string | null;
  notas?: string | null;
  importe: number;
  fecha: string; // ISO date
};

export function useAddGasto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (gasto: NuevoGasto) => {
      const { error } = await supabase.from('gastos').insert(gasto);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['gastos', variables.lead_id] });
      // La rentabilidad depende de los gastos, así que también se invalida
      queryClient.invalidateQueries({ queryKey: ['rentabilidad'] });
    },
  });
}

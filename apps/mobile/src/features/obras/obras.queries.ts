import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { EstadoObra } from '@obrakit/shared/constants/estados';

const OBRAS_KEY = ['obras'] as const;

export function useObras() {
  return useQuery({
    queryKey: OBRAS_KEY,
    queryFn: async () => {
      // RLS filtra automáticamente por tenant_id vía get_my_tenants()
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useObra(id: string) {
  return useQuery({
    queryKey: ['obras', id],
    queryFn: async () => {
      const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateObraEstado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: EstadoObra }) => {
      const { error } = await supabase.from('leads').update({ estado }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBRAS_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useSeguimientos(obraId: string) {
  return useQuery({
    queryKey: ['seguimientos', obraId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('seguimientos')
        .select('*')
        .eq('lead_id', obraId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!obraId,
  });
}

export type ObraFormValues = {
  nombre: string;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  tipo_obra: string | null;
  origen: string | null;
  fecha_inicio: string | null; // 'YYYY-MM-DD'
  dias_estimados: number | null;
  fecha_fin_estimada: string | null; // 'YYYY-MM-DD', calculada
  importe_ofertado: number | null;
  importe_cerrado: number | null;
};

export function useCreateObra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ObraFormValues & { tenant_id: string; created_by: string }) => {
      const { data, error } = await supabase.from('leads').insert(payload).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OBRAS_KEY });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateObra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, values }: { id: string; values: ObraFormValues }) => {
      const { error } = await supabase.from('leads').update(values).eq('id', id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: OBRAS_KEY });
      queryClient.invalidateQueries({ queryKey: ['obras', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

type NuevoSeguimiento = {
  lead_id: string;
  tenant_id: string;
  created_by: string;
  descripcion: string;
  tipo?: string | null;
};

export function useAddSeguimiento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (seguimiento: NuevoSeguimiento) => {
      const { error } = await supabase.from('seguimientos').insert(seguimiento);
      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['seguimientos', variables.lead_id] });
    },
  });
}

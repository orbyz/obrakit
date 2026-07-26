import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';

export type AlertaObra = {
  id: string;
  nombre: string;
  fecha_fin_estimada: string;
  diasRestantes: number; // negativo = ya vencida
};

export type DashboardData = {
  obrasActivas: number;
  totalFacturado: number;
  totalGastadoCerradas: number;
  margenTotalEur: number;
  margenTotalPct: number;
  materialesTotalGastado: number;
  alertas: AlertaObra[];
};

function diasRestantesDesdeHoy(fechaISO: string): number {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [y, m, d] = fechaISO.split('-').map(Number);
  const fecha = new Date(y, m - 1, d);
  return Math.round((fecha.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
}

// Si en la web ya existe una vista SQL o función RPC para estos totales,
// conviene migrar esto a `supabase.rpc(...)` para no duplicar la lógica.
export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      const { data: obras, error: obrasError } = await supabase
        .from('leads')
        .select('id, nombre, estado, importe_cerrado, fecha_fin_estimada');
      if (obrasError) throw obrasError;

      const { data: gastos, error: gastosError } = await supabase.from('gastos').select('lead_id, importe');
      if (gastosError) throw gastosError;

      const gastosPorObra = new Map<string, number>();
      let materialesTotalGastado = 0;
      (gastos ?? []).forEach((g) => {
        const importe = Number(g.importe);
        materialesTotalGastado += importe;
        if (g.lead_id) {
          gastosPorObra.set(g.lead_id, (gastosPorObra.get(g.lead_id) ?? 0) + importe);
        }
      });

      const todas = obras ?? [];
      const obrasActivas = todas.filter((o) => o.estado !== 'cerrado').length;

      const cerradas = todas.filter((o) => o.estado === 'cerrado' && o.importe_cerrado != null);
      const totalFacturado = cerradas.reduce((sum, o) => sum + Number(o.importe_cerrado ?? 0), 0);
      const totalGastadoCerradas = cerradas.reduce((sum, o) => sum + (gastosPorObra.get(o.id) ?? 0), 0);
      const margenTotalEur = totalFacturado - totalGastadoCerradas;
      const margenTotalPct = totalFacturado > 0 ? (margenTotalEur / totalFacturado) * 100 : 0;

      const alertas: AlertaObra[] = todas
        .filter((o) => o.estado !== 'cerrado' && o.fecha_fin_estimada)
        .map((o) => ({
          id: o.id,
          nombre: o.nombre,
          fecha_fin_estimada: o.fecha_fin_estimada as string,
          diasRestantes: diasRestantesDesdeHoy(o.fecha_fin_estimada as string),
        }))
        .filter((o) => o.diasRestantes <= 7) // vencidas o a 7 días o menos
        .sort((a, b) => a.diasRestantes - b.diasRestantes);

      return {
        obrasActivas,
        totalFacturado,
        totalGastadoCerradas,
        margenTotalEur,
        margenTotalPct,
        materialesTotalGastado,
        alertas,
      };
    },
  });
}

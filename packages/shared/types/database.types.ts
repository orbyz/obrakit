export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      employee_assignments: {
        Row: {
          created_at: string
          default_break_minutes: number
          default_end_time: string | null
          default_start_time: string | null
          employee_id: string
          end_date: string | null
          hourly_rate_snapshot: number | null
          id: string
          notes: string | null
          project_id: string
          role: string
          start_date: string
          status: string
          tenant_id: string
          updated_at: string
          work_days: number[]
        }
        Insert: {
          created_at?: string
          default_break_minutes?: number
          default_end_time?: string | null
          default_start_time?: string | null
          employee_id: string
          end_date?: string | null
          hourly_rate_snapshot?: number | null
          id?: string
          notes?: string | null
          project_id: string
          role: string
          start_date: string
          status?: string
          tenant_id: string
          updated_at?: string
          work_days?: number[]
        }
        Update: {
          created_at?: string
          default_break_minutes?: number
          default_end_time?: string | null
          default_start_time?: string | null
          employee_id?: string
          end_date?: string | null
          hourly_rate_snapshot?: number | null
          id?: string
          notes?: string | null
          project_id?: string
          role?: string
          start_date?: string
          status?: string
          tenant_id?: string
          updated_at?: string
          work_days?: number[]
        }
        Relationships: [
          {
            foreignKeyName: "employee_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_assignments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_worklogs: {
        Row: {
          assignment_id: string
          break_minutes: number
          created_at: string
          employee_id: string
          end_time: string
          id: string
          notes: string | null
          pricing_model_snapshot: string | null
          pricing_value_snapshot: number | null
          project_id: string
          start_time: string
          tenant_id: string
          updated_at: string
          work_date: string
          worked_minutes: number
        }
        Insert: {
          assignment_id: string
          break_minutes?: number
          created_at?: string
          employee_id: string
          end_time: string
          id?: string
          notes?: string | null
          pricing_model_snapshot?: string | null
          pricing_value_snapshot?: number | null
          project_id: string
          start_time: string
          tenant_id: string
          updated_at?: string
          work_date: string
          worked_minutes: number
        }
        Update: {
          assignment_id?: string
          break_minutes?: number
          created_at?: string
          employee_id?: string
          end_time?: string
          id?: string
          notes?: string | null
          pricing_model_snapshot?: string | null
          pricing_value_snapshot?: number | null
          project_id?: string
          start_time?: string
          tenant_id?: string
          updated_at?: string
          work_date?: string
          worked_minutes?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_worklogs_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "employee_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_worklogs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_worklogs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_worklogs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          apellidos: string | null
          coste_hora: number | null
          created_at: string | null
          created_by: string | null
          daily_rate: number | null
          direccion: string | null
          email: string | null
          especialidad: string | null
          estado: string
          fecha_alta: string | null
          fixed_rate: number | null
          foto_url: string | null
          hourly_rate: number | null
          id: string
          monthly_salary: number | null
          nombre: string
          notas: string | null
          pricing_model: string
          salario_mensual: number | null
          telefono: string | null
          tenant_id: string | null
          tipo_contrato: string
          updated_at: string | null
        }
        Insert: {
          apellidos?: string | null
          coste_hora?: number | null
          created_at?: string | null
          created_by?: string | null
          daily_rate?: number | null
          direccion?: string | null
          email?: string | null
          especialidad?: string | null
          estado?: string
          fecha_alta?: string | null
          fixed_rate?: number | null
          foto_url?: string | null
          hourly_rate?: number | null
          id?: string
          monthly_salary?: number | null
          nombre: string
          notas?: string | null
          pricing_model?: string
          salario_mensual?: number | null
          telefono?: string | null
          tenant_id?: string | null
          tipo_contrato?: string
          updated_at?: string | null
        }
        Update: {
          apellidos?: string | null
          coste_hora?: number | null
          created_at?: string | null
          created_by?: string | null
          daily_rate?: number | null
          direccion?: string | null
          email?: string | null
          especialidad?: string | null
          estado?: string
          fecha_alta?: string | null
          fixed_rate?: number | null
          foto_url?: string | null
          hourly_rate?: number | null
          id?: string
          monthly_salary?: number | null
          nombre?: string
          notas?: string | null
          pricing_model?: string
          salario_mensual?: number | null
          telefono?: string | null
          tenant_id?: string | null
          tipo_contrato?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      gastos: {
        Row: {
          cantidad: number | null
          categoria: string | null
          created_at: string | null
          created_by: string | null
          fecha: string | null
          id: string
          importe: number
          lead_id: string | null
          material: string
          notas: string | null
          obra_nombre: string | null
          project_id: string | null
          proveedor: string | null
          tenant_id: string | null
          unidad: string | null
        }
        Insert: {
          cantidad?: number | null
          categoria?: string | null
          created_at?: string | null
          created_by?: string | null
          fecha?: string | null
          id?: string
          importe: number
          lead_id?: string | null
          material: string
          notas?: string | null
          obra_nombre?: string | null
          project_id?: string | null
          proveedor?: string | null
          tenant_id?: string | null
          unidad?: string | null
        }
        Update: {
          cantidad?: number | null
          categoria?: string | null
          created_at?: string | null
          created_by?: string | null
          fecha?: string | null
          id?: string
          importe?: number
          lead_id?: string | null
          material?: string
          notas?: string | null
          obra_nombre?: string | null
          project_id?: string | null
          proveedor?: string | null
          tenant_id?: string | null
          unidad?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gastos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gastos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string | null
          created_by: string | null
          dias_estimados: number | null
          direccion: string | null
          email: string | null
          estado: string | null
          fecha_fin_estimada: string | null
          fecha_inicio: string | null
          fecha_visita: string | null
          id: string
          importe_cerrado: number | null
          importe_ofertado: number | null
          motivo_perdida: string | null
          nombre: string
          notas: string | null
          origen: string | null
          telefono: string | null
          tenant_id: string | null
          tipo_obra: string | null
          updated_at: string | null
          zona: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          dias_estimados?: number | null
          direccion?: string | null
          email?: string | null
          estado?: string | null
          fecha_fin_estimada?: string | null
          fecha_inicio?: string | null
          fecha_visita?: string | null
          id?: string
          importe_cerrado?: number | null
          importe_ofertado?: number | null
          motivo_perdida?: string | null
          nombre: string
          notas?: string | null
          origen?: string | null
          telefono?: string | null
          tenant_id?: string | null
          tipo_obra?: string | null
          updated_at?: string | null
          zona?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          dias_estimados?: number | null
          direccion?: string | null
          email?: string | null
          estado?: string | null
          fecha_fin_estimada?: string | null
          fecha_inicio?: string | null
          fecha_visita?: string | null
          id?: string
          importe_cerrado?: number | null
          importe_ofertado?: number | null
          motivo_perdida?: string | null
          nombre?: string
          notas?: string | null
          origen?: string | null
          telefono?: string | null
          tenant_id?: string | null
          tipo_obra?: string | null
          updated_at?: string | null
          zona?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      material_consumptions: {
        Row: {
          cantidad: number
          created_at: string
          created_by: string | null
          fecha: string
          id: string
          importe_total: number
          material_id: string
          material_nombre_snapshot: string
          notas: string | null
          precio_snapshot: number
          project_id: string
          tenant_id: string
          unidad_snapshot: string
          updated_at: string
        }
        Insert: {
          cantidad: number
          created_at?: string
          created_by?: string | null
          fecha?: string
          id?: string
          importe_total: number
          material_id: string
          material_nombre_snapshot: string
          notas?: string | null
          precio_snapshot: number
          project_id: string
          tenant_id: string
          unidad_snapshot: string
          updated_at?: string
        }
        Update: {
          cantidad?: number
          created_at?: string
          created_by?: string | null
          fecha?: string
          id?: string
          importe_total?: number
          material_id?: string
          material_nombre_snapshot?: string
          notas?: string | null
          precio_snapshot?: number
          project_id?: string
          tenant_id?: string
          unidad_snapshot?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_consumptions_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_consumptions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_consumptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          activo: boolean
          categoria: string
          created_at: string
          descripcion: string | null
          id: string
          marca: string | null
          nombre: string
          precio_habitual: number
          referencia: string | null
          tenant_id: string
          unidad_base: string
          updated_at: string
        }
        Insert: {
          activo?: boolean
          categoria: string
          created_at?: string
          descripcion?: string | null
          id?: string
          marca?: string | null
          nombre: string
          precio_habitual?: number
          referencia?: string | null
          tenant_id: string
          unidad_base: string
          updated_at?: string
        }
        Update: {
          activo?: boolean
          categoria?: string
          created_at?: string
          descripcion?: string | null
          id?: string
          marca?: string | null
          nombre?: string
          precio_habitual?: number
          referencia?: string | null
          tenant_id?: string
          unidad_base?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "materials_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          activo: boolean
          created_at: string
          descripcion: string | null
          id: string
          nombre: string
          precio_anual: number
          precio_mensual: number
          slug: string
          trial_days: number
          updated_at: string
        }
        Insert: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre: string
          precio_anual?: number
          precio_mensual?: number
          slug: string
          trial_days?: number
          updated_at?: string
        }
        Update: {
          activo?: boolean
          created_at?: string
          descripcion?: string | null
          id?: string
          nombre?: string
          precio_anual?: number
          precio_mensual?: number
          slug?: string
          trial_days?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          actual_end_date: string | null
          actual_start_date: string | null
          address: string | null
          approved_budget: number | null
          city: string | null
          client_email: string | null
          client_name: string | null
          client_phone: string | null
          created_at: string
          id: string
          lead_id: string | null
          name: string
          notes: string | null
          planned_end_date: string | null
          planned_start_date: string | null
          postal_code: string | null
          reference: string | null
          status: string
          tenant_id: string
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          address?: string | null
          approved_budget?: number | null
          city?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          name: string
          notes?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          postal_code?: string | null
          reference?: string | null
          status?: string
          tenant_id: string
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          actual_start_date?: string | null
          address?: string | null
          approved_budget?: number | null
          city?: string | null
          client_email?: string | null
          client_name?: string | null
          client_phone?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          name?: string
          notes?: string | null
          planned_end_date?: string | null
          planned_start_date?: string | null
          postal_code?: string | null
          reference?: string | null
          status?: string
          tenant_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      seguimientos: {
        Row: {
          created_at: string | null
          created_by: string | null
          descripcion: string | null
          id: string
          lead_id: string | null
          tenant_id: string | null
          tipo: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          id?: string
          lead_id?: string | null
          tenant_id?: string | null
          tipo?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          id?: string
          lead_id?: string | null
          tenant_id?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seguimientos_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguimientos_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seguimientos_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_interval: string | null
          canceled_at: string | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          tenant_id: string
          trial_ends_at: string | null
          trial_started_at: string | null
          updated_at: string
        }
        Insert: {
          billing_interval?: string | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          tenant_id: string
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
        }
        Update: {
          billing_interval?: string | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          tenant_id?: string
          trial_ends_at?: string | null
          trial_started_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_members: {
        Row: {
          created_at: string | null
          id: string
          role: string | null
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tenant_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          nombre: string
          plan: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          nombre: string
          plan?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          nombre?: string
          plan?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_tenants: { Args: never; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const




SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."calcular_fecha_fin"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if new.fecha_inicio is not null and new.dias_estimados is not null then
    new.fecha_fin_estimada = new.fecha_inicio + (new.dias_estimados || ' days')::interval;
  else
    new.fecha_fin_estimada = null;
  end if;
  return new;
end;
$$;


ALTER FUNCTION "public"."calcular_fecha_fin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_my_tenants"() RETURNS SETOF "uuid"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  select tenant_id from tenant_members
  where user_id = auth.uid()
$$;


ALTER FUNCTION "public"."get_my_tenants"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."require_employee_worklog_pricing_snapshot"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  if new.pricing_model_snapshot is null or new.pricing_value_snapshot is null then
    raise exception 'New worklogs require a pricing snapshot';
  end if;

  return new;
end;
$$;


ALTER FUNCTION "public"."require_employee_worklog_pricing_snapshot"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."employee_assignments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "employee_id" "uuid" NOT NULL,
    "project_id" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "hourly_rate_snapshot" numeric(12,2),
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "employee_assignments_end_date_after_start_date" CHECK ((("end_date" IS NULL) OR ("end_date" >= "start_date")))
);


ALTER TABLE "public"."employee_assignments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employee_worklogs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "assignment_id" "uuid" NOT NULL,
    "employee_id" "uuid" NOT NULL,
    "project_id" "uuid" NOT NULL,
    "work_date" "date" NOT NULL,
    "start_time" time without time zone NOT NULL,
    "end_time" time without time zone NOT NULL,
    "break_minutes" integer DEFAULT 0 NOT NULL,
    "worked_minutes" integer NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "pricing_model_snapshot" "text",
    "pricing_value_snapshot" numeric,
    CONSTRAINT "employee_worklogs_break_minutes_non_negative" CHECK (("break_minutes" >= 0)),
    CONSTRAINT "employee_worklogs_end_time_after_start_time" CHECK (("end_time" > "start_time")),
    CONSTRAINT "employee_worklogs_pricing_model_snapshot_check" CHECK ((("pricing_model_snapshot" IS NULL) OR ("pricing_model_snapshot" = ANY (ARRAY['hourly'::"text", 'daily'::"text", 'monthly'::"text", 'fixed'::"text"])))),
    CONSTRAINT "employee_worklogs_pricing_value_snapshot_check" CHECK ((("pricing_value_snapshot" IS NULL) OR ("pricing_value_snapshot" >= (0)::numeric))),
    CONSTRAINT "employee_worklogs_worked_minutes_positive" CHECK (("worked_minutes" > 0))
);


ALTER TABLE "public"."employee_worklogs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "created_by" "uuid",
    "nombre" "text" NOT NULL,
    "apellidos" "text",
    "telefono" "text",
    "email" "text",
    "direccion" "text",
    "foto_url" "text",
    "especialidad" "text",
    "tipo_contrato" "text" DEFAULT 'empleado'::"text" NOT NULL,
    "estado" "text" DEFAULT 'activo'::"text" NOT NULL,
    "fecha_alta" "date",
    "coste_hora" numeric(10,2),
    "salario_mensual" numeric(10,2),
    "notas" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "pricing_model" "text" DEFAULT 'hourly'::"text" NOT NULL,
    "hourly_rate" numeric,
    "daily_rate" numeric,
    "monthly_salary" numeric,
    "fixed_rate" numeric,
    CONSTRAINT "employees_estado_check" CHECK (("estado" = ANY (ARRAY['activo'::"text", 'vacaciones'::"text", 'baja'::"text", 'inactivo'::"text"]))),
    CONSTRAINT "employees_pricing_model_check" CHECK (("pricing_model" = ANY (ARRAY['hourly'::"text", 'daily'::"text", 'monthly'::"text", 'fixed'::"text"]))),
    CONSTRAINT "employees_pricing_rates_non_negative_check" CHECK (((("hourly_rate" IS NULL) OR ("hourly_rate" >= (0)::numeric)) AND (("daily_rate" IS NULL) OR ("daily_rate" >= (0)::numeric)) AND (("monthly_salary" IS NULL) OR ("monthly_salary" >= (0)::numeric)) AND (("fixed_rate" IS NULL) OR ("fixed_rate" >= (0)::numeric)))),
    CONSTRAINT "employees_tipo_contrato_check" CHECK (("tipo_contrato" = ANY (ARRAY['empleado'::"text", 'autonomo'::"text", 'temporal'::"text", 'subcontrata'::"text"])))
);


ALTER TABLE "public"."employees" OWNER TO "postgres";


COMMENT ON COLUMN "public"."employees"."coste_hora" IS 'Deprecated. Use pricing_model and hourly_rate instead.';



CREATE TABLE IF NOT EXISTS "public"."gastos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "created_by" "uuid",
    "lead_id" "uuid",
    "obra_nombre" "text",
    "proveedor" "text",
    "material" "text" NOT NULL,
    "importe" numeric(10,2) NOT NULL,
    "cantidad" numeric(10,2),
    "unidad" "text",
    "categoria" "text",
    "notas" "text",
    "fecha" "date" DEFAULT CURRENT_DATE,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "gastos_categoria_check" CHECK (("categoria" = ANY (ARRAY['ceramica'::"text", 'fontaneria'::"text", 'electricidad'::"text", 'pintura'::"text", 'herramientas'::"text", 'otro'::"text"]))),
    CONSTRAINT "gastos_unidad_check" CHECK (("unidad" = ANY (ARRAY['m2'::"text", 'ml'::"text", 'kg'::"text", 'ud'::"text", 'sacos'::"text", 'litros'::"text", 'otro'::"text"])))
);


ALTER TABLE "public"."gastos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."leads" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "created_by" "uuid",
    "nombre" "text" NOT NULL,
    "telefono" "text",
    "zona" "text",
    "tipo_obra" "text",
    "origen" "text",
    "estado" "text" DEFAULT 'nuevo'::"text",
    "importe_ofertado" numeric(10,2),
    "importe_cerrado" numeric(10,2),
    "motivo_perdida" "text",
    "notas" "text",
    "fecha_visita" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "direccion" "text",
    "email" "text",
    "fecha_inicio" "date",
    "dias_estimados" integer,
    "fecha_fin_estimada" "date",
    CONSTRAINT "leads_estado_check" CHECK (("estado" = ANY (ARRAY['nuevo'::"text", 'en_curso'::"text", 'cerrado'::"text"]))),
    CONSTRAINT "leads_origen_check" CHECK (("origen" = ANY (ARRAY['whatsapp'::"text", 'instagram'::"text", 'recomendacion'::"text", 'web'::"text", 'otro'::"text"]))),
    CONSTRAINT "leads_tipo_obra_check" CHECK (("tipo_obra" = ANY (ARRAY['bano'::"text", 'cocina'::"text", 'pintura'::"text", 'integral'::"text", 'otro'::"text"])))
);


ALTER TABLE "public"."leads" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" "text",
    "phone" "text",
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid" NOT NULL,
    "lead_id" "uuid",
    "name" "text" NOT NULL,
    "reference" "text",
    "client_name" "text",
    "client_phone" "text",
    "client_email" "text",
    "address" "text",
    "city" "text",
    "postal_code" "text",
    "planned_start_date" "date",
    "planned_end_date" "date",
    "actual_start_date" "date",
    "actual_end_date" "date",
    "approved_budget" numeric,
    "status" "text" DEFAULT 'draft'::"text" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "projects_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'planned'::"text", 'in_progress'::"text", 'paused'::"text", 'completed'::"text", 'cancelled'::"text"])))
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."seguimientos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lead_id" "uuid",
    "tenant_id" "uuid",
    "created_by" "uuid",
    "tipo" "text",
    "descripcion" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "seguimientos_tipo_check" CHECK (("tipo" = ANY (ARRAY['llamada'::"text", 'whatsapp'::"text", 'visita'::"text", 'presupuesto'::"text", 'nota'::"text"])))
);


ALTER TABLE "public"."seguimientos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenant_members" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "tenant_id" "uuid",
    "user_id" "uuid",
    "role" "text" DEFAULT 'owner'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tenant_members" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."tenants" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "nombre" "text" NOT NULL,
    "plan" "text" DEFAULT 'free'::"text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."tenants" OWNER TO "postgres";


ALTER TABLE ONLY "public"."employee_assignments"
    ADD CONSTRAINT "employee_assignments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employee_worklogs"
    ADD CONSTRAINT "employee_worklogs_assignment_id_work_date_key" UNIQUE ("assignment_id", "work_date");



ALTER TABLE ONLY "public"."employee_worklogs"
    ADD CONSTRAINT "employee_worklogs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."gastos"
    ADD CONSTRAINT "gastos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."seguimientos"
    ADD CONSTRAINT "seguimientos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_members"
    ADD CONSTRAINT "tenant_members_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."tenant_members"
    ADD CONSTRAINT "tenant_members_tenant_id_user_id_key" UNIQUE ("tenant_id", "user_id");



ALTER TABLE ONLY "public"."tenants"
    ADD CONSTRAINT "tenants_pkey" PRIMARY KEY ("id");



CREATE INDEX "employee_assignments_tenant_employee_idx" ON "public"."employee_assignments" USING "btree" ("tenant_id", "employee_id");



CREATE INDEX "employee_assignments_tenant_project_idx" ON "public"."employee_assignments" USING "btree" ("tenant_id", "project_id");



CREATE INDEX "employee_worklogs_assignment_id_idx" ON "public"."employee_worklogs" USING "btree" ("assignment_id");



CREATE INDEX "employee_worklogs_employee_id_idx" ON "public"."employee_worklogs" USING "btree" ("employee_id");



CREATE INDEX "employee_worklogs_project_id_idx" ON "public"."employee_worklogs" USING "btree" ("project_id");



CREATE INDEX "employee_worklogs_tenant_id_idx" ON "public"."employee_worklogs" USING "btree" ("tenant_id");



CREATE INDEX "employee_worklogs_work_date_idx" ON "public"."employee_worklogs" USING "btree" ("work_date");



CREATE INDEX "gastos_fecha_idx" ON "public"."gastos" USING "btree" ("fecha");



CREATE INDEX "gastos_lead_id_idx" ON "public"."gastos" USING "btree" ("lead_id");



CREATE INDEX "gastos_tenant_id_idx" ON "public"."gastos" USING "btree" ("tenant_id");



CREATE INDEX "idx_employees_especialidad" ON "public"."employees" USING "btree" ("especialidad");



CREATE INDEX "idx_employees_estado" ON "public"."employees" USING "btree" ("estado");



CREATE INDEX "idx_employees_tenant" ON "public"."employees" USING "btree" ("tenant_id");



CREATE INDEX "projects_lead_id_idx" ON "public"."projects" USING "btree" ("lead_id");



CREATE INDEX "projects_status_idx" ON "public"."projects" USING "btree" ("status");



CREATE INDEX "projects_tenant_id_idx" ON "public"."projects" USING "btree" ("tenant_id");



CREATE OR REPLACE TRIGGER "employee_worklogs_require_pricing_snapshot" BEFORE INSERT ON "public"."employee_worklogs" FOR EACH ROW EXECUTE FUNCTION "public"."require_employee_worklog_pricing_snapshot"();



CREATE OR REPLACE TRIGGER "trigger_calcular_fecha_fin" BEFORE INSERT OR UPDATE ON "public"."leads" FOR EACH ROW EXECUTE FUNCTION "public"."calcular_fecha_fin"();



ALTER TABLE ONLY "public"."employee_assignments"
    ADD CONSTRAINT "employee_assignments_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."employee_assignments"
    ADD CONSTRAINT "employee_assignments_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."employee_assignments"
    ADD CONSTRAINT "employee_assignments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."employee_worklogs"
    ADD CONSTRAINT "employee_worklogs_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "public"."employee_assignments"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."employee_worklogs"
    ADD CONSTRAINT "employee_worklogs_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."employee_worklogs"
    ADD CONSTRAINT "employee_worklogs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."employee_worklogs"
    ADD CONSTRAINT "employee_worklogs_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."employees"
    ADD CONSTRAINT "employees_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."gastos"
    ADD CONSTRAINT "gastos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."gastos"
    ADD CONSTRAINT "gastos_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."gastos"
    ADD CONSTRAINT "gastos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."seguimientos"
    ADD CONSTRAINT "seguimientos_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id");



ALTER TABLE ONLY "public"."seguimientos"
    ADD CONSTRAINT "seguimientos_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."seguimientos"
    ADD CONSTRAINT "seguimientos_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_members"
    ADD CONSTRAINT "tenant_members_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."tenant_members"
    ADD CONSTRAINT "tenant_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE "public"."employee_assignments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "employee_assignments_delete_same_tenant" ON "public"."employee_assignments" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "employee_assignments"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "employee_assignments_insert_same_tenant" ON "public"."employee_assignments" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "employee_assignments"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "employee_assignments_select_same_tenant" ON "public"."employee_assignments" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "employee_assignments"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "employee_assignments_update_same_tenant" ON "public"."employee_assignments" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "employee_assignments"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "employee_assignments"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."employee_worklogs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "employee_worklogs_delete_same_tenant" ON "public"."employee_worklogs" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "employee_worklogs"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "employee_worklogs_insert_same_tenant" ON "public"."employee_worklogs" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "employee_worklogs"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "employee_worklogs_select_same_tenant" ON "public"."employee_worklogs" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "employee_worklogs"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "employee_worklogs_update_same_tenant" ON "public"."employee_worklogs" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "employee_worklogs"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "employee_worklogs"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."employees" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "employees_delete_same_tenant" ON "public"."employees" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members" "tm"
  WHERE (("tm"."tenant_id" = "employees"."tenant_id") AND ("tm"."user_id" = "auth"."uid"())))));



CREATE POLICY "employees_insert_same_tenant" ON "public"."employees" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenant_members" "tm"
  WHERE (("tm"."tenant_id" = "employees"."tenant_id") AND ("tm"."user_id" = "auth"."uid"())))));



CREATE POLICY "employees_select_same_tenant" ON "public"."employees" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members" "tm"
  WHERE (("tm"."tenant_id" = "employees"."tenant_id") AND ("tm"."user_id" = "auth"."uid"())))));



CREATE POLICY "employees_update_same_tenant" ON "public"."employees" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members" "tm"
  WHERE (("tm"."tenant_id" = "employees"."tenant_id") AND ("tm"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenant_members" "tm"
  WHERE (("tm"."tenant_id" = "employees"."tenant_id") AND ("tm"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."gastos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "gastos de mi tenant" ON "public"."gastos" USING (("tenant_id" IN ( SELECT "public"."get_my_tenants"() AS "get_my_tenants")));



ALTER TABLE "public"."leads" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "leads de mi tenant" ON "public"."leads" USING (("tenant_id" IN ( SELECT "public"."get_my_tenants"() AS "get_my_tenants")));



CREATE POLICY "miembros de mi tenant" ON "public"."tenant_members" USING (("tenant_id" IN ( SELECT "public"."get_my_tenants"() AS "get_my_tenants")));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "projects_delete_same_tenant" ON "public"."projects" FOR DELETE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "projects"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "projects_insert_same_tenant" ON "public"."projects" FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "projects"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "projects_select_same_tenant" ON "public"."projects" FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "projects"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



CREATE POLICY "projects_update_same_tenant" ON "public"."projects" FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "projects"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"()))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."tenant_members"
  WHERE (("tenant_members"."tenant_id" = "projects"."tenant_id") AND ("tenant_members"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."seguimientos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "seguimientos de mi tenant" ON "public"."seguimientos" USING (("tenant_id" IN ( SELECT "public"."get_my_tenants"() AS "get_my_tenants")));



CREATE POLICY "service role puede insertar profiles" ON "public"."profiles" FOR INSERT WITH CHECK (true);



CREATE POLICY "tenant propio" ON "public"."tenants" USING (("id" IN ( SELECT "public"."get_my_tenants"() AS "get_my_tenants")));



ALTER TABLE "public"."tenant_members" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."tenants" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "usuario edita su perfil" ON "public"."profiles" FOR UPDATE USING (("id" = "auth"."uid"()));



CREATE POLICY "usuario ve su perfil" ON "public"."profiles" FOR SELECT USING (("id" = "auth"."uid"()));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."calcular_fecha_fin"() TO "anon";
GRANT ALL ON FUNCTION "public"."calcular_fecha_fin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."calcular_fecha_fin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_my_tenants"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_my_tenants"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_my_tenants"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."require_employee_worklog_pricing_snapshot"() TO "anon";
GRANT ALL ON FUNCTION "public"."require_employee_worklog_pricing_snapshot"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."require_employee_worklog_pricing_snapshot"() TO "service_role";



GRANT ALL ON TABLE "public"."employee_assignments" TO "anon";
GRANT ALL ON TABLE "public"."employee_assignments" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_assignments" TO "service_role";



GRANT ALL ON TABLE "public"."employee_worklogs" TO "anon";
GRANT ALL ON TABLE "public"."employee_worklogs" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_worklogs" TO "service_role";



GRANT ALL ON TABLE "public"."employees" TO "anon";
GRANT ALL ON TABLE "public"."employees" TO "authenticated";
GRANT ALL ON TABLE "public"."employees" TO "service_role";



GRANT ALL ON TABLE "public"."gastos" TO "anon";
GRANT ALL ON TABLE "public"."gastos" TO "authenticated";
GRANT ALL ON TABLE "public"."gastos" TO "service_role";



GRANT ALL ON TABLE "public"."leads" TO "anon";
GRANT ALL ON TABLE "public"."leads" TO "authenticated";
GRANT ALL ON TABLE "public"."leads" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON TABLE "public"."seguimientos" TO "anon";
GRANT ALL ON TABLE "public"."seguimientos" TO "authenticated";
GRANT ALL ON TABLE "public"."seguimientos" TO "service_role";



GRANT ALL ON TABLE "public"."tenant_members" TO "anon";
GRANT ALL ON TABLE "public"."tenant_members" TO "authenticated";
GRANT ALL ON TABLE "public"."tenant_members" TO "service_role";



GRANT ALL ON TABLE "public"."tenants" TO "anon";
GRANT ALL ON TABLE "public"."tenants" TO "authenticated";
GRANT ALL ON TABLE "public"."tenants" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";








import { createClient } from "@/lib/supabase/server";

export async function getCurrentTenantId(): Promise<string | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("tenant_members")
    .select("tenant_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data?.tenant_id) {
    return null;
  }

  return data.tenant_id;
}

export async function getCurrentTenant() {
  const tenantId = await getCurrentTenantId();

  if (!tenantId) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tenants")
    .select("*")
    .eq("id", tenantId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getCurrentSubscription() {
  const tenantId = await getCurrentTenantId();

  if (!tenantId) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select(`
      *,
      plan:plans(*)
    `)
    .eq("tenant_id", tenantId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

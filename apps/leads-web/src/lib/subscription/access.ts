import { getCurrentSubscription } from "@/lib/tenant/context";

export async function getCurrentPlan() {
  const subscription = await getCurrentSubscription();

  if (!subscription?.plan) {
    return null;
  }

  return subscription.plan;
}

export async function hasActiveSubscription(): Promise<boolean> {
  const subscription = await getCurrentSubscription();

  if (!subscription) {
    return false;
  }

  return subscription.status === "active" || subscription.status === "trialing";
}

export async function hasPlan(planSlug: string): Promise<boolean> {
  const subscription = await getCurrentSubscription();

  if (!subscription?.plan) {
    return false;
  }

  return (
    (subscription.status === "active" ||
      subscription.status === "trialing") &&
    subscription.plan.slug === planSlug
  );
}

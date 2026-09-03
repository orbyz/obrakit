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

  if (subscription.status === "active") {
    return true;
  }

  if (subscription.status === "trialing") {
    if (!subscription.trial_ends_at) {
      return false;
    }

    return new Date(subscription.trial_ends_at) > new Date();
  }

  return false;
}

export async function hasPlan(planSlug: string): Promise<boolean> {
  const subscription = await getCurrentSubscription();

  if (!subscription?.plan) {
    return false;
  }

  if (subscription.status === "active") {
    return subscription.plan.slug === planSlug;
  }

  if (subscription.status === "trialing") {
    if (!subscription.trial_ends_at) {
      return false;
    }

    return (
      subscription.plan.slug === planSlug &&
      new Date(subscription.trial_ends_at) > new Date()
    );
  }

  return false;
}

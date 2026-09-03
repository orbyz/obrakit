import { getCurrentSubscription } from "@/lib/tenant/context";

export type CurrentSubscription = Awaited<
  ReturnType<typeof getCurrentSubscription>
>;

export function getTrialDaysRemaining(
  trialEndsAt: string | null,
): number {
  if (!trialEndsAt) {
    return 0;
  }

  const remainingMs = new Date(trialEndsAt).getTime() - Date.now();

  if (remainingMs <= 0) {
    return 0;
  }

  return Math.ceil(remainingMs / (1000 * 60 * 60 * 24));
}

export async function getCurrentPlan() {
  const subscription = await getCurrentSubscription();

  if (!subscription?.plan) {
    return null;
  }

  return subscription.plan;
}

export async function hasActiveSubscription(
  subscription?: CurrentSubscription,
): Promise<boolean> {
  const currentSubscription =
    subscription ?? (await getCurrentSubscription());

  if (!currentSubscription) {
    return false;
  }

  if (currentSubscription.status === "active") {
    return true;
  }

  if (currentSubscription.status === "trialing") {
    if (!currentSubscription.trial_ends_at) {
      return false;
    }

    return new Date(currentSubscription.trial_ends_at) > new Date();
  }

  return false;
}

export async function hasPlan(
  planSlug: string,
  subscription?: CurrentSubscription,
): Promise<boolean> {
  const currentSubscription =
    subscription ?? (await getCurrentSubscription());

  if (!currentSubscription?.plan) {
    return false;
  }

  if (currentSubscription.status === "active") {
    return currentSubscription.plan.slug === planSlug;
  }

  if (currentSubscription.status === "trialing") {
    if (!currentSubscription.trial_ends_at) {
      return false;
    }

    return (
      currentSubscription.plan.slug === planSlug &&
      new Date(currentSubscription.trial_ends_at) > new Date()
    );
  }

  return false;
}

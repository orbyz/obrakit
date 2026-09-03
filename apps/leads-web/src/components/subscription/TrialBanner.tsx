import { Badge } from "@/components/ui/badge";
import {
  getTrialDaysRemaining,
  type CurrentSubscription,
} from "@/lib/subscription/access";

interface TrialBannerProps {
  subscription: CurrentSubscription;
}

export function TrialBanner({ subscription }: TrialBannerProps) {
  if (
    !subscription ||
    subscription.status !== "trialing" ||
    !subscription.trial_ends_at
  ) {
    return null;
  }

  const daysRemaining = getTrialDaysRemaining(subscription.trial_ends_at);

  const trialMessage =
    daysRemaining <= 1
      ? "Tu período de evaluación termina mañana. Aprovecha hoy para probar ObraKit."
      : daysRemaining <= 3
        ? "Tu período de evaluación está por terminar. Aprovecha estos últimos días para probar ObraKit."
        : "Estás probando ObraKit. Aprovecha este período para conocer sus funcionalidades.";

  if (daysRemaining <= 0) {
    return null;
  }

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-primary/20 bg-surface px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-secondary">
            Período de evaluación
          </p>

          <Badge variant="primary" size="sm">
            {daysRemaining}{" "}
            {daysRemaining === 1 ? "día restante" : "días restantes"}
          </Badge>
        </div>

        <p className="mt-1 text-sm text-muted">{trialMessage}</p>
      </div>
    </div>
  );
}

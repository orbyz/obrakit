"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type FeedbackVariant = "success" | "error";

interface Feedback {
  message: string;
  variant: FeedbackVariant;
}

interface EmployeeFeedbackContextValue {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
}

const EmployeeFeedbackContext =
  createContext<EmployeeFeedbackContextValue | null>(null);

export function EmployeeFeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const showSuccess = useCallback((message: string) => {
    setFeedback({ message, variant: "success" });
  }, []);

  const showError = useCallback((message: string) => {
    setFeedback({ message, variant: "error" });
  }, []);

  useEffect(() => {
    if (!feedback) return;

    const timeoutId = window.setTimeout(() => setFeedback(null), 5000);

    return () => window.clearTimeout(timeoutId);
  }, [feedback]);

  return (
    <EmployeeFeedbackContext.Provider value={{ showError, showSuccess }}>
      {children}

      {feedback && (
        <div
          aria-live="polite"
          className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6"
        >
          <Alert
            variant={feedback.variant}
            className={cn(
              "pointer-events-auto flex w-full max-w-md items-center gap-3 border px-4 py-3 pr-2 shadow-elevated",
              feedback.variant === "success"
                ? "border-success bg-success text-white"
                : "border-danger bg-danger text-white",
            )}
          >
            {feedback.variant === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />
            ) : (
              <CircleAlert className="h-5 w-5 shrink-0" aria-hidden="true" />
            )}

            <span className="min-w-0 flex-1">{feedback.message}</span>

            <button
              type="button"
              onClick={() => setFeedback(null)}
              aria-label="Cerrar notificación"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/90 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </Alert>
        </div>
      )}
    </EmployeeFeedbackContext.Provider>
  );
}

export function useEmployeeFeedback() {
  const context = useContext(EmployeeFeedbackContext);

  if (!context) {
    throw new Error(
      "useEmployeeFeedback debe usarse dentro de EmployeeFeedbackProvider",
    );
  }

  return context;
}

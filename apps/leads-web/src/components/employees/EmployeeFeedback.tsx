"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { Alert } from "@/components/ui/alert";

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

  return (
    <EmployeeFeedbackContext.Provider value={{ showError, showSuccess }}>
      {children}

      {feedback && (
        <div aria-live="polite" className="fixed right-6 top-6 z-50 w-full max-w-sm">
          <Alert variant={feedback.variant}>{feedback.message}</Alert>
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

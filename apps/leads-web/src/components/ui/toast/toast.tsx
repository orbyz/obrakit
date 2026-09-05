"use client";

import { useEffect, useState } from "react";

import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

type ToastVariant = "error" | "success" | "warning" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastEventDetail {
  message: string;
  variant: ToastVariant;
}

const TOAST_EVENT = "obrakit:toast";

let toastId = 0;

function dispatchToast(
  message: string,
  variant: ToastVariant,
) {
  window.dispatchEvent(
    new CustomEvent<ToastEventDetail>(TOAST_EVENT, {
      detail: {
        message,
        variant,
      },
    }),
  );
}

export const toast = {
  error(message: string) {
    dispatchToast(message, "error");
  },

  success(message: string) {
    dispatchToast(message, "success");
  },

  warning(message: string) {
    dispatchToast(message, "warning");
  },

  info(message: string) {
    dispatchToast(message, "info");
  },
};

const variants: Record<ToastVariant, string> = {
  error: "border-danger bg-danger text-white",
  success: "border-success bg-success text-white",
  warning: "border-warning bg-warning text-white",
  info: "border-secondary bg-secondary text-white",
};

const icons: Record<
  ToastVariant,
  typeof CheckCircle2
> = {
  success: CheckCircle2,
  error: AlertCircle,
  warning: TriangleAlert,
  info: Info,
};

export function ToastViewport() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent =
        event as CustomEvent<ToastEventDetail>;

      const id = ++toastId;

      setToasts((current) => [
        ...current,
        {
          id,
          message: customEvent.detail.message,
          variant: customEvent.detail.variant,
        },
      ]);

      window.setTimeout(() => {
        setToasts((current) =>
          current.filter((toast) => toast.id !== id),
        );
      }, 4000);
    };

    window.addEventListener(TOAST_EVENT, handleToast);

    return () => {
      window.removeEventListener(TOAST_EVENT, handleToast);
    };
  }, []);

  function dismissToast(id: number) {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id),
    );
  }

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      aria-live="assertive"
      aria-atomic="true"
    >
      {toasts.map((toast) => {
        const Icon = icons[toast.variant];

        return (
          <div
            key={toast.id}
            role={toast.variant === "error" ? "alert" : "status"}
            className={cn(
              "flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl",
              variants[toast.variant],
            )}
          >
            <Icon
              className="mt-0.5 h-5 w-5 shrink-0"
              aria-hidden="true"
            />

            <p className="min-w-0 flex-1">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="shrink-0 rounded-md p-1 opacity-80 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-white/70"
              aria-label="Cerrar notificación"
            >
              <X
                className="h-4 w-4"
                aria-hidden="true"
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}

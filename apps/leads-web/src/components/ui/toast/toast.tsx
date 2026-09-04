"use client";

import { useEffect, useState } from "react";

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

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3"
      aria-live="assertive"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.variant === "error" ? "alert" : "status"}
          className={cn(
            "rounded-xl border px-4 py-3 text-sm font-medium shadow-xl",
            variants[toast.variant],
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import { logoutAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const INACTIVITY_TIMEOUT_MS = 60_000;
const COUNTDOWN_SECONDS = 30;

export function SessionManager() {
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(COUNTDOWN_SECONDS);
  const [isPending, startTransition] = useTransition();
  const inactivityTimeoutRef = useRef<number | null>(null);
  const countdownIntervalRef = useRef<number | null>(null);
  const isWarningOpenRef = useRef(false);
  const remainingSecondsRef = useRef(COUNTDOWN_SECONDS);

  const clearTimers = useCallback(() => {
    if (inactivityTimeoutRef.current !== null) {
      window.clearTimeout(inactivityTimeoutRef.current);
      inactivityTimeoutRef.current = null;
    }

    if (countdownIntervalRef.current !== null) {
      window.clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  }, []);

  const signOut = useCallback(() => {
    clearTimers();
    startTransition(async () => {
      await logoutAction();
    });
  }, [clearTimers, startTransition]);

  const startCountdown = useCallback(() => {
    isWarningOpenRef.current = true;
    remainingSecondsRef.current = COUNTDOWN_SECONDS;
    setRemainingSeconds(COUNTDOWN_SECONDS);
    setIsWarningOpen(true);

    countdownIntervalRef.current = window.setInterval(() => {
      remainingSecondsRef.current -= 1;
      setRemainingSeconds(remainingSecondsRef.current);

      if (remainingSecondsRef.current <= 0) {
        signOut();
      }
    }, 1_000);
  }, [signOut]);

  const resetInactivityTimer = useCallback(() => {
    if (isWarningOpenRef.current) return;

    if (inactivityTimeoutRef.current !== null) {
      window.clearTimeout(inactivityTimeoutRef.current);
    }

    inactivityTimeoutRef.current = window.setTimeout(
      startCountdown,
      INACTIVITY_TIMEOUT_MS,
    );
  }, [startCountdown]);

  const continueWorking = useCallback(() => {
    clearTimers();
    isWarningOpenRef.current = false;
    setIsWarningOpen(false);
    resetInactivityTimer();
  }, [clearTimers, resetInactivityTimer]);

  useEffect(() => {
    const activityEvents = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ] as const;

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer);
    });
    resetInactivityTimer();

    return () => {
      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, resetInactivityTimer);
      });
      clearTimers();
    };
  }, [clearTimers, resetInactivityTimer]);

  return (
    <Dialog
      open={isWarningOpen}
      onOpenChange={(open) => {
        if (open) setIsWarningOpen(true);
      }}
    >
      <DialogContent
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Sesión inactiva</DialogTitle>
          <DialogDescription>
            Por seguridad, tu sesión se cerrará automáticamente por inactividad.
          </DialogDescription>
        </DialogHeader>

        <p className="text-sm text-muted">
          Cierre automático en {remainingSeconds} segundos.
        </p>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={continueWorking}
            disabled={isPending}
          >
            Continuar trabajando
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={signOut}
            disabled={isPending}
          >
            {isPending ? "Saliendo..." : "Salir ahora"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

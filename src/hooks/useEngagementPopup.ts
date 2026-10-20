"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { DONATION_CONFIG } from "@/config/donation";

export type EngagementStep = "feedback" | "donation";

interface UseEngagementPopupOptions {
  timerSeconds?: number;
  sessionKey?: string;
  enabled?: boolean;
}

export function useEngagementPopup(options: UseEngagementPopupOptions = {}) {
  const {
    timerSeconds = DONATION_CONFIG.timerSeconds,
    sessionKey = DONATION_CONFIG.sessionStorageKey,
    enabled = true,
  } = options;

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<EngagementStep>("feedback");
  const hasInteractedRef = useRef(false);
  const isTriggeredRef = useRef(false);

  const markDismissed = useCallback(
    (reason: string) => {
      try {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(sessionKey, reason);
        }
      } catch (e) {
        // Handle private browsing or quota limits
      }
    },
    [sessionKey]
  );

  const isAlreadyDismissed = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        return !!sessionStorage.getItem(sessionKey);
      }
    } catch (e) {
      return false;
    }
    return false;
  }, [sessionKey]);

  const triggerModal = useCallback(() => {
    if (isTriggeredRef.current || isAlreadyDismissed()) return;
    isTriggeredRef.current = true;
    setStep("feedback");
    setIsOpen(true);
  }, [isAlreadyDismissed]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    markDismissed("dismissed");
  }, [markDismissed]);

  const handleFeedback = useCallback(
    (positive: boolean) => {
      if (positive) {
        // Transition to step 2 (donation screen)
        markDismissed("answered_positive");
        setStep("donation");
      } else {
        // User clicked "Not really": close immediately & mark dismissed for the session
        markDismissed("answered_negative");
        setIsOpen(false);
      }
    },
    [markDismissed]
  );

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return;

    if (isAlreadyDismissed()) return;

    // Check for instant test mode via query parameter: ?engagement_test=true
    const urlParams = new URLSearchParams(window.location.search);
    const isTestMode = urlParams.get("engagement_test") === "true";
    const targetMs = isTestMode ? 1500 : timerSeconds * 1000;

    let activeElapsedMs = 0;
    const intervalMs = 500;

    const onUserInteraction = () => {
      hasInteractedRef.current = true;
      if (activeElapsedMs >= targetMs) {
        triggerModal();
      }
    };

    const events = ["pointerdown", "keydown", "scroll", "touchstart", "mousemove"];
    events.forEach((evt) =>
      window.addEventListener(evt, onUserInteraction, {
        passive: true,
      })
    );

    const timer = setInterval(() => {
      // Only accumulate active time when tab is visible
      if (typeof document !== "undefined" && !document.hidden) {
        activeElapsedMs += intervalMs;
      }

      if (activeElapsedMs >= targetMs) {
        if (hasInteractedRef.current || isTestMode) {
          clearInterval(timer);
          triggerModal();
        }
      }
    }, intervalMs);

    return () => {
      clearInterval(timer);
      events.forEach((evt) =>
        window.removeEventListener(evt, onUserInteraction)
      );
    };
  }, [enabled, timerSeconds, triggerModal, isAlreadyDismissed]);

  return {
    isOpen,
    step,
    handleFeedback,
    handleClose,
    triggerModal,
  };
}

"use client";

import { useState, useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "acachete-intro-seen";

function getSnapshot(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useIntroState() {
  const hasSeenBefore = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const [introComplete, setIntroComplete] = useState(false);

  const isFirstVisit = !hasSeenBefore;
  const isReturnVisit = hasSeenBefore;

  const [isReplaying, setIsReplaying] = useState(false);

  const completeIntro = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // localStorage might be unavailable in private browsing
    }
    setIntroComplete(true);
    setIsReplaying(false);
  }, []);

  const replayIntro = useCallback(() => {
    setIntroComplete(false);
    setIsReplaying(true);
  }, []);

  return {
    introComplete,
    isFirstVisit,
    isReturnVisit,
    isReplaying,
    completeIntro,
    replayIntro,
  };
}

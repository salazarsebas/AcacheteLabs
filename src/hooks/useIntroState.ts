"use client";

import { useState, useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "acachete-intro-seen";

function getSnapshot(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

function getServerSnapshot(): boolean {
  return false;
}

function subscribe(callback: () => void): () => void {
  // sessionStorage doesn't have change events within the same tab,
  // but we subscribe to storage events for completeness
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

export function useIntroState() {
  const shouldSkip = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [introComplete, setIntroComplete] = useState(shouldSkip);

  const completeIntro = useCallback(() => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setIntroComplete(true);
  }, []);

  return { introComplete, shouldSkip, completeIntro };
}

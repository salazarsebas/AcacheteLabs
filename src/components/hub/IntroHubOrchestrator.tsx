"use client";

import { useIntroState } from "@/hooks/useIntroState";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { Hub } from "./Hub";

export function IntroHubOrchestrator() {
  const { introComplete, isReturnVisit, isReplaying, completeIntro, replayIntro } =
    useIntroState();
  const prefersReducedMotion = useReducedMotion();

  const skipEntirely = prefersReducedMotion;

  // During replay, always use full (non-compact) animation
  const showIntro = !skipEntirely && (!introComplete || isReplaying);
  const isCompact = isReturnVisit && !isReplaying;

  const revealMode: "instant" | "quick" | "cinematic" = skipEntirely
    ? "instant"
    : isCompact
      ? "quick"
      : "cinematic";

  return (
    <>
      {showIntro && (
        <IntroSequence onComplete={completeIntro} compact={isCompact} />
      )}
      <Hub
        visible={skipEntirely || (introComplete && !isReplaying)}
        revealMode={revealMode}
        onReplay={replayIntro}
      />
    </>
  );
}

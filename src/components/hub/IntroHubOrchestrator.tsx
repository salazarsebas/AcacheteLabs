"use client";

import { useIntroState } from "@/hooks/useIntroState";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { Hub } from "./Hub";

export function IntroHubOrchestrator() {
  const { introComplete, isReplaying, completeIntro, replayIntro } =
    useIntroState();
  const prefersReducedMotion = useReducedMotion();

  const skipEntirely = prefersReducedMotion;
  const showIntro = !skipEntirely && (!introComplete || isReplaying);
  const revealMode: "instant" | "quick" | "cinematic" = skipEntirely
    ? "instant"
    : "cinematic";

  return (
    <>
      {showIntro && <IntroSequence onComplete={completeIntro} />}
      <Hub
        visible={skipEntirely || (introComplete && !isReplaying)}
        revealMode={revealMode}
        onReplay={replayIntro}
      />
    </>
  );
}

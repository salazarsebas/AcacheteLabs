"use client";

import { useIntroState } from "@/hooks/useIntroState";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IntroSequence } from "@/components/intro/IntroSequence";
import { Hub } from "./Hub";

export function IntroHubOrchestrator() {
  const { introComplete, shouldSkip, completeIntro } = useIntroState();
  const prefersReducedMotion = useReducedMotion();

  const skipIntro = shouldSkip || prefersReducedMotion;

  return (
    <>
      {!skipIntro && !introComplete && (
        <IntroSequence onComplete={completeIntro} />
      )}
      <Hub visible={skipIntro || introComplete} />
    </>
  );
}

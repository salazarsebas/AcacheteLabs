import { Header } from "@/components/ui/Header";
import { CornerIndicator } from "@/components/decorative/CornerIndicator";
import { BlueprintGrid } from "@/components/decorative/BlueprintGrid";
import { CoordinateLabel } from "@/components/decorative/CoordinateLabel";
import { CADMarker } from "@/components/decorative/CADMarker";
import { MicroLabel } from "@/components/decorative/MicroLabel";
import { FloatingParticles } from "@/components/decorative/FloatingParticles";
import { WaveformSignal } from "@/components/decorative/WaveformSignal";
import { IntroHubOrchestrator } from "@/components/hub/IntroHubOrchestrator";

export default function Home() {
  return (
    <main className="relative bg-surface">
      <Header />
      <BlueprintGrid />
      <FloatingParticles />
      <WaveformSignal />

      {/* Fixed atmospheric overlays */}
      <div className="pointer-events-none fixed inset-0 z-10" aria-hidden="true">
        <CornerIndicator label="Calibration: Stable" position="top-right" />
        <CornerIndicator label="Runtime: Experimental" position="bottom-right" />
        <CornerIndicator label="Spec 01" position="bottom-left" />

        <CoordinateLabel x="0.25" y="0.20" className="left-[25%] top-[20%]" />
        <CoordinateLabel x="0.50" y="0.40" className="left-[50%] top-[40%]" />
        <CoordinateLabel x="0.75" y="0.60" className="left-[75%] top-[60%]" />

        <CADMarker className="left-[25%] top-[40%]" />
        <CADMarker className="left-[75%] top-[80%]" />

        <MicroLabel text="Layer 03" className="right-[15%] top-[35%]" staggerIndex={0} />
        <MicroLabel text="Node" className="left-[12%] bottom-[25%]" staggerIndex={1} />
      </div>

      <IntroHubOrchestrator />
    </main>
  );
}

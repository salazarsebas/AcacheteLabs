import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

gsap.defaults({
  ease: "power2.inOut",
  duration: 0.8,
});

export { gsap, ScrollTrigger };

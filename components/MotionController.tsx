"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const revealSelector = [
  "[data-reveal]",
  ".section-heading",
  ".demo-card",
  ".content-family-grid > a",
  ".creator-section > *",
  ".portfolio-evidence > *",
  ".standard-grid > article",
  ".path-grid > article",
  ".hub-hero > *",
  ".format-standard-grid > article",
  ".solution-layer-grid > article",
  ".case-type-grid > article",
  ".technology-grid > article",
  ".author-hero > *",
  ".author-statement > *",
  ".expertise-grid > article",
  ".author-approach li",
].join(",");

export default function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>(revealSelector));
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    document.documentElement.classList.add("motion-ready");
    elements.forEach((element, index) => {
      element.classList.add("reveal-target");
      element.style.setProperty("--reveal-delay", `${(index % 4) * 70}ms`);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, [pathname]);

  return null;
}

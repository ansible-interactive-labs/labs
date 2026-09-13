"use client";

import { useEffect, type MouseEvent as ReactMouseEvent, type ReactNode } from "react";

type EventValue = string | number | boolean;
type EventProperties = Record<string, EventValue>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: EventProperties }) => void;
  }
}

const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

export function trackLabEvent(event: string, properties: EventProperties = {}) {
  if (typeof window === "undefined") return;
  const privacyNavigator = navigator as Navigator & { globalPrivacyControl?: boolean };
  if (privacyNavigator.globalPrivacyControl || privacyNavigator.doNotTrack === "1") return;

  const detail = { event, properties, path: window.location.pathname };
  window.dispatchEvent(new CustomEvent("ratl:analytics", { detail }));
  window.plausible?.(event, { props: properties });

  if (!endpoint) return;
  const body = JSON.stringify(detail);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(endpoint, new Blob([body], { type: "application/json" }));
    return;
  }
  void fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true,
    credentials: "omit"
  }).catch(() => undefined);
}

export default function LabAnalytics({ hodId, slug }: { hodId: string; slug: string }) {
  useEffect(() => {
    trackLabEvent("hod_viewed", { hod_id: hodId, slug });

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-analytics-event]")
        : null;
      if (!target?.dataset.analyticsEvent) return;
      trackLabEvent(target.dataset.analyticsEvent, {
        hod_id: hodId,
        slug,
        ...(target.dataset.analyticsLabel ? { label: target.dataset.analyticsLabel } : {})
      });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [hodId, slug]);

  return null;
}

export function DemoStartLink({
  href,
  analyticsLabel,
  className,
  children
}: {
  href: string;
  analyticsLabel: string;
  className?: string;
  children: ReactNode;
}) {
  const startDemo = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    event.preventDefault();
    window.history.replaceState(window.history.state, "", href);
    target.scrollIntoView({ block: "start" });
    window.requestAnimationFrame(() => target.querySelector<HTMLButtonElement>(".start-lab-button")?.click());
  };

  return <a className={className} href={href} onClick={startDemo} data-analytics-event="installation_path_selected" data-analytics-label={analyticsLabel}>{children}</a>;
}

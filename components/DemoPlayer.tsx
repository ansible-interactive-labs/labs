"use client";

/* Native images keep screenshot URLs compatible with GitHub Pages project paths. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Lab } from "@/content/labs/types";
import TerminalReplay from "@/components/TerminalReplay";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const splitCommands = (value: string) => {
  const commands: string[] = [];
  let current: string[] = [];
  value.split("\n").forEach((line) => {
    current.push(line);
    if (!line.trimEnd().endsWith("\\")) {
      commands.push(current.join("\n"));
      current = [];
    }
  });
  if (current.length) commands.push(current.join("\n"));
  return commands;
};

export default function DemoPlayer({ lab }: { lab: Lab }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const playerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const hydratedRef = useRef(false);
  const step = lab.steps[stepIndex];
  const storageKey = `ansible-lab-progress:${lab.slug}`;

  useEffect(() => {
    let initialStep = 0;
    let savedCompleted = false;
    try {
      const queryStep = Number(new URLSearchParams(window.location.search).get("step"));
      const saved = window.localStorage.getItem(storageKey);
      if (Number.isInteger(queryStep) && queryStep >= 1 && queryStep <= lab.steps.length) {
        initialStep = queryStep - 1;
      } else if (saved) {
        const parsed = JSON.parse(saved) as { stepIndex?: number; completed?: boolean };
        if (typeof parsed.stepIndex === "number") initialStep = Math.min(Math.max(parsed.stepIndex, 0), lab.steps.length - 1);
        savedCompleted = Boolean(parsed.completed);
      }
    } catch {
      // Storage and query parsing are progressive enhancements.
    }
    const timer = window.setTimeout(() => {
      setStepIndex(initialStep);
      setCompleted(savedCompleted);
      hydratedRef.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [lab.steps.length, storageKey]);

  useEffect(() => {
    if (!hydratedRef.current) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ stepIndex, completed }));
      const url = new URL(window.location.href);
      url.searchParams.set("step", String(stepIndex + 1));
      window.history.replaceState({}, "", url);
    } catch {
      // The lab remains usable when storage is unavailable.
    }
    if (started) {
      const announceTimer = window.setTimeout(() => {
        setAnnouncement(`Step ${stepIndex + 1} of ${lab.steps.length}: ${step.title}`);
        titleRef.current?.focus({ preventScroll: true });
      }, 0);
      return () => window.clearTimeout(announceTimer);
    }
  }, [completed, lab.steps.length, started, step.title, stepIndex, storageKey]);

  useEffect(() => {
    if (!started) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [started]);

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === playerRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!started) return;
      if (event.key === "ArrowRight") setStepIndex((current) => Math.min(current + 1, lab.steps.length - 1));
      if (event.key === "ArrowLeft") setStepIndex((current) => Math.max(current - 1, 0));
      if (event.key === "Escape" && document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
      if (event.key === "Tab" && fullscreen && playerRef.current) {
        const focusable = Array.from(playerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'
        )).filter((element) => !element.hasAttribute("hidden"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [fullscreen, lab.steps.length, started]);

  const copyCommand = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setAnnouncement("Copy failed. Select the text manually.");
    }
  };

  const openFullscreen = async () => {
    try {
      await playerRef.current?.requestFullscreen();
    } catch {
      setAnnouncement("Fullscreen is not available in this browser. The demo remains fully usable.");
    }
  };

  const markComplete = () => {
    setCompleted(true);
    setStarted(false);
    setAnnouncement("Lab marked complete. Your progress is saved on this device.");
  };

  const startLab = () => {
    const startingStep = completed ? 0 : stepIndex;
    if (completed) {
      setStepIndex(0);
      setCompleted(false);
    }
    setStarted(true);
    setAnnouncement(`Lab started. Step ${startingStep + 1} of ${lab.steps.length}.`);
  };

  const resetProgress = () => {
    if (!window.confirm("Reset your saved progress for this lab?")) return;
    setStepIndex(0);
    setCompleted(false);
    try { window.localStorage.removeItem(storageKey); } catch { /* no-op */ }
    setAnnouncement("Progress reset.");
  };

  const issueTitle = encodeURIComponent(`[Lab feedback] ${lab.title} — step ${stepIndex + 1}`);
  const issueBody = encodeURIComponent(`Lab: ${lab.title}\nStep: ${stepIndex + 1} — ${step.title}\n\nWhat happened?\n\nWhat result did you expect?\n`);
  const issueUrl = `https://github.com/ansible-interactive-labs/labs/issues/new?title=${issueTitle}&body=${issueBody}`;

  return (
    <div className={`demo-player route-player${started ? " is-running" : ""}`} ref={playerRef} aria-label={`${lab.title} interactive demonstration`}>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      <header className="player-header">
        <div>
          <span className="player-kicker">Interactive demo</span>
          <strong>{lab.title}</strong>
        </div>
        <div className="player-tools">
          {started && <button type="button" onClick={openFullscreen} aria-label="Open demo in fullscreen">↗ <span>Fullscreen</span></button>}
          <Link href="/" aria-label="Return to demo library">×</Link>
        </div>
      </header>

      <div className="player-progress" style={{ gridTemplateColumns: `repeat(${lab.steps.length}, 1fr)` }} aria-label={`Step ${stepIndex + 1} of ${lab.steps.length}`}>
        {lab.steps.map((item, index) => (
          started ? (
            <button className={index === stepIndex ? "current" : index < stepIndex || completed ? "complete" : ""} type="button" key={item.label} onClick={() => setStepIndex(index)} aria-current={index === stepIndex ? "step" : undefined} aria-label={`Go to step ${index + 1}: ${item.label}`}>
              <span>{index < stepIndex || completed ? "✓" : index + 1}</span><small>{item.label}</small>
            </button>
          ) : (
            <div className="progress-step" key={item.label} aria-hidden="true"><span>{index + 1}</span><small>{item.label}</small></div>
          )
        ))}
      </div>

      {started ? <div className="player-stage">
        <div className="stage-media">
          {step.media?.type === "terminal" ? (
            <TerminalReplay
              key={step.media.source}
              source={step.media.source}
              transcript={step.media.transcript}
              title={step.title}
              fallbackImage={step.image}
              fallbackAlt={step.alt}
            />
          ) : (
            <img key={step.image} src={`${basePath}${step.image}`} alt={step.alt} />
          )}
          <span className="stage-number">{String(stepIndex + 1).padStart(2, "0")}</span>
          {step.media?.type !== "terminal" && <a className="image-link" href={`${basePath}${step.image}`} target="_blank" rel="noreferrer">Open full-size screenshot ↗</a>}
        </div>
        <aside className="stage-guide">
          <p className="step-label">Step {stepIndex + 1} of {lab.steps.length} · {step.label}</p>
          <h2 ref={titleRef} tabIndex={-1}>{step.title}</h2>
          <p className="explanation">{step.explanation}</p>
          {step.command && (
            <div className="command-block">
              <div><span>Run in your environment</span><button type="button" onClick={() => copyCommand(step.command ?? "")} aria-live="polite">{copied ? "Copied!" : "Copy"}</button></div>
              <pre tabIndex={0}><code>{splitCommands(step.command).map((command, index) => <span className="command-line" key={`${command}-${index}`}>{command}</span>)}</code></pre>
            </div>
          )}
          <div className="expected"><strong>Expected result</strong><p>{step.expected}</p></div>
          {step.note && <p className="step-note">ⓘ {step.note}</p>}
          <details className="step-troubleshooting">
            <summary>Result looks different?</summary>
            <p>{step.troubleshooting}</p>
          </details>
          <a className="step-feedback" href={issueUrl} target="_blank" rel="noreferrer">This step didn’t work? Report it ↗</a>
          <div className="stage-guide-utilities"><button type="button" onClick={resetProgress}>Reset progress</button><a href={issueUrl} target="_blank" rel="noreferrer">Report outdated content ↗</a></div>
        </aside>
      </div> : (
        <div className="player-ready">
          <div className="player-ready-visual"><img src={`${basePath}${lab.coverImage}`} alt={lab.coverAlt} /></div>
          <aside><p className="step-label">Ready when you are</p><h2>{lab.title}</h2><p>{lab.description}</p><ul>{lab.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></aside>
        </div>
      )}

      <footer className={`player-footer${started ? "" : " ready-footer"}`}>
        {!started ? <><span>Begin with step 1 and work at your own pace.</span><button className="player-next start-lab-button" type="button" onClick={startLab}>Start lab →</button></> : <>
          <button className="player-back" type="button" onClick={() => setStepIndex((current) => Math.max(current - 1, 0))} disabled={stepIndex === 0}>← Back</button>
          <span>Use ← → arrow keys to navigate</span>
          {stepIndex < lab.steps.length - 1 ? (
          <button className="player-next" type="button" onClick={() => setStepIndex((current) => Math.min(current + 1, lab.steps.length - 1))}>Next step →</button>
        ) : (
          <button className="player-next complete-button" type="button" onClick={markComplete}>Mark lab complete ✓</button>
        )}</>}
      </footer>
    </div>
  );
}

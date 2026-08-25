"use client";

/* Native images keep screenshot URLs compatible with GitHub Pages project paths. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Lab, LabDemo } from "@/content/labs/types";
import TerminalReplay from "@/components/TerminalReplay";
import { brand, formatHodNumber } from "@/lib/brand";

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

export default function DemoPlayer({ lab, demo }: { lab: Lab; demo: LabDemo }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const playerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const step = demo.steps[stepIndex];

  useEffect(() => {
    if (started) {
      const announceTimer = window.setTimeout(() => {
        setAnnouncement(`Step ${stepIndex + 1} of ${demo.steps.length}: ${step.title}`);
        titleRef.current?.focus({ preventScroll: true });
      }, 0);
      return () => window.clearTimeout(announceTimer);
    }
  }, [demo.steps.length, started, step.title, stepIndex]);

  useEffect(() => {
    if (!started && !completed) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [completed, started]);

  useEffect(() => {
    setFullscreenSupported(Boolean(playerRef.current?.requestFullscreen && document.exitFullscreen));
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === playerRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!started) return;
      if (event.key === "ArrowRight") setStepIndex((current) => Math.min(current + 1, demo.steps.length - 1));
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
  }, [demo.steps.length, fullscreen, started]);

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
    setAnnouncement("Demo complete. This session will reset when you leave or refresh the page.");
  };

  const startLab = () => {
    setStepIndex(0);
    setCompleted(false);
    setStarted(true);
    setAnnouncement(`Demo started. Step 1 of ${demo.steps.length}.`);
  };

  const resetProgress = () => {
    if (!window.confirm("Restart this demo from step 1?")) return;
    setStepIndex(0);
    setCompleted(false);
    setAnnouncement("Demo restarted at step 1.");
  };

  const issueTitle = encodeURIComponent(`[Lab feedback] ${lab.title} — step ${stepIndex + 1}`);
  const issueBody = encodeURIComponent(`Lab: ${lab.title}\nStep: ${stepIndex + 1} — ${step.title}\n\nWhat happened?\n\nWhat result did you expect?\n`);
  const issueUrl = `https://github.com/ansible-interactive-labs/labs/issues/new?title=${issueTitle}&body=${issueBody}`;

  return (
    <div className={`demo-player route-player${started || completed ? " is-running" : ""}`} ref={playerRef} aria-label={`${demo.title} interactive demonstration`}>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      <header className="player-header">
        <div>
          <span className="player-kicker">{formatHodNumber(lab.hodNumber)} · Demo module</span>
          <strong>{demo.title}</strong>
        </div>
        <div className="player-tools">
          {started && fullscreenSupported && <button type="button" onClick={openFullscreen} aria-label="Open demo in fullscreen">↗ <span>Fullscreen</span></button>}
          <Link href="/" aria-label="Return to demo library">×</Link>
        </div>
      </header>

      <div className="player-progress" style={{ gridTemplateColumns: `repeat(${demo.steps.length}, 1fr)` }} aria-label={`Step ${stepIndex + 1} of ${demo.steps.length}`}>
        {demo.steps.map((item, index) => (
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
          <p className="step-label">Step {stepIndex + 1} of {demo.steps.length} · {step.label}</p>
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
          <details className="demo-help">
            <summary>Demo troubleshooting guide</summary>
            <div>
              {demo.troubleshooting.map((item) => (
                <article key={item.title}>
                  <strong>{item.title}</strong>
                  <p>{item.detail}</p>
                  <pre tabIndex={0}><code>{item.command}</code></pre>
                </article>
              ))}
            </div>
          </details>
          <a className="step-feedback" href={issueUrl} target="_blank" rel="noreferrer">This step didn’t work? Report it ↗</a>
          <div className="stage-guide-utilities"><button type="button" onClick={resetProgress}>Restart demo</button><a href={issueUrl} target="_blank" rel="noreferrer">Report outdated content ↗</a></div>
        </aside>
      </div> : completed ? (
        <div className="player-complete">
          <div className="completion-mark" aria-hidden="true">✓</div>
          <aside>
            <p className="step-label">Outcome verified</p>
            <h2>Demo completed successfully</h2>
            <p>{demo.objective}</p>
            <ul>{demo.verification.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul>
            {demo.cleanup && (
              <details className="demo-cleanup">
                <summary>Optional cleanup</summary>
                <p>{demo.cleanup.explanation}</p>
                <pre tabIndex={0}><code>{demo.cleanup.command}</code></pre>
              </details>
            )}
          </aside>
        </div>
      ) : (
        <div className="player-ready">
          <div className="player-ready-visual"><img src={`${basePath}${lab.coverImage}`} alt={lab.coverAlt} /></div>
          <aside><p className="step-label">{formatHodNumber(lab.hodNumber)} · Ready when you are</p><h2>{demo.title}</h2><p>{demo.objective}</p><p className="player-creator">Created and verified by <a href={brand.linkedin} target="_blank" rel="noreferrer">{brand.creator} ↗</a></p><ul>{lab.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></aside>
        </div>
      )}

      <footer className={`player-footer${started ? "" : " ready-footer"}`}>
        {!started ? <><span>{completed ? "Verification complete. Run it again whenever you want." : `${brand.demoTagline} Every session begins fresh at step 1.`}</span><button className="player-next start-lab-button" type="button" onClick={startLab}>Start Demo</button></> : <>
          <button className="player-back" type="button" onClick={() => setStepIndex((current) => Math.max(current - 1, 0))} disabled={stepIndex === 0}>← Back</button>
          <span>Use ← → arrow keys to navigate</span>
          {stepIndex < demo.steps.length - 1 ? (
          <button className="player-next" type="button" onClick={() => setStepIndex((current) => Math.min(current + 1, demo.steps.length - 1))}>Next step →</button>
        ) : (
          <button className="player-next complete-button" type="button" onClick={markComplete}>Complete demo ✓</button>
        )}</>}
      </footer>
    </div>
  );
}

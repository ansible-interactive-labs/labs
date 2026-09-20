"use client";

/* Native images keep screenshot URLs compatible with static deployment paths. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import type { Lab, LabDemo } from "@/content/labs/types";
import TerminalReplay from "@/components/TerminalReplay";
import { trackLabEvent } from "@/components/LabAnalytics";
import { brand } from "@/lib/brand";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function DemoPlayer({ lab, demo }: { lab: Lab; demo: LabDemo }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [copiedCommand, setCopiedCommand] = useState<number | null>(null);
  const [recordCopied, setRecordCopied] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [started, setStarted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const playerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
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
    if (!started) return;
    const progress = progressRef.current;
    const activeStep = progress?.querySelector<HTMLElement>(`[data-step-index="${stepIndex}"]`);
    if (!progress || !activeStep) return;

    const left = activeStep.offsetLeft - (progress.clientWidth - activeStep.offsetWidth) / 2;
    progress.scrollTo({
      left: Math.max(0, left),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
    });
  }, [started, stepIndex]);

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

  const copyCommand = async (value: string, commandIndex: number) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedCommand(commandIndex);
      window.setTimeout(() => setCopiedCommand(null), 1600);
    } catch {
      setAnnouncement("Copy failed. Select the text manually.");
    }
  };

  const copyCompletionRecord = async () => {
    const record = [
      `${demo.demoId} completion record`,
      demo.title,
      "",
      ...demo.completionRecord.items.map((item) => `${item.label}: ${item.value}`),
      `Maintenance path: ${demo.completionRecord.maintenancePath}`,
      `Validation boundary: ${demo.validationBoundary}`,
      "",
      "Next actions:",
      ...demo.nextActions.map((item) => `- ${item}`)
    ].join("\n");
    try {
      await navigator.clipboard.writeText(record);
      setRecordCopied(true);
      window.setTimeout(() => setRecordCopied(false), 1600);
    } catch {
      setAnnouncement("Copy failed. Select the completion record manually.");
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
    trackLabEvent("demo_completed", { hod_id: lab.hodId, demo_id: demo.demoId });
    setCompleted(true);
    setStarted(false);
    setAnnouncement("Demo complete. This session will reset when you leave or refresh the page.");
  };

  const startLab = () => {
    trackLabEvent("demo_started", { hod_id: lab.hodId, demo_id: demo.demoId });
    setStepIndex(0);
    setCompleted(false);
    setStarted(true);
    setAnnouncement(`Demo started. Step 1 of ${demo.steps.length}.`);
  };

  const closePlayer = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
    setStepIndex(0);
    setCopiedCommand(null);
    setRecordCopied(false);
    setCompleted(false);
    setStarted(false);
    setAnnouncement("Demo closed. Progress was reset and focus returned to this demonstration.");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const moduleId = `demo-${demo.id}`;
        const demoModule = document.getElementById(moduleId);
        const url = new URL(window.location.href);
        url.hash = moduleId;
        window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
        demoModule?.scrollIntoView({ block: "start" });
        demoModule?.querySelector<HTMLElement>(".start-lab-button")?.focus({ preventScroll: true });
      });
    });
  };

  return (
    <div className={`demo-player route-player${started || completed ? " is-running" : ""}`} ref={playerRef} aria-label={`${demo.title} interactive demonstration`}>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      <header className="player-header">
        <div>
          <span className="player-kicker">{demo.demoId}</span>
          <strong>{demo.title}</strong>
        </div>
        <div className="player-tools">
          {started && fullscreenSupported && <button className="player-fullscreen" type="button" onClick={openFullscreen} aria-label="Open demo in fullscreen"><span>Fullscreen</span></button>}
          {(started || completed) && <button className="player-close" type="button" onClick={closePlayer} aria-label={`Close demo and return to ${demo.title}`}>×</button>}
        </div>
      </header>

      <div
        className="player-progress"
        ref={progressRef}
        aria-label={`Step ${stepIndex + 1} of ${demo.steps.length}`}
        onWheel={(event) => {
          const progress = event.currentTarget;
          if (progress.scrollWidth <= progress.clientWidth || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;
          event.preventDefault();
          progress.scrollBy({ left: event.deltaY, behavior: "auto" });
        }}
      >
        {demo.steps.map((item, index) => (
          started ? (
            <button className={index === stepIndex ? "current" : index < stepIndex || completed ? "complete" : ""} type="button" key={`${index}-${item.label}`} data-step-index={index} onClick={() => setStepIndex(index)} aria-current={index === stepIndex ? "step" : undefined} aria-label={`Go to step ${index + 1}: ${item.label}`}>
              <span>{index + 1}</span><small>{item.label}</small>
            </button>
          ) : (
            <div className="progress-step" key={`${index}-${item.label}`} aria-hidden="true"><span>{index + 1}</span><small>{item.label}</small></div>
          )
        ))}
      </div>

      {started ? <div className="player-stage">
        <div className="stage-media">
          {step.media?.type === "terminal" ? (
            <TerminalReplay
              key={step.media.source}
              source={step.media.source}
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
          <div className="command-block command-block-stacked">
            <div>
              <span>Run in your environment</span>
            </div>
            <div className="command-rows">
              {step.commands.map((item, commandIndex) => (
                <article className="command-row" key={`${item.command}-${commandIndex}`}>
                  <div className="command-value">
                    <pre tabIndex={0}><code>{item.command}</code></pre>
                    <button type="button" onClick={() => copyCommand(item.command, commandIndex)} aria-label={`Copy command: ${item.command}`} aria-live="polite">{copiedCommand === commandIndex ? "Copied!" : "Copy"}</button>
                  </div>
                  <p>{item.explanation}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="expected"><strong>Expected result</strong><p>{step.expected}</p></div>
          {step.note && <p className="step-note">ⓘ {step.note}</p>}
          <details className="step-troubleshooting">
            <summary>Result looks different?</summary>
            <p>{step.troubleshooting}</p>
            {step.recovery?.map((item) => (
              <article key={item.symptom}>
                <strong>{item.symptom}</strong>
                <p>{item.detail}</p>
                {item.command ? <pre tabIndex={0}><code>{item.command}</code></pre> : null}
              </article>
            ))}
          </details>
        </aside>
      </div> : completed ? (
        <div className="player-complete">
          <div className="completion-mark" aria-hidden="true">✓</div>
          <aside>
            <p className="step-label">Outcome verified</p>
            <h2>Demo completed successfully</h2>
            <p>{demo.objective}</p>
            <ul>{demo.verification.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul>
            <section className="completion-boundary">
              <strong>Validation boundary</strong>
              <p>{demo.validationBoundary}</p>
            </section>
            <section className="completion-record" aria-labelledby={`completion-record-${demo.id}`}>
              <div>
                <h3 id={`completion-record-${demo.id}`}>Save your completion record</h3>
                <button type="button" onClick={copyCompletionRecord}>{recordCopied ? "Copied!" : "Copy record"}</button>
              </div>
              <p>{demo.completionRecord.introduction}</p>
              <dl>
                {demo.completionRecord.items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
                <div><dt>Maintenance path</dt><dd>{demo.completionRecord.maintenancePath}</dd></div>
              </dl>
            </section>
            <section className="completion-next-actions">
              <h3>What to do next</h3>
              <ol>{demo.nextActions.map((item) => <li key={item}>{item}</li>)}</ol>
            </section>
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
          <div className="player-ready-visual"><img src={`${basePath}${demo.coverImage}`} alt={demo.coverAlt} /></div>
          <aside>
            <p className="step-label">{demo.demoId} · Ready when you are</p>
            <h2>{demo.title}</h2>
            <p>{demo.objective}</p>
            <p className="player-creator">Created and verified by <a href={brand.linkedin} target="_blank" rel="noreferrer">{brand.creator} ↗</a></p>
            <h3 className="ready-section-title">What you will accomplish</h3>
            <ul>{demo.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
            <section className="success-preview">
              <strong>Success looks like</strong>
              <ul>{demo.verification.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>
              {demo.verification.length > 4 ? <small>Plus {demo.verification.length - 4} additional verification checks at completion.</small> : null}
            </section>
          </aside>
        </div>
      )}

      <footer className={`player-footer${started ? "" : " ready-footer"}`}>
        {!started ? <><span>{completed ? "Verification complete. Run it again whenever you want." : `${brand.demoTagline} Every session begins fresh at step 1.`}</span><button className="player-next start-lab-button" type="button" onClick={startLab}>Start Demo</button></> : <>
          <button className="player-back" type="button" onClick={() => setStepIndex((current) => Math.max(current - 1, 0))} disabled={stepIndex === 0}>← Previous step</button>
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

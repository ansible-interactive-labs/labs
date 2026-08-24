"use client";

/* Native images provide a resilient fallback for static GitHub Pages hosting. */
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type TerminalReplayProps = {
  source: string;
  transcript: string;
  title: string;
  fallbackImage: string;
  fallbackAlt: string;
};

export default function TerminalReplay({ source, transcript, title, fallbackImage, fallbackAlt }: TerminalReplayProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let disposed = false;
    let player: { dispose: () => void } | undefined;

    const mount = async () => {
      try {
        const AsciinemaPlayer = await import("asciinema-player");
        if (disposed || !mountRef.current) return;
        player = AsciinemaPlayer.create(`${basePath}${source}`, mountRef.current, {
          autoPlay: false,
          controls: true,
          fit: "both",
          idleTimeLimit: 1.25,
          terminalFontSize: "small",
          theme: "asciinema",
        });
      } catch {
        if (!disposed) setFailed(true);
      }
    };

    mount();
    return () => {
      disposed = true;
      player?.dispose();
    };
  }, [source]);

  return (
    <div className="terminal-replay" role="region" aria-label={`Terminal replay: ${title}`}>
      {!failed && <div className="terminal-replay-mount" ref={mountRef} />}
      {failed && (
        <div className="terminal-replay-fallback" role="status">
          <img src={`${basePath}${fallbackImage}`} alt={fallbackAlt} />
          <p>The terminal replay could not load. The verified screenshot is shown instead.</p>
        </div>
      )}
      <div className="terminal-replay-links">
        <a href={`${basePath}${transcript}`} target="_blank" rel="noreferrer">Read transcript ↗</a>
        <a href={`${basePath}${fallbackImage}`} target="_blank" rel="noreferrer">View screenshot ↗</a>
      </div>
    </div>
  );
}

"use client";

/* Native images keep screenshot URLs compatible with GitHub Pages project paths. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Lab } from "@/content/labs";

type StoredProgress = { stepIndex: number; completed: boolean };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function DemoCatalog({ labs }: { labs: Lab[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All levels");
  const [topic, setTopic] = useState("All topics");
  const [progress, setProgress] = useState<Record<string, StoredProgress>>({});

  useEffect(() => {
    const saved: Record<string, StoredProgress> = {};
    labs.forEach((lab) => {
      try {
        const value = window.localStorage.getItem(`ansible-lab-progress:${lab.slug}`);
        if (value) saved[lab.slug] = JSON.parse(value) as StoredProgress;
      } catch {
        // A blocked storage API should never prevent access to a lab.
      }
    });
    const timer = window.setTimeout(() => setProgress(saved), 0);
    return () => window.clearTimeout(timer);
  }, [labs]);

  const difficulties = ["All levels", ...new Set(labs.map((lab) => lab.difficulty))];
  const topics = ["All topics", ...new Set(labs.map((lab) => lab.topic))];

  const filteredLabs = useMemo(() => {
    const search = query.trim().toLowerCase();
    return labs.filter((lab) => {
      const matchesQuery = !search || [lab.title, lab.description, lab.topic, lab.platform, ...lab.tags]
        .join(" ")
        .toLowerCase()
        .includes(search);
      const matchesDifficulty = difficulty === "All levels" || lab.difficulty === difficulty;
      const matchesTopic = topic === "All topics" || lab.topic === topic;
      return matchesQuery && matchesDifficulty && matchesTopic;
    });
  }, [difficulty, labs, query, topic]);

  return (
    <>
      <div className="catalog-tools" role="search" aria-label="Filter interactive demos">
        <label className="search-field">
          <span>Search demos</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search commands, topics, or platforms" />
        </label>
        <label>
          <span>Difficulty</span>
          <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            {difficulties.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Topic</span>
          <select value={topic} onChange={(event) => setTopic(event.target.value)}>
            {topics.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <span className="result-count" aria-live="polite">{filteredLabs.length} {filteredLabs.length === 1 ? "demo" : "demos"}</span>
      </div>

      <div className="demo-grid">
        {filteredLabs.map((lab) => {
          const saved = progress[lab.slug];
          const progressPercent = saved?.completed ? 100 : saved ? Math.round(((saved.stepIndex + 1) / lab.steps.length) * 100) : 0;
          return (
            <article className="demo-card" key={lab.slug}>
              <Link className="demo-visual" href={`/demos/${lab.slug}/`} aria-label={`Open ${lab.title} interactive demo`}>
                <img src={`${basePath}${lab.coverImage}`} alt={lab.coverAlt} />
                <span className="play-button" aria-hidden="true">▶</span>
                <span className="duration">{lab.duration}</span>
              </Link>
              <div className="demo-content">
                <div className="tags"><span>{lab.difficulty}</span><span>{lab.platform}</span><span>{lab.steps.length} steps</span></div>
                <h3>{lab.title}</h3>
                <p>{lab.description}</p>
                <ul className="outcomes">
                  {lab.outcomes.slice(0, 3).map((outcome) => <li key={outcome}>{outcome}</li>)}
                </ul>
                {saved && (
                  <div className="saved-progress" aria-label={`${progressPercent}% complete`}>
                    <div><span>{saved.completed ? "Completed" : `Step ${saved.stepIndex + 1} of ${lab.steps.length}`}</span><strong>{progressPercent}%</strong></div>
                    <i><span style={{ width: `${progressPercent}%` }} /></i>
                  </div>
                )}
                <Link className="button button-dark" href={`/demos/${lab.slug}/`}>
                  {saved?.completed ? "Review demo" : saved ? "Resume demo" : "Open interactive demo"} <span>→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {filteredLabs.length === 0 && (
        <div className="empty-results">
          <strong>No demos match those filters.</strong>
          <p>Clear the search or choose a different topic.</p>
          <button type="button" onClick={() => { setQuery(""); setDifficulty("All levels"); setTopic("All topics"); }}>Clear filters</button>
        </div>
      )}
    </>
  );
}

"use client";

/* Native images keep screenshot URLs compatible with GitHub Pages project paths. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { LabSummary } from "@/content/labs/types";
import { formatHodNumber } from "@/lib/brand";

type StoredProgress = { stepIndex: number; completed: boolean };

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const pageSize = 12;

export default function DemoCatalog({ labs }: { labs: LabSummary[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All levels");
  const [topic, setTopic] = useState("All topics");
  const [sort, setSort] = useState("Recommended");
  const [visibleCount, setVisibleCount] = useState(pageSize);
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
    const matches = labs.filter((lab) => {
      const matchesQuery = !search || [lab.title, lab.description, lab.topic, lab.platform, ...lab.tags]
        .join(" ")
        .toLowerCase()
        .includes(search);
      const matchesDifficulty = difficulty === "All levels" || lab.difficulty === difficulty;
      const matchesTopic = topic === "All topics" || lab.topic === topic;
      return matchesQuery && matchesDifficulty && matchesTopic;
    });
    return matches.sort((a, b) => {
      if (sort === "Newest") return b.verifiedDateISO.localeCompare(a.verifiedDateISO);
      if (sort === "Title A–Z") return a.title.localeCompare(b.title);
      if (sort === "Shortest") return a.durationMinutes - b.durationMinutes;
      return a.publishedOrder - b.publishedOrder;
    });
  }, [difficulty, labs, query, sort, topic]);

  const visibleLabs = filteredLabs.slice(0, visibleCount);
  const resetPage = () => setVisibleCount(pageSize);

  return (
    <>
      <div className="catalog-tools" role="search" aria-label="Filter interactive demos">
        <label className="search-field">
          <span>Search demos</span>
          <input value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder="Search commands, topics, or platforms" />
        </label>
        <label>
          <span>Difficulty</span>
          <select value={difficulty} onChange={(event) => { setDifficulty(event.target.value); resetPage(); }}>
            {difficulties.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Topic</span>
          <select value={topic} onChange={(event) => { setTopic(event.target.value); resetPage(); }}>
            {topics.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          <span>Sort</span>
          <select value={sort} onChange={(event) => { setSort(event.target.value); resetPage(); }}>
            {[
              "Recommended", "Newest", "Title A–Z", "Shortest"
            ].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <span className="result-count" aria-live="polite">Showing {Math.min(visibleCount, filteredLabs.length)} of {filteredLabs.length}</span>
      </div>

      <div className={`demo-grid${labs.length > 1 ? " compact-grid" : ""}`}>
        {visibleLabs.map((lab) => {
          const saved = progress[lab.slug];
          const progressPercent = saved?.completed ? 100 : saved ? Math.round(((saved.stepIndex + 1) / lab.stepCount) * 100) : 0;
          return (
            <article className="demo-card" key={lab.slug}>
              <Link className="demo-visual" href={`/demos/${lab.slug}/`} aria-label={`Open ${lab.title} interactive demo`}>
                <img src={`${basePath}${lab.coverImage}`} alt={lab.coverAlt} loading="lazy" decoding="async" />
                <span className="hod-badge">{formatHodNumber(lab.hodNumber)}</span>
                <span className="play-button" aria-hidden="true">▶</span>
                <span className="duration">{lab.duration}</span>
              </Link>
              <div className="demo-content">
                <div className="tags"><span>{lab.difficulty}</span><span>{lab.platform}</span><span>{lab.stepCount} steps</span></div>
                <h3>{lab.title}</h3>
                <p>{lab.description}</p>
                <ul className="outcomes">
                  {lab.outcomes.slice(0, 3).map((outcome) => <li key={outcome}>{outcome}</li>)}
                </ul>
                {saved && (
                  <div className="saved-progress" aria-label={`${progressPercent}% complete`}>
                    <div><span>{saved.completed ? "Completed" : `Step ${saved.stepIndex + 1} of ${lab.stepCount}`}</span><strong>{progressPercent}%</strong></div>
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

      {visibleCount < filteredLabs.length && (
        <div className="load-more-row">
          <button type="button" onClick={() => setVisibleCount((count) => count + pageSize)}>Load 12 more demos</button>
          <span>{filteredLabs.length - visibleCount} remaining</span>
        </div>
      )}

      {filteredLabs.length === 0 && (
        <div className="empty-results">
          <strong>No demos match those filters.</strong>
          <p>Clear the search or choose a different topic.</p>
          <button type="button" onClick={() => { setQuery(""); setDifficulty("All levels"); setTopic("All topics"); setSort("Recommended"); resetPage(); }}>Clear filters</button>
        </div>
      )}
    </>
  );
}

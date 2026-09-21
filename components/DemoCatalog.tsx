"use client";

/* Native images keep screenshot URLs compatible with static deployment paths. */
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo, useState } from "react";
import type { LabSummary } from "@/content/labs/types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const pageSize = 12;

export default function DemoCatalog({ labs }: { labs: LabSummary[] }) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState("All levels");
  const [topic, setTopic] = useState("All");
  const [sort, setSort] = useState("Recommended");
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const difficulties = ["All levels", ...new Set(labs.map((lab) => lab.difficulty))];
  const topics: Array<"All" | LabSummary["topic"]> = ["All", "Ansible", "RHEL"];

  const filteredLabs = useMemo(() => {
    const search = query.trim().toLowerCase();
    const matches = labs.filter((lab) => {
      const matchesQuery = !search || [lab.title, lab.description, lab.topic, lab.platform, ...lab.tags, ...(lab.plannedDemos ?? []).flatMap((demo) => [demo.demoId, demo.title, demo.audience])]
        .join(" ")
        .toLowerCase()
        .includes(search);
      const matchesDifficulty = difficulty === "All levels" || lab.difficulty === difficulty;
      const matchesTopic = topic === "All" || lab.topic === topic;
      return matchesQuery && matchesDifficulty && matchesTopic;
    });
    return matches.sort((a, b) => {
      if (sort === "Newest") return b.publishedOrder - a.publishedOrder;
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
          <input value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }} placeholder="Search demos, commands, or platforms" />
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
          return (
            <article className="demo-card" key={lab.slug}>
              <Link className="demo-visual" href={`/demos/${lab.slug}/`} aria-label={`Open ${lab.title} ${lab.stepCount ? "interactive demo" : "reference page"}`}>
                <img src={`${basePath}${lab.coverImage}`} alt={lab.coverAlt} loading="lazy" decoding="async" />
                <span className="hod-badge">{lab.hodId}</span>
                <span className="play-button" aria-hidden="true">{lab.stepCount ? "▶" : "→"}</span>
              </Link>
              <div className="demo-content">
                <div className="tags"><span>{lab.difficulty}</span></div>
                <h3>{lab.title}</h3>
                <p>{lab.description}</p>
                {lab.plannedDemos?.length ? <div className="catalog-planned-demos">
                  <strong>{lab.plannedDemos.length === 1 ? "Planned demonstration" : "Planned demonstrations"}</strong>
                  <ol>
                    {lab.plannedDemos.map((demo) => <li key={demo.demoId}>
                      <span>{demo.demoId}</span>
                      {demo.title}
                    </li>)}
                  </ol>
                </div> : null}
                <ul className="outcomes">
                  {lab.outcomes.slice(0, 3).map((outcome) => <li key={outcome}>{outcome}</li>)}
                </ul>
                <Link className="button button-dark" href={`/demos/${lab.slug}/`}>
                  Explore HOD
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
          <button type="button" onClick={() => { setQuery(""); setDifficulty("All levels"); setTopic("All"); setSort("Recommended"); resetPage(); }}>Clear filters</button>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useMemo } from "react";
import type { PeptideWithThreadCount } from "@/lib/types";
import { categories } from "@/lib/categories";
import PeptideCard from "./PeptideCard";

interface PeptideSearchProps {
  peptides: PeptideWithThreadCount[];
  initialSort?: string;
  initialCategory?: string;
}

export default function PeptideSearch({
  peptides,
  initialSort = "popular",
  initialCategory = "all",
}: PeptideSearchProps) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(initialSort);
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  const results = useMemo(() => {
    let list = peptides;

    // Category filter
    if (activeCategory !== "all") {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) {
        const slugSet = new Set(cat.peptideSlugs);
        list = list.filter((p) => slugSet.has(p.slug));
      }
    }

    // Search filter
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }

    // Sort
    if (sort === "popular") {
      list = [...list].sort((a, b) => b.thread_count - a.thread_count);
    } else {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [peptides, query, sort, activeCategory]);

  const activeCatName = activeCategory === "all"
    ? null
    : categories.find((c) => c.slug === activeCategory)?.name;

  return (
    <div>
      {/* Sort tabs */}
      <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-2 mb-4">
        <button
          type="button"
          onClick={() => setSort("popular")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            sort === "popular"
              ? "bg-surface text-foreground"
              : "text-muted hover:bg-hover hover:text-foreground"
          }`}
        >
          Popular
        </button>
        <button
          type="button"
          onClick={() => setSort("az")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            sort === "az"
              ? "bg-surface text-foreground"
              : "text-muted hover:bg-hover hover:text-foreground"
          }`}
        >
          A-Z
        </button>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`px-3 py-1 rounded-full text-sm transition-colors border ${
            activeCategory === "all"
              ? "bg-primary text-black border-primary font-medium"
              : "bg-card text-muted border-border hover:border-muted hover:text-foreground"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setActiveCategory(activeCategory === cat.slug ? "all" : cat.slug)}
            className={`px-3 py-1 rounded-full text-sm transition-colors border ${
              activeCategory === cat.slug
                ? "bg-primary text-black border-primary font-medium"
                : "bg-card text-muted border-border hover:border-muted hover:text-foreground"
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={activeCatName ? `Search ${activeCatName}...` : "Search peptides..."}
          className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((peptide) => (
            <PeptideCard key={peptide.id} peptide={peptide} threadCount={peptide.thread_count} />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-12">
          {query.trim()
            ? <>No peptides match &ldquo;{query}&rdquo;{activeCatName && ` in ${activeCatName}`}</>
            : activeCatName
              ? `No peptides in ${activeCatName}`
              : "No peptides found"}
        </p>
      )}
    </div>
  );
}

"use client";

import { useState, useMemo } from "react";
import type { Thread } from "@/lib/types";
import ThreadCard from "./ThreadCard";

interface ThreadSearchProps {
  threads: Thread[];
  peptideSlug: string;
}

function relevanceScore(thread: Thread, terms: string[]): number {
  let score = 0;
  const title = thread.title.toLowerCase();
  const body = (thread.body || "").toLowerCase();

  for (const term of terms) {
    // Exact match in title is worth the most
    if (title.includes(term)) score += 10;
    // Exact match in body
    if (body.includes(term)) score += 3;
  }

  // Boost by engagement
  score += Math.min(thread.comment_count, 5) * 0.5;
  score += Math.min(thread.upvotes - thread.downvotes, 10) * 0.3;

  return score;
}

export default function ThreadSearch({ threads, peptideSlug }: ThreadSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return threads;

    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length > 1);

    if (terms.length === 0) return threads;

    // Score all threads and sort by relevance
    const scored = threads
      .map((thread) => ({
        thread,
        score: relevanceScore(thread, terms),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    // If we have matches, return them. Otherwise return all threads
    // sorted by how close they are (best effort)
    if (scored.length > 0) {
      return scored.map((item) => item.thread);
    }

    // No matches — return all threads as fallback so the page isn't empty
    return threads;
  }, [threads, query]);

  const hasQuery = query.trim().length > 0;
  const noMatches =
    hasQuery &&
    results.length === threads.length &&
    threads.length > 0 &&
    relevanceScore(threads[0], query.toLowerCase().split(/\s+/)) === 0;

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search threads..."
          className="w-full bg-input border border-border rounded-md px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {noMatches && (
        <p className="text-muted text-sm mb-3">
          No exact matches for &ldquo;{query}&rdquo; — showing all threads
        </p>
      )}

      {results.length > 0 ? (
        <div className="space-y-3">
          {results.map((thread) => (
            <ThreadCard
              key={thread.id}
              thread={thread}
              peptideSlug={peptideSlug}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted text-center py-8">
          No discussions yet. Be the first to start one!
        </p>
      )}
    </div>
  );
}

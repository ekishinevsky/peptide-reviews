"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { SearchResults } from "@/lib/types";

export default function GlobalSearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults(null);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data: SearchResults = await res.json();
          setResults(data);
          setOpen(true);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const hasResults = results && (results.peptides.length > 0 || results.threads.length > 0);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && results && setOpen(true)}
          placeholder="Search peptides and threads..."
          className="w-full bg-surface border border-border rounded-full pl-9 pr-4 py-1.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-foreground"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-muted border-t-foreground rounded-full animate-spin" />
          </div>
        )}
      </div>

      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto">
          {!hasResults ? (
            <p className="px-4 py-3 text-sm text-muted">No results found</p>
          ) : (
            <>
              {results!.peptides.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider bg-surface">
                    Peptides
                  </p>
                  {results!.peptides.map((p) => (
                    <Link
                      key={p.id}
                      href={`/peptides/${p.slug}`}
                      onClick={() => { setOpen(false); setQuery(""); }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-hover transition-colors"
                    >
                      <span className="w-6 h-6 rounded-full bg-primary text-black text-[10px] font-bold flex items-center justify-center shrink-0">
                        {p.name[0]}
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">p/{p.name}</p>
                        {p.description && (
                          <p className="text-xs text-muted truncate">{p.description}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results!.threads.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-xs font-semibold text-muted uppercase tracking-wider bg-surface">
                    Threads
                  </p>
                  {results!.threads.map((t) => (
                    <Link
                      key={t.id}
                      href={`/peptides/${t.peptides?.slug}/threads/${t.id}`}
                      onClick={() => { setOpen(false); setQuery(""); }}
                      className="block px-4 py-2 hover:bg-hover transition-colors"
                    >
                      <p className="text-sm font-medium truncate">{t.title}</p>
                      <p className="text-xs text-muted">
                        p/{t.peptides?.name} · {t.upvotes - t.downvotes} points · {t.comment_count} comments
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

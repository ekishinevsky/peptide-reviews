"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") || "new";

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-2 mb-4">
      <button
        type="button"
        onClick={() => handleSort("new")}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          sort === "new"
            ? "bg-surface text-foreground"
            : "text-muted hover:bg-hover hover:text-foreground"
        }`}
      >
        New
      </button>
      <button
        type="button"
        onClick={() => handleSort("top")}
        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
          sort === "top"
            ? "bg-surface text-foreground"
            : "text-muted hover:bg-hover hover:text-foreground"
        }`}
      >
        Top
      </button>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import PeptideSearch from "@/components/PeptideSearch";
import type { PeptideWithThreadCount } from "@/lib/types";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; category?: string }>;
}) {
  const { sort, category } = await searchParams;
  const supabase = await createClient();

  const { data: peptides } = await supabase
    .from("peptides")
    .select("*, threads(count)")
    .order("name", { ascending: true });

  const mapped: PeptideWithThreadCount[] = ((peptides as any[]) || []).map((p) => ({
    ...p,
    thread_count: p.threads?.[0]?.count ?? 0,
    threads: undefined,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Explore Peptides</h1>
        <p className="text-muted text-sm mt-1">
          Browse all peptide communities
        </p>
      </div>

      <PeptideSearch
        peptides={mapped}
        initialSort={sort || "popular"}
        initialCategory={category || "all"}
      />
    </div>
  );
}

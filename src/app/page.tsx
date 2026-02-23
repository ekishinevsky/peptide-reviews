import { createClient } from "@/lib/supabase/server";
import FeedThreadCard from "@/components/FeedThreadCard";
import SortTabs from "@/components/SortTabs";
import type { ThreadWithPeptide } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;
  const supabase = await createClient();

  const orderColumn = sort === "top" ? "upvotes" : "created_at";

  const { data: threads } = await supabase
    .from("threads")
    .select("*, profiles(username), peptides(name, slug)")
    .order(orderColumn, { ascending: false })
    .limit(50);

  return (
    <div>
      <SortTabs />

      {(threads as ThreadWithPeptide[] | null)?.length ? (
        <div className="space-y-3">
          {(threads as ThreadWithPeptide[]).map((thread) => (
            <FeedThreadCard key={thread.id} thread={thread} />
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg p-8 text-center">
          <p className="text-muted">No threads yet. Visit a peptide community to start a discussion!</p>
        </div>
      )}
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import InteractiveRating from "@/components/InteractiveRating";
import ThreadSearch from "@/components/ThreadSearch";
import type { Peptide, Thread } from "@/lib/types";

export default async function PeptideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Fetch peptide
  const { data: peptide } = await supabase
    .from("peptides")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!peptide) notFound();

  const p = peptide as Peptide;
  const avgRating = p.rating_count > 0 ? p.rating_sum / p.rating_count : 0;

  // Fetch current user and their rating
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRating: number | null = null;
  if (user) {
    const { data: rating } = await supabase
      .from("ratings")
      .select("stars")
      .eq("peptide_id", p.id)
      .eq("user_id", user.id)
      .single();
    userRating = rating?.stars ?? null;
  }

  // Fetch threads
  const { data: threads } = await supabase
    .from("threads")
    .select("*, profiles(username)")
    .eq("peptide_id", p.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      {/* Community header */}
      <div className="bg-card border border-border rounded-lg p-5 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-10 h-10 rounded-full bg-primary text-black text-lg font-bold flex items-center justify-center">
            {p.name[0]}
          </span>
          <div>
            <h1 className="text-2xl font-bold">p/{p.name}</h1>
            {p.description && (
              <p className="text-muted text-sm">{p.description}</p>
            )}
          </div>
        </div>
      </div>

      <InteractiveRating
        peptideId={p.id}
        initialUserRating={userRating}
        initialAvg={avgRating}
        initialCount={p.rating_count}
        isLoggedIn={!!user}
      />

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Discussions</h2>
          {user ? (
            <Link
              href={`/peptides/${slug}/threads/new`}
              className="bg-primary text-black px-4 py-2 rounded-md text-sm hover:bg-primary-hover"
            >
              + New Thread
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm text-primary hover:underline"
            >
              Log in to start a discussion
            </Link>
          )}
        </div>

        <ThreadSearch
          threads={(threads as Thread[]) || []}
          peptideSlug={slug}
        />
      </div>
    </div>
  );
}

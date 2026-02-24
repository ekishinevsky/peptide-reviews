import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import VoteButtons from "@/components/VoteButtons";
import CommentForm from "@/components/CommentForm";
import CommentTree from "@/components/CommentTree";
import { timeAgo } from "@/lib/utils";
import type { Comment, Vote } from "@/lib/types";

export default async function ThreadDetailPage({
  params,
}: {
  params: Promise<{ slug: string; threadId: string }>;
}) {
  const { slug, threadId } = await params;
  const supabase = await createClient();

  // Fetch peptide name
  const { data: peptide } = await supabase
    .from("peptides")
    .select("name")
    .eq("slug", slug)
    .single();

  // Fetch thread with author
  const { data: thread } = await supabase
    .from("threads")
    .select("*, profiles(username)")
    .eq("id", threadId)
    .single();

  if (!thread) notFound();

  // Fetch all comments for this thread
  const { data: comments } = await supabase
    .from("comments")
    .select("*, profiles(username)")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true });

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's votes for this thread and its comments
  let userVotes: Record<string, 1 | -1> = {};
  let threadVote: 1 | -1 | null = null;

  if (user) {
    const commentIds = (comments || []).map((c: Comment) => c.id);
    const allTargetIds = [threadId, ...commentIds];

    const { data: votes } = await supabase
      .from("votes")
      .select("target_id, value")
      .eq("user_id", user.id)
      .in("target_id", allTargetIds);

    if (votes) {
      for (const v of votes as Vote[]) {
        if (v.target_id === threadId) {
          threadVote = v.value;
        } else {
          userVotes[v.target_id] = v.value;
        }
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Community badge */}
      <Link
        href={`/peptides/${slug}`}
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground mb-4"
      >
        <span className="w-5 h-5 rounded-full bg-primary text-black text-[8px] font-bold flex items-center justify-center">
          {peptide?.name?.[0] || "P"}
        </span>
        <span className="font-semibold text-foreground">p/{peptide?.name || slug}</span>
      </Link>

      {/* Thread header */}
      <div className="flex items-start gap-3 mb-6">
        <VoteButtons
          targetType="thread"
          targetId={threadId}
          upvotes={thread.upvotes}
          downvotes={thread.downvotes}
          userVote={threadVote}
          isLoggedIn={!!user}
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{thread.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted mt-1">
            <span>by {thread.profiles?.username || "unknown"}</span>
            <span>&middot;</span>
            <span>{timeAgo(thread.created_at)}</span>
          </div>
          {thread.body && (
            <p className="mt-3 whitespace-pre-wrap">{thread.body}</p>
          )}
          {thread.image_url && (
            <img
              src={thread.image_url}
              alt="Thread image"
              className="mt-3 max-w-full rounded-lg border border-border"
            />
          )}
        </div>
      </div>

      <hr className="border-border mb-6" />

      {/* Comment form */}
      {user ? (
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-2">Add a comment</h2>
          <CommentForm threadId={threadId} />
        </div>
      ) : (
        <p className="text-sm text-muted mb-6">
          <a href="/auth/login" className="text-primary hover:underline">
            Log in
          </a>{" "}
          to join the discussion
        </p>
      )}

      {/* Comments */}
      <h2 className="text-lg font-semibold mb-3">
        Comments ({thread.comment_count})
      </h2>
      <CommentTree
        comments={(comments as Comment[]) || []}
        threadId={threadId}
        userVotes={userVotes}
        isLoggedIn={!!user}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { timeAgo } from "@/lib/utils";

interface ProfileThread {
  id: string;
  title: string;
  created_at: string;
  comment_count: number;
  peptides?: { name: string; slug: string };
}

interface ProfileComment {
  id: string;
  body: string;
  created_at: string;
  threads?: { id: string; title: string; peptide_id: string; peptides?: { slug: string } };
}

interface ProfileContentProps {
  threads: ProfileThread[];
  comments: ProfileComment[];
}

export default function ProfileContent({ threads, comments }: ProfileContentProps) {
  const [tab, setTab] = useState<"posts" | "comments">("posts");
  const [deletingThread, setDeletingThread] = useState<string | null>(null);
  const [deletingComment, setDeletingComment] = useState<string | null>(null);
  const router = useRouter();

  async function handleDeleteThread(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This will also delete all comments on this thread.`)) return;
    setDeletingThread(id);
    const supabase = createClient();
    await supabase.from("threads").delete().eq("id", id);
    router.refresh();
    setDeletingThread(null);
  }

  async function handleDeleteComment(id: string) {
    if (!confirm("Delete this comment?")) return;
    setDeletingComment(id);
    await fetch(`/api/comments/${id}`, { method: "DELETE" });
    router.refresh();
    setDeletingComment(null);
  }

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2 bg-card border border-border rounded-lg p-2 mb-4">
        <button
          type="button"
          onClick={() => setTab("posts")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            tab === "posts"
              ? "bg-surface text-foreground"
              : "text-muted hover:bg-hover hover:text-foreground"
          }`}
        >
          Posts ({threads.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("comments")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
            tab === "comments"
              ? "bg-surface text-foreground"
              : "text-muted hover:bg-hover hover:text-foreground"
          }`}
        >
          Comments ({comments.length})
        </button>
      </div>

      {/* Posts tab */}
      {tab === "posts" && (
        <div className="space-y-2">
          {threads.length > 0 ? (
            threads.map((thread) => (
              <div
                key={thread.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted mb-1">
                    {thread.peptides && (
                      <Link
                        href={`/peptides/${thread.peptides.slug}`}
                        className="font-semibold text-foreground hover:underline"
                      >
                        p/{thread.peptides.name}
                      </Link>
                    )}
                    <span>&middot;</span>
                    <span>{timeAgo(thread.created_at)}</span>
                    <span>&middot;</span>
                    <span>{thread.comment_count} {thread.comment_count === 1 ? "comment" : "comments"}</span>
                  </div>
                  <Link
                    href={`/peptides/${thread.peptides?.slug}/threads/${thread.id}`}
                    className="text-sm font-medium text-foreground hover:underline line-clamp-1"
                  >
                    {thread.title}
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteThread(thread.id, thread.title)}
                  disabled={deletingThread === thread.id}
                  className="text-red-500 hover:text-red-400 text-sm shrink-0 disabled:opacity-50"
                >
                  {deletingThread === thread.id ? "..." : "Delete"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-muted text-center py-12 text-sm">No posts yet</p>
          )}
        </div>
      )}

      {/* Comments tab */}
      {tab === "comments" && (
        <div className="space-y-2">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-muted mb-1">
                    {comment.threads && (
                      <Link
                        href={`/peptides/${comment.threads.peptides?.slug}/threads/${comment.threads.id}`}
                        className="font-semibold text-foreground hover:underline"
                      >
                        {comment.threads.title}
                      </Link>
                    )}
                    <span>&middot;</span>
                    <span>{timeAgo(comment.created_at)}</span>
                  </div>
                  <p className="text-sm text-muted line-clamp-2">{comment.body}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={deletingComment === comment.id}
                  className="text-red-500 hover:text-red-400 text-sm shrink-0 disabled:opacity-50"
                >
                  {deletingComment === comment.id ? "..." : "Delete"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-muted text-center py-12 text-sm">No comments yet</p>
          )}
        </div>
      )}
    </div>
  );
}

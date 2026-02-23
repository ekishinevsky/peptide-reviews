import Link from "next/link";
import type { ThreadWithPeptide } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

export default function FeedThreadCard({ thread }: { thread: ThreadWithPeptide }) {
  const score = thread.upvotes - thread.downvotes;
  const peptideSlug = thread.peptides?.slug || "";
  const peptideName = thread.peptides?.name || "";

  return (
    <Link href={`/peptides/${peptideSlug}/threads/${thread.id}`}>
      <div className="bg-card border border-border rounded-lg p-4 hover:border-muted transition-colors">
        {/* Meta line */}
        <div className="flex items-center gap-2 text-xs text-muted mb-2">
          <Link
            href={`/peptides/${peptideSlug}`}
            onClick={(e) => e.stopPropagation()}
            className="font-semibold text-foreground hover:underline"
          >
            p/{peptideName}
          </Link>
          <span>&middot;</span>
          <span>Posted by {thread.profiles?.username || "unknown"}</span>
          <span>&middot;</span>
          <span>{timeAgo(thread.created_at)}</span>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-foreground mb-1">{thread.title}</h3>

        {/* Body preview */}
        {thread.body && (
          <p className="text-sm text-muted line-clamp-2 mb-3">{thread.body}</p>
        )}

        {/* Actions bar */}
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-upvote">
              <path d="M12 4l8 9H4z" />
            </svg>
            <span className="font-semibold">{score}</span>
          </span>
          <span className="flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            {thread.comment_count} {thread.comment_count === 1 ? "comment" : "comments"}
          </span>
        </div>
      </div>
    </Link>
  );
}

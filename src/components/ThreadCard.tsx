import Link from "next/link";
import type { Thread } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

interface ThreadCardProps {
  thread: Thread;
  peptideSlug: string;
  peptideName?: string;
}

export default function ThreadCard({ thread, peptideSlug, peptideName }: ThreadCardProps) {
  const score = thread.upvotes - thread.downvotes;

  return (
    <Link href={`/peptides/${peptideSlug}/threads/${thread.id}`}>
      <div className="flex items-start gap-3 bg-card border border-border rounded-lg p-4 hover:border-muted transition-colors">
        <div className="flex flex-col items-center text-sm min-w-[40px]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted"
          >
            <path d="M12 5l7 7H5z" />
          </svg>
          <span className="font-semibold">{score}</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted"
          >
            <path d="M12 19l7-7H5z" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          {peptideName && (
            <span className="text-xs text-muted mb-1 block">p/{peptideName}</span>
          )}
          <h3 className="font-medium text-base">{thread.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted mt-1">
            <span>by {thread.profiles?.username || "unknown"}</span>
            <span>&middot;</span>
            <span>{timeAgo(thread.created_at)}</span>
            <span>&middot;</span>
            <span>
              {thread.comment_count} {thread.comment_count === 1 ? "comment" : "comments"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

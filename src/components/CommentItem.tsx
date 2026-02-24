"use client";

import { useState } from "react";
import type { Comment } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import VoteButtons from "./VoteButtons";
import CommentForm from "./CommentForm";

interface CommentItemProps {
  comment: Comment;
  threadId: string;
  userVotes: Record<string, 1 | -1>;
  isLoggedIn: boolean;
  depth: number;
}

export default function CommentItem({
  comment,
  threadId,
  userVotes,
  isLoggedIn,
  depth,
}: CommentItemProps) {
  const [showReply, setShowReply] = useState(false);
  const maxIndent = 6;
  const indent = Math.min(depth, maxIndent);

  return (
    <div
      className={indent > 0 ? "ml-6 pl-3 border-l-2 border-border" : ""}
    >
      <div className="py-2">
        <div className="flex items-start gap-2">
          <VoteButtons
            targetType="comment"
            targetId={comment.id}
            upvotes={comment.upvotes}
            downvotes={comment.downvotes}
            userVote={userVotes[comment.id] || null}
            isLoggedIn={isLoggedIn}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="font-medium text-foreground">
                {comment.profiles?.username || "unknown"}
              </span>
              <span>&middot;</span>
              <span>{timeAgo(comment.created_at)}</span>
            </div>
            <p className="text-sm mt-1 whitespace-pre-wrap">{comment.body}</p>
            {comment.image_url && (
              <img
                src={comment.image_url}
                alt="Comment image"
                className="mt-2 max-w-full max-h-80 rounded-lg border border-border"
              />
            )}
            {isLoggedIn && (
              <button
                type="button"
                onClick={() => setShowReply(!showReply)}
                className="text-xs text-muted hover:text-primary mt-1"
              >
                {showReply ? "Cancel" : "Reply"}
              </button>
            )}
            {showReply && (
              <div className="mt-2">
                <CommentForm
                  threadId={threadId}
                  parentId={comment.id}
                  onCancel={() => setShowReply(false)}
                  placeholder="Write a reply..."
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {comment.children && comment.children.length > 0 && (
        <div>
          {comment.children.map((child) => (
            <CommentItem
              key={child.id}
              comment={child}
              threadId={threadId}
              userVotes={userVotes}
              isLoggedIn={isLoggedIn}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface VoteButtonsProps {
  targetType: "thread" | "comment";
  targetId: string;
  upvotes: number;
  downvotes: number;
  userVote: 1 | -1 | null;
  isLoggedIn: boolean;
  layout?: "vertical" | "horizontal";
}

export default function VoteButtons({
  targetType,
  targetId,
  upvotes: initialUpvotes,
  downvotes: initialDownvotes,
  userVote: initialUserVote,
  isLoggedIn,
  layout = "vertical",
}: VoteButtonsProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [loading, setLoading] = useState(false);

  const score = upvotes - downvotes;

  async function handleVote(value: 1 | -1) {
    if (!isLoggedIn || loading) return;
    setLoading(true);

    const prevUpvotes = upvotes;
    const prevDownvotes = downvotes;
    const prevUserVote = userVote;

    // Optimistic update
    if (userVote === value) {
      // Toggle off
      setUserVote(null);
      if (value === 1) setUpvotes((v) => v - 1);
      else setDownvotes((v) => v - 1);
    } else if (userVote === null) {
      // New vote
      setUserVote(value);
      if (value === 1) setUpvotes((v) => v + 1);
      else setDownvotes((v) => v + 1);
    } else {
      // Switch
      setUserVote(value);
      if (value === 1) {
        setUpvotes((v) => v + 1);
        setDownvotes((v) => v - 1);
      } else {
        setUpvotes((v) => v - 1);
        setDownvotes((v) => v + 1);
      }
    }

    const supabase = createClient();
    const { error } = await supabase.rpc("upsert_vote", {
      p_user_id: (await supabase.auth.getUser()).data.user!.id,
      p_target_type: targetType,
      p_target_id: targetId,
      p_value: value,
    });

    if (error) {
      setUpvotes(prevUpvotes);
      setDownvotes(prevDownvotes);
      setUserVote(prevUserVote);
    }

    setLoading(false);
  }

  const containerClass =
    layout === "vertical"
      ? "flex flex-col items-center gap-0.5"
      : "flex items-center gap-1";

  return (
    <div className={containerClass}>
      <button
        type="button"
        onClick={() => handleVote(1)}
        disabled={!isLoggedIn}
        className={`p-0.5 rounded transition-colors ${
          userVote === 1
            ? "text-upvote"
            : "text-muted hover:text-upvote"
        } ${!isLoggedIn ? "cursor-default" : "cursor-pointer"}`}
        title={isLoggedIn ? "Upvote" : "Log in to vote"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l8 9H4z" />
        </svg>
      </button>
      <span className="text-sm font-semibold min-w-[20px] text-center">
        {score}
      </span>
      <button
        type="button"
        onClick={() => handleVote(-1)}
        disabled={!isLoggedIn}
        className={`p-0.5 rounded transition-colors ${
          userVote === -1
            ? "text-downvote"
            : "text-muted hover:text-downvote"
        } ${!isLoggedIn ? "cursor-default" : "cursor-pointer"}`}
        title={isLoggedIn ? "Downvote" : "Log in to vote"}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l8-9H4z" />
        </svg>
      </button>
    </div>
  );
}

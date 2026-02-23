"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StarRating from "./StarRating";

interface InteractiveRatingProps {
  peptideId: string;
  initialUserRating: number | null;
  initialAvg: number;
  initialCount: number;
  isLoggedIn: boolean;
}

export default function InteractiveRating({
  peptideId,
  initialUserRating,
  initialAvg,
  initialCount,
  isLoggedIn,
}: InteractiveRatingProps) {
  const [userRating, setUserRating] = useState(initialUserRating);
  const [avg, setAvg] = useState(initialAvg);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleRate(stars: number) {
    if (!isLoggedIn || loading) return;
    setLoading(true);

    const prevUserRating = userRating;
    const prevAvg = avg;
    const prevCount = count;

    // Optimistic update
    let newSum: number;
    let newCount: number;
    if (prevUserRating) {
      newSum = prevAvg * prevCount - prevUserRating + stars;
      newCount = prevCount;
    } else {
      newSum = prevAvg * prevCount + stars;
      newCount = prevCount + 1;
    }
    setUserRating(stars);
    setAvg(newCount > 0 ? newSum / newCount : 0);
    setCount(newCount);

    const supabase = createClient();
    const { error } = await supabase.rpc("upsert_rating", {
      p_peptide_id: peptideId,
      p_user_id: (await supabase.auth.getUser()).data.user!.id,
      p_stars: stars,
    });

    if (error) {
      // Revert on error
      setUserRating(prevUserRating);
      setAvg(prevAvg);
      setCount(prevCount);
    }

    setLoading(false);
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm text-muted mb-1">Average Rating</p>
          <StarRating rating={avg} count={count} size="lg" />
        </div>

        {isLoggedIn ? (
          <div>
            <p className="text-sm text-muted mb-1">
              {userRating ? "Your rating" : "Rate this peptide"}
            </p>
            <StarRating
              rating={userRating || 0}
              interactive
              userRating={userRating || undefined}
              onRate={handleRate}
              size="lg"
            />
          </div>
        ) : (
          <p className="text-sm text-muted">
            <a href="/auth/login" className="text-primary hover:underline">
              Log in
            </a>{" "}
            to rate this peptide
          </p>
        )}
      </div>
    </div>
  );
}

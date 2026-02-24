"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StarRating from "./StarRating";

interface DimensionData {
  avg: number;
  count: number;
  userRating: number | null;
}

interface InteractiveRatingProps {
  peptideId: string;
  isLoggedIn: boolean;
  general: DimensionData;
  effectiveness: DimensionData;
  sideEffects: DimensionData;
}

type Dimension = "general" | "effectiveness" | "sideEffects";

const DIMENSION_CONFIG: Record<Dimension, { label: string; hint?: string; rpcParam: string }> = {
  effectiveness: { label: "Effectiveness", rpcParam: "p_effectiveness" },
  sideEffects: { label: "Side Effects", hint: "5 = minimal", rpcParam: "p_side_effects" },
  general: { label: "Overall", rpcParam: "p_stars" },
};

export default function InteractiveRating({
  peptideId,
  isLoggedIn,
  general,
  effectiveness,
  sideEffects,
}: InteractiveRatingProps) {
  const [state, setState] = useState({
    general: { ...general },
    effectiveness: { ...effectiveness },
    sideEffects: { ...sideEffects },
  });
  const [loading, setLoading] = useState<Dimension | null>(null);

  async function handleRate(dimension: Dimension, stars: number) {
    if (!isLoggedIn || loading) return;
    setLoading(dimension);

    const prev = { ...state[dimension] };

    // Optimistic update
    const prevUserRating = prev.userRating;
    let newSum: number;
    let newCount: number;
    if (prevUserRating) {
      newSum = prev.avg * prev.count - prevUserRating + stars;
      newCount = prev.count;
    } else {
      newSum = prev.avg * prev.count + stars;
      newCount = prev.count + 1;
    }

    setState((s) => ({
      ...s,
      [dimension]: {
        userRating: stars,
        avg: newCount > 0 ? newSum / newCount : 0,
        count: newCount,
      },
    }));

    const supabase = createClient();
    const { error } = await supabase.rpc("upsert_rating", {
      p_peptide_id: peptideId,
      p_user_id: (await supabase.auth.getUser()).data.user!.id,
      p_stars: dimension === "general" ? stars : null,
      p_effectiveness: dimension === "effectiveness" ? stars : null,
      p_side_effects: dimension === "sideEffects" ? stars : null,
    });

    if (error) {
      setState((s) => ({ ...s, [dimension]: prev }));
    }

    setLoading(null);
  }

  const dimensions: Dimension[] = ["effectiveness", "sideEffects", "general"];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="space-y-2.5">
        {dimensions.map((dim) => {
          const config = DIMENSION_CONFIG[dim];
          const d = state[dim];
          return (
            <div key={dim} className="flex items-center gap-3 flex-wrap">
              <div className="w-[100px] shrink-0">
                <span className="text-sm text-foreground">{config.label}</span>
                {config.hint && (
                  <span className="text-xs text-muted ml-1">({config.hint})</span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <StarRating rating={d.avg} count={d.count} size="sm" />
              </div>

              <div className="ml-auto">
                {isLoggedIn ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted">
                      {d.userRating ? "Yours:" : "Rate:"}
                    </span>
                    <StarRating
                      rating={d.userRating || 0}
                      interactive
                      userRating={d.userRating || undefined}
                      onRate={(stars) => handleRate(dim, stars)}
                      size="sm"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {!isLoggedIn && (
        <p className="text-sm text-muted mt-3 text-center">
          <a href="/auth/login" className="text-primary hover:underline">
            Log in
          </a>{" "}
          to rate this peptide
        </p>
      )}
    </div>
  );
}

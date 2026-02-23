import Link from "next/link";
import type { Peptide } from "@/lib/types";
import StarRating from "./StarRating";

interface PeptideCardProps {
  peptide: Peptide;
  threadCount?: number;
}

export default function PeptideCard({ peptide, threadCount }: PeptideCardProps) {
  const avgRating =
    peptide.rating_count > 0
      ? peptide.rating_sum / peptide.rating_count
      : 0;

  return (
    <Link href={`/peptides/${peptide.slug}`}>
      <div className="bg-card border border-border rounded-lg p-4 hover:border-muted transition-colors">
        <h3 className="font-semibold text-lg mb-1">p/{peptide.name}</h3>
        {peptide.description && (
          <p className="text-muted text-sm mb-3 line-clamp-2">
            {peptide.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <StarRating
            rating={avgRating}
            count={peptide.rating_count}
            size="sm"
          />
          {threadCount !== undefined && (
            <span className="text-xs text-muted">
              {threadCount} {threadCount === 1 ? "thread" : "threads"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

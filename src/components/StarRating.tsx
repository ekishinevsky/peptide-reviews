"use client";

interface StarRatingProps {
  rating: number;
  count?: number;
  interactive?: boolean;
  userRating?: number;
  onRate?: (stars: number) => void;
  size?: "sm" | "md" | "lg";
}

function StarIcon({
  filled,
  half,
  size,
}: {
  filled: boolean;
  half?: boolean;
  size: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.5}
      className={filled ? "text-star" : "text-border"}
    >
      {half ? (
        <>
          <defs>
            <linearGradient id="halfStar">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            fill="url(#halfStar)"
            className="text-star"
          />
        </>
      ) : (
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      )}
    </svg>
  );
}

export default function StarRating({
  rating,
  count,
  interactive = false,
  userRating,
  onRate,
  size = "md",
}: StarRatingProps) {
  const starSize = size === "sm" ? 16 : size === "lg" ? 28 : 20;

  const displayRating = interactive && userRating ? userRating : rating;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate?.(star)}
            className={
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            }
          >
            <StarIcon
              filled={star <= Math.floor(displayRating)}
              half={
                !interactive &&
                star === Math.ceil(displayRating) &&
                displayRating % 1 >= 0.25
              }
              size={starSize}
            />
          </button>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-muted text-sm">
          {rating > 0 ? rating.toFixed(1) : "—"} ({count}{" "}
          {count === 1 ? "rating" : "ratings"})
        </span>
      )}
    </div>
  );
}

import { Star } from "lucide-react";

export default function StarRating({ rating = 0 }) {
  const rounded = Math.round(rating);
  return (
    <span className="inline-flex items-center gap-1">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span className="text-sm text-ink-700">{rating.toFixed(2)}</span>
    </span>
  );
}

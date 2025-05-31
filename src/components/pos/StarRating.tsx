"use client";

import type { FC } from 'react';
import { Star, StarHalf } from 'lucide-react'; // Using StarHalf for more precise ratings

interface StarRatingProps {
  rating: number | string;
  maxStars?: number;
  starSize?: number;
}

const StarRating: FC<StarRatingProps> = ({ rating, maxStars = 5, starSize = 18 }) => {
  const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
  const fullStars = Math.floor(numericRating);
  const halfStar = numericRating % 1 >= 0.4 && numericRating % 1 < 0.9; // Adjusted threshold for half star
  const emptyStars = maxStars - fullStars - (halfStar ? 1 : 0);

  return (
    <div className="flex items-center" aria-label={`Rating: ${numericRating} out of ${maxStars} stars`}>
      {Array(fullStars)
        .fill(0)
        .map((_, i) => (
          <Star key={`full-${i}`} fill="hsl(var(--accent))" strokeWidth={0} size={starSize} className="text-accent" />
        ))}
      {halfStar && <StarHalf key="half" fill="hsl(var(--accent))" strokeWidth={0} size={starSize} className="text-accent" />}
      {Array(Math.max(0, emptyStars)) // Ensure emptyStars is not negative
        .fill(0)
        .map((_, i) => (
          <Star key={`empty-${i}`} fill="hsl(var(--muted))" strokeWidth={0} size={starSize} className="text-muted-foreground opacity-50" />
        ))}
    </div>
  );
};

export default StarRating;

import { Star } from 'lucide-react';

export const RatingStars = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex text-Sunglow fill-Sunglow">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 fill-current fill-Sunglow" />
      ))}

      {/* Half star */}
      {hasHalfStar && (
        <div key="half" className="relative h-4 w-4">
          <Star
            className="absolute top-0 left-0 h-4 w-4 fill-current fill-Sunglow"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          />
          <Star className="h-4 w-4 text-gray-300" />
        </div>
      )}

      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      ))}
    </div>
  );
};

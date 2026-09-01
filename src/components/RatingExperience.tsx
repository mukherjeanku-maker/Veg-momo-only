import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star } from 'lucide-react';
import { playBubbleTap, playSparkle } from '../utils/sound';

interface RatingExperienceProps {
  onRated?: (stars: number) => void;
}

export const RatingExperience: React.FC<RatingExperienceProps> = ({ onRated }) => {
  const [rating, setRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const handleRate = (stars: number) => {
    playBubbleTap();
    setRating(stars);
    if (stars >= 4) {
      playSparkle();
    }
    onRated?.(stars);
  };

  const getFeedback = (stars: number) => {
    if (stars <= 2) return 'Fair. Brutal, but fair. 😂';
    if (stars === 3) return 'Acceptable. We’ll call it a draw.';
    if (stars === 4) return 'Okay, I\'ll take that.';
    return 'Now you\'re just being nice. 😌';
  };

  return (
    <div id="rating-experience-card" className="w-full max-w-sm mx-auto my-4 text-center select-none">
      <div className="mb-2.5">
        <span className="text-[11px] uppercase tracking-widest text-purple-300/60 font-medium">
          Be honest
        </span>
        <h4 className="text-xs sm:text-sm font-light text-purple-100 mt-0.5">
          How suspiciously cute was this?
        </h4>
      </div>

      {/* 5 Star Buttons */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 my-2.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverRating !== null ? hoverRating >= star : (rating !== null && rating >= star));
          return (
            <motion.button
              key={star}
              id={`rating-star-${star}`}
              onClick={() => handleRate(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              whileHover={{ scale: 1.25, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-full transition-colors cursor-pointer"
              aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                className={`w-6 h-6 transition-all duration-200 ${
                  isFilled
                    ? 'fill-amber-400 text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                    : 'text-purple-400/40 hover:text-purple-300'
                }`}
              />
            </motion.button>
          );
        })}
      </div>

      {/* Rating Response */}
      <div className="min-h-[50px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {rating !== null && (
            <motion.div
              key={rating}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-2.5 rounded-xl glass-panel border border-amber-400/25 bg-purple-950/60 max-w-xs"
            >
              <p className="text-xs font-medium text-amber-200">
                {getFeedback(rating)}
              </p>
              <p className="text-[11px] text-purple-300/60 mt-0.5">
                Either way… thanks for making it this far. ✨
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

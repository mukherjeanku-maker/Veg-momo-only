import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playBubbleTap, playSparkle } from '../utils/sound';

interface MoodSelectorProps {
  onComplete?: (mood: string) => void;
}

const MOODS = [
  {
    id: 'calm',
    emoji: '😌',
    label: 'Calm',
    response: 'Calm energy. Respect.',
    animation: { rotate: [0, -4, 4, 0], scale: [1, 1.1, 1] },
  },
  {
    id: 'curious',
    emoji: '👀',
    label: 'Curious',
    response: 'Ah. Curious. I see.',
    animation: { x: [0, -3, 3, 0], scale: [1, 1.12, 1] },
  },
  {
    id: 'chaos',
    emoji: '🤣',
    label: 'Chaos',
    response: 'Okay, chaos detected.',
    animation: { rotate: [-10, 10, -8, 8, 0], y: [0, -6, 0] },
  },
  {
    id: 'suspicious',
    emoji: '🫣',
    label: 'Suspicious',
    response: 'Now that’s suspicious.',
    animation: { scale: [1, 0.9, 1.08, 1], y: [0, 3, -2, 0] },
  },
];

export const MoodSelector: React.FC<MoodSelectorProps> = ({ onComplete }) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    playBubbleTap();
    setSelectedMood(id);
    if (id === 'chaos' || id === 'curious') {
      playSparkle();
    }
    onComplete?.(id);
  };

  const selectedItem = MOODS.find((m) => m.id === selectedMood);

  return (
    <div id="mood-selector-container" className="w-full max-w-sm mx-auto my-4 text-center select-none">
      <div className="mb-3">
        <span className="text-[11px] uppercase tracking-widest text-purple-300/60 font-medium">
          Quick question
        </span>
        <h4 className="text-sm sm:text-base font-light text-purple-100 mt-0.5">
          What’s your current mood?
        </h4>
      </div>

      {/* 4 Floating Emoji Buttons with micro-animations */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-3">
        {MOODS.map((mood) => {
          const isSelected = selectedMood === mood.id;
          return (
            <motion.button
              key={mood.id}
              id={`mood-btn-${mood.id}`}
              onClick={() => handleSelect(mood.id)}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.92 }}
              animate={isSelected ? mood.animation : { y: [0, -3, 0] }}
              transition={
                isSelected
                  ? { duration: 0.6 }
                  : { duration: 3 + Math.random(), repeat: Infinity, ease: 'easeInOut' }
              }
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-300 border cursor-pointer ${
                isSelected
                  ? 'bg-purple-600/50 border-purple-300 shadow-[0_0_18px_rgba(192,132,252,0.45)]'
                  : 'glass-panel border-purple-400/20 hover:border-purple-400/50 text-purple-200'
              }`}
              title={mood.label}
              aria-label={mood.label}
            >
              <span>{mood.emoji}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Mood Feedback Display */}
      <div className="min-h-[48px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {selectedItem && (
            <motion.div
              key={selectedItem.id}
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="px-4 py-2 rounded-xl glass-panel border border-purple-400/25 max-w-xs"
            >
              <p className="text-xs sm:text-sm font-medium text-purple-200">
                {selectedItem.response}
              </p>
              <p className="text-[11px] text-purple-300/60 mt-0.5">
                Noted. Moving on before this gets scientifically complicated.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

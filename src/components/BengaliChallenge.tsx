import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SudiptaAvatar } from './CartoonAvatars';
import { playBubbleTap, playSparkle } from '../utils/sound';

interface BengaliChallengeProps {
  onComplete?: () => void;
}

const BENGALI_OPTIONS = [
  { id: 'okay', label: 'Okay', isCorrect: false },
  { id: 'interesting', label: 'Interesting…', isCorrect: false },
  { id: 'anything', label: 'Could mean absolutely anything', isCorrect: false },
  { id: 'all', label: 'All of the above 👀', isCorrect: true },
];

export const BengaliChallenge: React.FC<BengaliChallengeProps> = ({ onComplete }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    playBubbleTap();
    setSelectedOption(id);
    if (id === 'all') {
      playSparkle();
    }
    onComplete?.();
  };

  return (
    <div id="bengali-challenge-card" className="w-full max-w-md mx-auto my-4 text-center select-none">
      {/* Header with Cartoon Sudipta */}
      <div className="flex flex-col items-center mb-3">
        <div className="mb-2">
          <SudiptaAvatar
            size={68}
            expression={selectedOption === 'all' ? 'amused' : 'curious'}
            speechBubble={selectedOption ? 'আচ্ছা… 😌' : undefined}
            showGlow
            interactive
            emojiReaction="🇮🇳"
          />
        </div>

        <span className="text-[11px] uppercase tracking-widest text-purple-300/70 font-medium">
          Since you said “Yup obviously”…
        </span>
        <h4 className="text-sm sm:text-base font-medium text-purple-100 mt-0.5">
          Tiny Bengali test
        </h4>
        <p className="text-xs text-purple-300/80 mt-1 font-light">
          What does <span className="font-bengali font-semibold text-pink-300 text-sm">“আচ্ছা”</span> mean depending on the situation?
        </p>
      </div>

      {/* 4 Choices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3">
        {BENGALI_OPTIONS.map((opt) => {
          const isSelected = selectedOption === opt.id;
          return (
            <motion.button
              key={opt.id}
              id={`bengali-opt-${opt.id}`}
              onClick={() => handleSelect(opt.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 border text-left flex items-center justify-between cursor-pointer ${
                isSelected
                  ? opt.isCorrect
                    ? 'bg-gradient-to-r from-pink-600/90 to-purple-600/90 text-white border-pink-300/50 shadow-[0_0_18px_rgba(236,72,153,0.35)]'
                    : 'bg-purple-800/60 text-purple-100 border-purple-400/40'
                  : 'glass-panel text-purple-200 border-purple-400/20 hover:border-purple-400/50'
              }`}
            >
              <span>{opt.label}</span>
              {isSelected && <span className="text-xs">{opt.isCorrect ? '✨' : '👀'}</span>}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback Card */}
      <div className="min-h-[56px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {selectedOption && (
            <motion.div
              key={selectedOption}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-3 rounded-xl glass-panel border border-pink-400/30 bg-purple-950/70 max-w-sm"
            >
              <p className="text-xs sm:text-sm font-medium text-pink-200">
                {selectedOption === 'all'
                  ? 'Exactly. Bengali is already getting dangerous.'
                  : 'Close enough… but the true master answer is “All of the above 👀”'}
              </p>
              <p className="text-[11px] font-bengali text-purple-300/80 mt-1">
                আচ্ছা… 😌
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

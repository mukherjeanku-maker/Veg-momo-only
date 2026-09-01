import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye, CheckCircle2 } from 'lucide-react';
import { playBubbleTap, playSparkle } from '../utils/sound';

interface TinyThingsNoticedProps {
  onDone?: () => void;
}

const OBSERVATIONS = [
  {
    id: 1,
    badge: 'Observation 01',
    text: '“Yup obviously” has a very confident energy.',
    emoji: '✨',
  },
  {
    id: 2,
    badge: 'Observation 02',
    text: 'Apparently “To quit?? 🤣” is a surprisingly memorable sentence.',
    emoji: '💭',
  },
  {
    id: 3,
    badge: 'Observation 03',
    text: 'You somehow make a normal conversation slightly less normal.',
    emoji: '👀',
  },
];

export const TinyThingsNoticed: React.FC<TinyThingsNoticedProps> = ({ onDone }) => {
  const [revealedCount, setRevealedCount] = useState(1);

  const handleNext = () => {
    playBubbleTap();
    if (revealedCount < OBSERVATIONS.length) {
      setRevealedCount((prev) => prev + 1);
      if (revealedCount + 1 === OBSERVATIONS.length) {
        playSparkle();
        onDone?.();
      }
    }
  };

  const isAllRevealed = revealedCount >= OBSERVATIONS.length;

  return (
    <div id="tiny-things-noticed-card" className="w-full max-w-md mx-auto my-4 text-center select-none">
      <div className="mb-4">
        <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-purple-300/70 font-medium">
          <Eye className="w-3.5 h-3.5 text-purple-400" />
          <span>Tiny things I noticed…</span>
        </div>
        <p className="text-xs text-purple-300/60 mt-0.5">
          Nothing serious. Just observations. 👀
        </p>
      </div>

      {/* 3 Animated Glass Cards */}
      <div className="space-y-2.5 my-3">
        {OBSERVATIONS.slice(0, revealedCount).map((obs, index) => (
          <motion.div
            key={obs.id}
            id={`observation-card-${obs.id}`}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="p-3.5 rounded-2xl glass-panel border border-purple-400/20 text-left flex items-start gap-3 bg-purple-950/40"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-400/30 flex items-center justify-center text-sm shrink-0 mt-0.5">
              <span>{obs.emoji}</span>
            </div>
            <div className="flex-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400/80 font-semibold">
                {obs.badge}
              </span>
              <p className="text-xs sm:text-sm text-purple-100 font-normal mt-0.5 leading-relaxed">
                {obs.text}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reveal More / Done State */}
      <div className="mt-3 flex flex-col items-center justify-center min-h-[44px]">
        <AnimatePresence mode="wait">
          {!isAllRevealed ? (
            <motion.button
              key="reveal-btn"
              id="tiny-things-reveal-btn"
              onClick={handleNext}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="text-xs px-4 py-2 rounded-full glass-pill text-purple-200 hover:text-white hover:border-purple-400/40 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>Next observation</span>
              <span className="text-[11px] text-purple-400 font-mono">
                ({revealedCount}/{OBSERVATIONS.length})
              </span>
            </motion.button>
          ) : (
            <motion.div
              key="done-msg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-1.5 text-xs text-purple-200 font-medium py-1 px-3 rounded-full bg-purple-900/40 border border-purple-400/20"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-pink-400" />
              <span>Okay, investigation over. 😌</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

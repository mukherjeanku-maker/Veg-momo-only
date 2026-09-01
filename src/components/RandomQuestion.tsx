import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, HelpCircle } from 'lucide-react';
import { playBubbleTap } from '../utils/sound';

interface RandomQuestionProps {
  onAnswer?: (ans: string) => void;
}

const QUESTION_OPTIONS = [
  { id: 'sleeping', label: 'Sleeping 😴' },
  { id: 'dancing', label: 'Dancing 💃' },
  { id: 'mind_reading', label: 'Reading minds 👀' },
  { id: 'nothing', label: 'Doing absolutely nothing 😌' },
];

export const RandomQuestion: React.FC<RandomQuestionProps> = ({ onAnswer }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (id: string) => {
    playBubbleTap();
    setSelected(id);
    onAnswer?.(id);
  };

  return (
    <div id="random-question-card" className="w-full max-w-sm mx-auto my-3 text-center select-none">
      <div className="mb-2">
        <div className="flex items-center justify-center gap-1.5 text-[11px] uppercase tracking-widest text-purple-300/60 font-medium">
          <HelpCircle className="w-3 h-3 text-purple-400" />
          <span>Since you’re already here…</span>
        </div>
        <p className="text-xs sm:text-sm font-light text-purple-100 mt-0.5">
          If you could instantly become ridiculously good at one thing, what would it be?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 my-2.5">
        {QUESTION_OPTIONS.map((opt) => (
          <motion.button
            key={opt.id}
            id={`random-opt-${opt.id}`}
            onClick={() => handleSelect(opt.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            className={`py-2 px-3 rounded-xl text-xs font-medium transition-all duration-300 border cursor-pointer ${
              selected === opt.id
                ? 'bg-purple-600/60 text-white border-purple-300/50 shadow-[0_0_15px_rgba(192,132,252,0.3)]'
                : 'glass-panel text-purple-200 border-purple-400/20 hover:border-purple-300/40'
            }`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>

      <div className="min-h-[40px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-purple-200 py-1.5 px-3 rounded-lg glass-panel border border-purple-400/20"
            >
              <span>Interesting choice. </span>
              <span className="text-purple-300/80">I'll pretend I didn't judge you. 😂</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

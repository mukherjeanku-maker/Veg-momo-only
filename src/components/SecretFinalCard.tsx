import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Gift } from 'lucide-react';
import { playBubbleTap, playSparkle } from '../utils/sound';

export const SecretFinalCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const handleOpen = () => {
    playBubbleTap();
    playSparkle();
    setIsOpen(true);
    setStep(1);
    setTimeout(() => setStep(2), 1400);
    setTimeout(() => setStep(3), 3200);
  };

  const handleClose = () => {
    playBubbleTap();
    setIsOpen(false);
    setStep(0);
  };

  return (
    <div id="secret-final-card-wrapper" className="mt-4 flex flex-col items-center select-none">
      {!isOpen ? (
        <motion.button
          id="secret-psst-btn"
          onClick={handleOpen}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="text-[11px] text-purple-400/60 hover:text-purple-300 transition-colors py-1 px-3 rounded-full border border-purple-400/20 hover:border-purple-400/40 bg-purple-950/40 cursor-pointer flex items-center gap-1"
        >
          <span className="opacity-75">psst…</span>
          <Sparkles className="w-2.5 h-2.5 text-purple-400/70" />
        </motion.button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm p-4 rounded-2xl glass-panel border border-pink-400/30 bg-purple-950/90 text-center relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
          >
            <button
              id="secret-close-btn"
              onClick={handleClose}
              className="absolute top-2.5 right-2.5 p-1 text-purple-400/60 hover:text-purple-200 rounded-full cursor-pointer"
              aria-label="Close secret card"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-pink-300 text-xs uppercase tracking-wider font-medium mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>One last tiny thing…</span>
            </div>

            <div className="space-y-2 py-1 min-h-[90px] flex flex-col items-center justify-center">
              {step >= 1 && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-purple-200"
                >
                  You have officially been added to the very exclusive list of…
                </motion.p>
              )}

              {step >= 2 && (
                <motion.p
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-xs sm:text-sm font-medium text-pink-200 leading-snug"
                >
                  People who have a website page dedicated to them. 😂
                </motion.p>
              )}

              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-1"
                >
                  <p className="text-[11px] text-purple-300/60">
                    Membership benefits currently include absolutely nothing.
                  </p>
                  <span className="inline-block text-xs text-pink-400 font-medium mt-1">
                    ✨ congratulations.
                  </span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

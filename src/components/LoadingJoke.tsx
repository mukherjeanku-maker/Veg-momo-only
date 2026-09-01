import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Check } from 'lucide-react';
import { playSoftChime } from '../utils/sound';

interface LoadingJokeProps {
  isOpen: boolean;
  onFinished: () => void;
}

export const LoadingJoke: React.FC<LoadingJokeProps> = ({ isOpen, onFinished }) => {
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsDone(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setIsDone(true);
      playSoftChime(880);
    }, 1100);

    const timer2 = setTimeout(() => {
      onFinished();
    }, 1700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, onFinished]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md select-none"
        >
          <motion.div
            initial={{ scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="p-5 rounded-3xl glass-panel border border-purple-400/30 bg-purple-950/90 text-center max-w-xs shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col items-center"
          >
            <div className="w-10 h-10 rounded-full bg-purple-900/50 flex items-center justify-center mb-3 border border-purple-400/30">
              {!isDone ? (
                <Loader2 className="w-5 h-5 text-purple-300 animate-spin" />
              ) : (
                <Check className="w-5 h-5 text-pink-300" />
              )}
            </div>

            <p className="text-xs sm:text-sm font-medium text-purple-100 leading-snug">
              {!isDone ? 'Loading next unnecessarily complicated thought…' : 'Done.'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

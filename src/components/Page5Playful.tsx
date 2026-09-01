import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { MeAvatar, SudiptaAvatar } from './CartoonAvatars';
import { FlowerIllustration } from './FlowerIllustration';
import { StickyNote, HandwrittenAnnotation } from './Doodles';
import { playSoftChime, playBubbleTap } from '../utils/sound';

interface Page5PlayfulProps {
  onNext: () => void;
}

export const Page5Playful: React.FC<Page5PlayfulProps> = ({ onNext }) => {
  // Steps:
  // 0: Cafe table setup with 2 drinks
  // 1: "Imagine this…" -> "Just you and me."
  // 2: "No awkward introductions."
  // 3: "No 'what should I say now?'"
  // 4: "Just random conversations… bad jokes… and you laughing at something unnecessarily stupid. 😂"
  // 5: "Honestly… I'd like that. 😌" + Button: "Keep going →"
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setStep(1);
        playSoftChime(440);
      }, 700),
      setTimeout(() => {
        setStep(2);
      }, 2400),
      setTimeout(() => {
        setStep(3);
        playSoftChime(523.25);
      }, 4400),
      setTimeout(() => {
        setStep(4);
      }, 6400),
      setTimeout(() => {
        setStep(5);
        playSoftChime(659.25);
      }, 8800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleProceed = () => {
    playSoftChime(659.25);
    onNext();
  };

  return (
    <div
      id="page5-cafe-date-stage"
      className="relative flex flex-col items-center justify-center min-h-[85dvh] max-w-lg mx-auto text-center px-4 sm:px-6 py-6 select-none"
    >
      {/* Illustrated 2D Café Setting: Two cartoon characters across small table with 2 drinks */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center mb-4 w-full max-w-xs"
      >
        {/* Soft warm tabletop glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-pink-500/10 to-transparent rounded-3xl blur-xl pointer-events-none" />

        {/* Characters across small table */}
        <div className="relative flex items-center justify-between w-full px-2 py-3 bg-purple-950/40 rounded-3xl border border-amber-400/20 backdrop-blur-md">
          {/* Me */}
          <div className="flex flex-col items-center">
            <MeAvatar
              size={64}
              expression={step >= 4 ? 'laughing' : 'hopeful'}
              animateVariant={step >= 4 ? 'laughing' : 'idle'}
              showGlow
              emojiReaction={step >= 4 ? '😂' : '☕'}
              interactive
            />
            <span className="text-[10px] text-purple-300/70 mt-1 font-medium font-handwritten">Me</span>
          </div>

          {/* Center Table with 2 drinks, tiny flower & warm candle */}
          <div className="flex flex-col items-center px-1">
            {/* Soft Candle Flame */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_12px_4px_rgba(251,191,36,0.8)] mb-0.5"
            />
            {/* Table Surface with tiny flower & drinks */}
            <div className="relative w-24 h-5 rounded-full bg-amber-800/60 border border-amber-500/40 flex items-center justify-center gap-2 px-1">
              <span className="text-xs" title="Warm Coffee">☕</span>
              <span className="text-[10px]" title="The same flower">🌷</span>
              <span className="text-xs" title="Sweet Drink">🧋</span>
            </div>
            <span className="text-[9px] text-amber-200/60 font-handwritten text-xs mt-0.5">our table ✨</span>
          </div>

          {/* Sudipta */}
          <div className="flex flex-col items-center">
            <SudiptaAvatar
              size={64}
              expression={step >= 4 ? 'laughing' : 'playful'}
              animateVariant={step >= 4 ? 'celebrating' : 'idle'}
              showGlow
              emojiReaction={step >= 4 ? '🤣' : '🌸'}
              interactive
            />
            <span className="text-[10px] text-pink-300/70 mt-1 font-medium font-handwritten">Sudipta</span>
          </div>
        </div>
      </motion.div>

      {/* Date Narrative Dialogue Card */}
      <div className="w-full relative max-w-md space-y-3 min-h-[260px] flex flex-col justify-center glass-panel p-5 sm:p-6 rounded-3xl border border-amber-400/25 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Sticky note */}
        {step >= 3 && (
          <div className="absolute -top-3 -right-2 z-30 hidden sm:block">
            <StickyNote
              text="don't judge my coffee doodle 😂"
              rotation={2.5}
              color="yellow"
              delay={0.1}
            />
          </div>
        )}

        {/* Heading: "Imagine this…" */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-semibold font-handwritten text-sm">
            <span>☕</span>
            <span>Little Café Moment</span>
            <span>🌷</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-serif-elegant font-medium text-white"
          >
            Imagine this…
          </motion.h2>
        </div>

        {/* 1. "Just you and me." */}
        {step >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-base sm:text-lg font-serif-elegant text-pink-200 font-medium"
          >
            Just you and me. ✨
          </motion.p>
        )}

        {/* 2 & 3: "No awkward introductions." & "No 'what should I say now?'" */}
        <div className="space-y-1 text-xs sm:text-sm text-purple-200/80 font-light">
          {step >= 2 && (
            <motion.p initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              No awkward introductions.
            </motion.p>
          )}
          {step >= 3 && (
            <motion.p initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
              No <span className="italic">“what should I say now?”</span>
            </motion.p>
          )}
        </div>

        {/* 4. "Just random conversations… bad jokes… and you laughing at something unnecessarily stupid. 😂" */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="p-3 bg-purple-900/40 rounded-2xl border border-purple-400/20 space-y-1"
          >
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed font-light">
              Just random conversations… bad jokes…
            </p>
            <p className="text-sm sm:text-base font-serif-elegant font-medium text-pink-200">
              …and you laughing at something unnecessarily stupid. 😂
            </p>
          </motion.div>
        )}

        {/* 5. "Honestly… I'd like that. 😌" */}
        {step >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="pt-2 border-t border-amber-400/20 text-center"
          >
            <p className="text-base sm:text-lg font-serif-elegant font-semibold text-white">
              Honestly… <span className="bg-gradient-to-r from-pink-300 to-amber-200 bg-clip-text text-transparent">I&apos;d like that.</span> 😌
            </p>
          </motion.div>
        )}
      </div>

      {/* Mobile sticky note */}
      {step >= 3 && (
        <div className="mt-3 block sm:hidden">
          <StickyNote
            text="don't judge my coffee doodle 😂"
            rotation={-1.5}
            color="yellow"
          />
        </div>
      )}

      {/* Button: "Keep going →" */}
      <div className="pt-5 min-h-[70px]">
        {step >= 5 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              id="page5-keep-going-btn"
              onClick={handleProceed}
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(251, 191, 36, 0.45)' }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 min-h-[48px] rounded-full font-serif-elegant font-medium text-sm sm:text-base text-white bg-gradient-to-r from-amber-600 via-pink-600 to-purple-600 hover:from-amber-500 hover:to-purple-500 border border-amber-300/40 shadow-[0_4px_25px_rgba(251,191,36,0.35)] cursor-pointer transition-all"
            >
              <span>Keep going</span>
              <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        ) : (
          <button
            onClick={() => setStep(5)}
            className="text-[11px] text-purple-300/40 hover:text-purple-200 transition-colors py-1 cursor-pointer font-handwritten text-xs"
          >
            skip wait ⚡
          </button>
        )}
      </div>
    </div>
  );
};

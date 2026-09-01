import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Heart } from 'lucide-react';
import { MeAvatar, SudiptaAvatar } from './CartoonAvatars';
import { FlowerIllustration } from './FlowerIllustration';
import { StickyNote, DoodleStar, DoodleHeart } from './Doodles';
import { playSoftChime, playSparkle } from '../utils/sound';

interface Page6FinalMessageProps {
  onNext: () => void;
}

export const Page6FinalMessage: React.FC<Page6FinalMessageProps> = ({ onNext }) => {
  // Paced emotional reveals:
  // 0: Night sky with characters sitting together looking up with the 🌷 flower
  // 1: "Maybe it's a little early… Maybe I'm getting slightly ahead of myself. But…"
  // 2: "I like talking to you."
  // 3: "I like getting to know you."
  // 4: "And I'd really like to know you a little more."
  // 5: The Secret Human Note: "Honestly… I wasn't sure if I should send you this... But then I thought… Why not? 😌"
  // 6: "I just think… You might be someone worth knowing. ❤️"
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setStep(1);
        playSoftChime(440);
      }, 800),
      setTimeout(() => {
        setStep(2);
        playSoftChime(523.25);
      }, 2600),
      setTimeout(() => {
        setStep(3);
        playSoftChime(587.33);
      }, 4400),
      setTimeout(() => {
        setStep(4);
        playSoftChime(659.25);
      }, 6200),
      setTimeout(() => {
        setStep(5);
        playSparkle();
      }, 8400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleProceed = () => {
    playSoftChime(659.25);
    onNext();
  };

  return (
    <div
      id="page6-romantic-buildup-stage"
      className="relative flex flex-col items-center justify-center min-h-[85dvh] max-w-lg mx-auto text-center px-4 sm:px-6 py-6 select-none"
    >
      {/* Visual: Two Cartoon Characters Sitting Side-by-Side Looking Up at the Night Sky with flower */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center mb-4"
      >
        {/* Soft night starlight ground reflection */}
        <div className="absolute -bottom-2 w-56 h-8 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex items-end justify-center gap-4 sm:gap-6">
          <MeAvatar
            size={72}
            expression={step >= 5 ? 'hopeful' : 'shy'}
            animateVariant={step >= 5 ? 'nodding' : 'idle'}
            showGlow
            emojiReaction={step >= 5 ? '❤️' : '🌙'}
            interactive
          />

          {/* The recurring flower placed gently between them */}
          <div className="flex flex-col items-center -mb-1">
            <FlowerIllustration size={54} breeze glow={false} />
          </div>

          <SudiptaAvatar
            size={72}
            expression={step >= 5 ? 'playful' : 'shy'}
            animateVariant={step >= 5 ? 'idle' : 'idle'}
            showGlow
            emojiReaction={step >= 5 ? '🌷' : '✨'}
            interactive
          />
        </div>
      </motion.div>

      {/* Main Emotional Narrative Card */}
      <div className="w-full relative max-w-md space-y-3.5 min-h-[290px] flex flex-col justify-center glass-panel p-5 sm:p-7 rounded-3xl border border-pink-400/25 shadow-[0_12px_40px_rgba(0,0,0,0.5)]">
        {/* Heading */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-pink-300 font-semibold font-handwritten text-sm">
            <span>✨</span>
            <span>Under The Stars</span>
            <span>🌷</span>
          </div>
        </div>

        {/* Step 1: "Maybe it's a little early… Maybe I'm getting slightly ahead of myself. But…" */}
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-0.5"
          >
            <p className="text-xs sm:text-sm text-purple-200/80 font-light">
              Maybe it&apos;s a little early…
            </p>
            <p className="text-xs sm:text-sm text-purple-200/80 font-light">
              Maybe I&apos;m getting slightly ahead of myself.
            </p>
            <p className="text-sm font-serif-elegant italic text-pink-300 pt-0.5">
              But…
            </p>
          </motion.div>
        )}

        {/* Step 2, 3, 4: Progressive connection affirmations */}
        <div className="space-y-1 text-sm sm:text-base font-serif-elegant">
          {step >= 2 && (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-purple-100"
            >
              “I like talking to you.”
            </motion.p>
          )}
          {step >= 3 && (
            <motion.p
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-pink-200"
            >
              “I like getting to know you.”
            </motion.p>
          )}
          {step >= 4 && (
            <motion.p
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-white font-medium"
            >
              “And I&apos;d really like to know you a little more.”
            </motion.p>
          )}
        </div>

        {/* Step 5: The Secret Personal Note (Human Moment) */}
        {step >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="pt-3 border-t border-pink-400/25 space-y-2.5"
          >
            {/* Hand-crafted secret paper note */}
            <div className="relative p-3.5 rounded-2xl bg-pink-950/40 border border-pink-400/30 text-left font-handwritten text-sm sm:text-base text-pink-100/90 shadow-inner">
              <p>Honestly…</p>
              <p className="pl-2 text-purple-200">I wasn&apos;t sure if I should send you this.</p>
              <p className="pl-2 text-pink-200 font-semibold">But then I thought… Why not? 😌</p>
              <p className="text-right text-xs text-pink-300/80 pt-1 font-serif-elegant italic">
                So here we are.
              </p>
            </div>

            <p className="text-base sm:text-lg font-serif-elegant font-semibold bg-gradient-to-r from-pink-200 via-rose-200 to-white bg-clip-text text-transparent leading-relaxed text-center">
              I just think… You might be someone worth knowing.{' '}
              <span className="inline-block text-rose-400">❤️</span>
            </p>
          </motion.div>
        )}
      </div>

      {/* Button: "One more question… →" */}
      <div className="pt-5 min-h-[70px]">
        {step >= 5 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              id="page6-keep-going-btn"
              onClick={handleProceed}
              whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(244, 114, 182, 0.5)' }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 min-h-[48px] rounded-full font-serif-elegant font-medium text-sm sm:text-base text-white bg-gradient-to-r from-pink-600 via-purple-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 border border-pink-300/40 shadow-[0_4px_30px_rgba(236,72,153,0.4)] cursor-pointer transition-all"
            >
              <span>One more question</span>
              <ArrowRight className="w-4 h-4 text-pink-200 group-hover:translate-x-1 transition-transform" />
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

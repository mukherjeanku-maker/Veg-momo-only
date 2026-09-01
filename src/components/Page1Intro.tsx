import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { FlowerIllustration } from './FlowerIllustration';
import { MeAvatar } from './CartoonAvatars';
import { StickyNote, DoodleStar } from './Doodles';
import { playSoftChime, playBubbleTap } from '../utils/sound';

interface Page1IntroProps {
  onNext: () => void;
  onTriggerEyesEgg?: () => void;
}

export const Page1Intro: React.FC<Page1IntroProps> = ({ onNext, onTriggerEyesEgg }) => {
  // Reveal steps:
  // 0: Initial tiny glowing point
  // 1: Flower emerges and blooms
  // 2: "A flower for you. 🌷"
  // 3: "Because apparently saying 'Hi' normally wasn't interesting enough."
  // 4: Cartoon boy character appears beside flower (nervous)
  // 5: "Also... Why aren't you replying? 👀"
  // 6: "Are you angry at me? 🫣" (worried)
  // 7: "Or are you just pretending you didn't see this? 😏" + Sticky note + Button: "Okay, I'll explain →"
  const [step, setStep] = useState<number>(0);

  // Automatic progression sequence with organic pacing
  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setStep(1);
        playSoftChime(440);
      }, 1200), // Flower grows
      setTimeout(() => {
        setStep(2);
        playSoftChime(523.25);
      }, 2800), // "A flower for you. 🌷"
      setTimeout(() => {
        setStep(3);
      }, 4400), // "Because apparently saying 'Hi'..."
      setTimeout(() => {
        setStep(4);
        playSoftChime(587.33);
      }, 6200), // Cartoon boy appears
      setTimeout(() => {
        setStep(5);
      }, 8200), // "Also... Why aren't you replying? 👀"
      setTimeout(() => {
        setStep(6);
      }, 10400), // "Are you angry at me? 🫣"
      setTimeout(() => {
        setStep(7);
        playSoftChime(659.25);
      }, 12600), // "Or are you just pretending..." + Button
    ];

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleProceed = () => {
    playSoftChime(659.25);
    onNext();
  };

  // Determine boy character's current emotion
  const getBoyExpression = () => {
    if (step >= 7) return 'curious';
    if (step === 6) return 'confused';
    if (step === 5) return 'awkward';
    return 'shy';
  };

  return (
    <div
      id="page1-intro-stage"
      className="relative flex flex-col items-center justify-center min-h-[85dvh] max-w-lg mx-auto text-center px-4 sm:px-6 py-6 select-none overflow-hidden"
    >
      {/* 0. Initial glowing point before bloom */}
      <AnimatePresence>
        {step === 0 && (
          <motion.div
            key="glowing-point"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.4, 1],
              opacity: [0, 1, 0.8],
            }}
            exit={{ scale: 1.8, opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="flex flex-col items-center gap-3 my-auto"
          >
            <div className="relative w-4 h-4 rounded-full bg-pink-300 shadow-[0_0_25px_10px_rgba(244,114,182,0.8)] animate-pulse" />
            <span className="text-xs tracking-widest text-purple-300/60 font-handwritten text-base italic">
              shh… wait for it ✨
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Flower & Cartoon Character Center Stage */}
      {step >= 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center w-full relative"
        >
          {/* Handwritten Sticky Note pinned in corner */}
          {step >= 5 && (
            <div className="absolute -top-3 right-0 z-30 hidden sm:block">
              <StickyNote
                text="made this little thing and now I'm hoping it isn't cringe 😭"
                rotation={3}
                color="yellow"
                delay={0.2}
              />
            </div>
          )}

          {/* Visual duo: Flower + Nervous Cartoon Boy */}
          <div className="relative flex items-end justify-center gap-3 sm:gap-6 mb-4 sm:mb-5 min-h-[140px]">
            {/* The blooming flower */}
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <FlowerIllustration size={110} breeze glow />
            </motion.div>

            {/* Cartoon boy appearing beside the flower */}
            <AnimatePresence>
              {step >= 4 && (
                <motion.div
                  key="cartoon-boy-intro"
                  initial={{ opacity: 0, scale: 0.6, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                  className="relative -mb-1"
                >
                  <MeAvatar
                    size={68}
                    expression={getBoyExpression()}
                    showGlow
                    animateVariant={step >= 7 ? 'bouncing' : 'shy'}
                    emojiReaction={
                      step >= 7 ? '😏' : step === 6 ? '🫣' : step === 5 ? '👀' : '🌷'
                    }
                    interactive
                    onClick={() => {
                      playBubbleTap();
                      onTriggerEyesEgg?.();
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sequential Text Reveals */}
          <div className="space-y-3.5 max-w-md mx-auto min-h-[180px] flex flex-col justify-center">
            {/* 1. "A flower for you. 🌷" */}
            {step >= 2 && (
              <motion.h1
                id="intro-flower-title"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-3xl sm:text-4xl md:text-5xl font-serif-elegant font-medium text-white tracking-tight"
              >
                A flower for you.{' '}
                <span className="inline-block animate-bounce text-pink-300">🌷</span>
              </motion.h1>
            )}

            {/* 2. "Because apparently saying 'Hi' normally wasn't interesting enough." */}
            {step >= 3 && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-sm sm:text-base text-purple-200/85 font-light leading-relaxed px-2"
              >
                Because apparently saying <span className="text-pink-200 font-medium">“Hi”</span> normally wasn&apos;t interesting enough.
              </motion.p>
            )}

            {/* 3. "Also... Why aren't you replying? 👀" */}
            {step >= 5 && (
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7 }}
                className="pt-1.5"
              >
                <span className="text-xs tracking-wider uppercase text-pink-300/80 font-semibold block mb-1">
                  Also…
                </span>
                <p className="text-base sm:text-lg font-serif-elegant text-white font-medium">
                  Why aren&apos;t you replying?{' '}
                  <span className="inline-block animate-pulse">👀</span>
                </p>
              </motion.div>
            )}

            {/* 4. "Are you angry at me? 🫣" */}
            {step === 6 && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="text-sm sm:text-base text-purple-300/90 italic"
              >
                Are you angry at me? 🫣
              </motion.p>
            )}

            {/* 5. "Or are you just pretending you didn't see this? 😏" */}
            {step >= 7 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-1.5"
              >
                <p className="text-sm sm:text-base text-pink-200 font-medium">
                  Or are you just pretending you didn&apos;t see this? 😏
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-purple-300/60 pt-0.5 font-handwritten text-sm">
                  <span>🌷</span>
                  <span>don&apos;t judge me 😂</span>
                  <span>✨</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Mobile sticky note */}
          {step >= 5 && (
            <div className="mt-3 block sm:hidden">
              <StickyNote
                text="made this little thing and now I'm hoping it isn't cringe 😭"
                rotation={-1}
                color="yellow"
              />
            </div>
          )}

          {/* Action Button: "Okay, I'll explain →" */}
          <div className="pt-5 min-h-[70px]">
            {step >= 7 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-2"
              >
                <motion.button
                  id="page1-proceed-btn"
                  onClick={handleProceed}
                  whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(244, 114, 182, 0.45)' }}
                  whileTap={{ scale: 0.96 }}
                  className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 min-h-[48px] rounded-full font-serif-elegant font-medium text-sm sm:text-base text-white bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 border border-pink-300/40 shadow-[0_4px_25px_rgba(236,72,153,0.35)] cursor-pointer transition-all"
                >
                  <span>Okay, I&apos;ll explain</span>
                  <ArrowRight className="w-4 h-4 text-pink-200 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </motion.div>
            ) : (
              /* Allow impatient users to skip ahead easily */
              <button
                onClick={() => setStep(7)}
                className="text-[11px] text-purple-300/40 hover:text-purple-200 transition-colors py-1 cursor-pointer font-handwritten text-xs"
              >
                skip wait ⚡
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};


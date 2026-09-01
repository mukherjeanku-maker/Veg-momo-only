import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { MeAvatar } from './CartoonAvatars';
import { FlowerIllustration } from './FlowerIllustration';
import { StickyNote, HandwrittenAnnotation } from './Doodles';
import { playSoftChime, playBubbleTap } from '../utils/sound';

interface Page2StoryProps {
  onNext: () => void;
  onTriggerLoadingJoke?: () => void;
}

export const Page2Story: React.FC<Page2StoryProps> = ({ onNext }) => {
  // Step-by-step reveal:
  // 0: Male character with tiny flower
  // 1: "Okay okay… Don't be angry."
  // 2: "Don't judge me. 😂" + "I promise this isn't as dramatic as it looks."
  // 3: "Wait… I forgot what I was going to say. 😂 ... Okay, back to the point."
  // 4: "I just wanted to do something… a little different."
  // 5: "Because talking to you is actually kinda fun. 😌" + Button: "Keep going →"
  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setStep(1);
        playSoftChime(493.88);
      }, 700),
      setTimeout(() => {
        setStep(2);
      }, 2200),
      setTimeout(() => {
        setStep(3);
        playSoftChime(523.25);
      }, 4200),
      setTimeout(() => {
        setStep(4);
        playSoftChime(587.33);
      }, 6200),
      setTimeout(() => {
        setStep(5);
        playSoftChime(659.25);
      }, 8200),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleProceed = () => {
    playSoftChime(659.25);
    onNext();
  };

  return (
    <div
      id="page2-story-stage"
      className="relative flex flex-col items-center justify-center min-h-[85dvh] max-w-lg mx-auto text-center px-4 sm:px-6 py-6 select-none"
    >
      {/* Cartoon Scene: Boy sitting/standing with his tiny flower */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex flex-col items-center mb-5"
      >
        {/* Soft illuminated garden bench / ground aura */}
        <div className="absolute -bottom-2 w-48 h-10 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex items-end justify-center gap-3">
          <MeAvatar
            size={84}
            expression={step >= 5 ? 'hopeful' : step >= 3 ? 'awkward' : 'shy'}
            animateVariant={step >= 5 ? 'nodding' : step === 3 ? 'thinking' : 'shy'}
            showGlow
            emojiReaction={step >= 5 ? '😌' : step === 3 ? '🤔' : step >= 2 ? '😂' : '😭'}
            interactive
            onClick={() => {
              playBubbleTap();
              setStep(5);
            }}
          />

          {/* Tiny flower in hand / beside him */}
          <motion.div
            animate={{
              rotate: [-4, 4, -4],
              y: [0, -3, 0],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative -ml-4 -mb-2"
          >
            <FlowerIllustration size={70} breeze glow={false} />
          </motion.div>
        </div>
      </motion.div>

      {/* Story & Teasing Message Dialogue Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full relative space-y-3.5 max-w-md min-h-[220px] flex flex-col justify-center glass-panel p-5 sm:p-6 rounded-3xl border border-purple-400/20 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
      >
        {/* Sticky note positioned on side of card */}
        {step >= 3 && (
          <div className="absolute -top-4 -right-2 z-30 hidden sm:block">
            <StickyNote
              text="okay this animation took a slightly unnecessary turn."
              rotation={2}
              color="pink"
              delay={0.1}
            />
          </div>
        )}

        {/* Heading: "Okay okay… Don't be angry." */}
        <div className="space-y-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-pink-300 font-semibold"
          >
            <span>🌷</span>
            <span>Just hear me out</span>
            <span>😂</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl font-serif-elegant font-medium text-white"
          >
            Okay okay…{' '}
            <span className="bg-gradient-to-r from-pink-300 to-purple-200 bg-clip-text text-transparent">
              Don&apos;t be angry.
            </span>
          </motion.h2>
        </div>

        {/* 1. "Don't judge me. 😂 I promise this isn't as dramatic as it looks." */}
        {step >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-sm sm:text-base text-purple-100/90 leading-relaxed font-light"
          >
            Don&apos;t judge me. 😂 I promise this isn&apos;t as dramatic as it looks.
          </motion.p>
        )}

        {/* 2. "Wait… I forgot what I was going to say. 😂 ... Okay, back to the point." */}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-3 py-1.5 rounded-xl bg-purple-950/40 border border-purple-400/20 text-xs sm:text-sm text-purple-300/90 font-handwritten text-base"
          >
            Wait… I forgot what I was going to say. 😂 <br />
            <span className="text-pink-200 font-semibold">Okay, back to the point:</span>
          </motion.div>
        )}

        {/* 3. "I just wanted to do something… a little different." */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-1"
          >
            <p className="text-sm sm:text-base text-purple-200/80 font-light italic">
              I just wanted to do something…
            </p>
            <p className="text-base sm:text-lg font-serif-elegant font-semibold text-pink-200">
              …a little different. ✨
            </p>
          </motion.div>
        )}

        {/* 4. "Because talking to you is actually kinda fun. 😌" */}
        {step >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="pt-2 border-t border-purple-400/15"
          >
            <p className="text-base sm:text-lg font-serif-elegant font-medium text-white">
              Because talking to you is actually kinda fun.{' '}
              <span className="inline-block text-xl">😌</span>
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Mobile sticky note */}
      {step >= 3 && (
        <div className="mt-3 block sm:hidden">
          <StickyNote
            text="okay this animation took a slightly unnecessary turn."
            rotation={1}
            color="pink"
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
              id="page2-keep-going-btn"
              onClick={handleProceed}
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(192, 132, 252, 0.4)' }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 min-h-[48px] rounded-full font-serif-elegant font-medium text-sm sm:text-base text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:to-rose-400 border border-purple-300/40 shadow-[0_4px_25px_rgba(147,51,234,0.35)] cursor-pointer transition-all"
            >
              <span>Keep going</span>
              <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
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

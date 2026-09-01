import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { MeAvatar, SudiptaAvatar } from './CartoonAvatars';
import { FlowerIllustration } from './FlowerIllustration';
import { StickyNote } from './Doodles';
import { playSoftChime, playBubbleTap } from '../utils/sound';

interface Page4SurpriseProps {
  onNext: () => void;
  onSurpriseOpen?: () => void;
}

const MEMORABLE_CHAT = [
  { sender: 'me', text: '“Can I get another reply?”', emoji: '👀' },
  { sender: 'her', text: '“Nothing achieved thooo”', emoji: '💅' },
  { sender: 'me', text: '“Is there any possibilities?”', emoji: '🤔' },
  { sender: 'her', text: '“I quit was too funny tbh”', emoji: '😂' },
  { sender: 'me', text: '“Today was my birthday, i challenged myself”', emoji: '🎂' },
  { sender: 'her', text: '“To quit?? 🤣”', emoji: '🤣' },
];

export const Page4Surprise: React.FC<Page4SurpriseProps> = ({ onNext, onSurpriseOpen }) => {
  // Steps:
  // 0: Peaceful sunset setup
  // 1: "You probably don't know this…"
  // 2: "But some of our random little conversations…"
  // 3: "…stayed in my head longer than they probably should have. 😌"
  // 4: Memorable conversation bubbles appear
  // 5: "Yeah… That one definitely stayed. 😂" + "Why am I making this dramatic? 😂 Anyway… Focus." + Button
  const [step, setStep] = useState<number>(0);
  const [visibleChatCount, setVisibleChatCount] = useState<number>(0);

  useEffect(() => {
    onSurpriseOpen?.();

    const timers = [
      setTimeout(() => {
        setStep(1);
        playSoftChime(440);
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
      }, 5800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onSurpriseOpen]);

  // Animate chat lines one by one when step 4 activates
  useEffect(() => {
    if (step === 4) {
      const chatTimers: NodeJS.Timeout[] = [];
      MEMORABLE_CHAT.forEach((_, idx) => {
        chatTimers.push(
          setTimeout(() => {
            setVisibleChatCount(idx + 1);
            playBubbleTap();
          }, (idx + 1) * 650)
        );
      });

      chatTimers.push(
        setTimeout(() => {
          setStep(5);
          playSoftChime(659.25);
        }, (MEMORABLE_CHAT.length + 1) * 700)
      );

      return () => chatTimers.forEach(clearTimeout);
    }
  }, [step]);

  const handleProceed = () => {
    playSoftChime(659.25);
    onNext();
  };

  return (
    <div
      id="page4-memories-stage"
      className="relative flex flex-col items-center justify-center min-h-[85dvh] max-w-lg mx-auto text-center px-4 sm:px-6 py-6 select-none"
    >
      {/* 2D Cartoon Duo Sitting Peacefully at Sunset with tiny flower between them */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex items-end justify-center gap-4 sm:gap-6 mb-4"
      >
        <MeAvatar
          size={68}
          expression={step >= 5 ? 'laughing' : 'hopeful'}
          animateVariant={step >= 5 ? 'laughing' : 'idle'}
          showGlow
          emojiReaction={step >= 5 ? '😂' : '🌅'}
          interactive
        />
        
        {/* The recurring flower placed gently between them */}
        <div className="flex flex-col items-center -mb-1">
          <FlowerIllustration size={50} breeze glow={false} />
        </div>

        <SudiptaAvatar
          size={68}
          expression={step >= 5 ? 'laughing' : 'playful'}
          animateVariant={step >= 5 ? 'celebrating' : 'idle'}
          showGlow
          emojiReaction={step >= 5 ? '🤣' : '✨'}
          interactive
        />
      </motion.div>

      {/* Main Narrative Card */}
      <div className="w-full relative max-w-md space-y-3 min-h-[290px] flex flex-col justify-center glass-panel p-5 sm:p-6 rounded-3xl border border-amber-400/20 shadow-[0_8px_32px_rgba(0,0,0,0.45)]">
        {/* Sticky note */}
        {step >= 3 && (
          <div className="absolute -top-3 -right-2 z-30 hidden sm:block">
            <StickyNote
              text="don't ask why this exists. 😂"
              rotation={2}
              color="yellow"
              delay={0.1}
            />
          </div>
        )}

        {/* Step 1 & 2: Introductory lines */}
        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-amber-300 font-semibold font-handwritten text-sm">
            <span>🌷</span>
            <span>Little Moments</span>
            <span>😂</span>
          </div>
          {step >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-base sm:text-lg font-serif-elegant font-medium text-white"
            >
              You probably don&apos;t know this…
            </motion.p>
          )}
          {step >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs sm:text-sm text-purple-200/80 font-light"
            >
              But some of our random little conversations…
            </motion.p>
          )}
          {step >= 3 && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm sm:text-base font-serif-elegant italic text-pink-200 font-medium"
            >
              …stayed in my head longer than they probably should have. 😌
            </motion.p>
          )}
        </div>

        {/* Step 4: Memorable Conversation Snippets */}
        {step >= 4 && (
          <div className="space-y-2 pt-2 border-t border-purple-400/20 max-h-[200px] overflow-y-auto pr-1">
            {MEMORABLE_CHAT.slice(0, visibleChatCount).map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className={`flex items-center gap-2 text-xs sm:text-sm ${
                  msg.sender === 'me' ? 'justify-start text-left' : 'justify-end text-right'
                }`}
              >
                {msg.sender === 'me' && (
                  <div className="px-3 py-1.5 rounded-2xl bg-purple-900/60 border border-purple-400/30 text-purple-100 shadow-sm max-w-[82%]">
                    <span className="font-semibold text-purple-300 block text-[10px] uppercase font-handwritten">
                      Me
                    </span>
                    <span>{msg.text}</span>
                  </div>
                )}
                {msg.sender === 'her' && (
                  <div className="px-3 py-1.5 rounded-2xl bg-pink-900/60 border border-pink-400/40 text-pink-100 shadow-sm max-w-[82%]">
                    <span className="font-semibold text-pink-300 block text-[10px] uppercase font-handwritten">
                      Her
                    </span>
                    <span>{msg.text}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Step 5: "Yeah… That one definitely stayed. 😂" + messy human comment */}
        {step >= 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="pt-2 border-t border-pink-400/20 text-center space-y-1"
          >
            <p className="text-sm sm:text-base font-serif-elegant font-semibold text-white">
              Yeah… That one definitely stayed. 😂
            </p>
            <p className="text-xs text-purple-300/80 font-handwritten text-sm">
              Why am I making this dramatic? 😂 Anyway… Focus.
            </p>
          </motion.div>
        )}
      </div>

      {/* Mobile sticky note */}
      {step >= 3 && (
        <div className="mt-3 block sm:hidden">
          <StickyNote
            text="don't ask why this exists. 😂"
            rotation={-2}
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
              id="page4-keep-going-btn"
              onClick={handleProceed}
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(251, 146, 60, 0.45)' }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 min-h-[48px] rounded-full font-serif-elegant font-medium text-sm sm:text-base text-white bg-gradient-to-r from-amber-600 via-rose-600 to-purple-600 hover:from-amber-500 hover:to-rose-500 border border-amber-300/40 shadow-[0_4px_25px_rgba(251,146,60,0.35)] cursor-pointer transition-all"
            >
              <span>Keep going</span>
              <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        ) : (
          <button
            onClick={() => {
              setStep(5);
              setVisibleChatCount(MEMORABLE_CHAT.length);
            }}
            className="text-[11px] text-purple-300/40 hover:text-purple-200 transition-colors py-1 cursor-pointer font-handwritten text-xs"
          >
            skip wait ⚡
          </button>
        )}
      </div>
    </div>
  );
};

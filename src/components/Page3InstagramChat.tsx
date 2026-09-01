import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { playSoftChime, playBubbleTap, playSparkle } from '../utils/sound';
import { SudiptaAvatar } from './CartoonAvatars';
import { StickyNote, HandwrittenAnnotation } from './Doodles';

interface Page3InstagramChatProps {
  onNext: () => void;
}

const FLOATING_ELEMENTS = [
  { id: 'moon', icon: '🌙', label: 'moonlight', x: '8%', y: '10%', delay: 0.1 },
  { id: 'sparkles', icon: '✨', label: 'sparkle', x: '84%', y: '14%', delay: 0.4 },
  { id: 'flower', icon: '🌷', label: 'tulip', x: '12%', y: '74%', delay: 0.7 },
  { id: 'coffee', icon: '☕', label: 'coffee', x: '82%', y: '70%', delay: 1.0 },
  { id: 'chat', icon: '💬', label: 'replies', x: '48%', y: '4%', delay: 0.3 },
];

export const Page3InstagramChat: React.FC<Page3InstagramChatProps> = ({ onNext }) => {
  // Step sequence:
  // 0: Initial atmosphere + floating elements
  // 1: "I like the way you reply."
  // 2: "Even when the reply is completely unexpected. 😂"
  // 3: "Bengali? ... Yup obviously 👀" + "I like that little 'obviously' energy."
  // 4: "And somehow… I started looking forward to seeing your name pop up." + Button
  const [step, setStep] = useState<number>(0);
  const [tappedElement, setTappedElement] = useState<string | null>(null);

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
      }, 4500),
      setTimeout(() => {
        setStep(4);
        playSparkle();
      }, 6800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleElementTap = (id: string, note: number) => {
    playBubbleTap();
    playSoftChime(note);
    setTappedElement(id);
    setTimeout(() => setTappedElement(null), 1200);
  };

  const handleProceed = () => {
    playSoftChime(659.25);
    onNext();
  };

  return (
    <div
      id="page3-things-i-like-stage"
      className="relative flex flex-col items-center justify-center min-h-[85dvh] max-w-lg mx-auto text-center px-4 sm:px-6 py-6 select-none"
    >
      {/* Floating Illustrated Elements around the stage: 🌙 ✨ 🌷 ☕ 💬 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {FLOATING_ELEMENTS.map((elem, idx) => {
          const notes = [440, 523.25, 587.33, 659.25, 783.99];
          return (
            <motion.div
              key={elem.id}
              style={{ left: elem.x, top: elem.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -10, 0],
                rotate: [-6, 6, -6],
              }}
              transition={{
                opacity: { duration: 0.8, delay: elem.delay },
                scale: { duration: 0.8, delay: elem.delay },
                y: { duration: 3.8 + idx * 0.4, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 4.5 + idx * 0.3, repeat: Infinity, ease: 'easeInOut' },
              }}
              className="absolute pointer-events-auto"
            >
              <button
                onClick={() => handleElementTap(elem.id, notes[idx % notes.length])}
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl glass-pill flex items-center justify-center text-lg sm:text-xl border border-purple-400/25 shadow-[0_4px_20px_rgba(192,132,252,0.2)] hover:scale-115 active:scale-95 transition-all cursor-pointer ${
                  tappedElement === elem.id ? 'ring-2 ring-pink-300 scale-125' : ''
                }`}
                title={elem.label}
              >
                <span>{elem.icon}</span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Header Tag */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3 inline-flex items-center gap-2 px-4 py-1 rounded-full glass-pill border border-pink-400/30 text-xs font-handwritten text-pink-200 text-sm"
      >
        <span>🌷</span>
        <span>A few things I noticed</span>
        <span>✨</span>
      </motion.div>

      {/* Cute Character Avatar with "Smirking / Playful" Expression */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="mb-4"
      >
        <SudiptaAvatar
          size={72}
          expression={step >= 4 ? 'playful' : 'smirking'}
          animateVariant={step >= 4 ? 'laughing' : 'idle'}
          showGlow
          emojiReaction={step >= 4 ? '🌸' : '👀'}
          interactive
        />
      </motion.div>

      {/* Romantic Lines Container */}
      <div className="w-full relative max-w-md space-y-3 min-h-[260px] flex flex-col justify-center glass-panel p-5 sm:p-6 rounded-3xl border border-purple-400/20 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        {/* Sticky note positioned on side of card */}
        {step >= 3 && (
          <div className="absolute -top-3 -right-2 z-30 hidden sm:block">
            <StickyNote
              text="yes, I really added this."
              rotation={3}
              color="yellow"
              delay={0.1}
            />
          </div>
        )}

        {/* Line 1: "I like the way you reply." */}
        {step >= 1 && (
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left bg-purple-950/40 p-3 rounded-2xl border border-purple-400/20"
          >
            <p className="text-base sm:text-lg font-serif-elegant font-medium text-white">
              “I like the way you reply.” 💬
            </p>
          </motion.div>
        )}

        {/* Line 2: "Even when the reply is completely unexpected. 😂" */}
        {step >= 2 && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-right bg-pink-950/40 p-3 rounded-2xl border border-pink-400/20"
          >
            <p className="text-sm sm:text-base text-purple-200/90 font-light">
              Even when the reply is completely unexpected. 😂
            </p>
          </motion.div>
        )}

        {/* Line 3: "Bengali? ... Yup obviously 👀" + "I like that little 'obviously' energy." */}
        {step >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="p-3 rounded-2xl bg-purple-900/30 border border-purple-400/20 space-y-1 text-left"
          >
            <div className="flex items-center justify-between text-xs text-purple-300/70 font-handwritten text-sm">
              <span>Bengali?</span>
              <span className="text-pink-300 font-semibold">“Yup obviously” 👀</span>
            </div>
            <p className="text-sm sm:text-base text-pink-200 font-serif-elegant">
              I like that little <span className="underline decoration-pink-400 font-semibold">“obviously”</span> energy.
            </p>
          </motion.div>
        )}

        {/* Line 4 (Subtle romantic climax): "And somehow… I started looking forward to seeing your name pop up." */}
        {step >= 4 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="pt-3 border-t border-purple-400/20 text-center space-y-1"
          >
            <span className="text-xs text-pink-300/70 font-light italic block">
              And somehow…
            </span>
            <p className="text-base sm:text-lg font-serif-elegant font-semibold bg-gradient-to-r from-pink-200 via-rose-200 to-purple-100 bg-clip-text text-transparent leading-snug">
              I started looking forward to seeing your name pop up. 🌷
            </p>
          </motion.div>
        )}
      </div>

      {/* Mobile sticky note */}
      {step >= 3 && (
        <div className="mt-3 block sm:hidden">
          <StickyNote
            text="yes, I really added this."
            rotation={-2}
            color="yellow"
          />
        </div>
      )}

      {/* Button: "Keep going →" */}
      <div className="pt-5 min-h-[70px]">
        {step >= 4 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              id="page3-keep-going-btn"
              onClick={handleProceed}
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(244, 114, 182, 0.45)' }}
              whileTap={{ scale: 0.96 }}
              className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 min-h-[48px] rounded-full font-serif-elegant font-medium text-sm sm:text-base text-white bg-gradient-to-r from-pink-600 via-purple-600 to-rose-500 hover:from-pink-500 hover:to-purple-500 border border-pink-300/40 shadow-[0_4px_25px_rgba(236,72,153,0.35)] cursor-pointer transition-all"
            >
              <span>Keep going</span>
              <ArrowRight className="w-4 h-4 text-pink-200 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>
        ) : (
          <button
            onClick={() => setStep(4)}
            className="text-[11px] text-purple-300/40 hover:text-purple-200 transition-colors py-1 cursor-pointer font-handwritten text-xs"
          >
            skip wait ⚡
          </button>
        )}
      </div>
    </div>
  );
};

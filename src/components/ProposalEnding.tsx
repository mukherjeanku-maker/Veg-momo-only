import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Instagram, RotateCcw, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { playSparkle, playBubbleTap, playSoftChime } from '../utils/sound';
import { MeAvatar, SudiptaAvatar } from './CartoonAvatars';
import { PrivateChat } from './PrivateChat';

// Customizable Instagram Profile URL placeholder
const INSTAGRAM_URL = 'YOUR_INSTAGRAM_URL_HERE';

interface ProposalEndingProps {
  onRestart: () => void;
  onSceneChange?: (scene: 'proposal-warm' | 'proposal-dark' | 'rooftop-night') => void;
}

export const ProposalEnding: React.FC<ProposalEndingProps> = ({
  onRestart,
  onSceneChange,
}) => {
  // Step in the reveal sequence:
  // 0: Initializing
  // 1: "Okay… one last thing."
  // 2: "এতক্ষণ একটা কথা ঘুরিয়ে ঘুরিয়ে বললাম…"
  // 3: "আসলে তোমাকে একটা প্রশ্ন করার ছিল।"
  // 4: The Centerpiece Question ("তুমি কি আমাকে একটু ভালোভাবে জানার সুযোগ দেবে? ❤️")
  // 5: Second message ("No pressure... Maybe we could see where this goes? 😌") & Choice Buttons
  const [revealStep, setRevealStep] = useState<number>(1);
  const [maleReaction, setMaleReaction] = useState<'neutral' | 'nervous' | 'thinking' | 'happy'>('neutral');
  const [femaleReaction, setFemaleReaction] = useState<'neutral' | 'friendly' | 'happy'>('friendly');
  const [choice, setChoice] = useState<'yes' | 'think' | null>(null);
  const [showSecretConfession, setShowSecretConfession] = useState<boolean>(false);
  const [showFinalClosure, setShowFinalClosure] = useState<boolean>(false);

  // Cinematic Transition to Private Chat
  // 'none' | 'wait' | 'maybe' | 'made-one-thing' | 'chat'
  const [chatTransitionStep, setChatTransitionStep] = useState<'none' | 'wait' | 'maybe' | 'made-one-thing' | 'chat'>('none');

  // Inform background of scene warmth
  useEffect(() => {
    if (onSceneChange) {
      onSceneChange('proposal-warm');
    }
  }, [onSceneChange]);

  // Timed sequential text reveals
  useEffect(() => {
    const timer1 = setTimeout(() => setRevealStep(2), 1700);
    const timer2 = setTimeout(() => setRevealStep(3), 3600);
    const timer3 = setTimeout(() => {
      setRevealStep(4);
      // Trigger subtle nervous animation on male character
      setMaleReaction('nervous');
      playSparkle();
    }, 5500);
    const timer4 = setTimeout(() => {
      setRevealStep(5);
    }, 7800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  // Handle Choice A: "হ্যাঁ, কেন নয় 😌"
  const handleChoiceYes = () => {
    playSparkle();
    setChoice('yes');
    setMaleReaction('happy');
    setFemaleReaction('happy');

    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#c084fc', '#fbcfe8', '#fb7185', '#fef08a'],
      });
    } catch {
      // Fallback
    }

    setTimeout(() => {
      setShowFinalClosure(true);
    }, 4500);
  };

  // Handle Choice B: "একটু ভাবতে দাও 👀"
  const handleChoiceThink = () => {
    playBubbleTap();
    setChoice('think');
    setMaleReaction('thinking');
    setFemaleReaction('friendly');

    setTimeout(() => {
      setShowFinalClosure(true);
    }, 4500);
  };

  const handleSecretToggle = () => {
    playSparkle();
    setShowSecretConfession(true);
  };

  const handleInstagramClick = () => {
    if (INSTAGRAM_URL && INSTAGRAM_URL !== 'YOUR_INSTAGRAM_URL_HERE') {
      window.open(INSTAGRAM_URL, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://instagram.com', '_blank', 'noopener,noreferrer');
    }
  };

  // Start Cinematic Transition to Private Chat
  const handleStartChatTransition = () => {
    playSoftChime(440);
    setChatTransitionStep('wait');

    setTimeout(() => {
      setChatTransitionStep('maybe');
      playSoftChime(523.25);
    }, 2200);

    setTimeout(() => {
      setChatTransitionStep('made-one-thing');
      playSparkle();
    }, 4500);

    setTimeout(() => {
      setChatTransitionStep('chat');
    }, 6800);
  };

  // If in Chat Mode, render PrivateChat component
  if (chatTransitionStep === 'chat') {
    return (
      <PrivateChat
        onBackToProposal={() => {
          setChatTransitionStep('none');
          if (onSceneChange) onSceneChange('proposal-warm');
        }}
        onRestartWebsite={() => {
          if (onSceneChange) onSceneChange('rooftop-night');
          onRestart();
        }}
      />
    );
  }

  // If in Cinematic Transition Mode, render the slow transition sequence
  if (chatTransitionStep !== 'none') {
    return (
      <div
        id="chat-cinematic-transition-screen"
        className="flex flex-col items-center justify-center min-h-[85dvh] max-w-lg mx-auto text-center px-6 py-12 select-none z-20"
      >
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {chatTransitionStep === 'wait' && (
              <motion.div
                key="trans-wait"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1 }}
                className="space-y-3"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block text-pink-300"
                >
                  ✨
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-serif-elegant font-medium text-white tracking-widest">
                  Wait…
                </h2>
              </motion.div>
            )}

            {chatTransitionStep === 'maybe' && (
              <motion.div
                key="trans-maybe"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 1 }}
                className="space-y-2"
              >
                <p className="text-lg sm:text-xl font-serif-elegant italic text-purple-100/90 leading-relaxed">
                  “Maybe this shouldn&apos;t end here.”
                </p>
                <p className="text-xs text-purple-300/60 font-light">
                  Just a thought. 😌
                </p>
              </motion.div>
            )}

            {chatTransitionStep === 'made-one-thing' && (
              <motion.div
                key="trans-made-one-thing"
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-center gap-3">
                  <MeAvatar size={42} expression="shy" animateVariant="idle" />
                  <Sparkles className="w-5 h-5 text-pink-300 animate-spin" />
                  <SudiptaAvatar size={42} expression="playful" animateVariant="idle" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg sm:text-xl font-serif-elegant font-semibold text-white">
                    So I made one more little thing.
                  </p>
                  <p className="text-xs text-pink-300/80 font-light">
                    Entering our private corner…
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div
      id="proposal-ending-container"
      className="relative flex flex-col items-center justify-center min-h-[88dvh] max-w-xl mx-auto text-center px-4 sm:px-6 py-8 select-none z-10"
    >
      {/* 1. Cartoon Characters Rooftop Scene */}
      <motion.div
        id="proposal-characters-scene"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative mb-6 flex flex-col items-center justify-center"
      >
        {/* Subtle warm halo backdrop */}
        <div
          className={`absolute -inset-8 rounded-full blur-3xl transition-opacity duration-1000 ${
            revealStep >= 4 ? 'opacity-40 bg-gradient-to-r from-pink-500/30 via-purple-500/20 to-amber-500/20' : 'opacity-20 bg-purple-600/20'
          }`}
        />

        {/* 2D Cartoon Character Pair */}
        <div className="relative flex items-end justify-center gap-6 sm:gap-8 px-6 py-4">
          {/* Male Character with dynamic reactions */}
          <div className="relative flex flex-col items-center">
            <AnimatePresence>
              {maleReaction === 'nervous' && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.6 }}
                  animate={{
                    opacity: [0, 1, 1, 0.9],
                    y: [10, -6, -2, -4],
                    scale: [0.6, 1.2, 1, 1.05],
                  }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 1.4 }}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 text-2xl z-20 pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
                >
                  🫣
                </motion.div>
              )}
              {maleReaction === 'happy' && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.7 }}
                  animate={{ opacity: 1, y: -8, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 text-xl z-20 pointer-events-none"
                >
                  😌✨
                </motion.div>
              )}
              {maleReaction === 'thinking' && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.7 }}
                  animate={{ opacity: 1, y: -8, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 text-xl z-20 pointer-events-none"
                >
                  🤔💭
                </motion.div>
              )}
            </AnimatePresence>

            <MeAvatar
              size={56}
              expression={
                maleReaction === 'nervous'
                  ? 'awkward'
                  : maleReaction === 'happy'
                  ? 'hopeful'
                  : maleReaction === 'thinking'
                  ? 'shy'
                  : 'neutral'
              }
              animateVariant={
                maleReaction === 'nervous'
                  ? 'shy'
                  : maleReaction === 'happy'
                  ? 'celebrating'
                  : maleReaction === 'thinking'
                  ? 'thinking'
                  : 'idle'
              }
              interactive
            />
            <span className="text-[10px] tracking-wider text-purple-300/40 uppercase font-medium mt-1">
              Me
            </span>
          </div>

          {/* Gentle distance sparkle / heart pulse */}
          <div className="flex items-center justify-center h-12">
            <motion.div
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.75, 0.3],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles className="w-4 h-4 text-pink-300/60" />
            </motion.div>
          </div>

          {/* Female Character (Sudipta) */}
          <div className="relative flex flex-col items-center">
            <AnimatePresence>
              {femaleReaction === 'happy' && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.7 }}
                  animate={{ opacity: 1, y: -8, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="absolute -top-7 left-1/2 -translate-x-1/2 text-xl z-20 pointer-events-none"
                >
                  ✨
                </motion.div>
              )}
            </AnimatePresence>

            <SudiptaAvatar
              size={56}
              expression={
                femaleReaction === 'happy'
                  ? 'smirking'
                  : 'playful'
              }
              animateVariant={
                femaleReaction === 'happy'
                  ? 'celebrating'
                  : 'idle'
              }
              interactive
            />
            <span className="text-[10px] tracking-wider text-pink-300/40 uppercase font-medium mt-1">
              Sudipta
            </span>
          </div>
        </div>

        {/* Quiet rooftop line */}
        <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
      </motion.div>

      {/* 2. TEXT REVEAL SECTION */}
      <div id="proposal-text-container" className="w-full max-w-lg space-y-4 mb-6">
        {/* Line 1: "Okay… one last thing." */}
        <AnimatePresence>
          {revealStep >= 1 && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-xs uppercase tracking-widest text-pink-300/70 font-medium"
            >
              Okay… one last thing.
            </motion.p>
          )}
        </AnimatePresence>

        {/* Line 2: "এতক্ষণ একটা কথা ঘুরিয়ে ঘুরিয়ে বললাম…" */}
        <AnimatePresence>
          {revealStep >= 2 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-base sm:text-lg font-bengali text-purple-200/90 font-light"
            >
              এতক্ষণ একটা কথা ঘুরিয়ে ঘুরিয়ে বললাম…
            </motion.p>
          )}
        </AnimatePresence>

        {/* Line 3: "আসলে তোমাকে একটা প্রশ্ন করার ছিল।" */}
        <AnimatePresence>
          {revealStep >= 3 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-base sm:text-lg font-bengali text-purple-100 font-medium"
            >
              আসলে তোমাকে একটা প্রশ্ন করার ছিল।
            </motion.p>
          )}
        </AnimatePresence>

        {/* Line 4: MAIN QUESTION CENTERPIECE */}
        <AnimatePresence>
          {revealStep >= 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="py-3 px-4 sm:px-6 rounded-2xl glass-panel border border-pink-400/30 shadow-[0_0_35px_rgba(236,72,153,0.2)] my-2"
            >
              <h2 className="text-xl sm:text-2xl md:text-[26px] font-bengali font-semibold text-white tracking-wide leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] flex items-center justify-center flex-wrap gap-2">
                <span>তুমি কি আমাকে একটু ভালোভাবে জানার সুযোগ দেবে?</span>
                <motion.span
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex items-center text-pink-400"
                >
                  <Heart className="w-5 h-5 fill-pink-500 text-pink-400 inline" />
                </motion.span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Line 5: SECOND MESSAGE ("No pressure. No awkwardness. Just…") */}
        <AnimatePresence>
          {revealStep >= 5 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-1 pt-1"
            >
              <p className="text-xs sm:text-sm text-purple-300/80 font-normal">
                No pressure. No awkwardness.
              </p>
              <p className="text-xs sm:text-sm text-purple-200/90 font-serif-elegant italic">
                Just… Maybe we could see where this goes? 😌
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. TWO CHOICES BUTTONS */}
      <AnimatePresence>
        {revealStep >= 5 && !choice && (
          <motion.div
            id="proposal-choices-container"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-sm justify-center mb-6"
          >
            {/* Choice A: "হ্যাঁ, কেন নয় 😌" */}
            <motion.button
              id="proposal-choice-yes-btn"
              onClick={handleChoiceYes}
              whileHover={{ scale: 1.04, boxShadow: '0 0 25px rgba(236,72,153,0.4)' }}
              whileTap={{ scale: 0.96 }}
              className="flex-1 py-3.5 px-5 min-h-[46px] rounded-2xl font-bengali font-medium text-base text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:to-pink-500 border border-pink-300/40 shadow-[0_4px_20px_rgba(219,39,119,0.3)] cursor-pointer transition-all duration-300"
            >
              হ্যাঁ, কেন নয় 😌
            </motion.button>

            {/* Choice B: "একটু ভাবতে দাও 👀" */}
            <motion.button
              id="proposal-choice-think-btn"
              onClick={handleChoiceThink}
              whileHover={{ scale: 1.04, borderColor: 'rgba(192, 132, 252, 0.5)' }}
              whileTap={{ scale: 0.96 }}
              className="flex-1 py-3.5 px-5 min-h-[46px] rounded-2xl font-bengali font-medium text-base text-purple-100 glass-panel border border-purple-400/25 hover:border-purple-300/50 shadow-[0_4px_16px_rgba(0,0,0,0.3)] cursor-pointer transition-all duration-300"
            >
              একটু ভাবতে দাও 👀
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. CHOICE OUTCOME RESPONSES */}
      <AnimatePresence mode="wait">
        {choice === 'yes' && (
          <motion.div
            key="response-yes"
            id="proposal-response-yes-card"
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm p-5 sm:p-6 rounded-3xl glass-panel glow-card border border-pink-400/40 shadow-[0_15px_40px_rgba(0,0,0,0.5)] space-y-3 mb-5 text-center"
          >
            <p className="text-base sm:text-lg font-bengali font-semibold text-white drop-shadow-sm">
              তাহলে শুরুটা এখান থেকেই। 😌❤️
            </p>
            <p className="text-xs sm:text-sm font-bengali text-purple-100 leading-relaxed">
              আমি কিন্তু সত্যিই তোমাকে একটু একটু করে জানতে চাই।
            </p>
            <div className="pt-1 space-y-1">
              <p className="text-xs text-pink-300/90 font-bengali">
                একটা কথা promise করি…
              </p>
              <p className="text-xs sm:text-sm text-purple-100 font-bengali">
                তোমাকে boring conversation দিতে চেষ্টা করব না. 😂
              </p>
            </div>
            <p className="text-xs font-serif-elegant font-medium text-pink-200 pt-2 tracking-wide">
              Now… your move. 👀
            </p>
          </motion.div>
        )}

        {choice === 'think' && (
          <motion.div
            key="response-think"
            id="proposal-response-think-card"
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-sm p-5 sm:p-6 rounded-3xl glass-panel border border-purple-400/30 shadow-[0_15px_40px_rgba(0,0,0,0.5)] space-y-3 mb-5 text-center"
          >
            <p className="text-base sm:text-lg font-serif-elegant font-medium text-white">
              Fair enough. 😌
            </p>
            <p className="text-xs sm:text-sm font-bengali text-purple-100">
              কোনো hurry নেই. ভেবে নিও.
            </p>
            <p className="text-xs sm:text-sm font-bengali text-purple-200/90">
              আমি meanwhile… normal থাকার চেষ্টা করি. 😂 👀
            </p>
            <p className="text-xs text-pink-300/80 font-serif-elegant pt-1">
              Take your time.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. OPTIONAL SECRET REVEAL ("psst…") */}
      {choice && (
        <div className="w-full max-w-sm mb-4">
          <AnimatePresence>
            {!showSecretConfession ? (
              <motion.button
                id="proposal-psst-btn"
                onClick={handleSecretToggle}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="text-[11px] text-purple-300/40 hover:text-pink-300/80 px-3 py-1 rounded-full glass-pill border border-purple-400/10 hover:border-pink-400/30 transition-all cursor-pointer inline-flex items-center gap-1"
              >
                <span>psst…</span>
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="p-4 rounded-2xl glass-panel border border-pink-400/20 text-center space-y-2 bg-[#120520]/60"
              >
                <p className="text-xs uppercase tracking-widest text-pink-300/80 font-medium">
                  Okay, confession time…
                </p>
                <p className="text-xs sm:text-sm text-purple-100 leading-relaxed font-light">
                  I wasn&apos;t actually sure whether I should ask.
                </p>
                <p className="text-xs sm:text-sm text-purple-200/90 font-serif-elegant italic">
                  But I figured… Some questions are worth asking. 😌
                </p>
                <p className="text-xs text-pink-300 font-medium pt-1">
                  Especially this one.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 6. FINAL INSTAGRAM CTA & SILHOUETTE CLOSURE & OUR LITTLE CHAT TRIGGER */}
      <AnimatePresence>
        {(showFinalClosure || choice) && (
          <motion.div
            id="proposal-final-cta-section"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-sm space-y-4 pt-2"
          >
            <div className="space-y-1">
              <p className="text-xs sm:text-sm text-purple-200/80 font-medium">
                Now you know what I wanted to ask.
              </p>
              <p className="text-sm sm:text-base font-serif-elegant font-semibold text-white">
                Your turn.
              </p>
            </div>

            {/* Prominent Action Buttons */}
            <div className="flex flex-col gap-2.5 items-center">
              {/* FINAL SECRET SECTION: OUR LITTLE CHATBOX BUTTON */}
              <motion.button
                id="proposal-enter-private-chat-btn"
                onClick={handleStartChatTransition}
                whileHover={{ scale: 1.04, boxShadow: '0 0 35px rgba(244,114,182,0.5)' }}
                whileTap={{ scale: 0.96 }}
                className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 min-h-[48px] rounded-full font-serif-elegant font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-pink-600 via-purple-600 to-rose-500 hover:from-pink-500 hover:to-rose-400 border border-pink-300/50 shadow-[0_4px_30px_rgba(236,72,153,0.4)] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-pink-200" />
                <span>Our Little Corner 💬</span>
              </motion.button>

              {/* Instagram link */}
              <motion.button
                id="proposal-go-to-instagram-btn"
                onClick={handleInstagramClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 min-h-[40px] rounded-full font-medium text-xs sm:text-sm text-purple-200 glass-panel border border-purple-400/25 hover:border-pink-400/40 hover:text-white cursor-pointer transition-all"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-300" />
                <span>Go back to Instagram →</span>
              </motion.button>

              <motion.button
                id="proposal-replay-btn"
                onClick={onRestart}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 min-h-[32px] rounded-full font-medium text-[11px] text-purple-300/60 hover:text-purple-100 glass-pill border border-purple-400/15 hover:border-purple-300/40 cursor-pointer transition-all"
              >
                <RotateCcw className="w-3 h-3 text-purple-300" />
                <span>Replay ↻</span>
              </motion.button>
            </div>

            {/* Closing playful tagline */}
            <div className="pt-3 space-y-1">
              <p className="text-xs text-purple-200/90 font-medium">
                See you on Instagram. 👀
              </p>
              <p className="text-[11px] text-purple-300/45 italic">
                — probably your most unnecessarily elaborate &apos;Hi&apos; ever. 😂
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


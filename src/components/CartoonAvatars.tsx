import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playBubbleTap, playSparkle } from '../utils/sound';

export type AvatarExpression =
  | 'neutral'
  | 'hopeful'
  | 'curious'
  | 'proud'
  | 'confident'
  | 'confused'
  | 'awkward'
  | 'waving'
  | 'celebrating'
  | 'peeking'
  | 'laughing'
  | 'talking'
  | 'shy'
  | 'detective';

export type SudiptaExpression =
  | 'neutral'
  | 'smirking'
  | 'playful'
  | 'amused'
  | 'laughing'
  | 'mysterious'
  | 'celebrating'
  | 'talking'
  | 'shy'
  | 'curious'
  | 'suspicious'
  | 'surprised';

export type AvatarAnimationVariant =
  | 'idle'
  | 'blinking'
  | 'waving'
  | 'laughing'
  | 'celebrating'
  | 'talking'
  | 'thinking'
  | 'shy'
  | 'bouncing'
  | 'nodding';

export interface AvatarProps {
  size?: number;
  className?: string;
  emojiReaction?: string;
  showGlow?: boolean;
  animateVariant?: AvatarAnimationVariant;
  autoBlink?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  speechBubble?: string;
  nameTag?: string;
}

export interface MeAvatarProps extends AvatarProps {
  expression?: AvatarExpression;
}

export interface SudiptaAvatarProps extends AvatarProps {
  expression?: SudiptaExpression;
}

/**
 * State-driven motion animation variants for the whole avatar wrapper
 */
const avatarMotionVariants = {
  idle: {
    y: [0, -2, 0],
    rotate: [0, 0, 0],
    scale: 1,
    transition: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' as const },
  },
  blinking: {
    y: [0, -1, 0],
    scale: 1,
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
  },
  waving: {
    y: [0, -2, 0],
    rotate: [-3, 3, -3],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' as const },
  },
  laughing: {
    y: [0, -5, 0, -4, 0],
    rotate: [-3, 3, -3, 3, 0],
    scale: [1, 1.04, 1, 1.03, 1],
    transition: { duration: 0.85, repeat: Infinity, ease: 'easeInOut' as const },
  },
  celebrating: {
    y: [0, -8, 0],
    rotate: [-4, 4, -4],
    scale: [1, 1.08, 1],
    transition: { duration: 0.65, repeat: Infinity, ease: 'easeInOut' as const },
  },
  talking: {
    y: [0, -2, 0],
    scale: [1, 1.02, 1],
    transition: { duration: 0.5, repeat: Infinity, ease: 'easeInOut' as const },
  },
  thinking: {
    rotate: [-5, -7, -5],
    y: [0, -2, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  },
  shy: {
    rotate: [2, 0, 2],
    y: [2, 0, 2],
    scale: 0.98,
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' as const },
  },
  bouncing: {
    y: [0, -10, 0],
    scale: [1, 1.06, 0.96, 1],
    transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' as const },
  },
  nodding: {
    rotateX: [0, 15, 0, 15, 0],
    y: [0, 3, 0, 3, 0],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' as const },
  },
};

/**
 * High-quality stylized cartoon avatar for "Me"
 * Supports state-driven animation variants: blinking, waving, laughing, celebrating, etc.
 */
export const MeAvatar: React.FC<MeAvatarProps> = ({
  size = 54,
  expression = 'neutral',
  animateVariant = 'idle',
  className = '',
  emojiReaction,
  showGlow = false,
  autoBlink = true,
  interactive = false,
  onClick,
  speechBubble,
  nameTag,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [internalClickPop, setInternalClickPop] = useState(false);

  // Natural spontaneous blinking loop
  useEffect(() => {
    if (!autoBlink && animateVariant !== 'blinking') return;

    const scheduleBlink = () => {
      const delay = Math.random() * 3200 + 2000;
      return setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
        }, 180);
      }, delay);
    };

    let timer = scheduleBlink();
    const interval = setInterval(() => {
      clearTimeout(timer);
      timer = scheduleBlink();
    }, 4500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [autoBlink, animateVariant]);

  const effectiveVariant =
    animateVariant !== 'idle'
      ? animateVariant
      : expression === 'waving'
      ? 'waving'
      : expression === 'laughing'
      ? 'laughing'
      : expression === 'celebrating'
      ? 'celebrating'
      : expression === 'awkward' || expression === 'shy'
      ? 'shy'
      : expression === 'curious'
      ? 'thinking'
      : 'idle';

  const handleClick = () => {
    if (interactive || onClick) {
      playBubbleTap();
      setInternalClickPop(true);
      setTimeout(() => setInternalClickPop(false), 500);
      onClick?.();
    }
  };

  const isWavingArm =
    expression === 'waving' ||
    effectiveVariant === 'waving' ||
    expression === 'awkward';

  const isLaughingMode =
    expression === 'laughing' || effectiveVariant === 'laughing';

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ width: size }}
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {/* Ambient glowing ring */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-60 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(168, 85, 247, 0.7) 0%, rgba(99, 102, 241, 0.1) 70%)',
          }}
        />
      )}

      {/* Main Avatar SVG Container with State-driven Animations */}
      <motion.div
        className="relative w-full aspect-square flex items-center justify-center"
        variants={avatarMotionVariants}
        animate={internalClickPop ? { scale: [1, 1.15, 1], rotate: [-4, 4, 0] } : effectiveVariant}
        whileHover={interactive ? { scale: 1.08 } : undefined}
        whileTap={interactive ? { scale: 0.94 } : undefined}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md z-10 overflow-visible"
        >
          {/* Background circle badge for crisp contrast */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="#181329"
            stroke="rgba(192, 132, 252, 0.35)"
            strokeWidth="2.5"
          />

          {/* Shoulders / Casual Dark Modern Outfit */}
          <path
            d="M 22 88 Q 50 72 78 88 L 78 94 Q 50 88 22 94 Z"
            fill="#2d2248"
          />
          <path
            d="M 32 80 Q 50 92 68 80 L 68 88 Q 50 95 32 88 Z"
            fill="#433267"
          />
          {/* Crewneck collar line */}
          <path
            d="M 40 76 Q 50 84 60 76"
            stroke="#9382bd"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Neck */}
          <rect x="44" y="66" width="12" height="12" rx="3" fill="#fbd1b7" />
          <rect
            x="44"
            y="69"
            width="12"
            height="6"
            fill="#f0bba0"
            opacity="0.4"
          />

          {/* Ears */}
          <circle cx="28" cy="50" r="6" fill="#fbd1b7" />
          <circle cx="72" cy="50" r="6" fill="#fbd1b7" />
          <circle cx="28" cy="50" r="3.5" fill="#f0bba0" />
          <circle cx="72" cy="50" r="3.5" fill="#f0bba0" />

          {/* Head Base */}
          <rect
            x="29"
            y="32"
            width="42"
            height="40"
            rx="18"
            fill="#fbd1b7"
          />

          {/* Stylish Modern Dark Hair */}
          <path
            d="M 27 42 C 26 28, 36 18, 50 18 C 65 18, 74 27, 74 42 C 70 34, 62 30, 52 30 C 42 30, 34 35, 27 42 Z"
            fill="#1c1628"
          />
          {/* Hair front strands/texture */}
          <path d="M 34 28 Q 45 22 56 30 Q 42 26 34 32" fill="#2d2442" />
          <path d="M 48 24 Q 60 22 66 33" fill="#2d2442" />

          {/* Eyebrows */}
          {expression === 'confused' ? (
            <>
              <path
                d="M 36 39 Q 42 36 46 41"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 54 42 Q 58 37 64 38"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : expression === 'hopeful' || expression === 'curious' ? (
            <>
              <path
                d="M 36 38 Q 41 35 46 39"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 54 39 Q 59 35 64 38"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : expression === 'proud' ? (
            <>
              <path
                d="M 36 40 Q 41 38 46 41"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 54 38 Q 59 35 64 39"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              <path
                d="M 36 40 Q 41 38 46 40"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 54 40 Q 59 38 64 40"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* Eyes & Blinking Animation */}
          {isBlinking ? (
            /* Closed Blinking Eyelashes */
            <>
              <path
                d="M 37 47 Q 41 51 45 47"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 55 47 Q 59 51 63 47"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : isLaughingMode ? (
            /* Joyful laughing squint eyes */
            <>
              <path
                d="M 37 47 Q 41 43 45 47"
                stroke="#251c36"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 55 47 Q 59 43 63 47"
                stroke="#251c36"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 33 49 Q 34 52 33 54"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : expression === 'awkward' || expression === 'shy' ? (
            <>
              <circle cx="41" cy="47" r="3" fill="#251c36" />
              <circle cx="59" cy="47" r="3" fill="#251c36" />
              {/* Little blue nervous drop */}
              <path
                d="M 68 38 Q 70 41 68 43 Q 66 41 68 38"
                fill="#60a5fa"
              />
            </>
          ) : expression === 'proud' ? (
            <>
              <path
                d="M 38 48 Q 41 44 44 48"
                stroke="#251c36"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="59" cy="47" r="3.2" fill="#251c36" />
              <circle cx="60" cy="46" r="1" fill="#ffffff" />
            </>
          ) : expression === 'hopeful' || expression === 'curious' ? (
            <>
              <circle cx="41" cy="46" r="3.8" fill="#251c36" />
              <circle cx="42" cy="45" r="1.3" fill="#ffffff" />
              <circle cx="59" cy="46" r="3.8" fill="#251c36" />
              <circle cx="60" cy="45" r="1.3" fill="#ffffff" />
            </>
          ) : (
            <>
              <circle cx="41" cy="47" r="3.2" fill="#251c36" />
              <circle cx="42" cy="46" r="1" fill="#ffffff" />
              <circle cx="59" cy="47" r="3.2" fill="#251c36" />
              <circle cx="60" cy="46" r="1" fill="#ffffff" />
            </>
          )}

          {/* Cheeks */}
          <circle
            cx="36"
            cy="53"
            r="3.2"
            fill="#fca5a5"
            opacity={expression === 'shy' || expression === 'awkward' ? 0.9 : 0.6}
          />
          <circle
            cx="64"
            cy="53"
            r="3.2"
            fill="#fca5a5"
            opacity={expression === 'shy' || expression === 'awkward' ? 0.9 : 0.6}
          />

          {/* Mouth */}
          {isLaughingMode ? (
            <path
              d="M 43 55 Q 50 66 57 55 Z"
              fill="#e11d48"
              stroke="#251c36"
              strokeWidth="1.5"
            />
          ) : effectiveVariant === 'talking' ? (
            <motion.path
              d="M 44 56 Q 50 63 56 56 Z"
              fill="#e11d48"
              stroke="#251c36"
              strokeWidth="1.5"
              animate={{ d: ['M 44 56 Q 50 63 56 56 Z', 'M 44 57 Q 50 60 56 57 Z', 'M 44 56 Q 50 63 56 56 Z'] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          ) : expression === 'proud' ? (
            <path
              d="M 43 57 Q 50 63 58 56"
              stroke="#251c36"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : expression === 'confused' ? (
            <path
              d="M 44 59 Q 49 57 56 60"
              stroke="#251c36"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : expression === 'awkward' || expression === 'shy' ? (
            <path
              d="M 44 58 Q 50 60 56 57"
              stroke="#251c36"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
          ) : expression === 'hopeful' || expression === 'curious' ? (
            <path
              d="M 44 56 Q 50 63 56 56"
              stroke="#251c36"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="#e11d48"
            />
          ) : (
            <path
              d="M 43 56 Q 50 62 57 56"
              stroke="#251c36"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Animated Waving Hand */}
          {isWavingArm && (
            <motion.g
              animate={{ rotate: [-12, 22, -12] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut' }}
              style={{ transformOrigin: '76px 68px' }}
            >
              <circle cx="80" cy="62" r="5.5" fill="#fbd1b7" />
              <path
                d="M 76 68 Q 80 62 82 58"
                stroke="#fbd1b7"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M 88 56 Q 91 59 88 62"
                stroke="#c084fc"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </motion.g>
          )}
        </svg>

        {/* Floating Emoji Reaction Bubble */}
        <AnimatePresence>
          {emojiReaction && (
            <motion.div
              key={emojiReaction}
              initial={{ scale: 0, y: 5 }}
              animate={{ scale: 1, y: -8 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16 }}
              className="absolute -top-3 -right-2 z-20 px-1.5 py-0.5 rounded-full glass-pill text-xs shadow-md border border-purple-400/40 bg-purple-950/80 backdrop-blur-md pointer-events-none"
            >
              <span>{emojiReaction}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Optional Speech Bubble Overlay */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-xl bg-purple-950/90 border border-purple-400/30 text-[11px] text-purple-100 whitespace-nowrap shadow-lg backdrop-blur-md"
        >
          {speechBubble}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-purple-950/90 border-r border-b border-purple-400/30 rotate-45" />
        </motion.div>
      )}

      {/* Optional Character Name Tag */}
      {nameTag && (
        <span className="text-[10px] text-purple-300/60 font-medium tracking-wide mt-1">
          {nameTag}
        </span>
      )}
    </div>
  );
};

/**
 * High-quality stylized cartoon avatar for "Sudipta"
 * Supports state-driven animation variants: blinking, waving, laughing, talking, celebrating, etc.
 */
export const SudiptaAvatar: React.FC<SudiptaAvatarProps> = ({
  size = 54,
  expression = 'neutral',
  animateVariant = 'idle',
  className = '',
  emojiReaction,
  showGlow = false,
  autoBlink = true,
  interactive = false,
  onClick,
  speechBubble,
  nameTag,
}) => {
  const [isBlinking, setIsBlinking] = useState(false);
  const [internalClickPop, setInternalClickPop] = useState(false);

  // Natural spontaneous blinking loop
  useEffect(() => {
    if (!autoBlink && animateVariant !== 'blinking') return;

    const scheduleBlink = () => {
      const delay = Math.random() * 3000 + 2200;
      return setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
        }, 180);
      }, delay);
    };

    let timer = scheduleBlink();
    const interval = setInterval(() => {
      clearTimeout(timer);
      timer = scheduleBlink();
    }, 4800);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [autoBlink, animateVariant]);

  const effectiveVariant =
    animateVariant !== 'idle'
      ? animateVariant
      : expression === 'laughing'
      ? 'laughing'
      : expression === 'celebrating'
      ? 'celebrating'
      : expression === 'smirking' || expression === 'playful'
      ? 'idle'
      : expression === 'curious'
      ? 'thinking'
      : 'idle';

  const handleClick = () => {
    if (interactive || onClick) {
      playSparkle();
      setInternalClickPop(true);
      setTimeout(() => setInternalClickPop(false), 500);
      onClick?.();
    }
  };

  const isLaughingMode =
    expression === 'laughing' ||
    expression === 'amused' ||
    effectiveVariant === 'laughing';

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${
        interactive ? 'cursor-pointer' : ''
      } ${className}`}
      style={{ width: size }}
      onClick={handleClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {/* Ambient glowing ring */}
      {showGlow && (
        <div
          className="absolute inset-0 rounded-full blur-md opacity-60 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(244, 114, 182, 0.7) 0%, rgba(168, 85, 247, 0.1) 70%)',
          }}
        />
      )}

      {/* Main Avatar SVG Container with State-driven Animations */}
      <motion.div
        className="relative w-full aspect-square flex items-center justify-center"
        variants={avatarMotionVariants}
        animate={internalClickPop ? { scale: [1, 1.15, 1], rotate: [4, -4, 0] } : effectiveVariant}
        whileHover={interactive ? { scale: 1.08 } : undefined}
        whileTap={interactive ? { scale: 0.94 } : undefined}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md z-10 overflow-visible"
        >
          {/* Background circle badge for contrast */}
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="#1b122c"
            stroke="rgba(244, 114, 182, 0.38)"
            strokeWidth="2.5"
          />

          {/* Back Layer of Hair */}
          <path
            d="M 23 48 C 20 72, 30 84, 34 88 L 66 88 C 70 84, 80 72, 77 48 Z"
            fill="#1b1428"
          />

          {/* Shoulders / Stylish Outfit (Soft violet/pink) */}
          <path
            d="M 22 88 Q 50 72 78 88 L 78 94 Q 50 88 22 94 Z"
            fill="#3b204e"
          />
          <path
            d="M 32 80 Q 50 92 68 80 L 68 88 Q 50 95 32 88 Z"
            fill="#6b306e"
          />
          {/* Delicate necklace / collar */}
          <path
            d="M 44 76 Q 50 82 56 76"
            stroke="#f472b6"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="50" cy="80" r="1.5" fill="#fb7185" />

          {/* Neck */}
          <rect x="45" y="66" width="10" height="11" rx="3" fill="#fed7aa" />
          <rect
            x="45"
            y="68"
            width="10"
            height="5"
            fill="#fba981"
            opacity="0.3"
          />

          {/* Ears */}
          <circle cx="28" cy="50" r="5" fill="#fed7aa" />
          <circle cx="72" cy="50" r="5" fill="#fed7aa" />
          {/* Little sparkling earring */}
          <circle cx="28" cy="53" r="1.5" fill="#f472b6" />
          <circle cx="72" cy="53" r="1.5" fill="#f472b6" />

          {/* Head Base */}
          <rect
            x="30"
            y="32"
            width="40"
            height="38"
            rx="18"
            fill="#fed7aa"
          />

          {/* Front Hair with stylish bangs & volume */}
          <path
            d="M 25 44 C 25 26, 36 17, 50 17 C 64 17, 75 26, 75 44 C 73 35, 65 29, 54 29 C 43 29, 31 35, 25 44 Z"
            fill="#1b1428"
          />
          {/* Side swept bang */}
          <path d="M 28 32 Q 44 26 58 36 Q 44 30 28 39" fill="#2d1e3d" />
          <path d="M 52 25 Q 68 25 72 38" fill="#2d1e3d" />

          {/* Cute Pink/Purple Hair Clip / Ribbon */}
          <g transform="translate(64, 25) rotate(15)">
            <path d="M 0 0 L 8 4 L 0 8 Z" fill="#ec4899" />
            <path d="M 12 0 L 4 4 L 12 8 Z" fill="#ec4899" />
            <circle cx="6" cy="4" r="2.5" fill="#fdf2f8" />
          </g>

          {/* Eyebrows */}
          {expression === 'smirking' || expression === 'playful' ? (
            <>
              <path
                d="M 37 38 Q 42 34 46 38"
                stroke="#251633"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 54 37 Q 59 33 63 36"
                stroke="#251633"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : isLaughingMode ? (
            <>
              <path
                d="M 37 38 Q 41 35 46 39"
                stroke="#251633"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 54 39 Q 59 35 63 38"
                stroke="#251633"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : (
            <>
              <path
                d="M 37 39 Q 41 37 46 39"
                stroke="#251633"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 54 39 Q 59 37 63 39"
                stroke="#251633"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </>
          )}

          {/* Eyes & Blinking Animation */}
          {isBlinking ? (
            /* Closed Eyelashes with cat-eye flick */
            <>
              <path
                d="M 37 47 Q 41 51 45 47"
                stroke="#251633"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 55 47 Q 59 51 63 47"
                stroke="#251633"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 44 46 L 47 44"
                stroke="#251633"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 62 46 L 65 44"
                stroke="#251633"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </>
          ) : isLaughingMode ? (
            <>
              {/* Laughing curved joyful eyes */}
              <path
                d="M 37 47 Q 41 42 45 47"
                stroke="#251633"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M 55 47 Q 59 42 63 47"
                stroke="#251633"
                strokeWidth="2.8"
                strokeLinecap="round"
                fill="none"
              />
              {/* Tiny happy tear */}
              <path
                d="M 33 49 Q 34 52 33 54"
                stroke="#60a5fa"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />
            </>
          ) : expression === 'smirking' || expression === 'playful' ? (
            <>
              {/* Playful glancing eyes */}
              <circle cx="41" cy="46" r="3.2" fill="#251633" />
              <circle cx="42.5" cy="45" r="1.1" fill="#ffffff" />
              <circle cx="59" cy="46" r="3.2" fill="#251633" />
              <circle cx="60.5" cy="45" r="1.1" fill="#ffffff" />
              {/* Eyelash flick */}
              <path
                d="M 44 44 L 46 42"
                stroke="#251633"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 62 44 L 64 42"
                stroke="#251633"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              {/* Standard bright friendly eyes */}
              <circle cx="41" cy="46" r="3.2" fill="#251633" />
              <circle cx="42.5" cy="45" r="1.1" fill="#ffffff" />
              <circle cx="59" cy="46" r="3.2" fill="#251633" />
              <circle cx="60.5" cy="45" r="1.1" fill="#ffffff" />
              <path
                d="M 44 44 L 46 42"
                stroke="#251633"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M 62 44 L 64 42"
                stroke="#251633"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Soft Pink Blushing Cheeks */}
          <circle cx="35" cy="52" r="3.5" fill="#f472b6" opacity="0.75" />
          <circle cx="65" cy="52" r="3.5" fill="#f472b6" opacity="0.75" />

          {/* Mouth */}
          {isLaughingMode ? (
            <path
              d="M 43 55 Q 50 66 57 55 Z"
              fill="#e11d48"
              stroke="#251633"
              strokeWidth="1.5"
            />
          ) : effectiveVariant === 'talking' ? (
            <motion.path
              d="M 44 55 Q 50 63 57 55 Z"
              fill="#e11d48"
              stroke="#251633"
              strokeWidth="1.5"
              animate={{ d: ['M 44 55 Q 50 63 57 55 Z', 'M 44 56 Q 50 60 57 56 Z', 'M 44 55 Q 50 63 57 55 Z'] }}
              transition={{ duration: 0.4, repeat: Infinity }}
            />
          ) : expression === 'smirking' ? (
            <path
              d="M 44 56 Q 51 60 58 54"
              stroke="#251633"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          ) : expression === 'playful' || expression === 'amused' ? (
            <path
              d="M 44 55 Q 50 62 57 56"
              stroke="#251633"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <path
              d="M 44 56 Q 50 61 56 56"
              stroke="#251633"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
          )}
        </svg>

        {/* Floating Emoji Reaction Bubble */}
        <AnimatePresence>
          {emojiReaction && (
            <motion.div
              key={emojiReaction}
              initial={{ scale: 0, y: 5 }}
              animate={{ scale: 1, y: -8 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 16 }}
              className="absolute -top-3 -right-2 z-20 px-1.5 py-0.5 rounded-full glass-pill text-xs shadow-md border border-pink-400/40 bg-pink-950/80 backdrop-blur-md pointer-events-none"
            >
              <span>{emojiReaction}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Optional Speech Bubble Overlay */}
      {speechBubble && (
        <motion.div
          initial={{ opacity: 0, y: 4, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-xl bg-pink-950/90 border border-pink-400/30 text-[11px] text-pink-100 whitespace-nowrap shadow-lg backdrop-blur-md"
        >
          {speechBubble}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink-950/90 border-r border-b border-pink-400/30 rotate-45" />
        </motion.div>
      )}

      {/* Optional Character Name Tag */}
      {nameTag && (
        <span className="text-[10px] text-pink-300/60 font-medium tracking-wide mt-1">
          {nameTag}
        </span>
      )}
    </div>
  );
};

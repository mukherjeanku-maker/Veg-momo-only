import React from 'react';
import { motion } from 'motion/react';

interface FlowerIllustrationProps {
  size?: number;
  stage?: 'seed' | 'growing' | 'bloomed';
  glow?: boolean;
  breeze?: boolean;
  className?: string;
}

export const FlowerIllustration: React.FC<FlowerIllustrationProps> = ({
  size = 120,
  stage = 'bloomed',
  glow = true,
  breeze = true,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 1.4 }}
    >
      {/* Background radial aura glow */}
      {glow && (
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-4 w-28 h-28 rounded-full bg-gradient-to-r from-pink-400/30 via-rose-300/20 to-purple-400/25 blur-xl pointer-events-none"
        />
      )}

      {/* Swaying Flower Container */}
      <motion.svg
        viewBox="0 0 100 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
        animate={
          breeze
            ? {
                rotate: [-2.5, 2.5, -2.5],
                x: [-1.5, 1.5, -1.5],
              }
            : {}
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <defs>
          {/* Tulip Petal Gradients */}
          <linearGradient id="tulipGradientMain" x1="50" y1="20" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="50%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#e11d48" />
          </linearGradient>

          <linearGradient id="tulipGradientLeft" x1="20" y1="25" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="70%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          <linearGradient id="tulipGradientRight" x1="80" y1="25" x2="50" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbcfe8" />
            <stop offset="70%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          {/* Stem & Leaf Gradients */}
          <linearGradient id="stemGradient" x1="50" y1="50" x2="50" y2="135" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="50%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>

          <linearGradient id="leafGradient" x1="30" y1="75" x2="70" y2="115" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#16a34a" />
          </linearGradient>

          {/* Soft Bloom Filter */}
          <filter id="flowerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Stem - Growing Upwards with Motion */}
        <motion.path
          d="M 50 135 Q 49 95 50 55"
          stroke="url(#stemGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />

        {/* Left Leaf */}
        <motion.path
          d="M 50 105 C 32 100 24 82 22 72 C 34 76 46 88 50 94 Z"
          fill="url(#leafGradient)"
          stroke="#166534"
          strokeWidth="0.8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
          style={{ originX: '50px', originY: '105px' }}
        />

        {/* Right Leaf */}
        <motion.path
          d="M 50 115 C 68 112 78 95 80 84 C 68 88 56 100 50 106 Z"
          fill="url(#leafGradient)"
          stroke="#166534"
          strokeWidth="0.8"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
          style={{ originX: '50px', originY: '115px' }}
        />

        {/* Tulip Flower Head - Blooming Motion */}
        <motion.g
          initial={{ scale: 0, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
          style={{ originX: '50px', originY: '55px' }}
          filter="url(#flowerGlow)"
        >
          {/* Back Center Petal */}
          <path
            d="M 50 18 C 42 28 42 48 50 56 C 58 48 58 28 50 18 Z"
            fill="#be123c"
            opacity="0.85"
          />

          {/* Left Petal */}
          <motion.path
            d="M 50 56 C 42 56 26 48 26 32 C 26 22 36 20 44 26 C 46 36 48 46 50 56 Z"
            fill="url(#tulipGradientLeft)"
            stroke="#fda4af"
            strokeWidth="0.8"
          />

          {/* Right Petal */}
          <motion.path
            d="M 50 56 C 58 56 74 48 74 32 C 74 22 64 20 56 26 C 54 36 52 46 50 56 Z"
            fill="url(#tulipGradientRight)"
            stroke="#fda4af"
            strokeWidth="0.8"
          />

          {/* Main Front Middle Petal */}
          <motion.path
            d="M 50 58 C 38 58 34 40 38 24 C 42 16 50 14 50 14 C 50 14 58 16 62 24 C 66 40 62 58 50 58 Z"
            fill="url(#tulipGradientMain)"
            stroke="#fecdd3"
            strokeWidth="1"
          />

          {/* Soft Petal Highlights */}
          <path
            d="M 47 20 C 45 28 44 42 48 50"
            stroke="#fff"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </motion.g>

        {/* Floating golden sparkle particles */}
        <motion.circle
          cx="40"
          cy="20"
          r="1.5"
          fill="#fef08a"
          animate={{
            y: [-4, -14, -4],
            opacity: [0, 0.9, 0],
            scale: [0.8, 1.4, 0.8],
          }}
          transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
        />
        <motion.circle
          cx="62"
          cy="26"
          r="1.8"
          fill="#fbcfe8"
          animate={{
            y: [-3, -16, -3],
            opacity: [0, 0.85, 0],
            scale: [0.8, 1.5, 0.8],
          }}
          transition={{ duration: 2.8, repeat: Infinity, delay: 1 }}
        />
      </motion.svg>
    </div>
  );
};

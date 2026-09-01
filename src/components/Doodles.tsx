import React from 'react';
import { motion } from 'motion/react';

interface StickyNoteProps {
  text: string;
  rotation?: number;
  className?: string;
  tapeColor?: string;
  color?: 'yellow' | 'pink' | 'purple' | 'slate';
  delay?: number;
}

export const StickyNote: React.FC<StickyNoteProps> = ({
  text,
  rotation = -2,
  className = '',
  color = 'yellow',
  delay = 0.4,
}) => {
  const bgStyles = {
    yellow: 'bg-amber-100/90 text-amber-950 border-amber-300/60',
    pink: 'bg-pink-100/90 text-pink-950 border-pink-300/60',
    purple: 'bg-purple-100/90 text-purple-950 border-purple-300/60',
    slate: 'bg-slate-800/90 text-purple-100 border-purple-400/40',
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: rotation - 5 }}
      animate={{ opacity: 1, scale: 1, rotate: rotation }}
      transition={{ duration: 0.6, delay, ease: [0.34, 1.56, 0.64, 1] }}
      className={`sticky-note relative px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-lg border text-xs sm:text-sm font-handwritten font-medium tracking-wide shadow-md select-none inline-block ${bgStyles} ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {/* Little washi tape piece at the top */}
      <div className="washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3 bg-white/40 -rotate-1 rounded-xs pointer-events-none shadow-xs" />
      <span className="leading-snug">{text}</span>
    </motion.div>
  );
};

export const DoodleArrow: React.FC<{
  className?: string;
  direction?: 'right' | 'left' | 'down' | 'up' | 'curved-down' | 'curved-up';
  color?: string;
  width?: number;
  height?: number;
}> = ({
  className = '',
  direction = 'right',
  color = '#f472b6',
  width = 48,
  height = 28,
}) => {
  let path = 'M 4 14 Q 24 6 40 14 M 32 6 L 42 14 L 33 22';
  if (direction === 'curved-down') {
    path = 'M 4 4 Q 28 8 28 26 M 20 20 L 28 27 L 34 18';
  } else if (direction === 'curved-up') {
    path = 'M 4 24 Q 28 20 28 4 M 20 10 L 28 3 L 34 12';
  } else if (direction === 'left') {
    path = 'M 44 14 Q 24 6 8 14 M 16 6 L 6 14 L 15 22';
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible pointer-events-none ${className}`}
    >
      <path
        d={path}
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const DoodleHeart: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 22, color = '#fb7185' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block pointer-events-none ${className}`}
    >
      <path
        d="M 12 21 C 12 21 3 14.5 3 8.5 C 3 5.5 5.5 3 8.5 3 C 10.5 3 11.5 4 12 5 C 12.5 4 13.5 3 15.5 3 C 18.5 3 21 5.5 21 8.5 C 21 14.5 12 21 12 21 Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="0.5 0.5"
      />
    </svg>
  );
};

export const DoodleStar: React.FC<{
  className?: string;
  size?: number;
  color?: string;
}> = ({ className = '', size = 20, color = '#fde047' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block pointer-events-none ${className}`}
    >
      <path
        d="M 12 2 L 14 9 L 21 10 L 16 15 L 18 22 L 12 18 L 6 22 L 8 15 L 3 10 L 10 9 Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const HandwrittenAnnotation: React.FC<{
  text: string;
  arrowDirection?: 'left' | 'right' | 'up' | 'down' | 'curved-down' | 'curved-up';
  rotation?: number;
  className?: string;
  color?: string;
}> = ({
  text,
  arrowDirection = 'curved-down',
  rotation = -3,
  className = '',
  color = '#fbcfe8',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 font-handwritten text-xs sm:text-sm select-none ${className}`}
      style={{ transform: `rotate(${rotation}deg)`, color }}
    >
      <span>{text}</span>
      <DoodleArrow direction={arrowDirection} color={color} width={32} height={20} />
    </div>
  );
};

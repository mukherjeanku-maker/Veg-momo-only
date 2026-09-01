import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { playEasterEggSound, playBubbleTap } from '../utils/sound';

interface HeaderProgressProps {
  currentPage: number;
  totalPages: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPageSelect: (page: number) => void;
  onRestart: () => void;
  onTriggerEasterEgg?: (type: 'sparkle' | 'eyes') => void;
}

export const HeaderProgress: React.FC<HeaderProgressProps> = ({
  currentPage,
  totalPages,
  soundEnabled,
  onToggleSound,
  onPageSelect,
  onRestart,
  onTriggerEasterEgg,
}) => {
  const [sparkleTapCount, setSparkleTapCount] = useState(0);
  const formattedCurrent = currentPage.toString().padStart(2, '0');
  const formattedTotal = totalPages.toString().padStart(2, '0');

  const handleSparkleTap = () => {
    playBubbleTap();
    const nextCount = sparkleTapCount + 1;
    setSparkleTapCount(nextCount);
    if (nextCount >= 3) {
      playEasterEggSound();
      setSparkleTapCount(0);
      onTriggerEasterEgg?.('sparkle');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 pt-4 pb-3 flex items-center justify-between pointer-events-auto">
      {/* Brand / Subtle Title Indicator with Easter Egg 1 Trigger */}
      <div id="header-brand-badge" className="flex items-center gap-2">
        <button
          id="header-sparkle-egg-btn"
          onClick={handleSparkleTap}
          className="group flex items-center gap-1.5 focus:outline-none cursor-pointer py-1 px-2 rounded-full hover:bg-purple-950/40 transition-colors"
          title="✨"
          aria-label="Interactive sparkle badge"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-400 group-hover:rotate-45 transition-transform duration-300 animate-pulse" />
          <span className="text-xs tracking-widest uppercase font-medium text-purple-300/70 select-none">
            For Sudipta
          </span>
        </button>
      </div>

      {/* Center Progress: 01 / 07 */}
      <div id="header-progress-indicator" className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wider text-purple-200">
            {formattedCurrent}
          </span>
          <span className="text-[10px] text-purple-400/40">/</span>
          <span className="text-xs text-purple-300/50">
            {formattedTotal}
          </span>
        </div>
        
        {/* Subtle pill progress indicators */}
        <div className="flex items-center gap-1 mt-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              id={`header-step-pill-${page}`}
              onClick={() => onPageSelect(page)}
              className="group py-1.5 px-1 min-h-[32px] flex items-center justify-center focus:outline-none cursor-pointer"
              title={`Go to page ${page}`}
              aria-label={`Go to page ${page}`}
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  page === currentPage
                    ? 'w-5 bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_6px_rgba(236,72,153,0.5)]'
                    : page < currentPage
                    ? 'w-2.5 bg-purple-400/50'
                    : 'w-1.5 bg-purple-900/40 group-hover:bg-purple-700/60'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Action Controls: Sound & Restart */}
      <div className="flex items-center gap-2">
        <motion.button
          id="header-sound-toggle-btn"
          whileTap={{ scale: 0.9 }}
          onClick={onToggleSound}
          className="w-9 h-9 min-h-[36px] min-w-[36px] rounded-full flex items-center justify-center glass-pill text-purple-300/80 hover:text-purple-100 hover:border-purple-400/30 transition-colors cursor-pointer"
          title={soundEnabled ? 'Mute subtle chimes' : 'Enable subtle chimes'}
          aria-label={soundEnabled ? 'Mute subtle chimes' : 'Enable subtle chimes'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-purple-300" />
          ) : (
            <VolumeX className="w-4 h-4 text-purple-400/50" />
          )}
        </motion.button>

        {currentPage > 1 && (
          <motion.button
            id="header-restart-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onRestart}
            className="w-9 h-9 min-h-[36px] min-w-[36px] rounded-full flex items-center justify-center glass-pill text-purple-300/80 hover:text-purple-100 hover:border-purple-400/30 transition-colors cursor-pointer"
            title="Start from beginning"
            aria-label="Start from beginning"
          >
            <RotateCcw className="w-4 h-4 text-purple-300" />
          </motion.button>
        )}
      </div>
    </header>
  );
};

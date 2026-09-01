import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MeAvatar } from './CartoonAvatars';
import { playBubbleTap, playDetectiveClue } from '../utils/sound';
import { Search } from 'lucide-react';

interface SeriousInvestigationProps {
  onProceed?: () => void;
}

type TheoryChoice = 'sudipta' | 'not_me' | 'insufficient' | null;

export const SeriousInvestigation: React.FC<SeriousInvestigationProps> = ({ onProceed }) => {
  const [choice, setChoice] = useState<TheoryChoice>(null);

  const handleSelect = (c: TheoryChoice) => {
    playBubbleTap();
    playDetectiveClue();
    setChoice(c);
  };

  return (
    <div id="serious-investigation-card" className="w-full max-w-md mx-auto my-4 text-center select-none">
      {/* Header with Detective Mascot */}
      <div className="flex flex-col items-center mb-4">
        <div className="relative mb-2">
          <MeAvatar
            size={76}
            expression="detective"
            showGlow
            interactive
            emojiReaction="🕵️"
          />
          <div className="absolute -bottom-2 -right-1 bg-amber-500/20 border border-amber-400/40 px-2 py-0.5 rounded-full text-[10px] text-amber-200 font-mono tracking-wider">
            CASE #007
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs uppercase tracking-widest text-amber-300/80 font-medium">
          <Search className="w-3.5 h-3.5 text-amber-300" />
          <span>Important investigation</span>
        </div>
        <h3 className="text-base sm:text-lg font-light text-purple-100 mt-1">
          I have a theory.
        </h3>
        <p className="text-xs text-purple-300/70 mt-1">
          Who is responsible for the random smiles?
        </p>
      </div>

      {/* 3 Investigation Choices */}
      <div className="flex flex-col sm:flex-row gap-2.5 justify-center mb-4">
        <motion.button
          id="investigation-choice-sudipta"
          onClick={() => handleSelect('sudipta')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 border cursor-pointer ${
            choice === 'sudipta'
              ? 'bg-gradient-to-r from-amber-600/90 to-purple-600/90 text-white border-amber-300/50 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
              : 'glass-panel text-purple-100 border-purple-400/20 hover:border-amber-400/40'
          }`}
        >
          <span>Sudipta 👀</span>
        </motion.button>

        <motion.button
          id="investigation-choice-not-me"
          onClick={() => handleSelect('not_me')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 border cursor-pointer ${
            choice === 'not_me'
              ? 'bg-gradient-to-r from-amber-600/90 to-purple-600/90 text-white border-amber-300/50 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
              : 'glass-panel text-purple-100 border-purple-400/20 hover:border-amber-400/40'
          }`}
        >
          <span>Definitely not me</span>
        </motion.button>

        <motion.button
          id="investigation-choice-insufficient"
          onClick={() => handleSelect('insufficient')}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          className={`py-3 px-4 rounded-2xl text-xs sm:text-sm font-medium transition-all duration-300 border cursor-pointer ${
            choice === 'insufficient'
              ? 'bg-gradient-to-r from-amber-600/90 to-purple-600/90 text-white border-amber-300/50 shadow-[0_0_20px_rgba(245,158,11,0.35)]'
              : 'glass-panel text-purple-100 border-purple-400/20 hover:border-amber-400/40'
          }`}
        >
          <span>Insufficient evidence 🕵️</span>
        </motion.button>
      </div>

      {/* Investigation Finding Output */}
      <div className="min-h-[85px] flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {choice && (
            <motion.div
              key={choice}
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="w-full p-3.5 rounded-2xl glass-panel border border-amber-400/30 bg-purple-950/60"
            >
              <div className="text-xs sm:text-sm font-medium text-amber-200">
                {choice === 'sudipta' && 'Interesting. The evidence is… suspiciously strong.'}
                {choice === 'not_me' && 'Hmm. Denial detected.'}
                {choice === 'insufficient' && 'Fair. Case remains open. 😂'}
              </div>
              <div className="text-[11px] font-mono text-purple-300/70 mt-1.5 flex items-center justify-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span>Investigation status: unresolved.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

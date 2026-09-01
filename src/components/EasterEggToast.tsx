import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Eye } from 'lucide-react';

interface EasterEggToastProps {
  message: { title: string; subtitle?: string; type?: 'sparkle' | 'eyes' | 'avatar' } | null;
  onClose: () => void;
}

export const EasterEggToast: React.FC<EasterEggToastProps> = ({ message, onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 350, damping: 24 }}
          onClick={onClose}
          className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl glass-panel border border-pink-400/50 bg-purple-950/90 text-center shadow-[0_10px_25px_rgba(0,0,0,0.6)] cursor-pointer backdrop-blur-lg max-w-xs"
        >
          <div className="flex items-center justify-center gap-1.5 text-xs text-pink-300 font-medium">
            {message.type === 'sparkle' ? (
              <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: '3s' }} />
            ) : (
              <Eye className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            )}
            <span>{message.title}</span>
          </div>
          {message.subtitle && (
            <p className="text-[11px] text-purple-200/80 mt-0.5">
              {message.subtitle}
            </p>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

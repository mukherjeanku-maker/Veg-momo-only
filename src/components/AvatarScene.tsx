import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import {
  MeAvatar,
  SudiptaAvatar,
  AvatarExpression,
  SudiptaExpression,
  AvatarAnimationVariant,
} from './CartoonAvatars';
import { playSoftChime, playSparkle } from '../utils/sound';

export type ScenePreset =
  | 'greeting'
  | 'banter'
  | 'laughing'
  | 'curious'
  | 'surprise'
  | 'playful'
  | 'awkward'
  | 'bengali-ask'
  | 'bengali-yes'
  | 'bengali-maybe'
  | 'celebrating'
  | 'dialogue'
  | 'custom';

export type LayoutMode =
  | 'inline'
  | 'split'
  | 'floating-sides'
  | 'card'
  | 'badge'
  | 'peeking';

export interface AvatarSceneProps {
  scene?: ScenePreset;
  layout?: LayoutMode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  meExpression?: AvatarExpression;
  sudiptaExpression?: SudiptaExpression;
  meVariant?: AvatarAnimationVariant;
  sudiptaVariant?: AvatarAnimationVariant;
  meReaction?: string;
  sudiptaReaction?: string;
  meSpeech?: string;
  sudiptaSpeech?: string;
  showConnector?: 'heart' | 'sparkle' | 'dot' | 'none';
  showLabels?: boolean;
  showGlow?: boolean;
  interactive?: boolean;
  className?: string;
  onMeClick?: () => void;
  onSudiptaClick?: () => void;
  hideMe?: boolean;
  hideSudipta?: boolean;
}

const SIZE_MAP = {
  sm: 36,
  md: 48,
  lg: 60,
  xl: 76,
};

/**
 * High-level helper component coordinating 'Me' and 'Sudipta' cartoon avatars
 * with state-driven animation variants, preset scenarios, and interactive touch points.
 */
export const AvatarScene: React.FC<AvatarSceneProps> = ({
  scene = 'greeting',
  layout = 'inline',
  size = 'md',
  meExpression,
  sudiptaExpression,
  meVariant,
  sudiptaVariant,
  meReaction,
  sudiptaReaction,
  meSpeech,
  sudiptaSpeech,
  showConnector = 'dot',
  showLabels = false,
  showGlow = false,
  interactive = true,
  className = '',
  onMeClick,
  onSudiptaClick,
  hideMe = false,
  hideSudipta = false,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZE_MAP[size] || 48;

  // Resolve presets configuration
  const getPresetConfig = () => {
    switch (scene) {
      case 'greeting':
        return {
          meExpr: 'waving' as AvatarExpression,
          meVar: 'waving' as AvatarAnimationVariant,
          meReac: '👋',
          sudExpr: 'playful' as SudiptaExpression,
          sudVar: 'idle' as AvatarAnimationVariant,
          sudReac: '✨',
          connector: 'sparkle' as const,
        };
      case 'banter':
        return {
          meExpr: 'curious' as AvatarExpression,
          meVar: 'thinking' as AvatarAnimationVariant,
          meReac: '🤔',
          sudExpr: 'smirking' as SudiptaExpression,
          sudVar: 'idle' as AvatarAnimationVariant,
          sudReac: '😏',
          connector: 'dot' as const,
        };
      case 'laughing':
        return {
          meExpr: 'hopeful' as AvatarExpression,
          meVar: 'laughing' as AvatarAnimationVariant,
          meReac: '😄',
          sudExpr: 'laughing' as SudiptaExpression,
          sudVar: 'laughing' as AvatarAnimationVariant,
          sudReac: '🤣',
          connector: 'heart' as const,
        };
      case 'curious':
        return {
          meExpr: 'curious' as AvatarExpression,
          meVar: 'thinking' as AvatarAnimationVariant,
          meReac: '👀',
          sudExpr: 'mysterious' as SudiptaExpression,
          sudVar: 'idle' as AvatarAnimationVariant,
          sudReac: '🤫',
          connector: 'sparkle' as const,
        };
      case 'surprise':
        return {
          meExpr: 'peeking' as AvatarExpression,
          meVar: 'bouncing' as AvatarAnimationVariant,
          meReac: '🎁',
          sudExpr: 'playful' as SudiptaExpression,
          sudVar: 'celebrating' as AvatarAnimationVariant,
          sudReac: '✨',
          connector: 'sparkle' as const,
        };
      case 'playful':
        return {
          meExpr: 'proud' as AvatarExpression,
          meVar: 'idle' as AvatarAnimationVariant,
          meReac: '😌',
          sudExpr: 'smirking' as SudiptaExpression,
          sudVar: 'idle' as AvatarAnimationVariant,
          sudReac: '😏',
          connector: 'sparkle' as const,
        };
      case 'awkward':
        return {
          meExpr: 'awkward' as AvatarExpression,
          meVar: 'shy' as AvatarAnimationVariant,
          meReac: '🫣',
          sudExpr: 'playful' as SudiptaExpression,
          sudVar: 'idle' as AvatarAnimationVariant,
          sudReac: '🤭',
          connector: 'dot' as const,
        };
      case 'bengali-ask':
        return {
          meExpr: 'hopeful' as AvatarExpression,
          meVar: 'nodding' as AvatarAnimationVariant,
          meReac: '🤞',
          sudExpr: 'smirking' as SudiptaExpression,
          sudVar: 'idle' as AvatarAnimationVariant,
          sudReac: '👀',
          connector: 'sparkle' as const,
        };
      case 'bengali-yes':
        return {
          meExpr: 'celebrating' as AvatarExpression,
          meVar: 'celebrating' as AvatarAnimationVariant,
          meReac: '🎉',
          sudExpr: 'celebrating' as SudiptaExpression,
          sudVar: 'celebrating' as AvatarAnimationVariant,
          sudReac: '❤️',
          connector: 'heart' as const,
        };
      case 'bengali-maybe':
        return {
          meExpr: 'confused' as AvatarExpression,
          meVar: 'thinking' as AvatarAnimationVariant,
          meReac: '👀',
          sudExpr: 'playful' as SudiptaExpression,
          sudVar: 'idle' as AvatarAnimationVariant,
          sudReac: '🤭',
          connector: 'dot' as const,
        };
      case 'celebrating':
        return {
          meExpr: 'celebrating' as AvatarExpression,
          meVar: 'celebrating' as AvatarAnimationVariant,
          meReac: '🎉',
          sudExpr: 'celebrating' as SudiptaExpression,
          sudVar: 'celebrating' as AvatarAnimationVariant,
          sudReac: '✨',
          connector: 'heart' as const,
        };
      case 'dialogue':
        return {
          meExpr: 'hopeful' as AvatarExpression,
          meVar: meSpeech ? ('talking' as AvatarAnimationVariant) : ('idle' as AvatarAnimationVariant),
          meReac: undefined,
          sudExpr: 'smirking' as SudiptaExpression,
          sudVar: sudiptaSpeech ? ('talking' as AvatarAnimationVariant) : ('idle' as AvatarAnimationVariant),
          sudReac: undefined,
          connector: 'sparkle' as const,
        };
      default:
        return {
          meExpr: 'neutral' as AvatarExpression,
          meVar: 'idle' as AvatarAnimationVariant,
          meReac: undefined,
          sudExpr: 'neutral' as SudiptaExpression,
          sudVar: 'idle' as AvatarAnimationVariant,
          sudReac: undefined,
          connector: 'dot' as const,
        };
    }
  };

  const preset = getPresetConfig();

  const finalMeExpr = meExpression || preset.meExpr;
  const finalMeVar = meVariant || preset.meVar;
  const finalMeReac = meReaction !== undefined ? meReaction : preset.meReac;

  const finalSudExpr = sudiptaExpression || preset.sudExpr;
  const finalSudVar = sudiptaVariant || preset.sudVar;
  const finalSudReac = sudiptaReaction !== undefined ? sudiptaReaction : preset.sudReac;

  const effectiveConnector = showConnector !== 'dot' ? showConnector : preset.connector;

  const handleMeClick = () => {
    playSoftChime(523.25);
    onMeClick?.();
  };

  const handleSudiptaClick = () => {
    playSparkle();
    onSudiptaClick?.();
  };

  // Render floating sides layout (e.g. ambient background in intro)
  if (layout === 'floating-sides') {
    return (
      <div className={`absolute inset-0 pointer-events-none flex items-center justify-between px-6 sm:px-12 opacity-20 ${className}`}>
        {!hideMe && (
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [-4, 4, -4] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MeAvatar
              size={pixelSize}
              expression={finalMeExpr}
              animateVariant={finalMeVar}
              emojiReaction={finalMeReac}
              showGlow={showGlow}
              nameTag={showLabels ? 'Me' : undefined}
            />
          </motion.div>
        )}
        {!hideSudipta && (
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [4, -4, 4] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SudiptaAvatar
              size={pixelSize}
              expression={finalSudExpr}
              animateVariant={finalSudVar}
              emojiReaction={finalSudReac}
              showGlow={showGlow}
              nameTag={showLabels ? 'Sudipta' : undefined}
            />
          </motion.div>
        )}
      </div>
    );
  }

  // Render card container layout
  if (layout === 'card') {
    return (
      <div className={`p-4 sm:p-5 rounded-3xl glass-panel border border-purple-400/20 shadow-xl flex items-center justify-between gap-4 ${className}`}>
        {!hideMe && (
          <div className="flex items-center gap-3">
            <MeAvatar
              size={pixelSize}
              expression={finalMeExpr}
              animateVariant={finalMeVar}
              emojiReaction={finalMeReac}
              showGlow={showGlow}
              interactive={interactive}
              onClick={handleMeClick}
              speechBubble={meSpeech}
              nameTag={showLabels ? 'Me' : undefined}
            />
          </div>
        )}

        {/* Connector */}
        {!hideMe && !hideSudipta && (
          <div className="flex items-center justify-center px-2">
            {effectiveConnector === 'heart' && (
              <motion.div
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400/40" />
              </motion.div>
            )}
            {effectiveConnector === 'sparkle' && (
              <motion.div
                animate={{ rotate: [0, 180, 360], scale: [1, 1.15, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <Sparkles className="w-4 h-4 text-purple-300" />
              </motion.div>
            )}
            {effectiveConnector === 'dot' && (
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400/40" />
            )}
          </div>
        )}

        {!hideSudipta && (
          <div className="flex items-center gap-3">
            <SudiptaAvatar
              size={pixelSize}
              expression={finalSudExpr}
              animateVariant={finalSudVar}
              emojiReaction={finalSudReac}
              showGlow={showGlow}
              interactive={interactive}
              onClick={handleSudiptaClick}
              speechBubble={sudiptaSpeech}
              nameTag={showLabels ? 'Sudipta' : undefined}
            />
          </div>
        )}
      </div>
    );
  }

  // Standard inline layout
  return (
    <div className={`relative inline-flex items-center justify-center gap-3.5 select-none ${className}`}>
      {!hideMe && (
        <MeAvatar
          size={pixelSize}
          expression={finalMeExpr}
          animateVariant={finalMeVar}
          emojiReaction={finalMeReac}
          showGlow={showGlow}
          interactive={interactive}
          onClick={handleMeClick}
          speechBubble={meSpeech}
          nameTag={showLabels ? 'Me' : undefined}
        />
      )}

      {/* Center connector badge */}
      {!hideMe && !hideSudipta && showConnector !== 'none' && (
        <div className="flex items-center justify-center shrink-0">
          {effectiveConnector === 'heart' ? (
            <motion.div
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ duration: 1.6, repeat: Infinity }}
            >
              <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/40" />
            </motion.div>
          ) : effectiveConnector === 'sparkle' ? (
            <motion.div
              animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            </motion.div>
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400/40" />
          )}
        </div>
      )}

      {!hideSudipta && (
        <SudiptaAvatar
          size={pixelSize}
          expression={finalSudExpr}
          animateVariant={finalSudVar}
          emojiReaction={finalSudReac}
          showGlow={showGlow}
          interactive={interactive}
          onClick={handleSudiptaClick}
          speechBubble={sudiptaSpeech}
          nameTag={showLabels ? 'Sudipta' : undefined}
        />
      )}
    </div>
  );
};

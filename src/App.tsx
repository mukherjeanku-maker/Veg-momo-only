import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CinematicBackground, BackgroundSceneType } from './components/CinematicBackground';
import { HeaderProgress } from './components/HeaderProgress';
import { Page1Intro } from './components/Page1Intro';
import { Page2Story } from './components/Page2Story';
import { Page3InstagramChat } from './components/Page3InstagramChat';
import { Page4Surprise } from './components/Page4Surprise';
import { Page5Playful } from './components/Page5Playful';
import { Page6FinalMessage } from './components/Page6FinalMessage';
import { Page7FinalInteraction } from './components/Page7FinalInteraction';
import { EasterEggToast } from './components/EasterEggToast';
import { LoadingJoke } from './components/LoadingJoke';
import { AdminVisitDashboard } from './components/AdminVisitDashboard';
import { setSoundEnabled, playSoftChime } from './utils/sound';
import { recordVisit, trackPageProgress } from './lib/visitTracker';

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const [easterEggType, setEasterEggType] = useState<'sparkle' | 'eyes' | null>(null);
  const [showLoadingJoke, setShowLoadingJoke] = useState<boolean>(false);
  const [surpriseOpen, setSurpriseOpen] = useState<boolean>(false);
  const [customScene, setCustomScene] = useState<BackgroundSceneType | null>(null);
  const [isAdminView, setIsAdminView] = useState<boolean>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get('admin') === 'true' || window.location.hash === '#admin';
    } catch {
      return false;
    }
  });
  const totalPages = 7;

  // Record initial lightweight anonymous visit
  useEffect(() => {
    recordVisit();
  }, []);

  // Track page progression privately
  useEffect(() => {
    trackPageProgress(currentPage);
  }, [currentPage]);

  // Sync sound settings
  const handleToggleSound = () => {
    const newState = !soundActive;
    setSoundActive(newState);
    setSoundEnabled(newState);
    if (newState) {
      playSoftChime(659.25);
    }
  };

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const handlePrev = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const handleSelectPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      playSoftChime(587.33);
      setCustomScene(null);
      setCurrentPage(page);
    }
  };

  const handleRestart = () => {
    playSoftChime(523.25);
    setCustomScene(null);
    setSurpriseOpen(false);
    setCurrentPage(1);
  };

  const handleTriggerLoadingJoke = () => {
    setShowLoadingJoke(true);
  };

  const handleFinishLoadingJoke = () => {
    setShowLoadingJoke(false);
    handleNext();
  };

  // Keyboard navigation support (Arrow keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Touch swipe support on mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 60;

    // Swipe left (next)
    if (distance > minSwipeDistance) {
      handleNext();
    }
    // Swipe right (prev)
    else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    setTouchStart(null);
  };

  if (isAdminView) {
    return (
      <AdminVisitDashboard
        onCloseAdmin={() => setIsAdminView(false)}
        onOpenWebsite={() => setIsAdminView(false)}
      />
    );
  }

  return (
    <div
      className="relative w-full min-h-[100dvh] bg-[#07050e] text-slate-100 flex flex-col justify-between overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Cinematic 2D Illustrated Animated Background */}
      <CinematicBackground scene={customScene || undefined} page={currentPage} surpriseOpen={surpriseOpen} />

      {/* Top Header & Progress */}
      <HeaderProgress
        currentPage={currentPage}
        totalPages={totalPages}
        soundEnabled={soundActive}
        onToggleSound={handleToggleSound}
        onPageSelect={handleSelectPage}
        onRestart={handleRestart}
        onTriggerEasterEgg={(type) => setEasterEggType(type)}
      />

      {/* Main Interactive Stage with Motion Transitions */}
      <main className="relative z-10 flex-1 flex items-center justify-center pt-16 pb-12 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {currentPage === 1 && (
            <motion.div
              key="page-1"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Page1Intro
                onNext={handleNext}
                onTriggerEyesEgg={() => setEasterEggType('eyes')}
              />
            </motion.div>
          )}

          {currentPage === 2 && (
            <motion.div
              key="page-2"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Page2Story
                onNext={handleNext}
                onTriggerLoadingJoke={handleTriggerLoadingJoke}
              />
            </motion.div>
          )}

          {currentPage === 3 && (
            <motion.div
              key="page-3"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Page3InstagramChat onNext={handleNext} />
            </motion.div>
          )}

          {currentPage === 4 && (
            <motion.div
              key="page-4"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Page4Surprise
                onNext={handleNext}
                onSurpriseOpen={() => setSurpriseOpen(true)}
              />
            </motion.div>
          )}

          {currentPage === 5 && (
            <motion.div
              key="page-5"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Page5Playful onNext={handleNext} />
            </motion.div>
          )}

          {currentPage === 6 && (
            <motion.div
              key="page-6"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Page6FinalMessage onNext={handleNext} />
            </motion.div>
          )}

          {currentPage === 7 && (
            <motion.div
              key="page-7"
              initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 1.03, filter: 'blur(4px)' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <Page7FinalInteraction
                onRestart={handleRestart}
                onSceneChange={(scene) => setCustomScene(scene)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Global Easter Egg Toast notification */}
      <EasterEggToast
        isOpen={easterEggType !== null}
        type={easterEggType || 'sparkle'}
        onClose={() => setEasterEggType(null)}
      />

      {/* Loading joke transition modal */}
      <LoadingJoke
        isOpen={showLoadingJoke}
        onFinished={handleFinishLoadingJoke}
      />

      {/* Subtle bottom navigation hint for mobile users with discrete owner shortcut */}
      <footer className="relative z-10 text-center py-2 px-4 select-none flex items-center justify-center gap-2">
        <p className="text-[11px] text-purple-300/30 tracking-wider">
          {currentPage < totalPages ? 'Tap button or swipe to navigate' : 'Crafted with care ✨'}
        </p>
        <button
          onClick={() => setIsAdminView(true)}
          className="opacity-0 hover:opacity-40 transition-opacity text-[10px] text-purple-300 p-1 cursor-default"
          title="Owner view"
          tabIndex={-1}
        >
          🌷
        </button>
      </footer>
    </div>
  );
}

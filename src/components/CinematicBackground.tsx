import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export type BackgroundSceneType = 
  | 'rooftop-night'   // Scene 1: Page 1, 3, 5 - Rooftop under starry sky, crescent moon, city in distance
  | 'city-walk'       // Scene 2: Page 2 - Walking through softly illuminated street
  | 'warm-lights'     // Scene 4: Page 4 - Sitting under warm city lights, fairy lights, surprise sparkle
  | 'sunset-horizon'  // Scene 3: Page 6 - Sunset evening scene, looking at horizon
  | 'calm-starlight'  // Scene 5: Page 7 - Calm night scene, twinkling stars, peaceful starlight
  | 'proposal-warm'   // Secret Ending Proposal Scene: Darker, warmer rooftop with soft purple & pink glow
  | 'proposal-dark';  // Final Ending Closure Scene: Deep silhouettes, stars, intimate dark glow

interface CinematicBackgroundProps {
  scene?: BackgroundSceneType;
  page?: number;
  surpriseOpen?: boolean;
}

export const CinematicBackground: React.FC<CinematicBackgroundProps> = ({
  scene,
  page = 1,
  surpriseOpen = false,
}) => {
  // Determine active scene based on page mapping
  const activeScene: BackgroundSceneType = scene || (
    page === 1 ? 'proposal-dark' :
    page === 2 ? 'city-walk' :
    page === 3 ? 'warm-lights' :
    page === 4 ? 'sunset-horizon' :
    page === 5 ? 'warm-lights' :
    page === 6 ? 'calm-starlight' :
    'proposal-dark'
  );

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Canvas starfield, embers, and shooting stars animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const isSunset = activeScene === 'sunset-horizon';
    const isWarm = activeScene === 'warm-lights' || activeScene === 'proposal-warm';
    const isCalm = activeScene === 'calm-starlight' || activeScene === 'proposal-dark';

    // Stars pool
    const starCount = isSunset ? 30 : isWarm ? 60 : isCalm ? 90 : 70;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * (h * 0.72),
      r: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    // Floating embers / bokeh fireflies
    const emberCount = activeScene === 'proposal-warm' ? 38 : isWarm ? 32 : isSunset ? 24 : 16;
    const embers = Array.from({ length: emberCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 3.2 + 1,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: -Math.random() * 0.45 - 0.12,
      alpha: Math.random() * 0.45 + 0.15,
      color: activeScene === 'proposal-warm' ? '#f472b6' : isWarm ? '#fef08a' : isSunset ? '#fbcfe8' : '#e9d5ff',
    }));

    // Shooting star
    let shootingStar: { x: number; y: number; length: number; speed: number; angle: number; opacity: number } | null = null;
    let nextShootingStar = Date.now() + Math.random() * 5000 + 3000;

    let time = 0;
    const render = () => {
      time += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Render stars
      stars.forEach((s) => {
        const tw = Math.sin(time * 2.2 + s.phase) * 0.35;
        const curAlpha = Math.max(0.1, Math.min(1, s.alpha + tw));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = isSunset ? '#fef08a' : '#f5d0fe';
        ctx.globalAlpha = curAlpha;
        ctx.fill();
      });

      // Render embers
      embers.forEach((e) => {
        e.x += e.speedX;
        e.y += e.speedY;
        if (e.y < -10) {
          e.y = h + 10;
          e.x = Math.random() * w;
        }
        if (e.x < -10) e.x = w + 10;
        if (e.x > w + 10) e.x = -10;

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.globalAlpha = e.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = e.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Shooting stars
      if (Date.now() > nextShootingStar && !shootingStar && !isSunset) {
        shootingStar = {
          x: Math.random() * (w * 0.7),
          y: Math.random() * (h * 0.35),
          length: Math.random() * 90 + 45,
          speed: Math.random() * 9 + 11,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.25,
          opacity: 1,
        };
        nextShootingStar = Date.now() + Math.random() * 7000 + 4000;
      }

      if (shootingStar) {
        ctx.beginPath();
        const endX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
        const endY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;
        const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, endX, endY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        grad.addColorStop(1, 'rgba(216, 180, 254, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.016;

        if (shootingStar.opacity <= 0 || shootingStar.x > w || shootingStar.y > h) {
          shootingStar = null;
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
    };
  }, [activeScene]);

  // Scene Atmosphere Colors
  const getAtmosphere = () => {
    switch (activeScene) {
      case 'sunset-horizon':
        return {
          sky: 'bg-gradient-to-b from-[#180a2b] via-[#3a1236] via-[#5a1c38] to-[#12071f]',
          bloom1: 'radial-gradient(circle, rgba(244, 114, 182, 0.32) 0%, rgba(217, 70, 239, 0.1) 60%, transparent 100%)',
          bloom2: 'radial-gradient(circle, rgba(251, 146, 60, 0.28) 0%, rgba(234, 88, 12, 0.05) 70%, transparent 100%)',
          horizon: 'bg-gradient-to-t from-pink-500/25 via-amber-500/15 to-transparent',
        };
      case 'warm-lights':
        return {
          sky: 'bg-gradient-to-b from-[#0b0518] via-[#1c0c28] to-[#10061d]',
          bloom1: 'radial-gradient(circle, rgba(250, 204, 21, 0.28) 0%, rgba(244, 114, 182, 0.1) 60%, transparent 100%)',
          bloom2: 'radial-gradient(circle, rgba(236, 72, 153, 0.24) 0%, rgba(168, 85, 247, 0.08) 70%, transparent 100%)',
          horizon: 'bg-gradient-to-t from-amber-500/20 via-pink-500/12 to-transparent',
        };
      case 'city-walk':
        return {
          sky: 'bg-gradient-to-b from-[#070314] via-[#120722] to-[#0a0416]',
          bloom1: 'radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, rgba(139, 92, 246, 0.08) 60%, transparent 100%)',
          bloom2: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, rgba(192, 132, 252, 0.05) 70%, transparent 100%)',
          horizon: 'bg-gradient-to-t from-purple-500/18 via-indigo-500/10 to-transparent',
        };
      case 'calm-starlight':
        return {
          sky: 'bg-gradient-to-b from-[#050210] via-[#0d051e] to-[#070213]',
          bloom1: 'radial-gradient(circle, rgba(147, 51, 234, 0.22) 0%, rgba(79, 70, 229, 0.06) 60%, transparent 100%)',
          bloom2: 'radial-gradient(circle, rgba(216, 180, 254, 0.18) 0%, rgba(168, 85, 247, 0.04) 70%, transparent 100%)',
          horizon: 'bg-gradient-to-t from-purple-900/30 via-indigo-900/15 to-transparent',
        };
      case 'proposal-warm':
        return {
          sky: 'bg-gradient-to-b from-[#0b0318] via-[#1a082b] via-[#2a0c33] to-[#10041d]',
          bloom1: 'radial-gradient(circle, rgba(244, 114, 182, 0.35) 0%, rgba(192, 132, 252, 0.14) 60%, transparent 100%)',
          bloom2: 'radial-gradient(circle, rgba(251, 146, 60, 0.25) 0%, rgba(219, 39, 119, 0.08) 70%, transparent 100%)',
          horizon: 'bg-gradient-to-t from-pink-500/26 via-purple-600/16 to-transparent',
        };
      case 'proposal-dark':
        return {
          sky: 'bg-gradient-to-b from-[#04010a] via-[#090314] to-[#04010b]',
          bloom1: 'radial-gradient(circle, rgba(168, 85, 247, 0.16) 0%, rgba(79, 70, 229, 0.04) 60%, transparent 100%)',
          bloom2: 'radial-gradient(circle, rgba(216, 180, 254, 0.12) 0%, transparent 70%)',
          horizon: 'bg-gradient-to-t from-purple-950/25 to-transparent',
        };
      case 'rooftop-night':
      default:
        return {
          sky: 'bg-gradient-to-b from-[#090418] via-[#140827] to-[#0b0318]',
          bloom1: 'radial-gradient(circle, rgba(192, 132, 252, 0.25) 0%, rgba(147, 51, 234, 0.08) 60%, transparent 100%)',
          bloom2: 'radial-gradient(circle, rgba(244, 114, 182, 0.2) 0%, rgba(219, 39, 119, 0.05) 70%, transparent 100%)',
          horizon: 'bg-gradient-to-t from-purple-600/18 via-pink-600/10 to-transparent',
        };
    }
  };

  const colors = getAtmosphere();

  return (
    <div
      id="cinematic-2d-background"
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-1000"
    >
      {/* 1. Deep Sky Base Gradient */}
      <div className={`absolute inset-0 ${colors.sky} transition-all duration-1000`} />

      {/* 2. Soft Ambient Lighting Blobs (Cinematic bloom) */}
      <div
        className="absolute -top-[15%] -left-[10%] w-[75vw] h-[75vw] rounded-full blur-[130px] opacity-70 transition-all duration-1000"
        style={{ background: colors.bloom1 }}
      />
      <div
        className="absolute top-[35%] -right-[15%] w-[80vw] h-[80vw] rounded-full blur-[140px] opacity-60 transition-all duration-1000"
        style={{ background: colors.bloom2 }}
      />

      {/* 3. Horizon Ambient Glow */}
      <div className={`absolute bottom-0 left-0 right-0 h-[45vh] ${colors.horizon} transition-all duration-1000`} />

      {/* 4. Canvas Stars & Floating Embers */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />

      {/* 5. Celestial Moon or Sunset Sun */}
      <div className="absolute top-[8%] right-[10%] sm:right-[16%]">
        {activeScene === 'sunset-horizon' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2 }}
            className="relative"
          >
            <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-amber-300 via-pink-400 to-rose-300 blur-sm opacity-50 shadow-[0_0_50px_rgba(251,146,60,0.6)]" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-amber-100 to-pink-200 opacity-60" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 50 50"
              className="drop-shadow-[0_0_15px_rgba(233,213,255,0.7)] opacity-75"
            >
              <path
                d="M38 12C31 12 25 18 25 26C25 34 31 40 38 40C41 40 43.5 39 45.5 37.5C36 39.5 28 32 28 23C28 16 33 12.5 38 12Z"
                fill="#f5d0fe"
              />
              <circle cx="20" cy="20" r="1" fill="#fff" opacity="0.8" />
              <circle cx="15" cy="28" r="0.8" fill="#fff" opacity="0.6" />
            </svg>
          </motion.div>
        )}
      </div>

      {/* 6. Distant 2D Illustrated City Skyline with Twinkling Windows */}
      <div className="absolute bottom-0 left-0 right-0 h-[38vh] max-h-[320px] pointer-events-none opacity-40">
        <svg
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="skylineGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2e1045" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f051d" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="skylineGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#43145c" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#140624" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="bridgeGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#581c87" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#c084fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#581c87" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Far Layer City Silhouettes */}
          <path
            d="M0 400 L0 230 L50 230 L50 200 L90 200 L90 250 L140 250 L140 180 L180 180 L180 240 L230 240 L230 160 L270 160 L270 260 L330 260 L330 210 L390 210 L390 170 L430 170 L430 250 L500 250 L500 190 L560 190 L560 230 L620 230 L620 150 L660 150 L660 240 L720 240 L720 200 L790 200 L790 260 L850 260 L850 175 L900 175 L900 240 L960 240 L960 190 L1020 190 L1020 250 L1080 250 L1080 210 L1140 210 L1140 260 L1200 260 L1200 400 Z"
            fill="url(#skylineGrad2)"
          />

          {/* Mid Layer Detailed Buildings & Towers */}
          <path
            d="M0 400 L0 270 L70 270 L70 220 L120 220 L120 280 L200 280 L200 210 L220 180 L240 210 L240 280 L310 280 L310 230 L370 230 L370 290 L460 290 L460 200 L490 200 L490 290 L580 290 L580 240 L650 240 L650 300 L740 300 L740 210 L800 210 L800 290 L880 290 L880 230 L940 230 L940 290 L1040 290 L1040 215 L1110 215 L1110 280 L1200 280 L1200 400 Z"
            fill="url(#skylineGrad1)"
          />

          {/* Glowing City Windows */}
          <g fill="#fef08a" opacity="0.6">
            <rect x="25" y="240" width="3" height="4" rx="0.5" />
            <rect x="35" y="240" width="3" height="4" rx="0.5" />
            <rect x="25" y="250" width="3" height="4" rx="0.5" />
            <rect x="35" y="250" width="3" height="4" rx="0.5" />
            <rect x="80" y="230" width="4" height="5" rx="0.5" fill="#fbcfe8" />
            <rect x="95" y="230" width="4" height="5" rx="0.5" />
            <rect x="80" y="245" width="4" height="5" rx="0.5" />
            <rect x="95" y="245" width="4" height="5" rx="0.5" fill="#fbcfe8" />
            <circle cx="230" cy="178" r="2" fill="#fda4af" />
            <circle cx="640" cy="148" r="2" fill="#fda4af" />
            <rect x="325" y="245" width="3" height="4" rx="0.5" />
            <rect x="340" y="245" width="3" height="4" rx="0.5" />
            <rect x="355" y="245" width="3" height="4" rx="0.5" fill="#fbcfe8" />
            <rect x="755" y="225" width="4" height="4" rx="0.5" />
            <rect x="770" y="225" width="4" height="4" rx="0.5" fill="#fbcfe8" />
            <rect x="895" y="245" width="3" height="4" rx="0.5" fill="#fbcfe8" />
            <rect x="910" y="245" width="3" height="4" rx="0.5" />
          </g>

          {/* Distant Bridge cable glow */}
          <path
            d="M500 320 Q600 280 700 320"
            stroke="url(#bridgeGrad)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* 7. CINEMATIC 2D CARTOON CHARACTERS SCENE (Subtle 20-25% opacity layer) */}
      {/* Smooth camera floating motion: gently drifting sideways and breathing */}
      <motion.div
        animate={{
          x: [0, 6, 0, -6, 0],
          y: [0, -3, 0, 3, 0],
          scale: [1, 1.012, 1, 1.008, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-0 left-0 right-0 h-[48vh] max-h-[420px] flex items-end justify-center pointer-events-none opacity-[0.22] sm:opacity-[0.26]"
      >
        <svg
          viewBox="0 0 1000 450"
          className="w-full max-w-4xl h-full"
          preserveAspectRatio="xMidYMax meet"
        >
          <defs>
            {/* Ledge / Rooftop Gradient */}
            <linearGradient id="rooftopGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#250d3b" />
              <stop offset="25%" stopColor="#180727" />
              <stop offset="100%" stopColor="#0a0213" />
            </linearGradient>

            {/* Street pavement gradient for city-walk */}
            <linearGradient id="streetGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#200a35" />
              <stop offset="100%" stopColor="#0a0213" />
            </linearGradient>

            {/* Character Clothing / Skin Tones */}
            <linearGradient id="boyJacket" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#3730a3" />
            </linearGradient>
            <linearGradient id="girlSweater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#9d174d" />
            </linearGradient>
            <linearGradient id="cartoonHairBoy" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="cartoonHairGirl" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#581c87" />
              <stop offset="100%" stopColor="#3b0764" />
            </linearGradient>
            <linearGradient id="warmSkin" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#fbcfe8" />
            </linearGradient>
          </defs>

          {/* SCENE SPECIFIC FOREGROUND ELEMENTS */}

          {/* === SCENE 2: CITY WALK (Street lamps, pavement) === */}
          {activeScene === 'city-walk' && (
            <g id="scene-city-walk">
              {/* Street Pavement */}
              <path d="M0 450 L0 390 Q500 380 1000 390 L1000 450 Z" fill="url(#streetGrad)" />
              <path d="M0 390 Q500 380 1000 390" stroke="#a855f7" strokeWidth="2" strokeOpacity="0.3" fill="none" />
              {/* Street Lantern on Left */}
              <path d="M220 390 L220 180" stroke="#4c1d95" strokeWidth="6" strokeLinecap="round" />
              <path d="M210 180 Q220 165 240 170" stroke="#6d28d9" strokeWidth="4" fill="none" />
              <ellipse cx="240" cy="175" rx="10" ry="14" fill="#fef08a" opacity="0.8" filter="drop-shadow(0 0 12px #fde047)" />
              {/* Street Lantern on Right */}
              <path d="M780 390 L780 180" stroke="#4c1d95" strokeWidth="6" strokeLinecap="round" />
              <path d="M790 180 Q780 165 760 170" stroke="#6d28d9" strokeWidth="4" fill="none" />
              <ellipse cx="760" cy="175" rx="10" ry="14" fill="#f472b6" opacity="0.8" filter="drop-shadow(0 0 12px #f472b6)" />
            </g>
          )}

          {/* === SCENE 1, 3, 4, 5: ROOFTOP & BALCONY STRUCTURE === */}
          {activeScene !== 'city-walk' && (
            <g id="scene-rooftop-balcony">
              <path
                d="M100 450 L100 370 Q500 360 900 370 L900 450 Z"
                fill="url(#rooftopGrad)"
              />
              <path
                d="M100 370 Q500 360 900 370"
                stroke="#a855f7"
                strokeWidth="3"
                strokeOpacity="0.4"
                fill="none"
              />

              {/* Balcony Railings for Sunset (Scene 3 / Page 6) */}
              {activeScene === 'sunset-horizon' && (
                <g opacity="0.7">
                  <line x1="200" y1="330" x2="800" y2="330" stroke="#c084fc" strokeWidth="3" />
                  <line x1="200" y1="350" x2="800" y2="350" stroke="#7e22ce" strokeWidth="2" />
                  {Array.from({ length: 13 }).map((_, idx) => (
                    <line
                      key={idx}
                      x1={220 + idx * 48}
                      y1="330"
                      x2={220 + idx * 48}
                      y2="370"
                      stroke="#6b21a8"
                      strokeWidth="2"
                    />
                  ))}
                </g>
              )}

              {/* Fairy Lights string across rooftop in warm scene (Scene 4 / Page 4) */}
              {(activeScene === 'warm-lights' || activeScene === 'rooftop-night') && (
                <g>
                  <path
                    d="M160 350 Q300 380 440 355 Q600 385 760 350 Q840 375 920 355"
                    stroke="#6b21a8"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.6"
                  />
                  <circle cx="220" cy="368" r="4" fill="#fef08a" filter="drop-shadow(0 0 6px #fde047)" />
                  <circle cx="310" cy="374" r="4.5" fill="#f472b6" filter="drop-shadow(0 0 6px #f472b6)" />
                  <circle cx="400" cy="362" r="4" fill="#fef08a" filter="drop-shadow(0 0 6px #fde047)" />
                  <circle cx="580" cy="376" r="4.5" fill="#c084fc" filter="drop-shadow(0 0 6px #c084fc)" />
                  <circle cx="680" cy="368" r="4" fill="#fef08a" filter="drop-shadow(0 0 6px #fde047)" />
                  <circle cx="790" cy="358" r="4.5" fill="#f472b6" filter="drop-shadow(0 0 6px #f472b6)" />
                  <circle cx="870" cy="368" r="4" fill="#fef08a" filter="drop-shadow(0 0 6px #fde047)" />
                </g>
              )}
            </g>
          )}

          {/* TWO FICTIONAL 2D CARTOON CHARACTERS (BOY & GIRL) */}

          {/* === BOY CARTOON CHARACTER (Left side, ~x: 430) === */}
          <g id="bg-cartoon-boy" transform="translate(425, 240)">
            <motion.g
              animate={{
                y: [0, -2, 0],
                rotate: [0, 0.5, 0],
              }}
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Shadow on rooftop / ground */}
              <ellipse cx="40" cy="145" rx="35" ry="8" fill="#05010a" opacity="0.6" />

              {/* Legs sitting & dangling over edge */}
              <path
                d="M20 120 L25 155 Q28 165 38 165"
                stroke="#312e81"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M45 120 L50 152 Q53 162 63 162"
                stroke="#1e1b4b"
                strokeWidth="14"
                strokeLinecap="round"
                fill="none"
              />
              {/* Shoes */}
              <ellipse cx="40" cy="165" rx="8" ry="4" fill="#f3e8ff" />
              <ellipse cx="65" cy="162" rx="8" ry="4" fill="#e9d5ff" />

              {/* Torso / Casual Jacket */}
              <path
                d="M15 70 Q40 65 65 70 L60 130 Q38 135 18 130 Z"
                fill="url(#boyJacket)"
              />
              <path d="M30 70 Q40 76 50 70" stroke="#f3e8ff" strokeWidth="3" fill="none" />

              {/* Arm leaning back on roof */}
              <path
                d="M18 78 L-2 115 Q-5 130 10 132"
                stroke="url(#boyJacket)"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="10" cy="132" r="5" fill="url(#warmSkin)" />

              {/* Arm resting on knee */}
              <path
                d="M58 78 L65 110 L52 125"
                stroke="url(#boyJacket)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="52" cy="125" r="4.5" fill="url(#warmSkin)" />

              {/* Neck */}
              <rect x="34" y="58" width="12" height="14" rx="3" fill="url(#warmSkin)" />

              {/* Head / Face Profile (Looking up at sky / horizon) */}
              <g transform="rotate(-4, 40, 40)">
                <ellipse cx="40" cy="40" rx="20" ry="22" fill="url(#warmSkin)" />
                <path d="M56 40 Q60 42 55 46" stroke="#f472b6" strokeWidth="1.5" fill="none" />
                <ellipse cx="50" cy="36" rx="2" ry="2.5" fill="#1e1b4b" />
                <circle cx="51" cy="35" r="0.8" fill="#fff" />
                <path d="M48 48 Q54 50 56 46" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="23" cy="42" r="4" fill="url(#warmSkin)" />

                {/* Animated Hair strands swaying in breeze */}
                <motion.path
                  animate={{
                    d: [
                      "M18 42 Q15 15 42 16 Q62 17 62 34 Q55 24 40 25 Q28 26 22 42 Z",
                      "M18 42 Q13 13 42 15 Q64 16 63 32 Q56 22 40 24 Q28 25 22 42 Z",
                      "M18 42 Q15 15 42 16 Q62 17 62 34 Q55 24 40 25 Q28 26 22 42 Z",
                    ]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  fill="url(#cartoonHairBoy)"
                />
              </g>
            </motion.g>
          </g>

          {/* === GIRL CARTOON CHARACTER (Right side, ~x: 520) === */}
          <g id="bg-cartoon-girl" transform="translate(515, 238)">
            <motion.g
              animate={{
                y: [0, -2.5, 0],
                rotate: [0, -0.6, 0],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.6,
              }}
            >
              {/* Shadow */}
              <ellipse cx="38" cy="147" rx="34" ry="8" fill="#05010a" opacity="0.6" />

              {/* Legs curled / dangling */}
              <path
                d="M25 122 L30 156 Q33 166 43 166"
                stroke="#831843"
                strokeWidth="13"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M48 122 L53 154 Q56 164 66 164"
                stroke="#500724"
                strokeWidth="13"
                strokeLinecap="round"
                fill="none"
              />
              {/* Shoes */}
              <ellipse cx="45" cy="166" rx="7.5" ry="4" fill="#fdf2f8" />
              <ellipse cx="68" cy="164" rx="7.5" ry="4" fill="#fbcfe8" />

              {/* Torso / Cute Cozy Sweater */}
              <path
                d="M16 72 Q38 66 60 72 L56 132 Q36 136 18 132 Z"
                fill="url(#girlSweater)"
              />
              <path d="M28 72 Q38 78 48 72" stroke="#fbcfe8" strokeWidth="2.5" fill="none" />

              {/* Arm holding small cup or resting */}
              <path
                d="M20 80 L10 110 Q14 122 28 120"
                stroke="url(#girlSweater)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="28" cy="120" r="4.5" fill="url(#warmSkin)" />

              {/* Coffee cup with tiny steam */}
              <rect x="26" y="112" width="7" height="9" rx="2" fill="#fdf2f8" opacity="0.8" />
              <motion.path
                animate={{
                  d: [
                    "M29 110 Q28 104 30 98",
                    "M29 110 Q31 104 29 98",
                    "M29 110 Q28 104 30 98",
                  ],
                  opacity: [0.2, 0.7, 0.2],
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                stroke="#fdf2f8"
                strokeWidth="1"
                fill="none"
              />

              {/* Arm resting on ledge */}
              <path
                d="M55 80 L72 112 Q76 128 62 130"
                stroke="url(#girlSweater)"
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="62" cy="130" r="4.5" fill="url(#warmSkin)" />

              {/* Neck */}
              <rect x="32" y="60" width="11" height="13" rx="3" fill="url(#warmSkin)" />

              {/* Head / Face Profile (Looking peacefully toward the city) */}
              <g transform="rotate(3, 38, 40)">
                <ellipse cx="38" cy="40" rx="19" ry="21" fill="url(#warmSkin)" />
                <path d="M22 41 Q18 43 23 46" stroke="#f472b6" strokeWidth="1.5" fill="none" />
                <ellipse cx="28" cy="37" rx="2" ry="2.5" fill="#3b0764" />
                <circle cx="27.5" cy="36" r="0.8" fill="#fff" />
                <path d="M24 48 Q28 51 32 48" stroke="#db2777" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                <circle cx="49" cy="42" r="3.5" fill="url(#warmSkin)" />
                <circle cx="49" cy="45" r="1" fill="#fde047" />

                {/* Animated Hair (Stylish bob with breeze flow) */}
                <motion.path
                  animate={{
                    d: [
                      "M54 36 Q56 12 36 13 Q16 14 18 36 Q22 23 38 23 Q52 24 54 36 Z",
                      "M56 34 Q58 10 36 12 Q14 13 17 35 Q22 21 38 22 Q53 23 56 34 Z",
                      "M54 36 Q56 12 36 13 Q16 14 18 36 Q22 23 38 23 Q52 24 54 36 Z",
                    ]
                  }}
                  transition={{
                    duration: 3.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  fill="url(#cartoonHairGirl)"
                />

                {/* Back hair flowing softly in wind */}
                <motion.path
                  animate={{
                    d: [
                      "M50 25 Q58 40 56 60 Q52 64 48 58 Q48 40 45 28 Z",
                      "M50 25 Q62 38 60 58 Q55 62 50 56 Q49 39 45 28 Z",
                      "M50 25 Q58 40 56 60 Q52 64 48 58 Q48 40 45 28 Z",
                    ]
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 0.3,
                  }}
                  fill="url(#cartoonHairGirl)"
                />
              </g>
            </motion.g>
          </g>

          {/* Occasional Sparkle passing between them */}
          <motion.g
            animate={{
              x: [470, 500, 480],
              y: [280, 240, 210],
              opacity: [0, 0.85, 0],
              scale: [0.5, 1.2, 0.3],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              repeatDelay: 3.5,
              ease: 'easeInOut',
            }}
          >
            <path
              d="M0 -6 L1.5 -1.5 L6 0 L1.5 1.5 L0 6 L-1.5 1.5 L-6 0 L-1.5 -1.5 Z"
              fill="#fef08a"
              filter="drop-shadow(0 0 4px #fde047)"
            />
          </motion.g>

          {/* Surprise Open Sparkle Burst in Page 4 */}
          {surpriseOpen && (
            <g transform="translate(500, 250)">
              {Array.from({ length: 10 }).map((_, i) => {
                const angle = (i * Math.PI * 2) / 10;
                const dist = 50;
                return (
                  <motion.circle
                    key={i}
                    initial={{ cx: 0, cy: 0, opacity: 1, r: 3.5 }}
                    animate={{
                      cx: Math.cos(angle) * dist,
                      cy: Math.sin(angle) * dist,
                      opacity: 0,
                      r: 1,
                    }}
                    transition={{ duration: 1.4, ease: 'easeOut' }}
                    fill="#f472b6"
                  />
                );
              })}
            </g>
          )}
        </svg>
      </motion.div>

      {/* 8. Dark Translucent Readability Overlay (Targeting 15-25% background prominence with 100% crisp text readability) */}
      <div className="absolute inset-0 bg-[#080214]/65 backdrop-blur-[0.5px] pointer-events-none" />
      
      {/* Top and Bottom subtle depth vignettes */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#080214] via-[#080214]/60 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#080214] via-[#080214]/80 to-transparent pointer-events-none" />
    </div>
  );
};

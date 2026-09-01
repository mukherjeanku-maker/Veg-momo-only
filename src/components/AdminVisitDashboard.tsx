import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Eye,
  Clock,
  Navigation,
  MessageCircle,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Heart,
  Lock,
  Compass,
} from 'lucide-react';
import { VisitorRecord, subscribeToVisitors } from '../lib/visitTracker';
import { playSoftChime, playSparkle } from '../utils/sound';

interface AdminVisitDashboardProps {
  onCloseAdmin: () => void;
  onOpenWebsite: () => void;
}

// Formats timestamp warmly (e.g. "Today · 7:42 PM", "Yesterday · 3:15 PM", "Sep 1 · 4:20 PM")
function formatWarmTimestamp(timestamp: number): string {
  if (!timestamp) return '—';
  const date = new Date(timestamp);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (isToday) {
    return `Today · ${timeStr}`;
  }
  if (isYesterday) {
    return `Yesterday · ${timeStr}`;
  }

  const monthStr = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  return `${monthStr} · ${timeStr}`;
}

export const AdminVisitDashboard: React.FC<AdminVisitDashboardProps> = ({
  onCloseAdmin,
  onOpenWebsite,
}) => {
  const [visitors, setVisitors] = useState<VisitorRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [customInviteToken, setCustomInviteToken] = useState<string>('');
  const [hasSparkled, setHasSparkled] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('date_app_admin_pass_unlocked') === 'true';
  });
  const [passcodeInput, setPasscodeInput] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<boolean>(false);

  // Generate a random, non-guessable invitation token for the owner to share
  useEffect(() => {
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 8);
    setCustomInviteToken(`tulip_${randomHex}`);
  }, []);

  // Real-time Firestore subscription for visitor records
  useEffect(() => {
    const unsubscribe = subscribeToVisitors(
      (list) => {
        // Filter out records marked as pure admin testing if separate visitor exists, or show primary guest visitor
        const guestVisitors = list.filter((v) => !v.isOwnerAdmin);
        const activeList = guestVisitors.length > 0 ? guestVisitors : list;

        setVisitors((prev) => {
          // Trigger subtle sparkle animation if a new visit occurs while open
          if (prev.length > 0 && activeList.length > 0) {
            const latestOld = prev[0]?.lastActivityAt || 0;
            const latestNew = activeList[0]?.lastActivityAt || 0;
            if (latestNew > latestOld) {
              setHasSparkled(true);
              playSparkle();
              setTimeout(() => setHasSparkled(false), 3000);
            }
          }
          return activeList;
        });
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Most recent primary visitor
  const latestVisitor = useMemo(() => {
    if (visitors.length === 0) return null;
    return visitors[0];
  }, [visitors]);

  const hasVisits = visitors.length > 0 && latestVisitor !== null;

  // Handle Passcode Unlock
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple passcode or quick bypass for owner
    if (passcodeInput.trim() === 'sudipta2026' || passcodeInput.trim() === '1234' || passcodeInput.trim() === 'love' || passcodeInput.trim() === '') {
      setIsUnlocked(true);
      localStorage.setItem('date_app_admin_pass_unlocked', 'true');
      playSoftChime(659.25);
    } else {
      setPasscodeError(true);
      setTimeout(() => setPasscodeError(false), 2000);
    }
  };

  const copyInviteLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const shareableUrl = `${baseUrl}?token=${customInviteToken}`;
    navigator.clipboard.writeText(shareableUrl);
    setCopiedToken(shareableUrl);
    playSoftChime(523.25);
    setTimeout(() => setCopiedToken(null), 3000);
  };

  // Determine stage status
  const getStatusText = (v: VisitorRecord): { title: string; subtitle?: string; icon: string } => {
    if (v.sentMessage) {
      return {
        title: '💌 Sent a message!',
        subtitle: 'She sent a message in the private chat.',
        icon: '💌',
      };
    }
    if (v.openedChat) {
      return {
        title: '💬 Found the chatbox',
        subtitle: 'She opened the private chatbox at the end.',
        icon: '💬',
      };
    }
    if (v.reachedEnd || v.currentPage >= 7 || v.maxPageReached >= 7) {
      return {
        title: '✨ Reached the end',
        subtitle: 'She made it to the final proposal page. 👀',
        icon: '✨',
      };
    }
    const pageNum = v.currentPage || 1;
    const pageNames: Record<number, string> = {
      1: 'Scene 01 · Opened website',
      2: 'Scene 02 · Reading our story',
      3: 'Scene 03 · Instagram chat memory',
      4: 'Scene 04 · Little memories & sunset',
      5: 'Scene 05 · Café table moment',
      6: 'Scene 06 · Under the stars',
      7: 'Scene 07 · The question',
    };
    return {
      title: pageNames[pageNum] || `Scene 0${pageNum} / 07`,
      subtitle: `Currently viewing page 0${pageNum} of 07`,
      icon: '📖',
    };
  };

  if (!isUnlocked) {
    return (
      <div className="relative min-h-[100dvh] w-full flex items-center justify-center p-4 bg-[#07050e] text-slate-100 select-none">
        <div className="w-full max-w-sm glass-panel p-6 sm:p-8 rounded-3xl border border-pink-400/20 shadow-2xl text-center space-y-5">
          <div className="w-12 h-12 mx-auto rounded-full bg-pink-950/60 border border-pink-400/30 flex items-center justify-center text-pink-300">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-serif-elegant font-semibold text-white">
              Private Owner View 🌷
            </h3>
            <p className="text-xs text-purple-200/70">
              Enter your passcode or press unlock to view website activity.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-3 pt-1">
            <input
              type="password"
              placeholder="Passcode (default: 1234)"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-purple-950/50 border border-pink-400/30 text-white text-center placeholder:text-purple-300/40 text-sm focus:outline-none focus:border-pink-400"
            />
            {passcodeError && (
              <p className="text-xs text-rose-300 font-medium">Incorrect passcode. Try again.</p>
            )}
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium text-sm shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              Unlock Private Dashboard
            </button>
          </form>

          <button
            onClick={onOpenWebsite}
            className="text-xs text-purple-300/60 hover:text-purple-200 transition-colors pt-2 block mx-auto"
          >
            ← Back to Romantic Website
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 sm:p-6 bg-[#07050e] text-slate-100 select-none overflow-x-hidden">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 text-xs text-pink-300/80 font-medium">
          <ShieldCheck className="w-4 h-4 text-pink-400" />
          <span>Private Owner Dashboard</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[11px] text-emerald-300/90 font-medium px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Sync
          </span>
          <button
            onClick={onOpenWebsite}
            className="text-xs text-purple-200/70 hover:text-white px-2.5 py-1 rounded-full glass-pill border border-purple-400/20 hover:border-pink-400/40 transition-colors"
          >
            View Website →
          </button>
        </div>
      </div>

      {/* Main Single Large Glass Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md glass-panel p-6 sm:p-8 rounded-3xl border border-pink-400/25 shadow-[0_16px_50px_rgba(0,0,0,0.6)] space-y-6"
      >
        {/* Sparkle overlay for real-time live pulse */}
        <AnimatePresence>
          {hasSparkled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute -top-3 -right-3 z-30 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 text-xs font-bold shadow-lg flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current" />
              <span>Live Update!</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Card Title */}
        <div className="flex items-center justify-between border-b border-pink-400/15 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌷</span>
            <h2 className="text-lg font-serif-elegant font-semibold text-white tracking-wide">
              Website Activity
            </h2>
          </div>
          <span className="text-xs text-purple-300/60 font-mono">
            {loading ? 'connecting...' : `${visitors.length} session${visitors.length === 1 ? '' : 's'}`}
          </span>
        </div>

        {/* Dynamic Activity Content */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-purple-300/60">
            <RefreshCw className="w-6 h-6 animate-spin text-pink-400" />
            <p className="text-xs font-medium">Checking live activity...</p>
          </div>
        ) : !hasVisits ? (
          /* Zero Visits State: Waiting */
          <div className="py-8 space-y-5 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-purple-950/60 border border-purple-400/25 flex items-center justify-center text-2xl">
              ⏳
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-serif-elegant font-semibold text-white">
                Waiting for her to open it… ⏳
              </h3>
              <p className="text-xs text-purple-200/70 max-w-xs mx-auto leading-relaxed">
                No visits recorded yet. As soon as she opens the link, this card will update in real-time.
              </p>
            </div>

            {/* Share link helper */}
            <div className="pt-2">
              <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-400/20 text-left space-y-2">
                <div className="flex items-center justify-between text-[11px] text-purple-300">
                  <span className="font-semibold">Your Private Share Link:</span>
                  <span className="text-[10px] text-pink-300/80">Anonymous Token</span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={`${window.location.origin}${window.location.pathname}?token=${customInviteToken}`}
                    className="w-full text-xs font-mono bg-black/40 border border-purple-400/20 rounded-lg px-2.5 py-1.5 text-purple-200 truncate focus:outline-none"
                  />
                  <button
                    onClick={copyInviteLink}
                    className="shrink-0 p-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white transition-all active:scale-95"
                    title="Copy Link"
                  >
                    {copiedToken ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                {copiedToken && (
                  <p className="text-[11px] text-emerald-300 text-center font-medium">
                    ✓ Link copied to clipboard!
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Active Visits State */
          <div className="space-y-6">
            {/* Playful Headline Notification */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-pink-950/50 via-purple-950/40 to-pink-950/50 border border-pink-400/30 text-center space-y-1.5 shadow-inner"
            >
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-semibold tracking-wide">
                <span>🔔</span>
                <span>Someone opened the website. 👀</span>
              </div>
              <h3 className="text-2xl font-serif-elegant font-bold bg-gradient-to-r from-pink-200 via-rose-100 to-white bg-clip-text text-transparent">
                “She opened it. 🌷”
              </h3>
              <p className="text-xs text-purple-300/80 font-handwritten text-base italic pt-0.5">
                « “Okay… now don&apos;t panic. 😂” »
              </p>
            </motion.div>

            {/* Metrics List matching prompt layout */}
            <div className="grid grid-cols-2 gap-3">
              {/* Last Visit */}
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-400/15 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-purple-300/70 font-medium">
                  <Clock className="w-3 h-3 text-pink-400" />
                  <span>Last visit</span>
                </div>
                <p className="text-sm font-semibold text-white font-serif-elegant">
                  {formatWarmTimestamp(latestVisitor.lastVisitAt)}
                </p>
              </div>

              {/* Total Visits */}
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-400/15 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-purple-300/70 font-medium">
                  <Eye className="w-3 h-3 text-pink-400" />
                  <span>Visits</span>
                </div>
                <p className="text-sm font-semibold text-white font-serif-elegant">
                  {latestVisitor.visitCount}{' '}
                  <span className="text-xs font-normal text-purple-300/60 font-sans">
                    {latestVisitor.visitCount === 1 ? 'time' : 'times'}
                  </span>
                </p>
              </div>

              {/* Last Page Reached */}
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-400/15 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-purple-300/70 font-medium">
                  <Navigation className="w-3 h-3 text-pink-400" />
                  <span>Last page</span>
                </div>
                <p className="text-sm font-semibold text-white font-mono">
                  {String(latestVisitor.maxPageReached || latestVisitor.currentPage || 1).padStart(2, '0')} / 07
                </p>
              </div>

              {/* Status */}
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-400/15 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-purple-300/70 font-medium">
                  <Sparkles className="w-3 h-3 text-pink-400" />
                  <span>Status</span>
                </div>
                <p className="text-xs font-semibold text-pink-200 truncate" title={getStatusText(latestVisitor).title}>
                  {getStatusText(latestVisitor).title}
                </p>
              </div>
            </div>

            {/* Page Progress Indicator Visual */}
            <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-400/15 space-y-2">
              <div className="flex items-center justify-between text-xs text-purple-200">
                <span className="font-serif-elegant font-medium">Journey Progress</span>
                <span className="font-mono text-pink-300 text-[11px]">
                  {Math.round(((latestVisitor.maxPageReached || 1) / 7) * 100)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-purple-950 border border-purple-500/20 overflow-hidden flex">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 border-r border-black/40 transition-all duration-500 ${
                      i + 1 <= (latestVisitor.maxPageReached || 1)
                        ? 'bg-gradient-to-r from-pink-500 to-rose-400'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
              <p className="text-[11px] text-purple-300/70 font-light italic">
                {latestVisitor.sentMessage
                  ? '💌 She sent a message in the private chat.'
                  : latestVisitor.openedChat
                  ? '💬 She found and opened the chatbox.'
                  : latestVisitor.reachedEnd || latestVisitor.maxPageReached >= 7
                  ? '✨ She made it all the way to the final question scene.'
                  : `Currently at Scene 0${latestVisitor.currentPage || 1} of 07.`}
              </p>
            </div>

            {/* First visit detail */}
            <div className="text-[11px] text-purple-300/50 text-center flex items-center justify-center gap-1.5">
              <span>First opened:</span>
              <span className="text-purple-200/80 font-mono">
                {formatWarmTimestamp(latestVisitor.firstVisitAt)}
              </span>
            </div>

            {/* Playful Footer Note */}
            <div className="text-center pt-2 border-t border-pink-400/15">
              <p className="text-xs sm:text-sm text-purple-200/90 font-handwritten text-base">
                “Now… wait for that reply. 😂”
              </p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            onClick={copyInviteLink}
            className="flex-1 py-2.5 px-3 rounded-xl glass-pill border border-purple-400/25 hover:border-pink-400/40 text-xs text-purple-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
          >
            {copiedToken ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-pink-300" />
                <span>Copy Share Link</span>
              </>
            )}
          </button>
          <button
            onClick={onOpenWebsite}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Preview Website</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </motion.div>

      {/* Secret quick exit note */}
      <footer className="relative z-10 mt-4 text-center">
        <p className="text-[10px] text-purple-300/30">
          This dashboard is private to you and never shown to visitors.
        </p>
      </footer>
    </div>
  );
};

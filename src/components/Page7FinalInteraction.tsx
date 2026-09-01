import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, RotateCcw, Send, Smile, MessageCircle } from 'lucide-react';
import { MeAvatar, SudiptaAvatar } from './CartoonAvatars';
import { FlowerIllustration } from './FlowerIllustration';
import { StickyNote, DoodleHeart } from './Doodles';
import { playSparkle, playSoftChime, playBubbleTap } from '../utils/sound';
import {
  db,
  ensureAuthUser,
  getLocalUserId,
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  ChatMessage,
  handleFirestoreError,
  OperationType,
} from '../lib/firebase';
import { trackMilestone } from '../lib/visitTracker';

interface Page7FinalInteractionProps {
  onRestart: () => void;
  onSceneChange?: (scene: 'rooftop-night' | 'proposal-warm' | 'proposal-dark') => void;
}

const QUICK_EMOJIS = ['😌', '😂', '👀', '❤️', '🌷', '✨', '☕', '😏'];

export const Page7FinalInteraction: React.FC<Page7FinalInteractionProps> = ({
  onRestart,
  onSceneChange,
}) => {
  // Step sequence:
  // 0: Dark intimate stage with 2 characters and soft lights
  // 1: "So… I have one question."
  // 2: "Would you let me take you on a real date sometime? 👀" + Two Response Buttons
  const [step, setStep] = useState<number>(0);
  const [proposalAnswer, setProposalAnswer] = useState<'yes' | 'maybe' | null>(null);
  const [showBonusChatIntro, setShowBonusChatIntro] = useState<boolean>(false);
  const [showTinyPhone, setShowTinyPhone] = useState<boolean>(false);

  // Mini Chat State connected to real Firestore
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<'sudipta' | 'me'>('sudipta');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showQuickEmojiTray, setShowQuickEmojiTray] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Notify parent background to darken for proposal
  useEffect(() => {
    onSceneChange?.('proposal-dark');
  }, [onSceneChange]);

  // Initial sequence
  useEffect(() => {
    const timers = [
      setTimeout(() => {
        setStep(1);
        playSoftChime(440);
      }, 700),
      setTimeout(() => {
        setStep(2);
        playSoftChime(523.25);
      }, 2600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Initialize Firestore Auth
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await ensureAuthUser();
        setCurrentUserId(user.uid);
      } catch {
        setCurrentUserId(getLocalUserId());
      }
    };
    initAuth();
  }, []);

  // Real-time Firestore message subscription
  useEffect(() => {
    const activeUserId = currentUserId || getLocalUserId();
    if (!activeUserId) return;

    const messagesCol = collection(db, 'conversations', 'private_chat', 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        if (snapshot.empty) {
          // Seed the starter message if empty
          const now = Date.now();
          try {
            await addDoc(messagesCol, {
              senderId: 'author_me',
              senderName: 'Me',
              senderRole: 'me',
              text: 'Okay, your turn now. 👀',
              createdAt: now,
              reactions: {},
              status: 'sent',
            });
          } catch (e) {
            handleFirestoreError(e, OperationType.CREATE, 'conversations/private_chat/messages');
          }
          return;
        }

        const loaded: ChatMessage[] = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            senderId: data.senderId || 'unknown',
            senderName: data.senderName || 'Anonymous',
            senderRole: data.senderRole || (data.senderName === 'Me' ? 'me' : 'sudipta'),
            text: data.text || '',
            createdAt: data.createdAt || Date.now(),
            reactions: data.reactions || {},
            status: 'sent',
          };
        });

        setMessages(loaded);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'conversations/private_chat/messages');
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  // Handle Response to Proposal
  const handleAnswerYes = () => {
    setProposalAnswer('yes');
    playSparkle();
    onSceneChange?.('proposal-warm');

    // Confetti celebration
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f472b6', '#ec4899', '#fbcfe8', '#fbbf24', '#c084fc'],
    });

    // Reveal bonus tiny chatbox after reading response
    setTimeout(() => {
      setShowBonusChatIntro(true);
      playSoftChime(587.33);
    }, 3800);

    setTimeout(() => {
      setShowTinyPhone(true);
      playSparkle();
      trackMilestone('opened_chat');
    }, 6200);
  };

  const handleAnswerMaybe = () => {
    setProposalAnswer('maybe');
    playSoftChime(493.88);

    // Reveal bonus tiny chatbox
    setTimeout(() => {
      setShowBonusChatIntro(true);
      playSoftChime(587.33);
    }, 3800);

    setTimeout(() => {
      setShowTinyPhone(true);
      playSparkle();
      trackMilestone('opened_chat');
    }, 6200);
  };

  // Send message to Firestore
  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || isSending) return;

    const senderId = currentUserId || getLocalUserId();
    const newMsg: ChatMessage = {
      id: 'temp_' + Date.now(),
      senderId,
      senderName: userRole === 'sudipta' ? 'Sudipta' : 'Me',
      senderRole: userRole,
      text: cleanText,
      createdAt: Date.now(),
      reactions: {},
      status: 'sending',
    };

    setIsSending(true);
    playBubbleTap();
    setInputText('');

    try {
      const messagesCol = collection(db, 'conversations', 'private_chat', 'messages');
      await addDoc(messagesCol, {
        senderId: newMsg.senderId,
        senderName: newMsg.senderName,
        senderRole: newMsg.senderRole,
        text: newMsg.text,
        createdAt: newMsg.createdAt,
        reactions: {},
        status: 'sent',
      });

      playSoftChime(659.25);
      trackMilestone('sent_message');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'conversations/private_chat/messages');
      // If offline/error, keep local copy visible
      setMessages((prev) => [...prev, { ...newMsg, status: 'sent' }]);
    } finally {
      setIsSending(false);
    }
  };

  // Add emoji reaction
  const handleReactToMessage = async (messageId: string, emoji: string) => {
    playBubbleTap();
    const activeUserId = currentUserId || getLocalUserId();
    try {
      const msgRef = doc(db, 'conversations', 'private_chat', 'messages', messageId);
      const targetMsg = messages.find((m) => m.id === messageId);
      if (!targetMsg) return;

      const curReactions = targetMsg.reactions || {};
      const existingUserIds: string[] = Array.isArray(curReactions[emoji]) ? curReactions[emoji] : [];

      let updatedUserIds: string[];
      if (existingUserIds.includes(activeUserId)) {
        updatedUserIds = existingUserIds.filter((id) => id !== activeUserId);
      } else {
        updatedUserIds = [...existingUserIds, activeUserId];
      }

      const newReactions = { ...curReactions };
      if (updatedUserIds.length > 0) {
        newReactions[emoji] = updatedUserIds;
      } else {
        delete newReactions[emoji];
      }

      // Optimistic local update
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reactions: newReactions } : m))
      );

      await updateDoc(msgRef, { reactions: newReactions });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `conversations/private_chat/messages/${messageId}`);
    }
  };

  return (
    <div
      id="page7-proposal-stage"
      className="relative flex flex-col items-center justify-center min-h-[85dvh] max-w-lg mx-auto text-center px-4 sm:px-6 py-6 select-none"
    >
      {/* 1. Cartoon Duo in Darker Intimate Glow with Flower */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="relative flex flex-col items-center mb-4"
      >
        {/* Soft intimate fairy glow */}
        <div className="absolute -bottom-2 w-52 h-10 bg-pink-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="relative flex items-end justify-center gap-4 sm:gap-6">
          {/* Me */}
          <MeAvatar
            size={74}
            expression={
              proposalAnswer === 'yes'
                ? 'celebrating'
                : proposalAnswer === 'maybe'
                ? 'curious'
                : 'hopeful'
            }
            animateVariant={
              proposalAnswer === 'yes'
                ? 'celebrating'
                : proposalAnswer === 'maybe'
                ? 'thinking'
                : 'shy'
            }
            showGlow
            emojiReaction={
              proposalAnswer === 'yes'
                ? '🌷'
                : proposalAnswer === 'maybe'
                ? '🤔'
                : '👀'
            }
            interactive
          />

          {/* Sudipta */}
          <SudiptaAvatar
            size={74}
            expression={
              proposalAnswer === 'yes'
                ? 'celebrating'
                : proposalAnswer === 'maybe'
                ? 'smirking'
                : 'playful'
            }
            animateVariant={
              proposalAnswer === 'yes'
                ? 'celebrating'
                : proposalAnswer === 'maybe'
                ? 'idle'
                : 'idle'
            }
            showGlow
            emojiReaction={
              proposalAnswer === 'yes'
                ? '❤️'
                : proposalAnswer === 'maybe'
                ? '😏'
                : '✨'
            }
            interactive
          />
        </div>
      </motion.div>

      {/* 2. THE LITTLE QUESTION CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full relative max-w-md space-y-3.5 min-h-[220px] flex flex-col justify-center glass-panel p-5 sm:p-7 rounded-3xl border border-pink-400/30 shadow-[0_12px_45px_rgba(0,0,0,0.55)] mb-4"
      >
        {/* Sticky note */}
        <div className="absolute -top-3 -right-2 z-30 hidden sm:block">
          <StickyNote
            text="I spent way too long coding this 😂"
            rotation={2.5}
            color="yellow"
            delay={0.2}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-pink-300 font-semibold font-handwritten text-sm">
            <span>🌷</span>
            <span>The Little Question</span>
            <span>✨</span>
          </div>
          {step >= 1 && (
            <motion.h2
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl font-serif-elegant font-medium text-white"
            >
              So… <span className="text-pink-200">I have one question.</span>
            </motion.h2>
          )}
        </div>

        {/* The Proposal Itself */}
        {step >= 2 && !proposalAnswer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="space-y-4 pt-1"
          >
            <p className="text-lg sm:text-xl font-serif-elegant font-semibold text-white leading-relaxed">
              Would you let me take you on a real date sometime?{' '}
              <span className="inline-block text-pink-300">👀</span>
            </p>

            {/* Response Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              {/* Option A: Yes */}
              <motion.button
                id="proposal-btn-yes"
                onClick={handleAnswerYes}
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(244,114,182,0.6)' }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-full font-serif-elegant font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 hover:from-pink-500 hover:to-rose-500 border border-pink-300/50 shadow-[0_4px_25px_rgba(236,72,153,0.4)] cursor-pointer"
              >
                <span>Yes 😌❤️</span>
              </motion.button>

              {/* Option B: Maybe */}
              <motion.button
                id="proposal-btn-maybe"
                onClick={handleAnswerMaybe}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-full font-serif-elegant font-medium text-sm sm:text-base text-purple-200 glass-pill border border-purple-400/30 hover:border-pink-400/50 hover:text-white cursor-pointer"
              >
                <span>Hmm… maybe 👀</span>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Response Outcome: YES */}
        {proposalAnswer === 'yes' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-3 pt-2"
          >
            {/* Flower from opening reappears */}
            <div className="flex items-center justify-center py-1">
              <FlowerIllustration size={75} breeze glow />
            </div>

            <div className="space-y-1">
              <p className="text-base sm:text-lg font-serif-elegant font-medium text-white">
                Okay… That made me smile.{' '}
                <span className="inline-block text-xl">😌</span>
              </p>
              <p className="text-lg sm:text-xl font-serif-elegant font-semibold text-pink-300">
                It&apos;s a date. 🌷❤️
              </p>
              <p className="text-xs sm:text-sm text-purple-200/80 font-light pt-1">
                I&apos;ll try to make it worth remembering.
              </p>
            </div>
          </motion.div>
        )}

        {/* Response Outcome: HMM… MAYBE */}
        {proposalAnswer === 'maybe' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2 pt-2"
          >
            <p className="text-base sm:text-lg font-serif-elegant font-medium text-white">
              Hmm… 🤔
            </p>
            <p className="text-sm sm:text-base text-purple-200/90 leading-relaxed font-light">
              I&apos;ll consider that a very mysterious yes-not-yet. 😂
            </p>
            <div className="pt-2 text-xs sm:text-sm font-serif-elegant text-pink-200 space-y-1 border-t border-purple-400/20">
              <p>No pressure.</p>
              <p className="font-semibold text-white">
                I&apos;ll just keep being charming until you decide. 😌
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* 3. FINAL LITTLE CHATBOX BONUS (Revealed after answering) */}
      <AnimatePresence>
        {showBonusChatIntro && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-md space-y-4 mb-6"
          >
            <div className="text-center space-y-1">
              <p className="text-xs text-pink-300 font-light italic font-handwritten text-sm">
                Actually…
              </p>
              <p className="text-sm sm:text-base font-serif-elegant font-medium text-purple-100">
                Since apparently we&apos;re already having a conversation…
              </p>
            </div>

            {/* Cartoon Phone Container */}
            {showTinyPhone && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="w-full bg-[#120822]/90 backdrop-blur-xl border border-purple-400/30 rounded-3xl p-4 sm:p-5 shadow-[0_12px_45px_rgba(0,0,0,0.6)] text-left"
              >
                {/* Phone Header */}
                <div className="flex items-center justify-between border-b border-purple-400/20 pb-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-sm shadow-md">
                      💬
                    </div>
                    <div>
                      <h4 className="text-sm font-serif-elegant font-semibold text-white">
                        Our tiny chat 💬
                      </h4>
                      <p className="text-[10px] text-purple-300/70 font-handwritten text-xs">
                        Because normal DMs weren&apos;t complicated enough. 😂
                      </p>
                    </div>
                  </div>

                  {/* Switch user role indicator */}
                  <button
                    onClick={() => {
                      playBubbleTap();
                      setUserRole((prev) => (prev === 'sudipta' ? 'me' : 'sudipta'));
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-full glass-pill border border-pink-400/30 text-pink-200 hover:text-white cursor-pointer font-handwritten text-xs"
                    title="Click to toggle speaking as Sudipta or Me"
                  >
                    As: {userRole === 'sudipta' ? 'Sudipta 🌸' : 'Me 🌙'}
                  </button>
                </div>

                {/* Message Stream */}
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 mb-3">
                  {messages.map((msg) => {
                    const isMe = msg.senderRole === 'me';
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}
                      >
                        <div
                          className={`max-w-[85%] px-3.5 py-2 rounded-2xl text-xs sm:text-sm shadow-sm ${
                            isMe
                              ? 'bg-purple-900/60 text-purple-100 border border-purple-400/30 rounded-tl-sm'
                              : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white border border-pink-300/40 rounded-tr-sm'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 text-[10px] opacity-70 mb-0.5">
                            <span className="font-semibold font-handwritten">{msg.senderName}</span>
                          </div>
                          <p className="break-words leading-relaxed">{msg.text}</p>
                        </div>

                        {/* Message Reactions */}
                        <div className="flex items-center gap-1 mt-1 px-1">
                          {Object.entries(msg.reactions || {}).map(([emoji, uids]) => {
                            const uidList = Array.isArray(uids) ? uids : [];
                            return (
                              <button
                                key={emoji}
                                onClick={() => handleReactToMessage(msg.id, emoji)}
                                className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                                  uidList.includes(currentUserId)
                                    ? 'bg-pink-500/30 border-pink-300 text-white'
                                    : 'bg-purple-950/40 border-purple-400/20 text-purple-200'
                                }`}
                              >
                                {emoji} {uidList.length > 1 && uidList.length}
                              </button>
                            );
                          })}

                          {/* Quick react button */}
                          <button
                            onClick={() => handleReactToMessage(msg.id, '❤️')}
                            className="text-[10px] text-purple-300/40 hover:text-pink-300 transition-colors"
                          >
                            +❤️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Emoji Bar */}
                {showQuickEmojiTray && (
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 mb-2">
                    {QUICK_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          setInputText((prev) => prev + emoji);
                          playBubbleTap();
                        }}
                        className="text-base p-1 hover:scale-125 transition-transform cursor-pointer"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input & Send Form */}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playBubbleTap();
                      setShowQuickEmojiTray((prev) => !prev);
                    }}
                    className="p-2 rounded-full glass-pill border border-purple-400/20 text-purple-300 hover:text-white cursor-pointer"
                    title="Insert emoji"
                  >
                    <Smile className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Say something…"
                    className="flex-1 px-3.5 py-2 rounded-full bg-purple-950/50 border border-purple-400/30 text-white text-xs sm:text-sm placeholder-purple-300/40 focus:outline-none focus:border-pink-400"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="p-2 rounded-full bg-pink-600 hover:bg-pink-500 disabled:opacity-40 text-white shadow-md cursor-pointer transition-all"
                    title="Send"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. FINAL SIGN-OFF & REPLAY BUTTON */}
      <AnimatePresence>
        {proposalAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full max-w-md pt-4 space-y-3 border-t border-purple-400/20"
          >
            <div className="space-y-1">
              <p className="text-base sm:text-lg font-serif-elegant font-semibold text-white">
                See you soon, Sudipta.{' '}
                <span className="inline-block text-pink-300">🌷</span>
              </p>
              <p className="text-xs text-purple-200/80 font-handwritten text-sm">
                And please don&apos;t make me wait forever for that reply. 😂
              </p>
            </div>

            {/* Replay Button */}
            <div className="pt-1">
              <motion.button
                id="proposal-replay-date-btn"
                onClick={onRestart}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-serif-elegant text-xs sm:text-sm text-purple-200 glass-pill border border-purple-400/25 hover:border-pink-400/40 hover:text-white cursor-pointer transition-all font-handwritten text-sm"
              >
                <RotateCcw className="w-3.5 h-3.5 text-pink-300" />
                <span>Start our little date again ↻</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

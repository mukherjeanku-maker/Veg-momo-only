import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Smile, MoreVertical, Trash2, RotateCcw, Check, Sparkles, AlertCircle, Shield, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  db,
  ensureAuthUser,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  ChatMessage,
} from '../lib/firebase';
import { MeAvatar, SudiptaAvatar } from './CartoonAvatars';
import { playBubbleTap, playSparkle, playSoftChime } from '../utils/sound';

const QUICK_REACTION_EMOJIS = ['❤️', '😂', '👀', '😌', '🤣', '✨'];
const TRAY_EMOJIS = ['😌', '😂', '👀', '❤️', '✨', '🫣', '☕', '🌸', '💬', '🙌', '🤔', '🌙'];

interface PrivateChatProps {
  onBackToProposal?: () => void;
  onRestartWebsite?: () => void;
}

export const PrivateChat: React.FC<PrivateChatProps> = ({
  onBackToProposal,
  onRestartWebsite,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<'sudipta' | 'me'>('sudipta');
  const [userName, setUserName] = useState<string>('Sudipta');
  const [hasEnteredChat, setHasEnteredChat] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'error'>('connecting');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [activeReactionMessageId, setActiveReactionMessageId] = useState<string | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);
  const [messageToDelete, setMessageToDelete] = useState<ChatMessage | null>(null);
  const [showSpecialCelebration, setShowSpecialCelebration] = useState<boolean>(false);
  const [hasSudiptaRepliedEver, setHasSudiptaRepliedEver] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Initialize Auth and load existing user preferences from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('just_us_user_name');
    const savedRole = localStorage.getItem('just_us_user_role') as 'sudipta' | 'me' | null;
    const hasJoined = localStorage.getItem('just_us_has_joined') === 'true';

    if (savedName) setUserName(savedName);
    if (savedRole) setUserRole(savedRole);
    if (hasJoined) setHasEnteredChat(true);

    const initAuth = async () => {
      try {
        const user = await ensureAuthUser();
        setCurrentUserId(user.uid);
        setConnectionStatus('connected');
      } catch (err) {
        console.error('Firebase Auth error:', err);
        setConnectionStatus('error');
      }
    };

    initAuth();
  }, []);

  // Firestore Realtime Subscription & Initial Seeding
  useEffect(() => {
    if (!currentUserId) return;

    const messagesCol = collection(db, 'conversations', 'private_chat', 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'asc'));

    // Check conversation metadata for first-reply celebration
    const metaDocRef = doc(db, 'conversations', 'private_chat');
    getDoc(metaDocRef).then((metaSnap) => {
      if (metaSnap.exists()) {
        setHasSudiptaRepliedEver(!!metaSnap.data()?.firstMessageBySudiptaSent);
      }
    });

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        setConnectionStatus('connected');
        setIsLoading(false);

        if (snapshot.empty) {
          // Seed the initial messages from "Me"
          const now = Date.now();
          try {
            await addDoc(messagesCol, {
              senderId: 'author_me',
              senderName: 'Me',
              senderRole: 'me',
              text: 'Okay… website part is officially over. 😂',
              createdAt: now - 60000,
              reactions: {},
              status: 'sent',
            });
            await addDoc(messagesCol, {
              senderId: 'author_me',
              senderName: 'Me',
              senderRole: 'me',
              text: 'Now you can actually say something.',
              createdAt: now,
              reactions: {},
              status: 'sent',
            });
            await setDoc(metaDocRef, {
              initialized: true,
              lastActivity: now,
              firstMessageBySudiptaSent: false,
            }, { merge: true });
          } catch (seedErr) {
            console.error('Error seeding initial starter messages:', seedErr);
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
            status: data.status || 'sent',
          };
        });

        setMessages(loaded);

        // Check if any message from sudipta exists
        const hasSudiptaMsg = loaded.some((m) => m.senderRole === 'sudipta');
        if (hasSudiptaMsg) {
          setHasSudiptaRepliedEver(true);
        }
      },
      (error) => {
        console.error('Firestore messages listener error:', error);
        setConnectionStatus('error');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUserId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showSpecialCelebration]);

  // Handle Nickname Modal Submission
  const handleJoinChat = () => {
    playSparkle();
    const finalName = userName.trim() || (userRole === 'sudipta' ? 'Sudipta' : 'Me');
    setUserName(finalName);
    setHasEnteredChat(true);
    localStorage.setItem('just_us_user_name', finalName);
    localStorage.setItem('just_us_user_role', userRole);
    localStorage.setItem('just_us_has_joined', 'true');
  };

  // Send Message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || !currentUserId) return;

    playBubbleTap();
    setInputText('');
    setShowEmojiPicker(false);

    // Optimistic local UI insert
    const tempId = 'temp_' + Date.now();
    const newMsg: ChatMessage = {
      id: tempId,
      senderId: currentUserId,
      senderName: userName,
      senderRole: userRole,
      text: cleanText,
      createdAt: Date.now(),
      reactions: {},
      status: 'sending',
    };

    setMessages((prev) => [...prev, newMsg]);

    // Check if this is Sudipta's first message ever
    const isFirstSudiptaMessage = userRole === 'sudipta' && !hasSudiptaRepliedEver;

    try {
      const messagesCol = collection(db, 'conversations', 'private_chat', 'messages');
      await addDoc(messagesCol, {
        senderId: currentUserId,
        senderName: userName,
        senderRole: userRole,
        text: cleanText,
        createdAt: Date.now(),
        reactions: {},
        status: 'sent',
      });

      // Update meta doc
      const metaDocRef = doc(db, 'conversations', 'private_chat');
      await setDoc(metaDocRef, {
        lastActivity: Date.now(),
        ...(isFirstSudiptaMessage ? { firstMessageBySudiptaSent: true } : {}),
      }, { merge: true });

      if (isFirstSudiptaMessage) {
        setHasSudiptaRepliedEver(true);
        setShowSpecialCelebration(true);
        playSparkle();
        try {
          confetti({
            particleCount: 45,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#f472b6', '#c084fc', '#fbcfe8', '#fef08a'],
          });
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' } : m))
      );
    }
  };

  // Toggle Reaction on Message
  const handleToggleReaction = async (messageId: string, emoji: string) => {
    playBubbleTap();
    setActiveReactionMessageId(null);
    const targetMsg = messages.find((m) => m.id === messageId);
    if (!targetMsg || !currentUserId) return;

    const currentReactions = { ...(targetMsg.reactions || {}) };
    const userList = currentReactions[emoji] || [];
    const hasReacted = userList.includes(currentUserId);

    let updatedUsers: string[];
    if (hasReacted) {
      updatedUsers = userList.filter((uid) => uid !== currentUserId);
    } else {
      updatedUsers = [...userList, currentUserId];
    }

    if (updatedUsers.length === 0) {
      delete currentReactions[emoji];
    } else {
      currentReactions[emoji] = updatedUsers;
    }

    try {
      const msgRef = doc(db, 'conversations', 'private_chat', 'messages', messageId);
      await updateDoc(msgRef, {
        reactions: currentReactions,
      });
    } catch (err) {
      console.error('Error updating reaction:', err);
    }
  };

  // Delete message with confirmation
  const handleConfirmDelete = async () => {
    if (!messageToDelete) return;
    try {
      const msgRef = doc(db, 'conversations', 'private_chat', 'messages', messageToDelete.id);
      await deleteDoc(msgRef);
      setMessageToDelete(null);
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  // Format time timestamp nicely
  const formatTime = (epoch: number) => {
    const d = new Date(epoch);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      id="private-chatbox-wrapper"
      className="relative flex flex-col items-center justify-between min-h-[92dvh] w-full max-w-xl mx-auto px-3 sm:px-4 py-4 select-none z-10"
    >
      {/* 1. TOP HEADER BAR */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full glass-panel border border-pink-400/25 rounded-2xl p-3 sm:p-4 mb-3 flex items-center justify-between shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          {/* Avatar Duo in Header */}
          <div className="flex items-center -space-x-3">
            <div className="relative z-10">
              <MeAvatar size={34} expression="hopeful" animateVariant="idle" />
            </div>
            <div className="relative z-20">
              <SudiptaAvatar size={34} expression="playful" animateVariant="idle" />
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base sm:text-lg font-serif-elegant font-semibold text-white tracking-wide">
                Just Us. 💬
              </h2>
              <span
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected'
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                    : connectionStatus === 'connecting'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-rose-400'
                }`}
                title={connectionStatus}
              />
            </div>
            <p className="text-[11px] sm:text-xs text-purple-200/70 truncate max-w-[210px] sm:max-w-xs font-light">
              A tiny corner of the internet for random conversations.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="relative">
          <button
            id="chat-settings-menu-btn"
            onClick={() => setShowSettingsMenu(!showSettingsMenu)}
            className="p-2 rounded-full glass-pill border border-purple-400/20 text-purple-200 hover:text-white hover:border-pink-400/40 transition-colors cursor-pointer"
            aria-label="Settings"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Settings Dropdown */}
          <AnimatePresence>
            {showSettingsMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -5 }}
                className="absolute right-0 mt-2 w-48 rounded-2xl glass-panel border border-purple-400/30 p-2 shadow-2xl z-50 text-left space-y-1 bg-[#150624]/90 backdrop-blur-xl"
              >
                <button
                  onClick={() => {
                    setShowSettingsMenu(false);
                    setHasEnteredChat(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-purple-200 hover:text-pink-200 hover:bg-purple-800/30 rounded-xl transition-colors cursor-pointer"
                >
                  Change Nickname / Role
                </button>
                <button
                  onClick={() => {
                    setInputText('');
                    setShowSettingsMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs text-purple-200 hover:text-pink-200 hover:bg-purple-800/30 rounded-xl transition-colors cursor-pointer"
                >
                  Clear Draft
                </button>
                {onBackToProposal && (
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      onBackToProposal();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-purple-200 hover:text-pink-200 hover:bg-purple-800/30 rounded-xl transition-colors cursor-pointer"
                  >
                    Back to Proposal
                  </button>
                )}
                {onRestartWebsite && (
                  <button
                    onClick={() => {
                      setShowSettingsMenu(false);
                      onRestartWebsite();
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restart Journey</span>
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 2. CONNECTION INTERRUPTED NOTIFICATION (Auto-reconnecting) */}
      {connectionStatus === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full py-1.5 px-3 mb-2 rounded-xl bg-amber-950/40 border border-amber-400/30 flex items-center justify-center gap-2 text-xs text-amber-200"
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-300" />
          <span>Connection interrupted. Trying again…</span>
        </motion.div>
      )}

      {/* 3. MESSAGES CONVERSATION SCROLL AREA */}
      <div
        id="chat-messages-container"
        className="w-full flex-1 overflow-y-auto px-2 py-3 space-y-3.5 scroll-smooth min-h-[50vh] max-h-[62vh] rounded-2xl glass-panel border border-purple-400/15 shadow-inner"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-48 space-y-2 text-purple-300/70">
            <Sparkles className="w-6 h-6 animate-spin text-pink-400/80" />
            <p className="text-xs">Opening our little corner…</p>
          </div>
        ) : messages.length === 0 ? (
          /* Empty state illustration */
          <div className="flex flex-col items-center justify-center h-52 text-center p-4 space-y-3">
            <div className="flex items-center gap-6 opacity-80">
              <MeAvatar size={44} expression="curious" animateVariant="idle" />
              <div className="text-pink-300/40 font-mono text-xs">· · ·</div>
              <SudiptaAvatar size={44} expression="mysterious" animateVariant="idle" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-purple-200">It&apos;s quiet here.</p>
              <p className="text-xs text-purple-300/60">
                Someone should probably say something. 👀
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isMeSender = (userRole === 'me' && msg.senderRole === 'me') || (userRole === 'sudipta' && msg.senderRole === 'sudipta');
            const isMeCharacter = msg.senderRole === 'me';

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`relative flex items-end gap-2 group ${
                  isMeSender ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Other user's avatar */}
                {!isMeSender && (
                  <div className="flex-shrink-0 mb-1">
                    {isMeCharacter ? (
                      <MeAvatar size={30} expression="neutral" />
                    ) : (
                      <SudiptaAvatar size={30} expression="playful" />
                    )}
                  </div>
                )}

                <div className="relative max-w-[78%] sm:max-w-[72%]">
                  {/* Sender Name label */}
                  <div
                    className={`text-[10px] text-purple-300/60 mb-0.5 px-1 font-medium ${
                      isMeSender ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.senderName}
                  </div>

                  {/* Message Bubble */}
                  <div
                    onClick={() => {
                      setActiveReactionMessageId(
                        activeReactionMessageId === msg.id ? null : msg.id
                      );
                    }}
                    className={`relative p-3 rounded-2xl text-xs sm:text-sm text-left leading-relaxed transition-all cursor-pointer ${
                      isMeSender
                        ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 text-white shadow-[0_4px_16px_rgba(219,39,119,0.25)] rounded-br-xs'
                        : 'glass-panel border border-purple-300/20 text-purple-100 bg-[#1e0a2e]/70 shadow-[0_4px_16px_rgba(0,0,0,0.3)] rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                    {/* Timestamp & Send Status */}
                    <div
                      className={`flex items-center gap-1 text-[9px] mt-1.5 opacity-70 ${
                        isMeSender ? 'justify-end text-pink-100' : 'justify-start text-purple-300'
                      }`}
                    >
                      <span>{formatTime(msg.createdAt)}</span>
                      {isMeSender && (
                        <span>
                          {msg.status === 'sending' ? (
                            '⋯'
                          ) : msg.status === 'failed' ? (
                            '⚠️'
                          ) : (
                            <Check className="w-2.5 h-2.5 inline" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Emoji Reactions Pill Bar */}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div
                      className={`flex flex-wrap gap-1 mt-1 ${
                        isMeSender ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {Object.entries(msg.reactions).map(([emoji, uids]) => {
                        const uidList = Array.isArray(uids) ? uids : [];
                        const hasReacted = uidList.includes(currentUserId);
                        return (
                          <button
                            key={emoji}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleReaction(msg.id, emoji);
                            }}
                            className={`text-[10px] px-1.5 py-0.5 rounded-full glass-pill border transition-transform hover:scale-110 cursor-pointer ${
                              hasReacted
                                ? 'border-pink-400/60 bg-pink-500/30 text-white font-medium'
                                : 'border-purple-400/20 text-purple-200'
                            }`}
                          >
                            <span>{emoji}</span>
                            {uidList.length > 1 && <span className="ml-0.5">{uidList.length}</span>}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Quick Reaction Floating Bar on Tap/Hover */}
                  <AnimatePresence>
                    {activeReactionMessageId === msg.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.85 }}
                        animate={{ opacity: 1, y: -4, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        className={`absolute -top-9 ${
                          isMeSender ? 'right-0' : 'left-0'
                        } flex items-center gap-1 p-1 rounded-full glass-panel border border-pink-400/40 bg-[#160527]/95 shadow-xl z-30`}
                      >
                        {QUICK_REACTION_EMOJIS.map((emoji) => (
                          <button
                            key={emoji}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleReaction(msg.id, emoji);
                            }}
                            className="p-1 text-sm hover:scale-125 transition-transform cursor-pointer"
                          >
                            {emoji}
                          </button>
                        ))}
                        {isMeSender && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMessageToDelete(msg);
                              setActiveReactionMessageId(null);
                            }}
                            className="p-1 text-xs text-rose-300 hover:text-rose-100 hover:scale-110 transition-transform cursor-pointer ml-1"
                            title="Delete message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* My Avatar on the right */}
                {isMeSender && (
                  <div className="flex-shrink-0 mb-1">
                    {userRole === 'me' ? (
                      <MeAvatar size={30} expression="hopeful" />
                    ) : (
                      <SudiptaAvatar size={30} expression="smirking" />
                    )}
                  </div>
                )}
              </motion.div>
            );
          })
        )}

        {/* Special First Message Celebration Banner */}
        <AnimatePresence>
          {showSpecialCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full my-3 p-3 rounded-2xl glass-panel glow-card border border-pink-400/40 text-center space-y-1.5 shadow-[0_8px_30px_rgba(236,72,153,0.3)] bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-purple-900/40"
            >
              <div className="flex items-center justify-center gap-2">
                <MeAvatar size={36} expression="celebrating" animateVariant="celebrating" />
                <Sparkles className="w-4 h-4 text-pink-300 animate-spin" />
              </div>
              <p className="text-xs sm:text-sm font-serif-elegant font-medium text-white">
                Okay. The website has officially become a conversation. 😂
              </p>
              <button
                onClick={() => setShowSpecialCelebration(false)}
                className="text-[10px] text-pink-300/80 hover:text-white underline cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* 4. TRAY OF QUICK EMOJIS (Collapsible) */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: 10, height: 0 }}
            className="w-full mt-2 p-2 rounded-2xl glass-panel border border-pink-400/25 bg-[#140624]/90 flex flex-wrap gap-2 justify-center shadow-lg"
          >
            {TRAY_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  inputRef.current?.focus();
                }}
                className="text-lg p-1.5 rounded-lg hover:bg-purple-800/40 hover:scale-125 transition-transform cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. MESSAGE COMPOSER BAR (Fixed Bottom) */}
      <form
        onSubmit={handleSendMessage}
        className="w-full mt-3 relative flex items-center gap-2"
      >
        <button
          type="button"
          id="chat-emoji-toggle-btn"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-3 rounded-full glass-panel border border-purple-400/25 text-purple-200 hover:text-pink-300 hover:border-pink-400/40 transition-colors cursor-pointer flex-shrink-0"
          aria-label="Add Emoji"
        >
          <Smile className="w-4 h-4" />
        </button>

        <input
          ref={inputRef}
          type="text"
          id="chat-message-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Say something… 👀"
          className="flex-1 py-3 px-4 min-h-[46px] rounded-full glass-panel border border-purple-400/25 focus:border-pink-400/60 text-white placeholder-purple-300/45 text-xs sm:text-sm focus:outline-hidden shadow-inner"
        />

        <motion.button
          type="submit"
          id="chat-send-message-btn"
          disabled={!inputText.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`p-3 min-h-[46px] min-w-[46px] rounded-full flex items-center justify-center transition-all cursor-pointer ${
            inputText.trim()
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]'
              : 'glass-panel border border-purple-400/15 text-purple-400/40 cursor-not-allowed'
          }`}
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </form>

      {/* 6. PRIVACY FOOTER NOTE */}
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-purple-300/50">
        <Shield className="w-3 h-3 text-pink-400/60" />
        <span>Private chat · No public profile · No tracking</span>
      </div>

      {/* 7. FIRST-TIME ENTRY / USERNAME NICKNAME MODAL */}
      <AnimatePresence>
        {!hasEnteredChat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080214]/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 15 }}
              className="w-full max-w-sm p-6 rounded-3xl glass-panel glow-card border border-pink-400/40 shadow-2xl text-center space-y-4 bg-[#140624]/95"
            >
              {/* Cute Header Mascot */}
              <div className="flex items-center justify-center gap-4 py-1">
                <MeAvatar size={48} expression="hopeful" animateVariant="idle" />
                <Sparkles className="w-4 h-4 text-pink-300 animate-pulse" />
                <SudiptaAvatar size={48} expression="smirking" animateVariant="idle" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-serif-elegant font-semibold text-white">
                  Welcome to the slightly unnecessary private corner. 😂
                </h3>
                <p className="text-xs text-purple-200/70 font-light">
                  Who is currently typing?
                </p>
              </div>

              {/* Role Selector Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl glass-panel border border-purple-400/20">
                <button
                  type="button"
                  onClick={() => {
                    setUserRole('sudipta');
                    if (userName === 'Me' || !userName) setUserName('Sudipta');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    userRole === 'sudipta'
                      ? 'bg-pink-600 text-white shadow-md'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  I&apos;m Sudipta 🌸
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserRole('me');
                    if (userName === 'Sudipta' || !userName) setUserName('Me');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                    userRole === 'me'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  I&apos;m Me 🌙
                </button>
              </div>

              {/* Nickname Input */}
              <div className="space-y-1.5 text-left">
                <label className="text-[11px] text-purple-300/80 font-medium px-1">
                  Username / Nickname:
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Sudipta"
                  className="w-full py-2.5 px-4 rounded-xl glass-panel border border-purple-400/30 text-white text-xs sm:text-sm focus:outline-hidden focus:border-pink-400/70"
                />
              </div>

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleJoinChat}
                className="w-full py-3 rounded-full font-medium text-xs sm:text-sm text-white bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 hover:from-purple-500 hover:to-pink-500 border border-pink-300/40 shadow-lg cursor-pointer transition-all"
              >
                Enter Little Chat 💬
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 8. DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {messageToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080214]/85 backdrop-blur-xs"
          >
            <div className="w-full max-w-xs p-5 rounded-2xl glass-panel border border-rose-400/40 bg-[#160624] text-center space-y-3 shadow-2xl">
              <p className="text-sm font-medium text-white">Delete this message?</p>
              <p className="text-xs text-purple-200/70 truncate italic">
                &ldquo;{messageToDelete.text}&rdquo;
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setMessageToDelete(null)}
                  className="flex-1 py-2 rounded-xl glass-pill text-xs text-purple-200 border border-purple-400/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs text-white font-medium cursor-pointer shadow-md"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

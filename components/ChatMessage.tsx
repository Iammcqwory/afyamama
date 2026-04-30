import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { Logo } from './Logo';
import { AlertTriangle, AlertCircle, Copy, Share2, Check, SmilePlus } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onReact?: (reaction: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onReact }) => {
  const isUser = message.sender === Sender.User;
  const isWarning = message.sender === Sender.Warning;
  const [copied, setCopied] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reactions = [
    { emoji: '👍', label: 'like' },
    { emoji: '❤️', label: 'love' },
    { emoji: '💡', label: 'informative' },
    { emoji: '🙏', label: 'thanks' },
    { emoji: '🩺', label: 'medical' }
  ];

  const wrapperClasses = isUser ? 'flex flex-row-reverse' : 'flex flex-row';
  
  const bubbleClasses = isUser
    ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white rounded-[2rem] rounded-tr-[0.5rem] shadow-[0_10px_40px_-12px_rgba(239,68,68,0.4)] border border-red-400/20'
    : isWarning
    ? 'bg-zinc-950 text-red-100 rounded-[2rem] rounded-tl-[0.5rem] border-2 border-red-500/30 shadow-[0_0_50px_-10px_rgba(239,68,68,0.15)] overflow-hidden'
    : 'bg-zinc-900/60 backdrop-blur-md text-zinc-100 rounded-[2rem] rounded-tl-[0.5rem] border border-zinc-800/80 shadow-lg';
  
  const Avatar = () => {
    if (isUser) return null;
    if (isWarning) return (
        <div className="shrink-0 w-11 h-11 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-lg animate-pulse">
            <AlertTriangle className="w-5.5 h-5.5 text-red-500" />
        </div>
    );
    return (
        <div className="shrink-0 w-11 h-11 rounded-2xl bg-zinc-900 flex items-center justify-center p-2.5 border border-zinc-800 shadow-xl ring-1 ring-white/5">
            <Logo className="w-full h-full transition-transform group-hover:scale-110" />
        </div>
    );
  }

  // Fixed TypeScript error: Operator '>' cannot be applied to types 'unknown' and 'number'
  // by explicitly casting 'count' to 'number'.
  const activeReactions = message.reactions 
    ? Object.entries(message.reactions).filter(([_, count]) => (count as number) > 0) 
    : [];

  return (
    <div className={`w-full flex items-start gap-4 ${wrapperClasses} animate-slide-up group group/msg relative`}>
      <Avatar />
      <div className="flex flex-col gap-2 max-w-[85%] sm:max-w-[75%]">
        <div className={`relative px-7 py-6 ${bubbleClasses} transition-all duration-500 hover:scale-[1.01] hover:shadow-2xl group-hover:border-white/10`}>
          {/* Subtle reflection effect for AI bubbles */}
          {!isUser && (
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none rounded-t-[2rem]"></div>
          )}

          {isWarning && (
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-red-500/10">
              <div className="relative">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="absolute inset-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-400 drop-shadow-sm">Emergency Protocol Required</span>
            </div>
          )}
          
          {!isUser && !isWarning && (
            <div className="flex items-center gap-2 mb-3.5">
              <AlertCircle className="w-4 h-4 text-red-500 opacity-80" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500/80">MamaB Health Analysis</span>
            </div>
          )}

          <div className="whitespace-pre-wrap text-[15.5px] leading-relaxed font-medium tracking-tight text-zinc-100 antialiased animate-fade-in [animation-delay:200ms]">
            {message.text}
          </div>

          {/* Action Icons - appear on hover */}
          <div className={`absolute -bottom-4 ${isUser ? 'right-4' : 'left-4'} flex items-center gap-1.5 opacity-0 translate-y-2 group-hover/msg:opacity-100 group-hover/msg:translate-y-0 transition-all duration-300 z-30`}>
            {/* Reaction Trigger */}
            <div className="relative">
              <button 
                onMouseEnter={() => setShowReactionPicker(true)}
                onMouseLeave={() => setShowReactionPicker(false)}
                className="p-2 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all shadow-xl"
                title="React"
              >
                <SmilePlus className="w-3.5 h-3.5" />
              </button>
              
              {/* Floating Reaction Picker */}
              {showReactionPicker && (
                <div 
                  onMouseEnter={() => setShowReactionPicker(true)}
                  onMouseLeave={() => setShowReactionPicker(false)}
                  className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1.5 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl animate-slide-up"
                >
                  {reactions.map((r) => (
                    <button
                      key={r.label}
                      onClick={() => {
                        onReact?.(r.emoji);
                        setShowReactionPicker(false);
                      }}
                      className="p-1.5 hover:bg-zinc-800 rounded-lg transition-colors text-lg filter hover:scale-125 transition-transform"
                      title={r.label}
                    >
                      {r.emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={handleCopy}
              className="p-2 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all shadow-xl"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {!isUser && (
              <button className="p-2 bg-zinc-800 border border-zinc-700 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all shadow-xl">
                <Share2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        
        {/* Reactions Display */}
        {activeReactions.length > 0 && (
          <div className={`flex items-center gap-1.5 mt-1 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
            {activeReactions.map(([emoji, count]) => (
              <div 
                key={emoji}
                className="flex items-center gap-1.5 px-2 py-1 bg-zinc-900/60 border border-zinc-800 rounded-full text-[11px] font-bold text-zinc-400 hover:border-zinc-700 transition-colors shadow-sm"
              >
                <span>{emoji}</span>
                <span className="text-zinc-500">{count}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className={`flex items-center gap-2 px-4 text-[9px] font-bold uppercase tracking-widest text-zinc-600 ${isUser ? 'justify-end' : 'justify-start'} transition-opacity group-hover/msg:opacity-100 opacity-40`}>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isUser && <span className="w-1 h-1 bg-zinc-700 rounded-full"></span>}
          {isUser && <span className="text-zinc-500">Delivered</span>}
        </div>
      </div>
    </div>
  );
};

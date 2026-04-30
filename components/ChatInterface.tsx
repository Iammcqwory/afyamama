
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Message, Sender } from '../types';
import { ChatMessage } from './ChatMessage';
import { Mic, Send, VolumeX, Sparkles, Trash2, Camera, X, Search, Filter, Calendar, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';

interface ChatInterfaceProps {
  messages: Message[];
  onSend: (text: string, imageData?: string) => void;
  isTyping: boolean;
  onClear: () => void;
  onReact: (messageId: string, reaction: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSend, isTyping, onClear, onReact }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Search & Filter State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [senderFilter, setSenderFilter] = useState<'all' | Sender>('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    if (scrollRef.current && !isSearchOpen) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping, isSearchOpen]);

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => {
      // Text Search
      const matchesSearch = msg.text.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Sender Filter
      const matchesSender = senderFilter === 'all' || msg.sender === senderFilter;
      
      // Date Filter
      const msgDate = new Date(msg.timestamp);
      msgDate.setHours(0, 0, 0, 0);
      
      const matchesStart = !dateRange.start || msgDate >= new Date(dateRange.start);
      const matchesEnd = !dateRange.end || msgDate <= new Date(dateRange.end);
      
      return matchesSearch && matchesSender && matchesStart && matchesEnd;
    });
  }, [messages, searchQuery, senderFilter, dateRange]);

  const popularQuestions = [
    { label: "Teething Signs", query: "What are the common signs of teething and how can I soothe my baby?" },
    { label: "Fever Help", query: "My child has a fever. What are the home care steps and when is it a red flag?" },
    { label: "Solid Foods", query: "How do I know if my baby is ready for solid foods?" },
    { label: "Sleep Help", query: "My toddler is having a sleep regression. Any tips?" }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = () => {
    if ((inputText.trim() || selectedImage) && !isTyping) {
      onSend(inputText.trim(), selectedImage || undefined);
      setInputText('');
      setSelectedImage(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-zinc-950 border border-zinc-800/80 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] animate-fade-in relative">
      {/* Dynamic Header */}
      <div className="px-6 py-4 border-b border-zinc-800/50 glass flex flex-col gap-4 z-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center p-2 border border-zinc-800 shadow-inner group cursor-pointer">
                <Logo className="w-full h-full transition-transform group-hover:scale-110" />
              </div>
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-[3px] border-zinc-950 rounded-full"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold text-white tracking-tight">MamaB Assistant</h2>
                <span className="px-2 py-0.5 bg-red-500/10 rounded-full text-[9px] font-black text-red-500 uppercase tracking-widest border border-red-500/20">AI PRO</span>
              </div>
              <p className="text-zinc-500 text-[11px] font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Encrypted & Private Session
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2.5 transition-all rounded-xl border ${isSearchOpen ? 'bg-zinc-800 text-white border-zinc-700' : 'text-zinc-500 border-transparent hover:bg-zinc-800/50'}`}
              title="Search Messages"
            >
              <Search className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={onClear}
              className="p-2.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/5 transition-all rounded-xl"
              title="Clear Chat"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 rounded-xl text-[12px] font-bold transition-all text-zinc-400 hover:text-white ml-2">
              <VolumeX className="w-4 h-4" />
              Mute
            </button>
          </div>
        </div>

        {/* Expandable Search & Filter Bar */}
        {isSearchOpen && (
          <div className="flex flex-col gap-3 py-2 animate-slide-up border-t border-zinc-800/50 mt-2">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex-grow relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search in history..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-700 transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-zinc-500" />
                <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                  {(['all', Sender.User, Sender.AI, Sender.Warning] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSenderFilter(s)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                        senderFilter === s 
                          ? 'bg-zinc-800 text-white shadow-sm' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[12px]">
              <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="bg-transparent text-zinc-300 focus:outline-none [color-scheme:dark]"
                  />
                  <span className="text-zinc-600">to</span>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="bg-transparent text-zinc-300 focus:outline-none [color-scheme:dark]"
                  />
                </div>
                {(dateRange.start || dateRange.end || senderFilter !== 'all' || searchQuery) && (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSenderFilter('all');
                      setDateRange({ start: '', end: '' });
                    }}
                    className="ml-2 text-red-500 hover:text-red-400 font-bold uppercase tracking-widest text-[10px]"
                  >
                    Reset
                  </button>
                )}
              </div>
              {isSearchOpen && (
                <div className="text-zinc-500 font-medium">
                  Found <span className="text-zinc-200 font-bold">{filteredMessages.length}</span> results
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Message Area */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto px-6 py-8 space-y-8 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 max-w-md mx-auto py-12">
             <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 blur-[60px] rounded-full"></div>
                <div className="w-20 h-20 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center relative border border-zinc-800 shadow-2xl animate-float">
                   <Sparkles className="w-8 h-8 text-red-500" />
                </div>
             </div>
             <div className="space-y-3">
                <h3 className="text-2xl font-black text-white tracking-tight">How can I support you today?</h3>
                <p className="text-zinc-500 text-[15px] leading-relaxed font-medium">
                  Share your concerns about symptoms, nutrition, or development. You can even upload a photo for better context.
                </p>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {popularQuestions.map((q, i) => (
                  <button 
                    key={i}
                    onClick={() => onSend(q.query)}
                    className="p-4 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800/80 rounded-2xl text-[13px] font-bold text-zinc-400 transition-all hover:text-white hover:border-zinc-700 text-left group"
                  >
                    <div className="text-red-500 mb-1 group-hover:scale-110 transition-transform"><Sparkles className="w-3.5 h-3.5" /></div>
                    {q.label}
                  </button>
                ))}
             </div>
          </div>
        )}

        {isSearchOpen && filteredMessages.length === 0 && messages.length > 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No matches found for your criteria</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setSenderFilter('all');
                setDateRange({ start: '', end: '' });
              }}
              className="mt-4 text-red-500 font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
        
        {(isSearchOpen ? filteredMessages : messages).map((msg) => (
          <ChatMessage key={msg.id} message={msg} onReact={(r) => onReact(msg.id, r)} />
        ))}
        
        {isTyping && !isSearchOpen && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-zinc-900/50 border border-zinc-800/50 px-5 py-4 rounded-3xl rounded-tl-none flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-duration:0.8s]"></span>
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-bounce [animation-duration:0.8s] [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      {/* Modern Action Bar */}
      <div className="px-6 pb-6 pt-2 z-10">
        <div className="relative group max-w-4xl mx-auto">
          {selectedImage && (
            <div className="absolute bottom-full left-0 mb-4 p-2 bg-zinc-900 border border-zinc-800 rounded-2xl animate-slide-up shadow-2xl flex items-center gap-3">
              <img src={selectedImage} alt="Selected" className="w-16 h-16 object-cover rounded-xl border border-zinc-700" />
              <div className="pr-4">
                <p className="text-xs font-bold text-white">Image attached</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Ready to analyze</p>
              </div>
              <button 
                onClick={() => setSelectedImage(null)}
                className="p-1.5 bg-zinc-800 hover:bg-red-500 text-white rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="relative flex items-center gap-3 p-2 bg-zinc-900/90 border border-zinc-800 rounded-[2.5rem] focus-within:border-zinc-700/80 transition-all backdrop-blur-xl shadow-2xl">
            <input 
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-4 text-zinc-500 hover:text-white transition-all"
              title="Attach photo"
            >
              <Camera className="w-6 h-6" />
            </button>
            
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe symptoms or ask a question"
              className="flex-grow bg-transparent py-4 text-[15px] text-white placeholder-zinc-600 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
            />
            
            <button className="flex p-4 text-zinc-500 hover:text-white transition-all">
              <Mic className="w-6 h-6" />
            </button>
            
            <button 
              onClick={handleSendMessage}
              disabled={(!inputText.trim() && !selectedImage) || isTyping}
              className="p-4.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all active:scale-95 shadow-xl shadow-red-600/20 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
            >
              <Send className="w-5.5 h-5.5" />
            </button>
          </div>
        </div>
        <p className="text-center mt-4 text-[11px] text-zinc-600 font-medium">
          Mamabora AI can analyze images but always consult a doctor for a definitive diagnosis.
        </p>
      </div>
    </div>
  );
};
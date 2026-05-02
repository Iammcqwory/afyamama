
import React, { useState, useEffect, useRef } from 'react';
import { Users, MessageSquare, Send, ChevronRight, Hash, Shield, Search, Plus, MapPin, Calendar, Info } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, limit, doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Village, VillageMessage } from '../types';
import { formatDistanceToNow } from 'date-fns';

export const CommunityVillages: React.FC = () => {
  const { user } = useAuth();
  const [villages, setVillages] = useState<Village[]>([]);
  const [selectedVillage, setSelectedVillage] = useState<Village | null>(null);
  const [messages, setMessages] = useState<VillageMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'dueDate' | 'region' | 'topic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newVillage, setNewVillage] = useState({ name: '', description: '', type: 'topic' as any });
  const [isTyping, setIsTyping] = useState(false);
  const [showMemberInfo, setShowMemberInfo] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleCreateVillage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVillage.name || !newVillage.description || !user) return;

    try {
      const docRef = await addDoc(collection(db, 'villages'), {
        ...newVillage,
        memberCount: 1,
        createdBy: user.uid,
        createdAt: serverTimestamp()
      });
      setIsCreateModalOpen(false);
      setNewVillage({ name: '', description: '', type: 'topic' });
      // The useEffect for villages will fetch the new one if we had a real listener, 
      // but for now let's manually add it to the state for immediate feedback
      setVillages(prev => [{ id: docRef.id, ...newVillage, memberCount: 1 } as Village, ...prev]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'villages');
    }
  };

  const [myVillages, setMyVillages] = useState<string[]>([]);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // Sync User's MyVillages
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/villageMemberships`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyVillages(snapshot.docs.map(doc => doc.id));
    }, (error) => {
      console.error("Membership sync error:", error);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const q = query(collection(db, 'villages'), orderBy('memberCount', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Village));
      
      if (list.length === 0 && user) {
        // Seed some villages if none exist
        const initialVillages = [
          { name: "October 2025 Due Date", description: "Parents expecting in October 2025.", type: "dueDate", memberCount: 124 },
          { name: "BabaBora Hub", description: "Dedicated space for fathers sharing the journey.", type: "role", memberCount: 1450 },
          { name: "Kinship Care Network", description: "Support for guardians, aunties, and grandparents.", type: "kinship", memberCount: 320 },
          { name: "Nairobi Parents", description: "Local support and meetups in Nairobi.", type: "region", memberCount: 850 },
          { name: "Single Parent Village", description: "Strength and solidarity in solo caregiving.", type: "topic", memberCount: 1200 },
          { name: "Breastfeeding Support", description: "Share tips and get advice on nursing.", type: "topic", memberCount: 2300 },
          { name: "Orphan Support Hub", description: "Resources and care for guardians of orphans.", type: "kinship", memberCount: 540 },
          { name: "Sleep Training Hub", description: "Restoring sleep for the whole family.", type: "topic", memberCount: 1100 },
          { name: "Twin Parents", description: "Double the joy, double the effort.", type: "topic", memberCount: 430 }
        ];
        initialVillages.forEach(v => {
          addDoc(collection(db, 'villages'), { ...v, createdAt: serverTimestamp() });
        });
      }
 else {
        setVillages(list);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'villages');
    });

    return () => unsubscribe();
  }, [user]);

  const handleJoinVillage = async (villageId: string) => {
    if (!user || isJoining) return;
    setIsJoining(true);
    try {
      await setDoc(doc(db, `users/${user.uid}/villageMemberships`, villageId), {
        joinedAt: serverTimestamp()
      });

      const villageRef = doc(db, 'villages', villageId);
      const vDoc = villages.find(v => v.id === villageId);
      if (vDoc) {
        await updateDoc(villageRef, {
          memberCount: (vDoc.memberCount || 0) + 1
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'membership');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveVillage = async (villageId: string) => {
    if (!user || isJoining) return;
    setIsJoining(true);
    try {
      await deleteDoc(doc(db, `users/${user.uid}/villageMemberships`, villageId));
      const villageRef = doc(db, 'villages', villageId);
      const vDoc = villages.find(v => v.id === villageId);
      if (vDoc) {
        await updateDoc(villageRef, {
          memberCount: Math.max(0, (vDoc.memberCount || 0) - 1)
        });
      }
      setShowMemberInfo(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'membership');
    } finally {
      setIsJoining(false);
    }
  };

  useEffect(() => {
    if (!selectedVillage) return;

    const q = query(
      collection(db, `villages/${selectedVillage.id}/messages`),
      orderBy('timestamp', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toMillis() || Date.now()
        } as VillageMessage;
      }));
    });

    return () => unsubscribe();
  }, [selectedVillage]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputText.trim() || !selectedVillage || !user) return;

    const text = inputText.trim();
    setInputText('');

    try {
      await addDoc(collection(db, `villages/${selectedVillage.id}/messages`), {
        villageId: selectedVillage.id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || null,
        text,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `villages/${selectedVillage.id}/messages`);
    }
  };

  const filteredVillages = villages.filter(v => {
    const matchesCategory = activeCategory === 'all' || v.type === activeCategory;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-xl">
      <div className="flex h-full">
        {/* Villages Sidebar */}
        <div className={`w-full md:w-85 border-r border-zinc-100 dark:border-zinc-800 flex flex-col bg-zinc-50 dark:bg-zinc-900/50 ${selectedVillage ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black tracking-tight flex items-center gap-2 text-zinc-950 dark:text-white">
                  <Users className="w-5 h-5 text-red-600 dark:text-red-500" />
                  Villages
              </h2>
              <button 
                onClick={() => setIsCreateModalOpen(true)}
                className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-600 dark:hover:bg-red-500 hover:text-white transition-all group border border-red-100 dark:border-red-900/40"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input 
                      type="text" 
                      placeholder="Search communities..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl py-2.5 pl-9 pr-4 text-xs focus:outline-none focus:border-red-600/30 transition-all font-medium text-zinc-900 dark:text-white shadow-sm"
                  />
              </div>

              <div className="flex gap-1 p-1 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-x-auto scrollbar-hide shadow-sm">
                {(['all', 'dueDate', 'region', 'topic', 'role', 'kinship'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat as any)}
                    className={`flex-grow py-1.5 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                      activeCategory === cat 
                      ? 'bg-zinc-900 dark:bg-zinc-700 text-white shadow-md' 
                      : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50'
                    }`}
                  >
                    {cat === 'dueDate' ? 'Due' : 
                     cat === 'region' ? 'Loc' : 
                     cat === 'topic' ? 'Sub' : 
                     cat === 'role' ? 'Role' : 
                     cat === 'kinship' ? 'Kin' : 'All'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex-grow overflow-y-auto p-4 space-y-2">
            {filteredVillages.map(village => (
              <button 
                key={village.id}
                onClick={() => setSelectedVillage(village)}
                className={`w-full p-4 rounded-2xl border text-left transition-all group relative overflow-hidden ${
                    selectedVillage?.id === village.id 
                    ? 'bg-white dark:bg-zinc-800 border-red-200 dark:border-red-900/40 shadow-md ring-1 ring-red-100 dark:ring-red-900/20' 
                    : 'bg-transparent border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                {selectedVillage?.id === village.id && (
                  <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-600"></div>
                )}
                <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${
                           village.type === 'dueDate' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                           village.type === 'region' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                           'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        }`}>
                          {village.type === 'dueDate' && <Calendar className="w-3.5 h-3.5" />}
                          {village.type === 'region' && <MapPin className="w-3.5 h-3.5" />}
                          {village.type === 'topic' && <Hash className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-[13px] font-bold ${selectedVillage?.id === village.id ? 'text-zinc-950 dark:text-white' : 'text-zinc-700 dark:text-zinc-300'}`}>{village.name}</span>
                    </div>
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 font-medium leading-relaxed">{village.description}</p>
                <div className="mt-3 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500">{village.memberCount} MEMBERS</span>
                    {myVillages.includes(village.id) ? (
                      <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/40">Member</span>
                    ) : (
                      <span className="text-[9px] font-black uppercase tracking-widest text-red-400 dark:text-red-500 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">Join <ChevronRight className="inline w-3 h-3" /></span>
                    )}
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100/30 dark:bg-zinc-800/30">
            <div className="p-4 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl text-white space-y-2 shadow-lg shadow-red-600/20">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Safety First</p>
              <h4 className="text-[13px] font-bold">Verified Spaces</h4>
              <p className="text-[10px] leading-relaxed opacity-90">All villages are monitored by counselors to ensure a safe environment.</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-grow flex flex-col bg-white dark:bg-zinc-900 ${!selectedVillage ? 'hidden md:flex' : 'flex'}`}>
          {selectedVillage ? (
            <>
              <div className="p-4 sm:p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-zinc-900 z-10 sticky top-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedVillage(null)} className="md:hidden p-2 text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-white bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-100 dark:border-zinc-700">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                    </button>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center justify-center border border-red-100 dark:border-red-900/40">
                        <Users className="w-5 h-5 text-red-600 dark:text-red-500" />
                      </div>
                      <div>
                          <h3 className="text-base font-black tracking-tight text-zinc-950 dark:text-white">{selectedVillage.name}</h3>
                          <div className="flex items-center gap-2">
                             <div className="flex -space-x-2">
                                {[1,2,3].map(i => (
                                  <div key={i} className="w-4 h-4 rounded-full border border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-700"></div>
                                ))}
                             </div>
                             <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
                                Online now
                            </p>
                          </div>
                      </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowMemberInfo(!showMemberInfo)}
                    className={`hidden sm:flex items-center gap-2 px-3 py-1.5 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      showMemberInfo 
                        ? 'bg-red-600 text-white border-red-600 shadow-md' 
                        : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-700 shadow-sm'
                    }`}
                  >
                      <Info className="w-3 h-3" />
                      Village Info
                  </button>
                </div>
              </div>

              <div className="flex-grow flex overflow-hidden relative">
                {selectedVillage && !myVillages.includes(selectedVillage.id) && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center p-6 bg-zinc-50/10 dark:bg-zinc-950/20 backdrop-blur-[2px]">
                    <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-8 rounded-[2rem] max-w-sm w-full text-center space-y-6 shadow-2xl">
                      <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto border border-red-100 dark:border-red-900/40">
                        <Users className="w-8 h-8 text-red-600 dark:text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Join this Village</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">You need to be a member of this village to participate in the conversation.</p>
                      </div>
                      <button 
                        onClick={() => handleJoinVillage(selectedVillage.id)}
                        disabled={isJoining}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-600/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isJoining ? 'Joining...' : 'Join Village'}
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex-grow overflow-y-auto p-4 sm:p-8 space-y-8 scrollbar-hide dark:bg-zinc-900/30">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                        <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">Village Silence</p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 max-w-[200px]">Be the brave soul to break the ice!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                       const isMe = msg.userId === user?.uid;
                       const prevMsg = messages[index - 1];
                       const showHeader = !prevMsg || prevMsg.userId !== msg.userId;

                       return (
                        <div key={msg.id} className={`flex gap-3 sm:gap-4 ${isMe ? 'flex-row-reverse' : ''} ${!showHeader ? 'mt-[-20px]' : ''}`}>
                            {showHeader ? (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-zinc-50 dark:bg-zinc-800 shrink-0 border border-zinc-100 dark:border-zinc-700 overflow-hidden shadow-inner">
                                  {msg.userPhoto ? (
                                      <img src={msg.userPhoto} alt={msg.userName} className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                                          {msg.userName.substring(0, 2).toUpperCase()}
                                      </div>
                                  )}
                              </div>
                            ) : (
                              <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 opacity-0" />
                            )}
                            <div className={`space-y-1.5 max-w-[85%] sm:max-w-[70%] ${isMe ? 'text-right' : ''}`}>
                                {showHeader && (
                                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mb-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                                      <span className={isMe ? 'text-zinc-500 dark:text-zinc-400' : 'text-red-500 dark:text-red-400'}>{msg.userName}</span>
                                      <span className="text-zinc-200 dark:text-zinc-800 text-[8px]">•</span>
                                      <span className="text-zinc-400 dark:text-zinc-500">{formatDistanceToNow(new Date(msg.timestamp), { addSuffix: true })}</span>
                                  </div>
                                )}
                                <div className={`p-3 sm:p-4 rounded-2xl text-[13px] sm:text-[14px] leading-relaxed shadow-sm transition-all hover:shadow-md ${
                                    isMe 
                                    ? 'bg-red-500 text-white rounded-tr-none' 
                                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-none border border-zinc-100 dark:border-zinc-700'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        </div>
                       );
                    })
                )}
                {isTyping && (
                  <div className="flex gap-3 items-center text-zinc-400 dark:text-zinc-500 animate-pulse">
                    <div className="w-8 h-8 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 flex items-center justify-center">
                      <div className="flex gap-0.5">
                        <span className="w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce"></span>
                        <span className="w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce delay-75"></span>
                        <span className="w-1 h-1 bg-zinc-400 dark:bg-zinc-600 rounded-full animate-bounce delay-150"></span>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Someone is typing...</span>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {showMemberInfo && (
                <div className="w-64 border-l border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-6 hidden lg:block animate-slide-left space-y-8 shadow-inner">
                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">About</h4>
                    <p className="text-[13px] text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">{selectedVillage.description}</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">Resources</h4>
                    <div className="space-y-2">
                      {['Birth Prep', 'Nutrition Tips', 'Counseling'].map(res => (
                        <div key={res} className="p-3 bg-white dark:bg-zinc-800 shadow-sm rounded-xl border border-zinc-100 dark:border-zinc-700 hover:border-red-600/30 cursor-pointer group">
                          <p className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{res}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
                    <button 
                      onClick={() => handleLeaveVillage(selectedVillage.id)}
                      disabled={isJoining}
                      className="w-full py-3 px-4 rounded-xl border border-zinc-200 dark:border-zinc-700 text-[10px] font-black uppercase tracking-widest text-zinc-500 dark:text-zinc-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/40 transition-all disabled:opacity-50"
                    >
                      {isJoining ? 'Processing...' : 'Leave Village'}
                    </button>
                  </div>
                </div>
              )}
            </div>

              <div className="p-4 sm:p-10 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/50">
                <div className="max-w-3xl mx-auto">
                  <div className="relative flex items-center gap-3">
                      <div className="flex-grow relative group">
                        <input 
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder={`Send a message to ${selectedVillage.name}...`}
                            className="w-full bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl py-4 px-6 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-red-600/50 transition-all font-medium pr-14 shadow-sm"
                        />
                        <button 
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-zinc-300 dark:text-zinc-600 hover:text-zinc-950 dark:hover:text-white transition-colors"
                        >
                          <Hash className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                          onClick={sendMessage}
                          disabled={!inputText.trim()}
                          className={`p-4 rounded-2xl transition-all shadow-xl flex items-center justify-center ${
                            inputText.trim() 
                              ? 'bg-red-600 text-white shadow-red-600/20 hover:scale-105 active:scale-95 shadow-md' 
                              : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed shadow-none'
                          }`}
                      >
                          <Send className="w-5 h-5" />
                      </button>
                  </div>
                  <p className="mt-4 text-[10px] text-center text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">
                    Press <span className="text-zinc-500 dark:text-zinc-400">Enter</span> to send your message
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-8 sm:p-20 text-center space-y-10">
                <div className="relative">
                  <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 blur-[80px] rounded-full"></div>
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white dark:bg-zinc-800 rounded-[3rem] flex items-center justify-center border border-zinc-100 dark:border-zinc-700 shadow-xl animate-float relative z-10">
                      <Users className="w-10 h-10 sm:w-14 sm:h-14 text-red-600 dark:text-red-500" />
                  </div>
                </div>
                
                <div className="space-y-4 max-w-lg">
                    <h3 className="text-3xl sm:text-5xl font-black tracking-tighter text-zinc-950 dark:text-white">Small steps, <span className="text-red-600 dark:text-red-500 font-black italic">shared together.</span></h3>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-lg font-medium leading-relaxed">Select a community group from the sidebar to connect with other mothers and share your journey.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full max-w-2xl mt-8">
                    <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] space-y-4 hover:border-red-600/20 transition-all group text-left shadow-sm">
                        <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-900/20 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/40 transition-all shadow-sm">
                          <MapPin className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-base tracking-tight">Regional Hubs</h4>
                          <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-medium">Connect with moms in your area for meetups, parenting tips, and local advice.</p>
                        </div>
                    </div>
                    <div className="p-8 bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] space-y-4 hover:border-red-600/20 transition-all group text-left shadow-sm">
                        <div className="w-12 h-12 bg-white dark:bg-zinc-800 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-900/20 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/40 transition-all shadow-sm">
                          <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-base tracking-tight">Timelines</h4>
                          <p className="text-[12px] text-zinc-500 dark:text-zinc-400 font-medium">Share specific milestones with moms expecting or supporting children at the same stage.</p>
                        </div>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)}></div>
          <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-zinc-950 dark:text-white">Startup a Village</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-400 hover:text-zinc-950 dark:hover:text-white">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleCreateVillage} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Village Name</label>
                <input 
                  type="text"
                  required
                  value={newVillage.name}
                  onChange={(e) => setNewVillage({ ...newVillage, name: e.target.value })}
                  placeholder="e.g. October 2025 Due Date"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl py-3 px-4 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-red-600/50 shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Description</label>
                <textarea 
                  required
                  rows={3}
                  value={newVillage.description}
                  onChange={(e) => setNewVillage({ ...newVillage, description: e.target.value })}
                  placeholder="What is this space for?"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-xl py-3 px-4 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-red-600/50 resize-none shadow-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 ml-1">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['dueDate', 'region', 'topic', 'role', 'kinship'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewVillage({ ...newVillage, type: cat })}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-tighter border transition-all ${
                        newVillage.type === cat 
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 shadow-sm' 
                        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-200 dark:hover:border-zinc-600 shadow-sm'
                      }`}
                    >
                      {cat === 'dueDate' ? 'Due Date' : 
                       cat === 'region' ? 'Region' : 
                       cat === 'topic' ? 'Health' : 
                       cat === 'role' ? 'Identity' : 'Kinship'}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-red-600/20 transition-all active:scale-95 mt-4"
              >
                Create Village
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

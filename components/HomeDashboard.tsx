import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { MessageSquare, Users, Heart, Shield, Baby, Sparkles, ChevronRight, Lightbulb } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { BabyProfileModal } from './BabyProfileModal';
import { UserProfile } from '../types';

interface HomeDashboardProps {
  onStart: () => void;
  onNavigate: (tab: any) => void;
}

const HEALTH_TIPS = [
  "Consistency is key for infant sleep. Try to keep the same bedtime routine every night.",
  "Tummy time helps your baby develop strong neck and shoulder muscles.",
  "Responsive caregiving helps your baby develop a sense of security and trust.",
  "Always place your baby on their back to sleep to reduce the risk of SIDS.",
  "Safe play environments are essential for exploration and learning.",
  "Nutrition support is vital for both caregiver and child during early development.",
  "Self-care for the caregiver is not selfish; it's necessary for providing the best care."
];

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onStart, onNavigate }) => {
  const { user, login } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasBaby, setHasBaby] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dailyTip, setDailyTip] = useState("");

  useEffect(() => {
    const tipIndex = new Date().getDate() % HEALTH_TIPS.length;
    setDailyTip(HEALTH_TIPS[tipIndex]);

    const fetchData = async () => {
      if (user) {
        // Fetch User Profile
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserProfile({ uid: user.uid, ...userSnap.data() } as UserProfile);
        }

        // Fetch Baby Profile
        const q = query(collection(db, 'babies'), where('ownerId', '==', user.uid));
        const snapshot = await getDocs(q);
        setHasBaby(!snapshot.empty);
      } else {
        setUserProfile(null);
        setHasBaby(false);
      }
    };
    fetchData();
  }, [user]);

  const handleProfileClick = () => {
    if (!user) {
      login();
    } else if (hasBaby) {
      onNavigate('baby-tracker');
    } else {
      setIsModalOpen(true);
    }
  };

  const getGreeting = () => {
    if (!userProfile?.role) return "Welcome to MamaBora";
    const roleMap: Record<string, string> = {
      mother: "Mama",
      father: "Baba",
      guardian: "Guardian",
      helper: "Caregiver",
      healthcare_worker: "Consultant",
      other: "Friend"
    };
    return `Jambo, ${roleMap[userProfile.role] || "Parent"}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 sm:space-y-20 animate-fade-in pt-4 sm:pt-6">
      <BabyProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => setHasBaby(true)} 
      />
      
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 animate-slide-up px-4">
        <div className="relative animate-float">
          <div className="absolute inset-0 bg-red-500/20 blur-[60px] sm:blur-[100px] rounded-full"></div>
          <Logo className="w-20 h-20 sm:w-28 sm:h-28 relative z-10 filter drop-shadow-[0_20px_50px_rgba(239,68,68,0.3)]" />
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <span className="text-red-600 dark:text-red-400 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-full border border-red-100 dark:border-red-900/40 inline-block mb-2">
            {getGreeting()}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tighter text-zinc-950 dark:text-white leading-[1.1]">
            Confidence in every <br className="hidden sm:block" />
            <span className="text-red-600 dark:text-red-500 italic">small step.</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-lg max-w-xl mx-auto leading-relaxed font-medium px-4">
            AI-powered support for symptom assessment, milestones, and expert guidance for the Mamabora journey.
          </p>
        </div>

        <button 
          onClick={onStart}
          className="group relative bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-4 sm:py-5 px-10 sm:px-12 rounded-2xl transition-all duration-500 active:scale-95 shadow-2xl shadow-red-600/30 text-xs sm:text-sm flex items-center gap-4"
        >
          <span>Start Consultation</span>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Daily Tip Section */}
      <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2rem] p-8 mx-4 sm:mx-0 flex items-start gap-6 relative overflow-hidden group">
        <div className="absolute -right-4 -bottom-4 bg-red-500/5 w-24 h-24 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all"></div>
        <div className="bg-red-50 dark:bg-red-900/40 p-4 rounded-2xl border border-red-100 dark:border-red-900/20">
          <Lightbulb className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 dark:text-red-400">Daily Wisdom</span>
          <p className="text-zinc-600 dark:text-zinc-300 text-lg leading-snug font-medium italic">"{dailyTip}"</p>
        </div>
      </div>

      {/* Daily Tips - Dynamic Section */}
      <div className="relative overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center gap-6 sm:gap-10 mx-4 sm:mx-0 shadow-sm">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Sparkles className="w-24 h-24 sm:w-32 sm:h-32 text-red-600" />
        </div>
        
        <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0 bg-white dark:bg-zinc-800 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-zinc-100 dark:border-zinc-700 shadow-sm">
          <Baby className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-300 dark:text-zinc-600" />
        </div>

        <div className="flex-grow space-y-2 sm:space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-red-600 dark:text-red-400">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <h3 className="text-[10px] sm:text-sm font-bold uppercase tracking-widest">Personalized Insights</h3>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white leading-tight">Your Mamabora Feed</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md">
            Complete your profile to unlock customized milestone tracking and age-specific health tips.
          </p>
        </div>

        <button 
          onClick={handleProfileClick}
          className="w-full md:w-auto bg-white dark:bg-zinc-800 hover:bg-red-600 text-zinc-500 dark:text-zinc-400 hover:text-white font-bold py-3 px-8 rounded-xl transition-all text-sm border border-zinc-200 dark:border-zinc-700 hover:border-red-600 hover:shadow-lg hover:shadow-red-600/20"
        >
          {hasBaby ? 'View Profile' : 'Setup Profile'}
        </button>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 animate-slide-up delay-150 px-4 sm:px-0">
        <ActionCard 
          icon={MessageSquare} 
          title="AI Assistant" 
          desc="24/7 symptom checker and care advice." 
          onClick={onStart}
        />
        <ActionCard 
          icon={Users} 
          title="Community" 
          desc="Connect with parents in similar stages." 
          onClick={() => onNavigate('community')}
        />
        <ActionCard 
          icon={Heart} 
          title="Expert Advice" 
          desc="Pediatrician-reviewed health guides." 
          onClick={() => onNavigate('expert-advice')}
        />
        <ActionCard 
          icon={Shield} 
          title="Safety Hub" 
          desc="Emergency response & safety standards." 
          onClick={() => onNavigate('safety')}
        />
      </div>
    </div>
  );
};

const ActionCard = ({ icon: Icon, title, desc, onClick, highlight = false }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-6 p-6 border rounded-3xl transition-all duration-500 text-left group ${
      highlight 
        ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40 hover:bg-red-600 hover:border-red-600 hover:shadow-lg hover:shadow-red-600/20' 
        : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:bg-red-600 hover:border-red-600 shadow-sm hover:shadow-lg hover:shadow-red-600/20'
    }`}
  >
    <div className={`p-4 rounded-2xl transition-all duration-300 shrink-0 border ${
      highlight 
        ? 'bg-white dark:bg-red-900/40 border-red-100 dark:border-red-900/20 group-hover:bg-white/20 group-hover:border-white/30' 
        : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 group-hover:bg-white/20 group-hover:border-white/30'
    }`}>
      <Icon className={`w-5 h-5 transition-colors ${
        highlight ? 'text-red-600 dark:text-red-400 group-hover:text-white' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-white'
      }`} />
    </div>
    <div>
      <h4 className={`font-bold text-[15px] transition-colors ${
        highlight ? 'text-zinc-950 dark:text-white group-hover:text-white' : 'text-zinc-900 dark:text-zinc-100 group-hover:text-white'
      }`}>{title}</h4>
      <p className={`text-xs leading-normal mt-0.5 transition-colors ${
        highlight ? 'text-zinc-500 dark:text-zinc-400 group-hover:text-red-100' : 'text-zinc-500 dark:text-zinc-400 group-hover:text-red-100'
      }`}>{desc}</p>
    </div>
  </button>
);

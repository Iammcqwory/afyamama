import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { MessageSquare, Users, Heart, Shield, Baby, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { BabyProfileModal } from './BabyProfileModal';

interface HomeDashboardProps {
  onStart: () => void;
  onNavigate: (tab: any) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onStart, onNavigate }) => {
  const { user, login } = useAuth();
  const [hasProfile, setHasProfile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const checkProfile = async () => {
      if (user) {
        const q = query(collection(db, 'babies'), where('ownerId', '==', user.uid));
        const snapshot = await getDocs(q);
        setHasProfile(!snapshot.empty);
      } else {
        setHasProfile(false);
      }
    };
    checkProfile();
  }, [user]);

  const handleProfileClick = () => {
    if (!user) {
      login();
    } else if (hasProfile) {
      onNavigate('baby-tracker');
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 sm:space-y-20 animate-fade-in pt-4 sm:pt-6">
      <BabyProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => setHasProfile(true)} 
      />
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 animate-slide-up px-4">
        <div className="relative animate-float">
          <div className="absolute inset-0 bg-red-500/20 blur-[60px] sm:blur-[100px] rounded-full"></div>
          <Logo className="w-20 h-20 sm:w-28 sm:h-28 relative z-10 filter drop-shadow-[0_20px_50px_rgba(239,68,68,0.3)]" />
        </div>
        
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Confidence in every <span className="text-red-500">small step.</span>
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light px-4">
            AI-powered support for symptom assessment, milestones, and expert guidance for your parenting journey.
          </p>
        </div>

        <button 
          onClick={onStart}
          className="group relative bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 sm:py-4 px-8 sm:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 active:scale-95 shadow-xl shadow-red-500/20 text-base sm:text-lg flex items-center gap-2 sm:gap-3"
        >
          <span>Start Consultation</span>
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Daily Tips - Dynamic Section */}
      <div className="relative overflow-hidden bg-zinc-900/40 border border-zinc-800/50 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 flex flex-col md:flex-row items-center gap-6 sm:gap-10 mx-4 sm:mx-0">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
          <Sparkles className="w-24 h-24 sm:w-32 sm:h-32 text-red-500" />
        </div>
        
        <div className="w-16 h-16 sm:w-24 sm:h-24 shrink-0 bg-zinc-800/80 rounded-2xl sm:rounded-3xl flex items-center justify-center border border-zinc-700/50 shadow-inner">
          <Baby className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-500" />
        </div>

        <div className="flex-grow space-y-2 sm:space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-red-500">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <h3 className="text-[10px] sm:text-sm font-bold uppercase tracking-widest">Personalized Insights</h3>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">Your Daily Parenting Feed</h2>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-md">
            Add a baby profile to unlock customized milestone tracking and age-specific health tips.
          </p>
        </div>

        <button 
          onClick={handleProfileClick}
          className="w-full md:w-auto bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-sm border border-zinc-700"
        >
          {hasProfile ? 'View Profile' : 'Create Profile'}
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
          onClick={() => {}}
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

const ActionCard = ({ icon: Icon, title, desc, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-6 p-6 bg-zinc-900/30 border border-zinc-800/40 rounded-3xl hover:bg-zinc-800/40 transition-all duration-300 text-left group"
  >
    <div className="bg-red-500/10 p-4 rounded-2xl group-hover:scale-110 transition-transform shrink-0 border border-red-500/10">
      <Icon className="w-5 h-5 text-red-500" />
    </div>
    <div>
      <h4 className="font-bold text-white text-[15px]">{title}</h4>
      <p className="text-xs text-zinc-500 leading-normal mt-0.5">{desc}</p>
    </div>
  </button>
);

import React from 'react';
import { Logo } from './Logo';
import { MessageSquare, Users, Heart, Shield, Baby, Sparkles, ChevronRight } from 'lucide-react';

interface HomeDashboardProps {
  onStart: () => void;
  onNavigate: (tab: any) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onStart, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-20 animate-fade-in pt-6">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center space-y-8 animate-slide-up">
        <div className="relative animate-float">
          <div className="absolute inset-0 bg-red-500/20 blur-[100px] rounded-full"></div>
          <Logo className="w-28 h-28 relative z-10 filter drop-shadow-[0_20px_50px_rgba(239,68,68,0.3)]" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Confidence in every <span className="text-red-500">small step.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed font-light">
            AI-powered support for symptom assessment, milestones, and expert guidance for your parenting journey.
          </p>
        </div>

        <button 
          onClick={onStart}
          className="group relative bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-10 rounded-2xl transition-all duration-300 active:scale-95 shadow-xl shadow-red-500/20 text-lg flex items-center gap-3"
        >
          <span>Start Consultation</span>
          <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Daily Tips - Dynamic Section */}
      <div className="relative overflow-hidden bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-10 md:p-14 flex flex-col md:flex-row items-center gap-10">
        <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-red-500" />
        </div>
        
        <div className="w-24 h-24 shrink-0 bg-zinc-800/80 rounded-3xl flex items-center justify-center border border-zinc-700/50 shadow-inner">
          <Baby className="w-10 h-10 text-zinc-500" />
        </div>

        <div className="flex-grow space-y-3 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-red-500">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-widest">Personalized Insights</h3>
          </div>
          <h2 className="text-2xl font-bold text-white">Your Daily Parenting Feed</h2>
          <p className="text-zinc-500 text-base leading-relaxed max-w-md">
            Add a baby profile to unlock customized milestone tracking and age-specific health tips.
          </p>
        </div>

        <button className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-6 rounded-xl transition-all text-sm border border-zinc-700">
          Create Profile
        </button>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-up delay-150">
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

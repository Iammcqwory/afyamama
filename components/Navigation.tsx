import React, { useState } from 'react';
import { Logo } from './Logo';
import { ChevronDown, Moon, User, LayoutGrid, MessageSquare, Headphones, ShoppingBag, Baby, Heart, Info, Shield, Utensils, Volume2, Search, CalendarDays, Sparkles } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [motherOpen, setMotherOpen] = useState(false);
  const [babyOpen, setBabyOpen] = useState(false);

  const NavItem = ({ id, label, icon: Icon, isButton = false }: any) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => onTabChange(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[13px] font-semibold tracking-tight ${
          isActive 
            ? isButton ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-red-500 bg-red-500/5'
            : isButton ? 'bg-red-500 text-white hover:bg-red-600 shadow-md' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
        }`}
      >
        {Icon && <Icon className={`w-3.5 h-3.5 ${isActive && !isButton ? 'text-red-500' : ''}`} />}
        {label}
      </button>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => onTabChange('home')}>
            <Logo className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg font-bold tracking-tighter text-white">Mamabora</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-1">
            <NavItem id="home" label="Home" icon={LayoutGrid} />
            <NavItem id="chat" label="AI Assistant" icon={MessageSquare} isButton={true} />
            
            <div className="relative group/mother" onMouseEnter={() => setMotherOpen(true)} onMouseLeave={() => setMotherOpen(false)}>
              <button className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold transition-colors rounded-lg ${motherOpen ? 'text-white bg-zinc-800/50' : 'text-zinc-400 hover:text-white'}`}>
                <Heart className="w-3.5 h-3.5" />
                Mother <ChevronDown className={`w-3 h-3 transition-transform ${motherOpen ? 'rotate-180' : ''}`} />
              </button>
              {motherOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 glass border border-zinc-800/80 rounded-xl shadow-2xl p-2 animate-slide-up">
                  <DropdownItem icon={CalendarDays} title="Pregnancy" desc="Weekly milestones" onClick={() => onTabChange('pregnancy')} />
                  <DropdownItem icon={Heart} title="Maternal Health" desc="Postpartum care" onClick={() => onTabChange('maternal-health')} />
                  <DropdownItem icon={Sparkles} title="Expert Advice" desc="Doctor insights" onClick={() => onTabChange('expert-advice')} />
                </div>
              )}
            </div>

            <div className="relative group/baby" onMouseEnter={() => setBabyOpen(true)} onMouseLeave={() => setBabyOpen(false)}>
              <button className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold transition-colors rounded-lg ${babyOpen ? 'text-white bg-zinc-800/50' : 'text-zinc-400 hover:text-white'}`}>
                <Baby className="w-3.5 h-3.5" />
                Baby <ChevronDown className={`w-3 h-3 transition-transform ${babyOpen ? 'rotate-180' : ''}`} />
              </button>
              {babyOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 glass border border-zinc-800/80 rounded-xl shadow-2xl p-2 animate-slide-up">
                  <DropdownItem icon={LayoutGrid} title="Baby Tracker" desc="Feeding & sleep" onClick={() => onTabChange('baby-tracker')} />
                  <DropdownItem icon={Baby} title="Development" desc="Milestone checks" onClick={() => onTabChange('development')} />
                  <DropdownItem icon={Volume2} title="White Noise" desc="Sleep assistance" onClick={() => onTabChange('white-noise')} />
                  <DropdownItem icon={Utensils} title="Nutrition" desc="Healthy recipes" onClick={() => onTabChange('nutrition')} />
                </div>
              )}
            </div>

            <NavItem id="podcast" label="Podcast" icon={Headphones} />
            <NavItem id="shop" label="Shop" icon={ShoppingBag} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-zinc-300 hover:text-white transition-colors">
            Login
          </button>
          <div className="w-px h-4 bg-zinc-800 hidden sm:block"></div>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors">
            <Moon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};

const DropdownItem = ({ icon: Icon, title, desc, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-800/50 text-left transition-all group/item"
  >
    <div className="shrink-0 p-1.5 bg-zinc-800 rounded-md group-hover/item:bg-red-500/10 transition-colors">
      <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover/item:text-red-500" />
    </div>
    <div>
      <p className="text-[13px] font-bold text-zinc-200 group-hover/item:text-white">{title}</p>
      <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">{desc}</p>
    </div>
  </button>
);

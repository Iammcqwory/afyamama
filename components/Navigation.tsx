import React, { useState } from 'react';
import { Logo } from './Logo';
import { ChevronDown, Moon, User, LayoutGrid, MessageSquare, Headphones, ShoppingBag, Baby, Heart, Info, Shield, Utensils, Volume2, Search, CalendarDays, Sparkles, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const [motherOpen, setMotherOpen] = useState(false);
  const [babyOpen, setBabyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, login, logout } = useAuth();

  const handleTabClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  const NavItem = ({ id, label, icon: Icon, isButton = false }: any) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => handleTabClick(id)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[13px] font-semibold tracking-tight w-full lg:w-auto ${
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
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => handleTabClick('home')}>
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
                  <DropdownItem icon={CalendarDays} title="Pregnancy" desc="Weekly milestones" onClick={() => handleTabClick('pregnancy')} />
                  <DropdownItem icon={Heart} title="Maternal Health" desc="Postpartum care" onClick={() => handleTabClick('maternal-health')} />
                  <DropdownItem icon={Sparkles} title="Expert Advice" desc="Doctor insights" onClick={() => handleTabClick('expert-advice')} />
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
                  <DropdownItem icon={LayoutGrid} title="Baby Tracker" desc="Feeding & sleep" onClick={() => handleTabClick('baby-tracker')} />
                  <DropdownItem icon={Baby} title="Development" desc="Milestone checks" onClick={() => handleTabClick('development')} />
                  <DropdownItem icon={Volume2} title="White Noise" desc="Sleep assistance" onClick={() => handleTabClick('white-noise')} />
                  <DropdownItem icon={Utensils} title="Nutrition" desc="Healthy recipes" onClick={() => handleTabClick('nutrition')} />
                </div>
              )}
            </div>

            <NavItem id="podcast" label="Podcast" icon={Headphones} />
            <NavItem id="shop" label="Shop" icon={ShoppingBag} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
              <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-800/50 rounded-lg transition-colors">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full border border-zinc-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-bold">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="hidden sm:block text-[13px] font-bold text-zinc-300">{user.displayName?.split(' ')[0]}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 glass border border-zinc-800/80 rounded-xl shadow-2xl p-2 animate-slide-up">
                  <div className="px-3 py-2 border-b border-zinc-800/50 mb-1">
                    <p className="text-[11px] font-bold text-zinc-200 truncate">{user.displayName}</p>
                    <p className="text-[9px] text-zinc-500 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={login}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-lg shadow-red-500/20"
            >
              Sign In
            </button>
          )}

          <div className="w-px h-4 bg-zinc-800 hidden sm:block"></div>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors">
            <Moon className="w-4 h-4" />
          </button>
          
          <button 
            className="lg:hidden p-2 text-zinc-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass border-t border-zinc-800/50 max-h-[calc(100vh-4rem)] overflow-y-auto animate-slide-down">
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <NavItem id="home" label="Home" icon={LayoutGrid} />
              <NavItem id="chat" label="AI Assistant" icon={MessageSquare} isButton={true} />
            </div>

            <div className="space-y-2">
              <p className="px-4 text-[11px] font-black uppercase tracking-widest text-zinc-600">Mother</p>
              <div className="grid grid-cols-1 gap-1">
                <DropdownItem icon={CalendarDays} title="Pregnancy" desc="Weekly milestones" onClick={() => handleTabClick('pregnancy')} />
                <DropdownItem icon={Heart} title="Maternal Health" desc="Postpartum care" onClick={() => handleTabClick('maternal-health')} />
                <DropdownItem icon={Sparkles} title="Expert Advice" desc="Doctor insights" onClick={() => handleTabClick('expert-advice')} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="px-4 text-[11px] font-black uppercase tracking-widest text-zinc-600">Baby</p>
              <div className="grid grid-cols-1 gap-1">
                <DropdownItem icon={LayoutGrid} title="Baby Tracker" desc="Feeding & sleep" onClick={() => handleTabClick('baby-tracker')} />
                <DropdownItem icon={Baby} title="Development" desc="Milestone checks" onClick={() => handleTabClick('development')} />
                <DropdownItem icon={Volume2} title="White Noise" desc="Sleep assistance" onClick={() => handleTabClick('white-noise')} />
                <DropdownItem icon={Utensils} title="Nutrition" desc="Healthy recipes" onClick={() => handleTabClick('nutrition')} />
              </div>
            </div>

            <div className="space-y-1">
              <NavItem id="podcast" label="Podcast" icon={Headphones} />
              <NavItem id="shop" label="Shop" icon={ShoppingBag} />
            </div>

            <div className="pt-4 border-t border-zinc-800/50">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4">
                    <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-sm font-bold text-white">{user.displayName}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 rounded-xl text-sm font-bold text-white shadow-lg shadow-red-500/20"
                >
                  <User className="w-4 h-4" />
                  Sign In with Google
                </button>
              )}
            </div>
          </div>
        </div>
      )}
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

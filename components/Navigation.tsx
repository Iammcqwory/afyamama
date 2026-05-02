import React, { useState } from 'react';
import { Logo } from './Logo';
import { ChevronDown, Moon, User, LayoutGrid, MessageSquare, Headphones, ShoppingBag, Baby, Heart, Info, Shield, Utensils, Volume2, Search, CalendarDays, Sparkles, Menu, X, LogOut, Users, Command, BookOpen, ChevronRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { EXPERT_ARTICLES } from '../services/resources';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const DropdownItem = ({ icon: Icon, title, desc, onClick }: any) => (
  <button
    onClick={onClick}
    className="w-full flex items-start gap-3 p-2.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-left transition-all group/item"
  >
    <div className="shrink-0 p-1.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-md group-hover/item:bg-red-500/10 transition-colors shadow-sm">
      <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover/item:text-red-500" />
    </div>
    <div>
      <p className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 group-hover/item:text-zinc-950 dark:group-hover/item:text-white">{title}</p>
      <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-medium">{desc}</p>
    </div>
  </button>
);

const NavItem = ({ id, label, icon: Icon, isButton = false, activeTab, onTabClick }: any) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => onTabClick(id)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[13px] font-semibold tracking-tight w-full lg:w-auto ${
        isActive 
          ? isButton ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-red-600 bg-red-50 dark:bg-red-950/20'
          : isButton ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-red-600 hover:text-white hover:shadow-lg hover:shadow-red-600/20 border border-zinc-200 dark:border-zinc-700 hover:border-red-600' : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'
      }`}
    >
      {Icon && <Icon className={`w-3.5 h-3.5 ${isActive && !isButton ? 'text-red-500' : ''}`} />}
      {label}
    </button>
  );
};

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, isDarkMode, toggleTheme }) => {
  const [motherOpen, setMotherOpen] = useState(false);
  const [babyOpen, setBabyOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, login, logout } = useAuth();

  const searchResults = searchQuery.trim() ? [
    ...EXPERT_ARTICLES.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())).map(a => ({ type: 'Article', title: a.title, tab: 'expert-advice' })),
    ...['Pregnancy', 'Nutrition', 'Baby Tracker', 'Development', 'Self-Care', 'Community', 'Podcast'].filter(t => t.toLowerCase().includes(searchQuery.toLowerCase())).map(t => ({ type: 'Section', title: t, tab: t.toLowerCase().replace(' ', '-') }))
  ].slice(0, 5) : [];

  const handleTabClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-zinc-200/50 dark:border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2.5 cursor-pointer group" onClick={() => handleTabClick('home')}>
            <Logo className="w-8 h-8 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-lg font-bold tracking-tighter text-zinc-950 dark:text-white">Mamabora</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-1">
            <NavItem id="home" label="Home" icon={LayoutGrid} activeTab={activeTab} onTabClick={handleTabClick} />
            <NavItem id="chat" label="AI Assistant" icon={MessageSquare} isButton={true} activeTab={activeTab} onTabClick={handleTabClick} />
            
            <div className="relative group/mother" onMouseEnter={() => setMotherOpen(true)} onMouseLeave={() => setMotherOpen(false)}>
              <button className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold transition-colors rounded-lg ${motherOpen ? 'text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
                <Heart className="w-3.5 h-3.5" />
                Mother <ChevronDown className={`w-3 h-3 transition-transform ${motherOpen ? 'rotate-180' : ''}`} />
              </button>
              {motherOpen && (
                <div className="absolute top-full left-0 mt-2 w-60 glass border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 animate-slide-up rounded-2xl">
                  <DropdownItem icon={CalendarDays} title="Pregnancy" desc="Weekly milestones" onClick={() => handleTabClick('pregnancy')} />
                  <DropdownItem icon={Heart} title="Self-Care" desc="Wellness & Recovery" onClick={() => handleTabClick('maternal-health')} />
                  <DropdownItem icon={Sparkles} title="Expert Advice" desc="Doctor insights" onClick={() => handleTabClick('expert-advice')} />
                </div>
              )}
            </div>

            <div className="relative group/baby" onMouseEnter={() => setBabyOpen(true)} onMouseLeave={() => setBabyOpen(false)}>
              <button className={`flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold transition-colors rounded-lg ${babyOpen ? 'text-zinc-950 dark:text-white bg-zinc-100 dark:bg-zinc-800' : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-50 dark:hover:bg-zinc-800'}`}>
                <Baby className="w-3.5 h-3.5" />
                Baby <ChevronDown className={`w-3 h-3 transition-transform ${babyOpen ? 'rotate-180' : ''}`} />
              </button>
              {babyOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 glass border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 animate-slide-up rounded-2xl">
                  <DropdownItem icon={LayoutGrid} title="Baby Tracker" desc="Feeding & sleep" onClick={() => handleTabClick('baby-tracker')} />
                  <DropdownItem icon={Baby} title="Development" desc="Milestone checks" onClick={() => handleTabClick('development')} />
                  <DropdownItem icon={Volume2} title="White Noise" desc="Sleep assistance" onClick={() => handleTabClick('white-noise')} />
                  <DropdownItem icon={Utensils} title="Nutrition" desc="Healthy recipes" onClick={() => handleTabClick('nutrition')} />
                </div>
              )}
            </div>

            <NavItem id="podcast" label="Podcast" icon={Headphones} activeTab={activeTab} onTabClick={handleTabClick} />
            <NavItem id="community" label="Community" icon={Users} activeTab={activeTab} onTabClick={handleTabClick} />
            <NavItem id="shop" label="Shop" icon={ShoppingBag} activeTab={activeTab} onTabClick={handleTabClick} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
              <button className="flex items-center gap-2 px-2 py-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-transparent hover:border-zinc-100 dark:hover:border-zinc-800 rounded-lg transition-colors">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-700" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                    {user.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="hidden sm:block text-[13px] font-bold text-zinc-700 dark:text-zinc-300">{user.displayName?.split(' ')[0]}</span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 glass border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 animate-slide-up rounded-xl">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    <p className="text-[11px] font-bold text-zinc-900 dark:text-white truncate">{user.displayName}</p>
                    <p className="text-[9px] text-zinc-400 dark:text-zinc-500 truncate">{user.email}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-[12px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
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
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-lg shadow-red-600/20"
            >
              Sign In
            </button>
          )}

          <button className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors" onClick={() => setSearchOpen(!searchOpen)}>
            <Search className="w-4 h-4" />
          </button>
          
          <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-800 hidden sm:block"></div>
          <button 
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sparkles className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {searchOpen && (
            <div className="absolute top-16 left-0 right-0 glass border-b border-zinc-200 dark:border-zinc-800 p-4 animate-slide-down flex justify-center">
                <div className="w-full max-w-2xl relative">
                    <Command className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input 
                        type="text" 
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for guidance, articles, or tools..."
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-12 pr-4 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-red-600/50 transition-all shadow-xl"
                    />
                    
                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden">
                            {searchResults.map((res, i) => (
                                <button 
                                    key={i}
                                    onClick={() => handleTabClick(res.tab)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${res.type === 'Article' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
                                            {res.type === 'Article' ? <BookOpen className="w-3 h-3" /> : <LayoutGrid className="w-3 h-3" />}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-red-600 transition-colors">{res.title}</p>
                                            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">{res.type}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-3 h-3 text-zinc-200 dark:text-zinc-700 group-hover:text-red-600" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
          )}
          
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
        <div className="lg:hidden glass border-t border-zinc-200 dark:border-zinc-800 max-h-[calc(100vh-4rem)] overflow-y-auto animate-slide-down">
          <div className="p-4 space-y-4">
            <div className="space-y-1">
              <NavItem id="home" label="Home" icon={LayoutGrid} activeTab={activeTab} onTabClick={handleTabClick} />
              <NavItem id="chat" label="AI Assistant" icon={MessageSquare} isButton={true} activeTab={activeTab} onTabClick={handleTabClick} />
            </div>

            <div className="space-y-2">
              <p className="px-4 text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Mamabora</p>
              <div className="grid grid-cols-1 gap-1">
                <DropdownItem icon={CalendarDays} title="Pregnancy" desc="Weekly milestones" onClick={() => handleTabClick('pregnancy')} />
                <DropdownItem icon={Heart} title="Self-Care" desc="Wellness & Recovery" onClick={() => handleTabClick('maternal-health')} />
                <DropdownItem icon={Sparkles} title="Expert Advice" desc="Doctor insights" onClick={() => handleTabClick('expert-advice')} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="px-4 text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">Baby</p>
              <div className="grid grid-cols-1 gap-1">
                <DropdownItem icon={LayoutGrid} title="Baby Tracker" desc="Feeding & sleep" onClick={() => handleTabClick('baby-tracker')} />
                <DropdownItem icon={Baby} title="Development" desc="Milestone checks" onClick={() => handleTabClick('development')} />
                <DropdownItem icon={Volume2} title="White Noise" desc="Sleep assistance" onClick={() => handleTabClick('white-noise')} />
                <DropdownItem icon={Utensils} title="Nutrition" desc="Healthy recipes" onClick={() => handleTabClick('nutrition')} />
              </div>
            </div>

            <div className="space-y-1">
              <NavItem id="podcast" label="Podcast" icon={Headphones} activeTab={activeTab} onTabClick={handleTabClick} />
              <NavItem id="community" label="Community" icon={Users} activeTab={activeTab} onTabClick={handleTabClick} />
              <NavItem id="shop" label="Shop" icon={ShoppingBag} activeTab={activeTab} onTabClick={handleTabClick} />
            </div>

            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-4">
                    <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700" referrerPolicy="no-referrer" />
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-white">{user.displayName}</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{user.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-bold text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <button 
                  onClick={login}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 rounded-xl text-sm font-bold text-white shadow-lg shadow-red-600/20"
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

import React, { useState } from 'react';
import { Volume2, Shield, Search, Play, Pause, SkipForward, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ToolsHubProps {
  activeSubTab: string;
}

export const ToolsHub: React.FC<ToolsHubProps> = ({ activeSubTab }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState('Gentle Rain');

  const renderWhiteNoise = () => (
    <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12 px-4 sm:px-6">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white">White Noise</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">Soothing sounds to help your baby sleep deeper and longer.</p>
      </div>
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 flex flex-col items-center space-y-8 sm:space-y-10 shadow-xl">
        <div className={`w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 sm:border-8 border-zinc-100 dark:border-zinc-800 flex items-center justify-center relative ${isPlaying ? 'animate-pulse' : ''}`}>
           <div className="absolute inset-0 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-2xl sm:blur-3xl"></div>
           <Volume2 className={`w-12 h-12 sm:w-20 sm:h-20 ${isPlaying ? 'text-red-600 dark:text-red-500' : 'text-zinc-300 dark:text-zinc-700'} transition-colors`} />
        </div>
        <div className="text-center space-y-1 sm:space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">{currentSound}</h3>
            <p className="text-zinc-400 dark:text-zinc-500 text-[10px] sm:text-sm uppercase tracking-widest font-black">Playing Now</p>
        </div>
        <div className="flex items-center gap-6 sm:gap-8">
            <button className="p-3 sm:p-4 text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"><RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" /></button>
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-600/20 active:scale-95 transition-all"
            >
                {isPlaying ? <Pause className="w-6 h-6 sm:w-8 sm:h-8 fill-current" /> : <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />}
            </button>
            <button className="p-3 sm:p-4 text-zinc-400 dark:text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors"><SkipForward className="w-5 h-5 sm:w-6 sm:h-6" /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
            {['White Noise', 'Gentle Rain', 'Womb Sounds', 'Ocean Waves'].map(sound => (
                <button 
                    key={sound}
                    onClick={() => { setCurrentSound(sound); setIsPlaying(true); }}
                    className={`py-3 sm:py-4 rounded-xl sm:rounded-2xl border transition-all text-xs sm:text-sm font-bold ${currentSound === sound ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-700'}`}
                >
                    {sound}
                </button>
            ))}
        </div>
      </div>
    </div>
  );

  const renderSafety = () => (
    <div className="space-y-8 sm:space-y-12 px-4 sm:px-6">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white">Safety Hub</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">Essential childproofing checklists for every room.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        <SafetyCard room="Living Room" items={["Anchor heavy furniture", "Cover electrical outlets", "Soften sharp corners"]} />
        <SafetyCard room="Kitchen" items={["Cabinet latches for cleaners", "Stove knob covers", "Keep knives out of reach"]} />
        <SafetyCard room="Nursery" items={["Crib safety standard check", "No loose blankets or toys", "Anchor changing table"]} />
        <SafetyCard room="Bathroom" items={["Toilet seat locks", "Anti-slip tub mat", "Medicine cabinet locks"]} />
      </div>
    </div>
  );

  const renderNames = () => (
    <div className="max-w-2xl mx-auto space-y-8 sm:space-y-12 px-4 sm:px-6">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white">Baby Names</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">Find the perfect name with our curated meaning-first database.</p>
      </div>
      <div className="relative group">
          <Search className="absolute left-5 sm:left-6 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-4 h-4 sm:w-5 sm:h-5" />
          <input 
            type="text" 
            placeholder="Search by meaning or origin..." 
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-3xl py-4 sm:py-6 pl-12 sm:pl-16 pr-5 sm:pr-6 text-base sm:text-lg focus:outline-none focus:border-red-600/50 transition-all text-zinc-950 dark:text-white shadow-sm"
          />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
         {[
           { name: "Aria", origin: "Italian", meaning: "Air; Song" },
           { name: "Leo", origin: "Latin", meaning: "Lion" },
           { name: "Maya", origin: "Sanskrit", meaning: "Illusion; Water" },
           { name: "Caleb", origin: "Hebrew", meaning: "Devotion; Whole Heart" }
         ].map(item => (
            <div key={item.name} className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-4 sm:p-6 rounded-xl sm:rounded-2xl flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors shadow-sm">
              <div>
                 <h4 className="text-lg sm:text-xl font-black text-zinc-950 dark:text-white">{item.name}</h4>
                 <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm">{item.origin} origin • {item.meaning}</p>
              </div>
              <button className="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-50 dark:bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border border-zinc-100 dark:border-zinc-700">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 animate-fade-in">
      {activeSubTab === 'white-noise' && renderWhiteNoise()}
      {activeSubTab === 'safety' && renderSafety()}
      {activeSubTab === 'baby-names' && renderNames()}
    </div>
  );
};

const SafetyCard = ({ room, items }: { room: string, items: string[] }) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-sm group hover:border-red-600/20 dark:hover:border-red-900/40 transition-all">
    <div className="flex items-center gap-3">
        <div className="p-2 sm:p-3 bg-red-50 dark:bg-red-950/20 rounded-xl sm:rounded-2xl transition-colors group-hover:bg-red-100 dark:group-hover:bg-red-900/40">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">{room}</h3>
    </div>
    <ul className="space-y-3 sm:space-y-4">
        {items.map(item => (
            <li key={item} className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 text-sm sm:text-base">
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 dark:text-emerald-400 shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
  </div>
);

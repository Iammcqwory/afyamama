import React, { useState } from 'react';
import { Volume2, Shield, Search, Play, Pause, SkipForward, RefreshCw, CheckCircle2 } from 'lucide-react';

interface ToolsHubProps {
  activeSubTab: string;
}

export const ToolsHub: React.FC<ToolsHubProps> = ({ activeSubTab }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState('Gentle Rain');

  const renderWhiteNoise = () => (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">White Noise</h2>
        <p className="text-zinc-500">Soothing sounds to help your baby sleep deeper and longer.</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[3rem] p-12 flex flex-col items-center space-y-10 shadow-2xl">
        <div className={`w-48 h-48 rounded-full border-8 border-zinc-800 flex items-center justify-center relative ${isPlaying ? 'animate-pulse' : ''}`}>
           <div className="absolute inset-0 bg-red-500/5 rounded-full blur-3xl"></div>
           <Volume2 className={`w-20 h-20 ${isPlaying ? 'text-red-500' : 'text-zinc-700'} transition-colors`} />
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">{currentSound}</h3>
            <p className="text-zinc-500 text-sm uppercase tracking-widest font-black">Playing Now</p>
        </div>
        <div className="flex items-center gap-8">
            <button className="p-4 text-zinc-500 hover:text-white transition-colors"><RefreshCw className="w-6 h-6" /></button>
            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-500/20 active:scale-95 transition-all"
            >
                {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
            </button>
            <button className="p-4 text-zinc-500 hover:text-white transition-colors"><SkipForward className="w-6 h-6" /></button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            {['White Noise', 'Gentle Rain', 'Womb Sounds', 'Ocean Waves'].map(sound => (
                <button 
                    key={sound}
                    onClick={() => { setCurrentSound(sound); setIsPlaying(true); }}
                    className={`py-4 rounded-2xl border transition-all text-sm font-bold ${currentSound === sound ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-zinc-800/50 border-zinc-700 text-zinc-400 hover:bg-zinc-700'}`}
                >
                    {sound}
                </button>
            ))}
        </div>
      </div>
    </div>
  );

  const renderSafety = () => (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Safety Hub</h2>
        <p className="text-zinc-500">Essential childproofing checklists for every room.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SafetyCard room="Living Room" items={["Anchor heavy furniture", "Cover electrical outlets", "Soften sharp corners"]} />
        <SafetyCard room="Kitchen" items={["Cabinet latches for cleaners", "Stove knob covers", "Keep knives out of reach"]} />
        <SafetyCard room="Nursery" items={["Crib safety standard check", "No loose blankets or toys", "Anchor changing table"]} />
        <SafetyCard room="Bathroom" items={["Toilet seat locks", "Anti-slip tub mat", "Medicine cabinet locks"]} />
      </div>
    </div>
  );

  const renderNames = () => (
    <div className="max-w-2xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Baby Names</h2>
        <p className="text-zinc-500">Find the perfect name with our curated meaning-first database.</p>
      </div>
      <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-500 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by meaning or origin..." 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl py-6 pl-16 pr-6 text-lg focus:outline-none focus:border-red-500/50 transition-all"
          />
      </div>
      <div className="grid grid-cols-1 gap-4">
         {[
           { name: "Aria", origin: "Italian", meaning: "Air; Song" },
           { name: "Leo", origin: "Latin", meaning: "Lion" },
           { name: "Maya", origin: "Sanskrit", meaning: "Illusion; Water" },
           { name: "Caleb", origin: "Hebrew", meaning: "Devotion; Whole Heart" }
         ].map(item => (
           <div key={item.name} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-center justify-between hover:bg-zinc-800 transition-colors">
              <div>
                 <h4 className="text-xl font-black text-white">{item.name}</h4>
                 <p className="text-zinc-500 text-sm">{item.origin} origin • {item.meaning}</p>
              </div>
              <button className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
                <Shield className="w-4 h-4" />
              </button>
           </div>
         ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fade-in">
      {activeSubTab === 'white-noise' && renderWhiteNoise()}
      {activeSubTab === 'safety' && renderSafety()}
      {activeSubTab === 'baby-names' && renderNames()}
    </div>
  );
};

const SafetyCard = ({ room, items }: { room: string, items: string[] }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 space-y-6">
    <div className="flex items-center gap-3">
        <div className="p-3 bg-red-500/10 rounded-2xl">
            <Shield className="w-6 h-6 text-red-500" />
        </div>
        <h3 className="text-2xl font-bold">{room}</h3>
    </div>
    <ul className="space-y-4">
        {items.map(item => (
            <li key={item} className="flex items-center gap-3 text-zinc-400">
                <CheckCircle2 className="w-5 h-5 text-zinc-700 shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
  </div>
);

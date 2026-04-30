import React from 'react';
import { Baby, Utensils, LayoutGrid, Timer, Droplets, Moon, CheckCircle2 } from 'lucide-react';

interface BabyHubProps {
  activeSubTab: string;
}

export const BabyHub: React.FC<BabyHubProps> = ({ activeSubTab }) => {
  const renderTracker = () => (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Baby Tracker</h2>
        <p className="text-zinc-500">Log and monitor your baby's daily routine.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <TrackerCard icon={Droplets} color="text-blue-500" title="Feeding" value="2h 15m ago" sub="Breast/Bottle" />
        <TrackerCard icon={Timer} color="text-emerald-500" title="Diaper" value="45m ago" sub="Wet & Dirty" />
        <TrackerCard icon={Moon} color="text-purple-500" title="Sleep" value="1h 20m ago" sub="Nap: 45 min" />
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 flex flex-col items-center justify-center space-y-6">
        <div className="w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center">
            <LayoutGrid className="text-zinc-500 w-10 h-10" />
        </div>
        <div className="text-center space-y-2">
            <h3 className="text-xl font-bold">No Recent Activity</h3>
            <p className="text-zinc-500">Start logging your baby's day for personalized trends.</p>
        </div>
        <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-xl transition-all">Add Log Entry</button>
      </div>
    </div>
  );

  const renderDevelopment = () => (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Milestones</h2>
        <p className="text-zinc-500">Standard developmental checks for your child's age.</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-8">
        <MilestoneSection age="4 Months" items={["Pushes up on arms during tummy time", "Makes sounds when spoken to", "Opens mouth when hungry", "Holds head steady"]} />
        <MilestoneSection age="6 Months" items={["Rolls from tummy to back", "Recognizes familiar faces", "Blows 'raspberries' with lips", "Starts to sit without support"]} />
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Nutrition & Solids</h2>
        <p className="text-zinc-500">A guide to starting solids and healthy meal ideas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 space-y-4">
            <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Utensils className="text-orange-500" />
            </div>
            <h3 className="text-xl font-bold">First Foods Checklist</h3>
            <ul className="space-y-3 text-zinc-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Avocado mash</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Iron-fortified cereals</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Steamed sweet potato</li>
            </ul>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 space-y-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <Baby className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold">Allergy Safety</h3>
            <p className="text-zinc-500 text-sm">Introduction of common allergens (peanuts, eggs, dairy) should be discussed with your pediatrician based on recent guidelines.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fade-in">
      {activeSubTab === 'baby-tracker' && renderTracker()}
      {activeSubTab === 'development' && renderDevelopment()}
      {activeSubTab === 'nutrition' && renderNutrition()}
      {activeSubTab === 'feeding-sleep' && renderTracker()}
    </div>
  );
};

const TrackerCard = ({ icon: Icon, color, title, value, sub }: any) => (
  <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 space-y-4 hover:border-zinc-700 transition-colors">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-2xl bg-zinc-800 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Active</span>
    </div>
    <div>
      <h3 className="text-zinc-500 text-sm font-bold">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-white">{value}</span>
      </div>
      <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-wider mt-1">{sub}</p>
    </div>
  </div>
);

const MilestoneSection = ({ age, items }: { age: string, items: string[] }) => (
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2rem] p-8 space-y-6">
    <div className="flex items-center justify-between">
      <h3 className="text-2xl font-bold">{age} Milestones</h3>
      <div className="px-3 py-1 bg-red-500 text-white text-[10px] font-black rounded-full uppercase">Standard</div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/30">
          <CheckCircle2 className="w-5 h-5 text-zinc-600 shrink-0 mt-0.5" />
          <span className="text-zinc-300 text-sm leading-tight">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

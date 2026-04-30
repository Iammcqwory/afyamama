import React, { useState, useEffect } from 'react';
import { Baby as BabyIcon, Utensils, LayoutGrid, Timer, Droplets, Moon, CheckCircle2, ChevronDown, Plus, Activity, Heart } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { LogModal } from './LogModal';
import { formatDistanceToNow } from 'date-fns';

interface BabyHubProps {
  activeSubTab: string;
}

interface BabyData {
  id: string;
  name: string;
  birthDate: string;
}

interface LogEntry {
  id: string;
  type: string;
  timestamp: string;
  notes?: string;
}

export const BabyHub: React.FC<BabyHubProps> = ({ activeSubTab }) => {
  const { user } = useAuth();
  const [babies, setBabies] = useState<BabyData[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<BabyData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'babies'), where('ownerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const babyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BabyData));
      setBabies(babyList);
      if (babyList.length > 0 && !selectedBaby) {
        setSelectedBaby(babyList[0]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!selectedBaby) return;
    const q = query(
      collection(db, `babies/${selectedBaby.id}/logs`),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LogEntry)));
    });
    return () => unsubscribe();
  }, [selectedBaby]);

  const renderTracker = () => {
    if (!user) return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-zinc-900 rounded-full text-zinc-700">
                <Heart className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold">Sign in to track progress</h2>
            <p className="text-zinc-500 max-w-sm">Securely log your baby's nutrition, sleep, and milestones.</p>
        </div>
    );

    if (loading) return <div className="text-center py-20 animate-pulse text-zinc-600">Loading your data...</div>;

    if (babies.length === 0) return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-6 bg-zinc-900 rounded-full text-zinc-700">
                <Plus className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold">No baby profiles found</h2>
            <p className="text-zinc-500 max-w-sm">Create a profile from the home dashboard to start tracking.</p>
        </div>
    );

    const lastFeeding = logs.find(l => l.type === 'feeding');
    const lastDiaper = logs.find(l => l.type === 'diaper');
    const lastSleep = logs.find(l => l.type === 'sleep');

    return (
        <div className="space-y-8 sm:space-y-12">
          <LogModal 
            isOpen={isLogModalOpen}
            onClose={() => setIsLogModalOpen(false)}
            babyId={selectedBaby?.id || ''}
            onSuccess={() => {}}
          />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-red-500 mb-1">
                    <Activity className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Real-time Tracker</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black">Daily Routine</h2>
                <p className="text-zinc-500 text-sm">Log and monitor your baby's vitals.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <div className="relative group">
                    <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors">
                        <BabyIcon className="w-4 h-4 text-red-500" />
                        <span>{selectedBaby?.name}</span>
                        <ChevronDown className="w-3 h-3 text-zinc-500" />
                    </button>
                    {/* Baby Selector dropdown could go here */}
                </div>
                <button 
                  onClick={() => setIsLogModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Add Log
                </button>
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <TrackerCard 
                icon={Droplets} 
                color="text-blue-500" 
                title="Feeding" 
                value={lastFeeding ? formatDistanceToNow(new Date(lastFeeding.timestamp), { addSuffix: true }) : 'No data'} 
                sub={lastFeeding?.notes || 'Breast/Bottle'} 
            />
            <TrackerCard 
                icon={Timer} 
                color="text-emerald-500" 
                title="Diaper" 
                value={lastDiaper ? formatDistanceToNow(new Date(lastDiaper.timestamp), { addSuffix: true }) : 'No data'} 
                sub={lastDiaper?.notes || 'Wet & Dirty'} 
            />
            <TrackerCard 
                icon={Moon} 
                color="text-purple-500" 
                title="Sleep" 
                value={lastSleep ? formatDistanceToNow(new Date(lastSleep.timestamp), { addSuffix: true }) : 'No data'} 
                sub={lastSleep?.notes || 'Recent nap duration'} 
            />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 inline-block">Recent Activity</h3>
            <div className="space-y-3">
                {logs.length > 0 ? logs.map(log => (
                    <div key={log.id} className="flex items-center justify-between p-4 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:bg-zinc-800/30 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center">
                                {log.type === 'feeding' && <Droplets className="w-5 h-5 text-blue-500" />}
                                {log.type === 'diaper' && <Timer className="w-5 h-5 text-emerald-500" />}
                                {log.type === 'sleep' && <Moon className="w-5 h-5 text-purple-500" />}
                                {log.type === 'milestone' && <Activity className="w-5 h-5 text-red-500" />}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-white capitalize">{log.type}</h4>
                                <p className="text-xs text-zinc-500">{log.notes || 'No notes added'}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black uppercase text-zinc-600 tracking-wider">
                                {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl">
                        <p className="text-zinc-600 text-sm font-medium">No recent activity logged for this baby.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
    );
  };

  const renderDevelopment = () => (
    <div className="space-y-8 sm:space-y-12">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold">Milestones</h2>
        <p className="text-zinc-500 text-sm sm:text-base">Standard developmental checks for your child's age.</p>
      </div>
      <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
        <MilestoneSection age="4 Months" items={["Pushes up on arms during tummy time", "Makes sounds when spoken to", "Opens mouth when hungry", "Holds head steady"]} />
        <MilestoneSection age="6 Months" items={["Rolls from tummy to back", "Recognizes familiar faces", "Blows 'raspberries' with lips", "Starts to sit without support"]} />
      </div>
    </div>
  );

  const renderNutrition = () => (
    <div className="space-y-8 sm:space-y-12">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-3xl sm:text-4xl font-bold">Nutrition & Solids</h2>
        <p className="text-zinc-500 text-sm sm:text-base">A guide to starting solids and healthy meal ideas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500/10 rounded-xl flex items-center justify-center">
                <Utensils className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold">First Foods Checklist</h3>
            <ul className="space-y-3 text-zinc-400">
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Avocado mash</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Iron-fortified cereals</li>
                <li className="flex items-center gap-2 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> Steamed sweet potato</li>
            </ul>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <Baby className="text-red-500 w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold">Allergy Safety</h3>
            <p className="text-zinc-500 text-xs sm:text-sm">Introduction of common allergens should be discussed with your pediatrician based on recent guidelines.</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 animate-fade-in px-4 sm:px-6">
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
  <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 space-y-4 sm:space-y-6">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-xl sm:text-2xl font-bold">{age} Milestones</h3>
      <div className="px-3 py-1 bg-red-500 text-white text-[9px] sm:text-[10px] font-black rounded-full uppercase shrink-0">Standard</div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-xl border border-zinc-700/30">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-600 shrink-0 mt-0.5" />
          <span className="text-zinc-300 text-[13px] sm:text-sm leading-tight">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

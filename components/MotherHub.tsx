import React, { useState, useEffect } from 'react';
import { CalendarDays, Heart, Sparkles, ChevronRight, CheckCircle2, BookOpen, Baby, Info, Smile, Droplets, Moon, Coffee, Activity, Plus, Shield } from 'lucide-react';
import { PREGNANCY_MILESTONES, EXPERT_ARTICLES, Milestone } from '../services/resources';
import { useAuth } from '../AuthContext';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, query, where, orderBy, onSnapshot, limit, addDoc } from 'firebase/firestore';

interface MotherHubProps {
  activeSubTab: string;
}

interface PregnancyJourneyProps {
  selectedMilestone: Milestone | null;
  onSelectMilestone: (m: Milestone | null) => void;
}

const PregnancyJourney: React.FC<PregnancyJourneyProps> = ({ selectedMilestone, onSelectMilestone }) => (
  <div className="space-y-8 sm:space-y-12">
    <div className="text-center space-y-3 sm:space-y-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">Pregnancy Journey</h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">Your week-by-week guide to a healthy pregnancy.</p>
    </div>

    {selectedMilestone && (
      <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[2rem] p-8 mb-12 animate-fade-in relative overflow-hidden">
        <button 
          onClick={() => onSelectMilestone(null)}
          className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          Close
        </button>
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 text-white rounded-3xl flex items-center justify-center shrink-0 shadow-lg shadow-red-600/20">
            <span className="text-2xl font-black">{selectedMilestone.week}</span>
          </div>
          <div className="space-y-6">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">{selectedMilestone.title}</h3>
              <p className="text-red-600 dark:text-red-400 font-medium tracking-wide uppercase text-xs flex items-center gap-2">
                <Baby className="w-3.5 h-3.5" /> Size of a {selectedMilestone.sizeDesc}
              </p>
            </div>
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl">{selectedMilestone.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {selectedMilestone.tips.map((tip, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white dark:bg-zinc-800 p-4 rounded-xl border border-zinc-100 dark:border-zinc-700 shadow-sm">
                  <Sparkles className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="grid gap-4 sm:gap-6">
      {PREGNANCY_MILESTONES.map((milestone) => (
        <div key={milestone.week} 
          className={`transition-all duration-300 bg-white dark:bg-zinc-900 border rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 items-center cursor-pointer group hover:border-red-600/30 dark:hover:border-red-500/30 shadow-sm ${selectedMilestone?.week === milestone.week ? 'border-red-600 dark:border-red-500 bg-red-50/10 dark:bg-red-900/10' : 'border-zinc-100 dark:border-zinc-800'}`}
          onClick={() => onSelectMilestone(milestone)}
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 dark:bg-red-900/20 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 border border-red-100 dark:border-red-900/40 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
            <span className="text-xl sm:text-2xl font-black text-red-600 dark:text-red-400">{milestone.week}</span>
          </div>
          <div className="flex-grow space-y-2 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">{milestone.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">At this stage, your baby is the size of a <span className="text-zinc-900 dark:text-zinc-100 font-medium">{milestone.sizeDesc}</span>.</p>
          </div>
          <button className="w-full md:w-auto px-6 py-3 bg-zinc-50 dark:bg-zinc-800 group-hover:bg-red-600 dark:group-hover:bg-red-500 group-hover:text-white transition-all rounded-xl text-sm font-bold text-zinc-600 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700">
            {selectedMilestone?.week === milestone.week ? 'Viewing' : 'View Details'}
          </button>
        </div>
      ))}
    </div>
  </div>
);

interface WellnessHubSectionProps {
  wellnessLogs: any[];
  onLog: (type: string, value: number) => void;
}

const WellnessCard = ({ icon: Icon, title, desc, color, value, onLog, options, showTotal }: any) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 hover:border-red-200 dark:hover:border-red-900/40 transition-colors group shadow-sm">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <button 
        onClick={() => !options && onLog()}
        className="p-2 bg-zinc-50 dark:bg-zinc-800 hover:bg-red-600 dark:hover:bg-red-500 text-zinc-400 dark:text-zinc-500 hover:text-white dark:hover:text-white rounded-xl transition-all active:scale-90 border border-zinc-100 dark:border-zinc-700"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
    <div>
      <h3 className="text-zinc-400 dark:text-zinc-500 text-[11px] font-black uppercase tracking-widest">{title}</h3>
      <p className="text-zinc-900 dark:text-white text-sm font-bold mt-1 line-clamp-1">{desc}</p>
      
      {showTotal ? (
        <p className="text-2xl font-black text-zinc-950 dark:text-white mt-2">{value || 0}</p>
      ) : (
        <div className="flex gap-1 mt-3">
          {options?.map((opt: any) => (
            <button
              key={opt.value}
              onClick={() => onLog(opt.value)}
              className={`flex-grow py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${
                value === opt.value 
                ? 'bg-red-600 text-white shadow-md shadow-red-600/20' 
                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white border border-zinc-100 dark:border-zinc-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  </div>
);

const WellnessHubSection: React.FC<WellnessHubSectionProps> = ({ wellnessLogs = [], onLog }) => {
  const todayHydration = (wellnessLogs || []).filter(l => {
    if (!l || l.type !== 'hydration' || !l.timestamp) return false;
    try {
      // Handle both ISO strings and Firestore Timestamps
      const logDate = typeof l.timestamp === 'string' 
        ? new Date(l.timestamp) 
        : (l.timestamp?.toDate ? l.timestamp.toDate() : new Date(l.timestamp));
      return !isNaN(logDate.getTime()) && logDate.toDateString() === new Date().toDateString();
    } catch (e) {
      return false;
    }
  }).length;

  return (
    <div className="space-y-8 sm:space-y-12">
      <div className="text-center space-y-3 sm:space-y-4">
        <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">Wellness Hub</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">Monitor your mood, hydration, and physical recovery. A healthy mother is the heart of a healthy family.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <WellnessCard
          icon={Smile}
          title="Mood"
          desc="How are you feeling?"
          color="text-yellow-500 dark:text-yellow-400"
          value={wellnessLogs.find((l: any) => l.type === 'mood')?.value}
          onLog={(val: number) => onLog('mood', val)}
          options={[
            { label: 'Happy', value: 3 },
            { label: 'Neutral', value: 2 },
            { label: 'Stressed', value: 1 }
          ]}
        />
        <WellnessCard
          icon={Droplets}
          title="Hydration"
          desc="Glasses of water"
          color="text-blue-500 dark:text-blue-400"
          value={todayHydration}
          onLog={() => onLog('hydration', 1)}
          showTotal
        />
        <WellnessCard
          icon={Moon}
          title="Sleep"
          desc="Quality last night"
          color="text-purple-500 dark:text-purple-400"
          value={wellnessLogs.find((l: any) => l.type === 'sleep')?.value}
          onLog={(val: number) => onLog('sleep', val)}
          options={[
            { label: 'Great', value: 3 },
            { label: 'Poor', value: 1 }
          ]}
        />
        <WellnessCard
          icon={Coffee}
          title="Recovery"
          desc="Energy levels"
          color="text-emerald-500 dark:text-emerald-400"
          value={wellnessLogs.find((l: any) => l.type === 'recovery')?.value}
          onLog={(val: number) => onLog('recovery', val)}
          options={[
            { label: 'Full', value: 3 },
            { label: 'Low', value: 1 }
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        <div className="bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 space-y-6 shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-3 text-zinc-950 dark:text-white"><Heart className="text-red-600 dark:text-red-500" /> Emotional Wellness</h3>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">Parenthood and caregiving can be overwhelming. Emotional adjustments are common, and it's okay to ask for support.</p>
            <div className="space-y-4">
                <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 flex items-center justify-between group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] dark:shadow-none">
                    <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-red-600 dark:text-red-500" />
                        <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">EPDS Questionnaire</p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest">Standard Clinical Tool</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />
                </div>
                <div className="p-4 bg-white dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700 flex items-center justify-between group cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-700/50 transition-colors shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] dark:shadow-none">
                    <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                        <div>
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">Contact a Counselor</p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-widest">Private & Confidential</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors" />
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 flex flex-col justify-center text-center space-y-4 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/5 dark:bg-red-500/10 blur-3xl rounded-full translate-y-16"></div>
            <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto relative z-10">
                <Sparkles className="w-8 h-8 text-red-600 dark:text-red-500" />
            </div>
            <h3 className="text-xl font-bold italic text-zinc-800 dark:text-zinc-200 relative z-10 leading-relaxed px-6">"You are doing an incredible job, mama. Remember to take five minutes just for yourself today."</h3>
        </div>
      </div>
    </div>
  );
};

const ExpertLibrary: React.FC = () => (
  <div className="space-y-8 sm:space-y-12">
    <div className="text-center space-y-3 sm:space-y-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">Expert Library</h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">Verified insights from leading pediatricians and counselors.</p>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
      {EXPERT_ARTICLES.filter(a => a.category === 'maternal' || a.category === 'pediatric').map(article => (
        <div key={article.id} className="group bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all cursor-pointer shadow-sm">
          <div className="w-full aspect-video bg-zinc-50 dark:bg-zinc-800 rounded-xl sm:rounded-2xl mb-4 sm:mb-6 flex items-center justify-center relative overflow-hidden border border-zinc-100 dark:border-zinc-700">
            <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-200 dark:text-zinc-700 z-10" />
            <div className="absolute inset-0 bg-red-500/5 dark:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest font-bold text-red-600 dark:text-red-400">{article.category}</span>
            <h4 className="font-bold text-base sm:text-lg mb-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors leading-tight text-zinc-900 dark:text-white">{article.title}</h4>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs sm:text-sm line-clamp-2">{article.excerpt}</p>
            <div className="pt-4 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-800 mt-2">
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">By {article.author}</span>
              <div className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400">
                Read <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const MotherHub: React.FC<MotherHubProps> = ({ activeSubTab }) => {
  const { user } = useAuth();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [wellnessLogs, setWellnessLogs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'wellnessLogs'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWellnessLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
        console.error("Wellness logs fetch error:", error);
    });
    return () => unsubscribe();
  }, [user]);

  const addWellnessLog = async (type: string, value: number, notes: string = '') => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'wellnessLogs'), {
        userId: user.uid,
        type,
        value,
        notes,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, 'wellnessLogs');
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 animate-fade-in px-4 sm:px-6">
      {activeSubTab === 'pregnancy' && <PregnancyJourney selectedMilestone={selectedMilestone} onSelectMilestone={setSelectedMilestone} />}
      {activeSubTab === 'maternal-health' && <WellnessHubSection wellnessLogs={wellnessLogs} onLog={addWellnessLog} />}
      {activeSubTab === 'expert-advice' && <ExpertLibrary />}
    </div>
  );
};

const CheckItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3 text-zinc-300 group cursor-default">
    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
    <span className="text-sm sm:text-base group-hover:text-white transition-colors">{text}</span>
  </li>
);


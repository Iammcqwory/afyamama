import React, { useState, useEffect } from 'react';
import { Baby as BabyIcon, Utensils, LayoutGrid, Timer, Droplets, Moon, CheckCircle2, ChevronDown, Plus, Activity, Heart } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot, limit, addDoc, updateDoc, doc } from 'firebase/firestore';
import { LogModal } from './LogModal';
import { formatDistanceToNow } from 'date-fns';
import { handleFirestoreError, OperationType } from '../services/firebase';

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

interface NutritionTask {
  id: string;
  foodName: string;
  status: 'to_try' | 'tried' | 'allergy';
  reaction?: string;
  triedAt?: string;
}

interface DailyRoutineProps {
  user: any;
  loading: boolean;
  babies: BabyData[];
  selectedBaby: BabyData | null;
  logs: LogEntry[];
  onAddLog: () => void;
}

const DailyRoutine: React.FC<DailyRoutineProps> = ({ user, loading, babies, selectedBaby, logs, onAddLog }) => {
  if (!user) return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-6 bg-red-50 dark:bg-red-900/10 rounded-full text-red-600 dark:text-red-500">
              <Heart className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">Sign in to track progress</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">Securely log your baby's nutrition, sleep, and milestones.</p>
      </div>
  );

  if (loading) return <div className="text-center py-20 animate-pulse text-zinc-400 dark:text-zinc-600">Loading your data...</div>;

  if (babies.length === 0) return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-full text-zinc-400 dark:text-zinc-600">
              <Plus className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">No baby profiles found</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">Create a profile from the home dashboard to start tracking.</p>
      </div>
  );

  const lastFeeding = logs.find(l => l.type === 'feeding');
  const lastDiaper = logs.find(l => l.type === 'diaper');
  const lastSleep = logs.find(l => l.type === 'sleep');

  return (
      <div className="space-y-8 sm:space-y-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
               <div className="flex items-center justify-center sm:justify-start gap-2 text-red-500 dark:text-red-400 mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Real-time Tracker</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 dark:text-white">Daily Routine</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Log and monitor your baby's vitals.</p>
          </div>
          
          <div className="flex items-center gap-3">
              <div className="relative group">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors shadow-sm">
                      <BabyIcon className="w-4 h-4 text-red-600 dark:text-red-500" />
                      <span className="text-zinc-900 dark:text-zinc-100">{selectedBaby?.name}</span>
                      <ChevronDown className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
                  </button>
              </div>
              <button 
                onClick={onAddLog}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-red-600/20"
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
          <h3 className="text-xl font-bold bg-zinc-50 dark:bg-zinc-800 p-4 rounded-xl border border-zinc-100 dark:border-zinc-700 inline-block text-zinc-950 dark:text-white">Recent Activity</h3>
          <div className="space-y-3">
              {logs.length > 0 ? logs.map(log => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group shadow-sm">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-zinc-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                              {log.type === 'feeding' && <Droplets className="w-5 h-5 text-blue-500 dark:text-blue-400" />}
                              {log.type === 'diaper' && <Timer className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />}
                              {log.type === 'sleep' && <Moon className="w-5 h-5 text-purple-500 dark:text-purple-400" />}
                              {log.type === 'milestone' && <Activity className="w-5 h-5 text-red-600 dark:text-red-500" />}
                          </div>
                          <div>
                              <h4 className="text-sm font-bold text-zinc-900 dark:text-white capitalize">{log.type}</h4>
                              <p className="text-xs text-zinc-500 dark:text-zinc-400">{log.notes || 'No notes added'}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <p className="text-[10px] font-black uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                          </p>
                      </div>
                  </div>
              )) : (
                  <div className="text-center py-12 bg-white dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                      <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">No recent activity logged for this baby.</p>
                  </div>
              )}
          </div>
        </div>
      </div>
  );
};

const MilestoneChecklist: React.FC = () => (
  <div className="space-y-8 sm:space-y-12">
    <div className="text-center space-y-3 sm:space-y-4">
      <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white">Milestones</h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base">Standard developmental checks for your child's age.</p>
    </div>
    <div className="max-w-3xl mx-auto space-y-6 sm:space-y-8">
      <MilestoneSection age="4 Months" items={["Pushes up on arms during tummy time", "Makes sounds when spoken to", "Opens mouth when hungry", "Holds head steady"]} />
      <MilestoneSection age="6 Months" items={["Rolls from tummy to back", "Recognizes familiar faces", "Blows 'raspberries' with lips", "Starts to sit without support"]} />
      <MilestoneSection age="9 Months" items={["Sits without support for long periods", "Moves things from one hand to another", "Looks for objects when dropped", "Copies sounds and gestures updates"]} />
      <MilestoneSection age="12 Months" items={["Pulls up to stand", "Walks holding on to furniture", "Says 'mama' or 'dada'", "Uses simple gestures like waving"]} />
    </div>
  </div>
);

interface NutritionTrackerProps {
  nutritionLog: NutritionTask[];
  onToggleFood: (food: string) => void;
  firstFoods: string[];
}

const NutritionTracker: React.FC<NutritionTrackerProps> = ({ nutritionLog, onToggleFood, firstFoods }) => (
  <div className="space-y-8 sm:space-y-12">
    <div className="text-center space-y-3 sm:space-y-4">
      <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">Nutrition & Solids</h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">Track "First Foods" and identify potential allergies early. Recommendations follow global pediatric standards.</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 sm:p-10 space-y-8 shadow-sm">
              <div className="flex items-center justify-between">
                  <div className="space-y-1">
                      <h3 className="text-xl font-bold text-zinc-950 dark:text-white">First Foods Checklist</h3>
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Click to cycle: To Try → Tried → Allergy</p>
                  </div>
                  <Utensils className="w-6 h-6 text-orange-500 dark:text-orange-400" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {firstFoods.map((food) => {
                      const status = nutritionLog.find(t => t.foodName === food)?.status || 'to_try';
                      return (
                          <button
                              key={food}
                              onClick={() => onToggleFood(food)}
                              className={`flex items-center justify-between p-5 rounded-2xl border transition-all active:scale-95 text-left group ${
                                  status === 'tried' ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30' : 
                                  status === 'allergy' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30' : 
                                  'bg-zinc-50 dark:bg-zinc-800 border-zinc-100 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500'
                              }`}
                          >
                              <div className="flex items-center gap-3">
                                  <div className={`w-2 h-2 rounded-full ${
                                      status === 'tried' ? 'bg-emerald-500' : 
                                      status === 'allergy' ? 'bg-red-600' : 
                                      'bg-zinc-300 dark:bg-zinc-600'
                                  }`} />
                                  <span className={`text-[13px] font-bold ${status === 'to_try' ? 'text-zinc-500 dark:text-zinc-400' : 'text-zinc-950 dark:text-white'}`}>{food}</span>
                              </div>
                              {status === 'tried' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                              {status === 'allergy' && <Activity className="w-4 h-4 text-red-600" />}
                          </button>
                      );
                  })}
              </div>
          </div>
      </div>

      <div className="space-y-6">
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-[2rem] p-8 space-y-6 shadow-sm">
              <div className="w-12 h-12 bg-red-600 dark:bg-red-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-red-600/20">
                  <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                  <h3 className="text-xl font-bold text-zinc-950 dark:text-white">Allergy Alerts</h3>
                  <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed">
                      Foods marked as <span className="text-red-600 dark:text-red-400 font-bold uppercase">Allergy</span> will be flagged in your baby's digital health record.
                  </p>
              </div>
              <div className="space-y-3">
                  {nutritionLog.filter(t => t.status === 'allergy').length > 0 ? (
                      nutritionLog.filter(t => t.status === 'allergy').map(item => (
                          <div key={item.id} className="p-3 bg-white dark:bg-zinc-800 rounded-xl border border-red-100 dark:border-red-900/30 flex items-center justify-between shadow-sm">
                              <span className="text-[12px] font-bold text-red-600 dark:text-red-400">{item.foodName}</span>
                              <span className="text-[9px] font-black uppercase text-red-400 dark:text-red-500">Reaction Logged</span>
                          </div>
                      ))
                  ) : (
                      <div className="py-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white/50 dark:bg-zinc-900/50">
                           <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">No Alerts</p>
                      </div>
                  )}
              </div>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-[2rem] p-8 space-y-4 shadow-sm">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">Pro Tip</h4>
              <p className="text-zinc-600 dark:text-zinc-300 text-sm italic font-medium leading-relaxed">
                  "Wait 3-5 days between introducing new high-allergen foods to monitor for reactions like hives, swelling, or respiratory issues."
              </p>
          </div>
      </div>
    </div>
  </div>
);

export const BabyHub: React.FC<BabyHubProps> = ({ activeSubTab }) => {
  const { user } = useAuth();
  const [babies, setBabies] = useState<BabyData[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<BabyData | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [nutritionLog, setNutritionLog] = useState<NutritionTask[]>([]);
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
    }, (error) => {
        handleFirestoreError(error, OperationType.LIST, 'babies');
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
    }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `babies/${selectedBaby.id}/logs`);
    });
    return () => unsubscribe();
  }, [selectedBaby]);

  useEffect(() => {
    if (!selectedBaby) return;
    const q = query(collection(db, `babies/${selectedBaby.id}/nutritionLog`));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNutritionLog(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NutritionTask)));
    }, (error) => {
        handleFirestoreError(error, OperationType.LIST, `babies/${selectedBaby.id}/nutritionLog`);
    });
    return () => unsubscribe();
  }, [selectedBaby]);

  const toggleFoodStatus = async (foodName: string) => {
    if (!selectedBaby) return;
    const existing = nutritionLog.find(t => t.foodName === foodName);
    const currentStatus = existing?.status || 'to_try';
    const nextStatus = currentStatus === 'to_try' ? 'tried' : currentStatus === 'tried' ? 'allergy' : 'to_try';
    
    try {
      if (existing) {
        await updateDoc(doc(db, `babies/${selectedBaby.id}/nutritionLog`, existing.id), {
          status: nextStatus,
          triedAt: nextStatus === 'tried' ? new Date().toISOString() : null
        });
      } else {
        await addDoc(collection(db, `babies/${selectedBaby.id}/nutritionLog`), {
          babyId: selectedBaby.id,
          foodName,
          status: nextStatus,
          triedAt: nextStatus === 'tried' ? new Date().toISOString() : null
        });
      }
    } catch (error) {
       handleFirestoreError(error, OperationType.WRITE, `babies/${selectedBaby.id}/nutritionLog`);
    }
  };

  const firstFoods = [
    "Avocado", "Sweet Potato", "Banana", "Apple Purée", "Iron-fortified Cereal", 
    "Peanut Butter (Diluted)", "Egg (Cooked)", "Greek Yogurt"
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 animate-fade-in px-4 sm:px-6">
      <LogModal 
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        babyId={selectedBaby?.id || ''}
        onSuccess={() => {}}
      />
      {activeSubTab === 'baby-tracker' && (
        <DailyRoutine 
          user={user} 
          loading={loading} 
          babies={babies} 
          selectedBaby={selectedBaby} 
          logs={logs} 
          onAddLog={() => setIsLogModalOpen(true)} 
        />
      )}
      {activeSubTab === 'development' && <MilestoneChecklist />}
      {activeSubTab === 'nutrition' && (
        <NutritionTracker 
          nutritionLog={nutritionLog} 
          onToggleFood={toggleFoodStatus} 
          firstFoods={firstFoods} 
        />
      )}
      {activeSubTab === 'feeding-sleep' && (
        <DailyRoutine 
          user={user} 
          loading={loading} 
          babies={babies} 
          selectedBaby={selectedBaby} 
          logs={logs} 
          onAddLog={() => setIsLogModalOpen(true)} 
        />
      )}
    </div>
  );
};

const TrackerCard = ({ icon: Icon, color, title, value, sub }: any) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-4 hover:border-red-200 dark:hover:border-red-900/40 transition-colors shadow-sm">
    <div className="flex items-center justify-between">
      <div className={`p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300 dark:text-zinc-600">Active</span>
    </div>
    <div>
      <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-bold">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-zinc-950 dark:text-white">{value}</span>
      </div>
      <p className="text-zinc-400 dark:text-zinc-500 text-[10px] uppercase font-bold tracking-wider mt-1">{sub}</p>
    </div>
  </div>
);

const MilestoneSection = ({ age, items }: { age: string, items: string[] }) => (
  <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-white">{age} Milestones</h3>
      <div className="px-3 py-1 bg-red-600 dark:bg-red-500 text-white text-[9px] sm:text-[10px] font-black rounded-full uppercase shrink-0">Standard</div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-100 dark:border-zinc-700">
          <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span className="text-zinc-600 dark:text-zinc-300 text-[13px] sm:text-sm leading-tight">{item}</span>
        </div>
      ))}
    </div>
  </div>
);

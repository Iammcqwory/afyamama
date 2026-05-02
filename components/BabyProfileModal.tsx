import React, { useState } from 'react';
import { X, Calendar, User, Heart, Users, Shield, Plus, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

interface BabyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CAREGIVER_ROLES = [
  { id: 'mother', label: 'Mother', icon: Heart },
  { id: 'father', label: 'Father', icon: User },
  { id: 'guardian', label: 'Guardian', icon: Shield },
  { id: 'helper', label: 'Helper / Nanny', icon: Users },
  { id: 'healthcare_worker', label: 'Health Worker', icon: Plus },
  { id: 'other', label: 'Other', icon: Users },
];

const FAMILY_TYPES = [
  { id: 'couple', label: 'Couple' },
  { id: 'single_parent', label: 'Single Parent' },
  { id: 'kinship', label: 'Kinship Care' },
  { id: 'orphan_hub', label: 'Guardian/Orphan' },
];

export const BabyProfileModal: React.FC<BabyProfileModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | 'other'>('boy');
  const [role, setRole] = useState('mother');
  const [familyType, setFamilyType] = useState('couple');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // 1. Update user profile
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        role,
        familyType,
        onboardingCompleted: true,
        updatedAt: serverTimestamp()
      });

      // 2. Create baby profile
      await addDoc(collection(db, 'babies'), {
        ownerId: user.uid,
        name,
        birthDate,
        gender,
        createdAt: serverTimestamp()
      });

      onSuccess();
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'profile_creation');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-6">
                <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-zinc-500" />
                </button>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 1 ? 'bg-red-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}></div>
                  <div className={`h-1.5 w-12 rounded-full transition-all ${step >= 2 ? 'bg-red-500' : 'bg-zinc-200 dark:bg-zinc-800'}`}></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">Step {step} of 2</span>
              </div>

              {step === 1 ? (
                <div className="space-y-8 animate-fade-in">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">Your Identity</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Help us personalize your experience based on your role.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                        <User className="w-3 h-3" />
                        Who are you?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {CAREGIVER_ROLES.map((r) => {
                          const Icon = r.icon;
                          return (
                            <button
                              key={r.id}
                              onClick={() => setRole(r.id)}
                              className={`flex items-center gap-3 p-4 rounded-2xl border text-left transition-all ${
                                role === r.id 
                                  ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-white shadow-lg shadow-red-500/5' 
                                  : 'bg-zinc-50/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700'
                              }`}
                            >
                              <div className={`p-2 rounded-lg ${role === r.id ? 'bg-red-500/20 text-red-600 dark:text-red-500' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className="text-sm font-bold">{r.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        Family Context
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {FAMILY_TYPES.map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setFamilyType(f.id)}
                            className={`p-3 rounded-xl border text-[11px] font-black uppercase tracking-widest transition-all ${
                              familyType === f.id 
                                ? 'bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-white' 
                                : 'bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-700'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setStep(2)}
                    className="w-full bg-zinc-950 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-95 shadow-xl dark:shadow-none"
                  >
                    Next Step
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-8 animate-fade-in">
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black tracking-tight text-zinc-950 dark:text-white">Baby's Details</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">Information to help MamaBora track health and milestones.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                        <input 
                          required
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Baby's name"
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-red-500/50 transition-all font-bold placeholder:text-zinc-300 dark:placeholder:text-zinc-700 placeholder:font-medium shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">Birth / Due Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
                        <input 
                          required
                          type="date" 
                          value={birthDate}
                          onChange={(e) => setBirthDate(e.target.value)}
                          className="w-full bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-zinc-800 dark:text-zinc-300 focus:outline-none focus:border-red-500/50 transition-all font-bold shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500 ml-1">Gender</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['boy', 'girl', 'other'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g as any)}
                            className={`py-4 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all shadow-sm ${
                              gender === g 
                                ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-500' 
                                : 'bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 hover:border-zinc-300 dark:hover:border-zinc-700'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="p-5 bg-white dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 rounded-2xl border border-zinc-200 dark:border-zinc-800 hover:text-zinc-950 dark:hover:text-white transition-all shadow-sm"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                      </button>
                      <button 
                        disabled={isSubmitting}
                        type="submit"
                        className="flex-grow bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-600/20 flex items-center justify-center gap-3 active:scale-95"
                      >
                        {isSubmitting ? 'Syncing...' : (
                          <>
                              <Heart className="w-5 h-5" />
                              Finish Setup
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

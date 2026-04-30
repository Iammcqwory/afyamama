import React, { useState } from 'react';
import { X, Droplets, Timer, Moon, Activity, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  babyId: string;
  onSuccess: () => void;
}

export const LogModal: React.FC<LogModalProps> = ({ isOpen, onClose, babyId, onSuccess }) => {
  const [type, setType] = useState<'feeding' | 'diaper' | 'sleep' | 'growth' | 'milestone'>('feeding');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!babyId) return;

    setIsSubmitting(true);
    const path = `babies/${babyId}/logs`;
    try {
      await addDoc(collection(db, path), {
        babyId,
        type,
        notes,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp(),
        data: {} // Could extend for specific fields
      });
      onSuccess();
      onClose();
      setNotes('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const types = [
    { id: 'feeding', icon: Droplets, label: 'Feeding' },
    { id: 'diaper', icon: Timer, label: 'Diaper' },
    { id: 'sleep', icon: Moon, label: 'Sleep' },
    { id: 'milestone', icon: Activity, label: 'Milestone' }
  ];

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
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl"
          >
            <div className="absolute top-0 right-0 p-4">
                <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-500" />
                </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white">Log Activity</h2>
                <p className="text-zinc-500 text-sm">Add an entry to your baby's tracker.</p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {types.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id as any)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${
                        type === t.id 
                        ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                        : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'
                    }`}
                  >
                    <t.icon className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase">{t.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Notes</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe specific details..."
                    rows={3}
                    className="w-full bg-black border border-zinc-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-red-500/50 transition-all resize-none"
                  />
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Logging...' : (
                    <>
                        <Plus className="w-4 h-4" />
                        Add Log Entry
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

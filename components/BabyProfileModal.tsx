import React, { useState } from 'react';
import { X, Calendar, User, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../AuthContext';

interface BabyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BabyProfileModal: React.FC<BabyProfileModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl' | 'other'>('boy');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    const path = 'babies';
    try {
      await addDoc(collection(db, path), {
        ownerId: user.uid,
        name,
        birthDate,
        gender,
        createdAt: serverTimestamp()
      });
      onSuccess();
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
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
            className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
                <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
                    <X className="w-5 h-5 text-zinc-500" />
                </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">New Baby Profile</h2>
                <p className="text-zinc-500 text-sm">Fill in the details to unlock personalized insights.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Baby's name"
                      className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Birth / Due Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input 
                      required
                      type="date" 
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-red-500/50 transition-all text-zinc-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['boy', 'girl', 'other'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g as any)}
                        className={`py-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                          gender === g 
                            ? 'bg-red-500/10 border-red-500/30 text-red-500' 
                            : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-700'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? 'Creating...' : (
                    <>
                        <Heart className="w-4 h-4" />
                        Create Profile
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

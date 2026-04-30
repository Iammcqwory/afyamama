import React from 'react';
import { Logo } from './Logo';
import { BotIcon } from './icons';

interface HomePageProps {
  onStart: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-brand-light flex flex-col items-center justify-center p-6 text-stone-800 font-sans">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-brand-light ring-4 ring-brand-light/50">
        <div className="bg-brand-DEFAULT p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
            <div className="bg-white w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-lg mb-4 relative z-10">
                <Logo className="w-28 h-28" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-wide relative z-10">MAMABORA</h1>
            <p className="text-brand-light opacity-90 text-sm font-medium tracking-wider uppercase mt-1 relative z-10">Pediatric AI Assistant</p>
        </div>
        
        <div className="p-8 space-y-8">
            <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-stone-800">Caring for your little one?</h2>
                <p className="text-stone-600 leading-relaxed">
                    Get instant, AI-powered guidance on symptoms, home care advice, and alerts for when to see a doctor.
                </p>
            </div>

            <div className="space-y-3">
                <FeatureItem text="Symptom Assessment" />
                <FeatureItem text="Home Care Guidance" />
                <FeatureItem text="Red Flag Identification" />
            </div>

            <button 
                onClick={onStart}
                className="w-full bg-brand-DEFAULT text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-brand-dark hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 group"
                aria-label="Start consultation with MamaB AI assistant"
            >
                <BotIcon className="w-6 h-6 text-brand-light group-hover:animate-bounce" />
                <span>Start Consultation</span>
            </button>
            
            <p className="text-xs text-center text-stone-600 leading-tight">
                Not a substitute for professional medical advice. <br/>In emergencies, contact emergency services immediately.
            </p>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-center gap-3 bg-stone-50 p-3 rounded-lg border border-stone-100">
        <div className="w-2 h-2 rounded-full bg-brand-DEFAULT flex-shrink-0" aria-hidden="true" />
        <span className="font-medium text-stone-700">{text}</span>
    </div>
);

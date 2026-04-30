import React from 'react';
import { CalendarDays, Heart, Sparkles, ChevronRight, CheckCircle2, BookOpen } from 'lucide-react';

interface MotherHubProps {
  activeSubTab: string;
}

export const MotherHub: React.FC<MotherHubProps> = ({ activeSubTab }) => {
  const renderPregnancy = () => (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Pregnancy Journey</h2>
        <p className="text-zinc-500">Your week-by-week guide to a healthy pregnancy.</p>
      </div>
      <div className="grid gap-6">
        {[12, 20, 28, 36].map((week) => (
          <div key={week} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center shrink-0 border border-red-500/20">
              <span className="text-2xl font-black text-red-500">{week}</span>
            </div>
            <div className="flex-grow space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold">Week {week}: {week === 12 ? 'The First Milestone' : week === 20 ? 'Halfway There' : week === 28 ? 'Third Trimester' : 'Getting Ready'}</h3>
              <p className="text-zinc-400">At this stage, your baby is the size of a {week === 12 ? 'lime' : week === 20 ? 'banana' : week === 28 ? 'eggplant' : 'watermelon'}.</p>
            </div>
            <button className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-bold transition-all">View Details</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Maternal Well-being</h2>
        <p className="text-zinc-500">Prioritizing your physical and mental health postpartum.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3"><Heart className="text-red-500" /> Physical Recovery</h3>
          <ul className="space-y-4">
            <CheckItem text="Healing milestones checklist" />
            <CheckItem text="Gentle postpartum exercises" />
            <CheckItem text="Nutrition for nursing mothers" />
          </ul>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-[2.5rem] p-10 space-y-6">
          <h3 className="text-2xl font-bold flex items-center gap-3"><Sparkles className="text-red-500" /> Mental Health</h3>
          <ul className="space-y-4">
            <CheckItem text="Recognizing baby blues vs PPD" />
            <CheckItem text="Guided meditation for sleep" />
            <CheckItem text="Finding your support village" />
          </ul>
        </div>
      </div>
    </div>
  );

  const renderExpert = () => (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold">Expert Library</h2>
        <p className="text-zinc-500">Verified insights from leading pediatricians and counselors.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="group bg-zinc-900/30 border border-zinc-800 rounded-3xl p-6 hover:bg-zinc-800/50 transition-all cursor-pointer">
            <div className="w-full aspect-video bg-zinc-800 rounded-2xl mb-6 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-zinc-700" />
            </div>
            <h4 className="font-bold text-lg mb-2 group-hover:text-red-500 transition-colors">Understanding Infant Sleep Cycles</h4>
            <p className="text-zinc-500 text-sm mb-4">Dr. Sarah Jenkins explains why babies wake up at night and how to cope.</p>
            <div className="flex items-center gap-2 text-xs font-bold text-red-500">
              Read Article <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto py-10 animate-fade-in">
      {activeSubTab === 'pregnancy' && renderPregnancy()}
      {activeSubTab === 'maternal-health' && renderHealth()}
      {activeSubTab === 'expert-advice' && renderExpert()}
    </div>
  );
};

const CheckItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3 text-zinc-300">
    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
    <span>{text}</span>
  </li>
);

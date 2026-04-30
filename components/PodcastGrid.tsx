import React from 'react';
import { Play, Calendar, Clock, Headphones } from 'lucide-react';

export const PodcastGrid: React.FC = () => {
  const podcasts = [
    { title: "First-Time Mom Essentials", desc: "Everything you need to know before your baby arrives", time: "32 min", date: "Dec 20, 2025", emoji: "🎙️" },
    { title: "Sleep Training Without Tears", desc: "Gentle methods to help your baby sleep through the night", time: "28 min", date: "Dec 18, 2025", emoji: "😴" },
    { title: "Postpartum Recovery Journey", desc: "Real talk about healing after childbirth", time: "45 min", date: "Dec 15, 2025", emoji: "💪" },
    { title: "Breastfeeding Basics", desc: "Tips and tricks from lactation consultants", time: "38 min", date: "Dec 12, 2025", emoji: "🤱" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16 animate-fade-in py-6 sm:py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center space-y-4 sm:space-y-6">
        <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500">
          <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-extrabold text-[10px] sm:text-sm uppercase tracking-wider">Mamabora Podcast</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">Listen & Learn</h1>
        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Expert advice, real stories, and practical tips for your parenting journey
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {podcasts.map((pod, i) => (
          <div key={i} className="group bg-zinc-900/50 border border-zinc-800/80 rounded-2xl sm:rounded-[2.5rem] p-6 sm:p-8 hover:border-red-500/40 transition-all cursor-pointer flex flex-col xs:flex-row items-center sm:items-start gap-6 sm:gap-8 hover:bg-zinc-800/40 relative overflow-hidden shadow-lg">
            <div className="shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-zinc-800 rounded-2xl sm:rounded-3xl flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-105 transition-transform duration-300">
              {pod.emoji}
            </div>
            <div className="flex-grow space-y-2 sm:space-y-3 text-center xs:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">{pod.title}</h3>
              <p className="text-zinc-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">{pod.desc}</p>
              <div className="flex items-center justify-center xs:justify-start gap-4 sm:gap-5 text-[10px] sm:text-xs font-medium text-zinc-500">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {pod.time}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> {pod.date}</span>
              </div>
            </div>
            <div className="p-3 sm:p-4 bg-zinc-800/80 rounded-full group-hover:bg-red-500 group-hover:text-white transition-all transform group-hover:translate-x-1 shrink-0">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            </div>
          </div>
        ))}
      </div>

      {/* CTA Footer Section */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl sm:rounded-[3rem] p-8 sm:p-16 md:p-20 text-center space-y-6 sm:space-y-8 shadow-inner shadow-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-30"></div>
        <div className="flex justify-center">
          <div className="p-4 sm:p-6 bg-red-500/10 rounded-2xl sm:rounded-3xl border border-red-500/20">
            <Headphones className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">Coming Soon!</h2>
          <p className="text-zinc-500 max-w-sm mx-auto text-base sm:text-lg leading-relaxed">
            We're working on bringing you more episodes. Subscribe to get notified!
          </p>
        </div>
        <button className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-3.5 sm:py-4 px-10 sm:px-12 rounded-xl sm:rounded-2xl transition-all active:scale-95 shadow-xl shadow-red-500/20 text-base sm:text-lg">
          Subscribe to Podcast
        </button>
      </div>
    </div>
  );
};

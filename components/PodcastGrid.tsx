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
    <div className="max-w-6xl mx-auto space-y-16 animate-fade-in py-8">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-brand/10 border border-brand/20 rounded-full text-brand">
          <Headphones className="w-5 h-5" />
          <span className="font-extrabold text-sm uppercase tracking-wider">Mamabora Podcast</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">Listen & Learn</h1>
        <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Expert advice, real stories, and practical tips for your parenting journey
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {podcasts.map((pod, i) => (
          <div key={i} className="group bg-zinc-900/50 border border-zinc-800/80 rounded-[2.5rem] p-8 hover:border-brand/40 transition-all cursor-pointer flex items-center gap-8 hover:bg-zinc-800/40 relative overflow-hidden">
            <div className="shrink-0 w-20 h-20 bg-zinc-800 rounded-3xl flex items-center justify-center text-4xl group-hover:scale-105 transition-transform duration-300">
              {pod.emoji}
            </div>
            <div className="flex-grow space-y-3">
              <h3 className="text-2xl font-bold text-white group-hover:text-brand transition-colors">{pod.title}</h3>
              <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{pod.desc}</p>
              <div className="flex items-center gap-5 text-xs font-medium text-zinc-500">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {pod.time}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {pod.date}</span>
              </div>
            </div>
            <div className="p-4 bg-zinc-800/80 rounded-full group-hover:bg-brand group-hover:text-white transition-all transform group-hover:translate-x-1">
              <Play className="w-5 h-5 fill-current" />
            </div>
          </div>
        ))}
      </div>

      {/* CTA Footer Section */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-20 text-center space-y-8 shadow-inner shadow-black relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand to-transparent opacity-30"></div>
        <div className="flex justify-center">
          <div className="p-6 bg-brand/10 rounded-3xl border border-brand/20">
            <Headphones className="w-12 h-12 text-brand" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold text-white">Coming Soon!</h2>
          <p className="text-zinc-500 max-w-md mx-auto text-lg leading-relaxed">
            We're working on bringing you more episodes. Subscribe to get notified!
          </p>
        </div>
        <button className="bg-brand hover:bg-brand-dark text-white font-bold py-4 px-12 rounded-2xl transition-all active:scale-95 shadow-xl shadow-brand/20 text-lg">
          Subscribe to Podcast
        </button>
      </div>
    </div>
  );
};

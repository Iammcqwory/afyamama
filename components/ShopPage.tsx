import React, { useState } from 'react';
import { ShoppingBag, Sparkles, Bike, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export const ShopPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const pillars = [
    {
      icon: ShieldCheck,
      title: "Founder Vetted",
      desc: "Every product in our curated collection is personally tested and approved by our medical advisory team."
    },
    {
      icon: Bike,
      title: "Zero-Emission Fulfilment",
      desc: "Partnering with SENDU for carbon-neutral, reliable last-mile delivery across Nairobi."
    },
    {
      icon: Sparkles,
      title: "Quality Over Quantity",
      desc: "No generic marketplace noise. Just the 15 essential items every Nairobi caregiver needs."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 sm:py-20 space-y-24 animate-fade-in px-4 sm:px-6">
      {/* Hero Teaser */}
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-400 dark:text-zinc-500 shadow-sm"
        >
          <ShoppingBag className="w-4 h-4 text-red-600 dark:text-red-500" />
          <span className="font-black text-[10px] uppercase tracking-[0.3em]">The Curated Essentials</span>
        </motion.div>
        
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tighter text-zinc-950 dark:text-white leading-[1.1]">
          Trust shouldn't be a <span className="text-red-600 dark:text-red-500 italic">purchase option.</span>
        </h1>
        
        <p className="text-zinc-500 dark:text-zinc-400 text-lg sm:text-xl font-medium leading-relaxed">
          We are currently building a supply chain based on quality, not volume. 
          The MamaBora shop will launch with a tight, medically-vetted catalog delivered by our electric fleet.
        </p>

        <div className="pt-6">
          {subscribed ? (
            <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/40 p-6 rounded-3xl animate-slide-up">
              <p className="text-emerald-700 dark:text-emerald-400 font-bold">You're on the list! We'll notify you when the first curation drops.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input 
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-6 py-4 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-red-600/50 transition-all font-medium shadow-sm"
              />
              <button 
                onClick={() => setSubscribed(true)}
                className="bg-zinc-950 dark:bg-white text-white dark:text-black font-black uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-zinc-900 dark:hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-zinc-950/20 dark:shadow-none"
              >
                Notify Me
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
          <p className="text-[10px] text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-widest mt-4">JOIN 1,400+ GUARDIANS ON THE WAITLIST</p>
        </div>
      </div>

      {/* Philosophy Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pillars.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[3rem] space-y-6 hover:border-red-600/20 dark:hover:border-red-600/40 transition-all group shadow-sm hover:shadow-xl"
            >
              <div className="w-14 h-14 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-red-50 dark:group-hover:bg-red-900/40 transition-all duration-500 shadow-inner">
                <Icon className="w-6 h-6 text-zinc-400 dark:text-zinc-500 group-hover:text-red-600 dark:group-hover:text-red-400" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">{p.title}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed font-medium">{p.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Vision Statement */}
      <div className="relative group overflow-hidden rounded-[3.5rem] bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-12 sm:p-24 text-center shadow-inner">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/5 dark:bg-red-600/10 blur-[120px] pointer-events-none group-hover:bg-red-600/10 Transition-all duration-1000"></div>
        
        <div className="relative space-y-6 max-w-2xl mx-auto">
          <Mail className="w-10 h-10 text-red-600 dark:text-red-400 mx-auto opacity-30" />
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950 dark:text-white italic">"We aren't building just another store. We are building a trust protocol for Nairobi families."</h2>
          <div className="pt-4">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 dark:text-zinc-500">MAMABORA X SENDU LOGISTICS</p>
          </div>
        </div>
      </div>
    </div>
  );
};


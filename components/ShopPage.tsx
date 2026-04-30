import React from 'react';
import { ShoppingBag, Star, Heart, ArrowRight } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const products = [
    { name: "Organic Cotton Swaddle", price: "$24.00", rating: "4.9", category: "Apparel" },
    { name: "No-Touch Thermometer", price: "$45.99", rating: "4.8", category: "Health" },
    { name: "Premium Diaper Bag", price: "$89.00", rating: "4.9", category: "Travel" },
    { name: "Silicone Feeding Set", price: "$32.50", rating: "4.7", category: "Nutrition" },
    { name: "Eco-Friendly Wet Wipes", price: "$12.00", rating: "4.6", category: "Hygiene" },
    { name: "Smart Baby Monitor", price: "$199.00", rating: "5.0", category: "Safety" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-12 sm:space-y-16 animate-fade-in px-4 sm:px-6">
      <div className="text-center space-y-4 sm:space-y-6">
        <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="font-extrabold text-[10px] sm:text-sm uppercase tracking-wider">Mamabora Curated Shop</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">The Essentials</h1>
        <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Every product is reviewed by our pediatric safety specialists for your peace of mind.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {products.map((product, i) => (
          <div key={i} className="group bg-zinc-900/50 border border-zinc-800/80 rounded-2xl sm:rounded-[2.5rem] overflow-hidden hover:border-red-500/40 transition-all flex flex-col shadow-lg">
            <div className="aspect-square bg-zinc-800 flex items-center justify-center p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                    <button className="p-2 sm:p-3 bg-zinc-900/80 rounded-full hover:text-red-500 transition-colors">
                        <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </div>
                <ShoppingBag className="w-16 h-16 sm:w-24 sm:h-24 text-zinc-700 opacity-20 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="p-6 sm:p-8 space-y-4 flex-grow flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{product.category}</span>
                    <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                        <span className="text-[9px] sm:text-[10px] font-bold">{product.rating}</span>
                    </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-500 transition-colors">{product.name}</h3>
                <p className="text-xl sm:text-2xl font-black text-white mt-1 sm:mt-2">{product.price}</p>
              </div>
              <button className="w-full py-3.5 sm:py-4 bg-zinc-800 hover:bg-red-500 text-white rounded-xl sm:rounded-2xl font-bold transition-all flex items-center justify-center gap-2 group/btn mt-4">
                Add to Cart
                <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 -translate-x-2 group-hover/btn:translate-x-0 transition-all" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl sm:rounded-[3rem] p-8 sm:p-16 text-center space-y-4 sm:space-y-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 sm:w-64 sm:h-64 bg-red-500/5 blur-[80px] sm:blur-[100px] pointer-events-none"></div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Trust the Mamabora Standard</h2>
        <p className="text-zinc-500 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            We partner with ethical brands to bring you products that are safe, sustainable, and effective for your family.
        </p>
      </div>
    </div>
  );
};

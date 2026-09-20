import React, { useState, useEffect } from 'react';
import { Scissors, Sparkles, Palette, Wand2, Hammer } from 'lucide-react';

const CRAFTING_QUOTES = [
  "Weaving your materials into creative masterpieces...",
  "Upcycling household items into stunning DIY art...",
  "Formulating kid-safe, step-by-step instructions...",
  "Measuring twice, cutting once, crafting forever...",
  "Transforming ordinary recyclables into treasures...",
  "Designing eco-friendly home decor just for you..."
];

export const LoadingSkeleton: React.FC = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % CRAFTING_QUOTES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Central Animated Loader */}
      <div className="text-center space-y-4">
        <div className="relative inline-flex items-center justify-center">
          
          {/* Glowing pulse ring */}
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500/30 via-rose-500/30 to-violet-600/30 blur-xl animate-pulse" />

          {/* Animated Craft Tools Icon */}
          <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-rose-500/25">
            <Scissors className="w-8 h-8 animate-bounce" />
          </div>

          <Sparkles className="w-5 h-5 text-amber-400 absolute -top-1 -right-1 animate-spin" />
        </div>

        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <span>Generating DIY Craft Ideas</span>
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </span>
          </h3>

          <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mt-2 h-6 transition-all duration-300">
            {CRAFTING_QUOTES[quoteIndex]}
          </p>
        </div>
      </div>

      {/* Shimmer Placeholder Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="rounded-3xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 p-6 space-y-4 shadow-sm relative overflow-hidden"
          >
            {/* Shimmer effect overlay */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/40 dark:via-slate-800/40 to-transparent" />

            <div className="flex items-center justify-between">
              <div className="w-20 h-5 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>

            <div className="w-3/4 h-7 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            <div className="w-full h-14 rounded-xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />

            <div className="flex gap-2">
              <div className="w-16 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
              <div className="w-20 h-6 rounded-lg bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="w-full h-10 rounded-xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

import React from 'react';
import { Sparkles, ArrowRight, Wand2, ShieldCheck, Clock, Recycle } from 'lucide-react';

interface HeroProps {
  onStartCraft: () => void;
  onQuickAddMaterial: (material: string) => void;
}

const POPULAR_MATERIALS = [
  { name: 'Cardboard', emoji: '📦' },
  { name: 'Plastic Bottles', emoji: '🍾' },
  { name: 'Wool / Yarn', emoji: '🧶' },
  { name: 'Ice-cream Sticks', emoji: '🪵' },
  { name: 'Old Clothes', emoji: '👕' },
  { name: 'Paper', emoji: '📄' },
  { name: 'Egg Cartons', emoji: '🥚' },
  { name: 'Mason Jars', emoji: '🫙' },
];

export const Hero: React.FC<HeroProps> = ({ onStartCraft, onQuickAddMaterial }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-14 md:pt-14 md:pb-20">
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[540px] sm:h-[540px] bg-gradient-to-tr from-amber-400/20 via-rose-500/20 to-purple-600/20 blur-3xl rounded-full pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-10 right-10 w-64 h-64 bg-cyan-400/15 blur-2xl rounded-full pointer-events-none -z-10 animate-float" />
      <div className="absolute bottom-4 left-8 w-60 h-60 bg-amber-400/15 blur-2xl rounded-full pointer-events-none -z-10 animate-float-reverse" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-amber-200/80 dark:border-amber-500/30 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm backdrop-blur-md mb-6 hover:scale-105 transition-transform duration-300">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Smart DIY & Sustainable Upcycling Engine</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight text-slate-900 dark:text-white leading-[1.15] mb-6">
          Craft Idea <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600">
            Generator
          </span>
        </h1>

        {/* Short Description */}
        <p className="text-lg sm:text-2xl font-medium text-slate-700 dark:text-slate-300 max-w-2xl mx-auto mb-4">
          Turn everyday materials into creative ideas.
        </p>

        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-8">
          Don't throw away that box or bottle! Tell us what household scraps you have, and get step-by-step DIY crafts, home decor tutorials, and school projects crafted by AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            onClick={onStartCraft}
            id="cta-create-craft"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 text-white font-bold text-base sm:text-lg shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-105 active:scale-98 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer group"
          >
            <Wand2 className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span>Create a Craft</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>

        {/* Quick Material Inspiration Chips */}
        <div className="pt-2">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-3">
            Quick tap to add common supplies:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
            {POPULAR_MATERIALS.map((item) => (
              <button
                key={item.name}
                onClick={() => onQuickAddMaterial(item.name)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white/90 dark:bg-slate-900/80 hover:bg-amber-50 dark:hover:bg-amber-950/40 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500 text-slate-700 dark:text-slate-300 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              >
                <span>{item.emoji}</span>
                <span>{item.name}</span>
                <span className="text-xs text-amber-500 font-bold ml-0.5">+</span>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto text-left">
          
          <div className="glass-card p-4.5 rounded-2xl flex items-start gap-3.5 hover:border-amber-400/50 transition-colors">
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shrink-0">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-0.5">Eco-Friendly Upcycling</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Repurpose cardboard, plastic, jars, and fabric into beautiful home pieces.
              </p>
            </div>
          </div>

          <div className="glass-card p-4.5 rounded-2xl flex items-start gap-3.5 hover:border-rose-400/50 transition-colors">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-0.5">Time & Steps Included</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Clear step-by-step instructions, checklist modes, and realistic time estimates.
              </p>
            </div>
          </div>

          <div className="glass-card p-4.5 rounded-2xl flex items-start gap-3.5 hover:border-purple-400/50 transition-colors">
            <div className="p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-0.5">Safety & Kid-Friendly</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Clear safety alerts for scissors, glues, and adult supervision notes.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

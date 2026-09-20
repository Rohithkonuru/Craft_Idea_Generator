import React from 'react';
import { CraftCategory, CraftDifficulty, CraftOccasion } from '../types/craft';
import { 
  Sparkles, 
  Home, 
  Gift, 
  Smile, 
  Palette, 
  Recycle, 
  PartyPopper, 
  Shirt, 
  SlidersHorizontal,
  Flame,
  Calendar,
  Layers
} from 'lucide-react';

interface CraftFiltersProps {
  selectedCategory: CraftCategory;
  onSelectCategory: (category: CraftCategory) => void;
  selectedDifficulty: CraftDifficulty | 'All';
  onSelectDifficulty: (difficulty: CraftDifficulty | 'All') => void;
  selectedOccasion: CraftOccasion;
  onSelectOccasion: (occasion: CraftOccasion) => void;
  ideaCount: number;
  onSelectIdeaCount: (count: number) => void;
  onGenerate: () => void;
  isLoading: boolean;
  canGenerate: boolean;
}

const CATEGORIES: { label: CraftCategory; icon: React.ReactNode; color: string }[] = [
  { label: 'All', icon: <Layers className="w-4 h-4" />, color: 'slate' },
  { label: 'Home Decor', icon: <Home className="w-4 h-4" />, color: 'amber' },
  { label: 'Gifts', icon: <Gift className="w-4 h-4" />, color: 'pink' },
  { label: 'Kids', icon: <Smile className="w-4 h-4" />, color: 'yellow' },
  { label: 'Art', icon: <Palette className="w-4 h-4" />, color: 'purple' },
  { label: 'Recycling', icon: <Recycle className="w-4 h-4" />, color: 'emerald' },
  { label: 'Festival', icon: <PartyPopper className="w-4 h-4" />, color: 'orange' },
  { label: 'Fashion', icon: <Shirt className="w-4 h-4" />, color: 'indigo' },
];

const DIFFICULTIES: { label: CraftDifficulty | 'All'; color: string; desc: string }[] = [
  { label: 'All', color: 'slate', desc: 'Any skill level' },
  { label: 'Easy', color: 'emerald', desc: '10-25 mins • Beginner' },
  { label: 'Medium', color: 'amber', desc: '25-45 mins • Intermediate' },
  { label: 'Hard', color: 'rose', desc: '45+ mins • Advanced craft' },
];

const OCCASIONS: { label: CraftOccasion; icon: string }[] = [
  { label: 'All', icon: '✨' },
  { label: 'General', icon: '🌟' },
  { label: 'Decoration', icon: '🎀' },
  { label: 'Birthday', icon: '🎂' },
  { label: 'Festival', icon: '🪔' },
  { label: 'School Project', icon: '🎒' },
];

export const CraftFilters: React.FC<CraftFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedDifficulty,
  onSelectDifficulty,
  selectedOccasion,
  onSelectOccasion,
  ideaCount,
  onSelectIdeaCount,
  onGenerate,
  isLoading,
  canGenerate,
}) => {
  return (
    <div className="space-y-6 pt-4">
      
      {/* Category Pills */}
      <div>
        <label className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-2.5">
          <Palette className="w-4 h-4 text-rose-500" />
          <span>Craft Category</span>
          <span className="text-xs font-normal text-slate-400">(Optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => onSelectCategory(cat.label)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-rose-300 dark:hover:border-rose-600'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid for Difficulty, Occasion, and Idea Count */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Difficulty Selector */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Difficulty Level</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            {DIFFICULTIES.map((diff) => {
              const isSelected = selectedDifficulty === diff.label;
              return (
                <button
                  key={diff.label}
                  type="button"
                  onClick={() => onSelectDifficulty(diff.label)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div>{diff.label}</div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-amber-100' : 'text-slate-400 dark:text-slate-500'}`}>
                    {diff.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Occasion Dropdown / Picker */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
            <Calendar className="w-4 h-4 text-violet-500" />
            <span>Occasion / Purpose</span>
          </label>
          <select
            id="occasion-select"
            value={selectedOccasion}
            onChange={(e) => onSelectOccasion(e.target.value as CraftOccasion)}
            className="w-full h-12 px-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-violet-500 cursor-pointer shadow-xs"
          >
            {OCCASIONS.map((occ) => (
              <option key={occ.label} value={occ.label}>
                {occ.icon} {occ.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 px-1">
            Tailors decorations, gifts, and themes to this event.
          </p>
        </div>

        {/* Number of Ideas Selector */}
        <div>
          <label className="flex items-center justify-between text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
              <span>Number of Ideas</span>
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-bold">
              {ideaCount} {ideaCount === 1 ? 'idea' : 'ideas'}
            </span>
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 h-12">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onSelectIdeaCount(num)}
                className={`flex-1 h-full rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  ideaCount === num
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5 px-1">
            Choose between 1 and 5 unique craft proposals.
          </p>
        </div>

      </div>

      {/* Main Submit Action */}
      <div className="pt-2">
        <button
          type="button"
          id="btn-generate-crafts"
          onClick={onGenerate}
          disabled={!canGenerate || isLoading}
          className={`w-full py-4 px-6 rounded-2xl font-heading font-extrabold text-lg text-white shadow-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer ${
            !canGenerate || isLoading
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-amber-500 via-rose-500 to-violet-600 hover:shadow-rose-500/30 hover:scale-[1.01] active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span>AI is generating DIY ideas...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
              <span>Generate Creative Ideas</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

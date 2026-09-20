import React from 'react';
import { CraftIdea } from '../types/craft';
import { 
  Heart, 
  Clock, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Share2,
  RefreshCw
} from 'lucide-react';

interface CraftCardProps {
  craft: CraftIdea;
  isSaved: boolean;
  onSave: (craft: CraftIdea) => void;
  onViewDetails: (craft: CraftIdea) => void;
  onGenerateSimilar: (craft: CraftIdea) => void;
}

export const CraftCard: React.FC<CraftCardProps> = ({
  craft,
  isSaved,
  onSave,
  onViewDetails,
  onGenerateSimilar,
}) => {
  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          dot: 'bg-emerald-500'
        };
      case 'medium':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          dot: 'bg-amber-500'
        };
      case 'hard':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          dot: 'bg-rose-500'
        };
      default:
        return {
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-400'
        };
    }
  };

  const diffStyle = getDifficultyBadge(craft.difficulty);

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl bg-white/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-500/80 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1.5 p-6 backdrop-blur-md">
      
      {/* Top Meta Badges & Save Action */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {/* Category */}
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60">
              {craft.category}
            </span>

            {/* Difficulty Badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${diffStyle.bg}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${diffStyle.dot}`} />
              <span>{craft.difficulty}</span>
            </span>

            {/* Occasion Pill */}
            {craft.occasion && craft.occasion !== 'All' && (
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {craft.occasion}
              </span>
            )}
          </div>

          {/* Heart Save Button */}
          <button
            onClick={() => onSave(craft)}
            title={isSaved ? "Remove from saved" : "Save craft idea"}
            className={`p-2.5 rounded-2xl transition-all duration-200 cursor-pointer ${
              isSaved
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105'
                : 'bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-white stroke-white' : ''}`} />
          </button>
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2 line-clamp-2">
          {craft.title}
        </h3>

        {/* Tagline / Subtitle */}
        {craft.tagline && (
          <p className="text-xs sm:text-sm font-medium text-amber-700 dark:text-amber-400/90 mb-3 italic">
            "{craft.tagline}"
          </p>
        )}

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4 line-clamp-3">
          {craft.description}
        </p>

        {/* Estimated Time Info */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4 bg-slate-50 dark:bg-slate-800/50 px-3 py-2 rounded-xl">
          <Clock className="w-3.5 h-3.5 text-amber-500" />
          <span>Estimated Time: <strong className="text-slate-700 dark:text-slate-200">{craft.estimatedTime || '20-30 mins'}</strong></span>
        </div>

        {/* Required Materials Pills */}
        <div className="mb-5">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500 mb-2">
            Materials:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {craft.materialsRequired?.slice(0, 4).map((mat, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
              >
                {mat}
              </span>
            ))}
            {craft.materialsRequired?.length > 4 && (
              <span className="px-2 py-1 rounded-lg text-xs font-semibold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                +{craft.materialsRequired.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Quick Safety Note Alert if applicable */}
        {craft.safetyNotes && (
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-amber-800 dark:text-amber-300 text-xs mb-5">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span className="truncate">{craft.safetyNotes}</span>
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
        <button
          onClick={() => onViewDetails(craft)}
          className="flex-1 py-3 px-4 rounded-xl bg-slate-900 dark:bg-white hover:bg-amber-600 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-sm group/btn"
        >
          <span>View Instructions ({craft.steps?.length || 0} steps)</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>

        <button
          onClick={() => onGenerateSimilar(craft)}
          title="Generate similar variations of this craft"
          className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

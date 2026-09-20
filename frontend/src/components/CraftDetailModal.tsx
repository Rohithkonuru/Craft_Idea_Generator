import React, { useState } from 'react';
import { CraftIdea } from '../types/craft';
import { 
  X, 
  Heart, 
  Printer, 
  Copy, 
  Check, 
  Clock, 
  Flame, 
  ShieldAlert, 
  Lightbulb, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Share2
} from 'lucide-react';

interface CraftDetailModalProps {
  craft: CraftIdea | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (craft: CraftIdea) => void;
  onShowToast: (message: string) => void;
}

export const CraftDetailModal: React.FC<CraftDetailModalProps> = ({
  craft,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onShowToast,
}) => {
  if (!isOpen || !craft) return null;

  // Track checked steps and materials for interactive DIY checklist
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [checkedMaterials, setCheckedMaterials] = useState<Record<number, boolean>>({});
  const [copied, setCopied] = useState(false);

  const toggleStep = (index: number) => {
    setCompletedSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleMaterial = (index: number) => {
    setCheckedMaterials(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopy = () => {
    const text = `🎨 ${craft.title}\nCategory: ${craft.category} | Difficulty: ${craft.difficulty} | Time: ${craft.estimatedTime}\n\n📝 Description:\n${craft.description}\n\n📦 Materials Required:\n${craft.materialsRequired.map(m => `• ${m}`).join('\n')}\n\n🛠️ Step-by-Step Instructions:\n${craft.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n💡 Creative Tips:\n${craft.tips?.map(t => `• ${t}`).join('\n') || 'None'}\n\n⚠️ Safety Notes: ${craft.safetyNotes || 'None'}`;
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('Craft tutorial copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalSteps = craft.steps?.length || 0;
  const doneStepsCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = totalSteps > 0 ? Math.round((doneStepsCount / totalSteps) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Dialog Card */}
      <div 
        id="craft-detail-modal"
        className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                {craft.category}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {craft.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {craft.estimatedTime}
              </span>
              {craft.occasion && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  {craft.occasion}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
              {craft.title}
            </h2>
            {craft.tagline && (
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mt-1 italic">
                "{craft.tagline}"
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(craft)}
              title={isSaved ? "Remove from saved" : "Save craft"}
              className={`p-2.5 rounded-2xl transition-all cursor-pointer ${
                isSaved
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-white stroke-white' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Description */}
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800/40 border border-amber-200/50 dark:border-slate-800 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {craft.description}
          </div>

          {/* Interactive Progress Bar */}
          {totalSteps > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Interactive Crafting Progress</span>
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {doneStepsCount} / {totalSteps} steps completed ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Required Materials Checklist */}
          <div>
            <h4 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-3">
              <Layers className="w-5 h-5 text-amber-500" />
              <span>Required Materials & Supplies</span>
              <span className="text-xs font-normal text-slate-400">(Tap to check off)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {craft.materialsRequired?.map((mat, idx) => {
                const isChecked = !!checkedMaterials[idx];
                return (
                  <label
                    key={idx}
                    onClick={() => toggleMaterial(idx)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all cursor-pointer select-none ${
                      isChecked
                        ? 'bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-200 line-through opacity-80'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                      isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-700'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <span>{mat}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div>
            <h4 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white mb-3">
              <Sparkles className="w-5 h-5 text-rose-500" />
              <span>Step-by-Step Instructions</span>
            </h4>
            <div className="space-y-3">
              {craft.steps?.map((stepText, idx) => {
                const isDone = !!completedSteps[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => toggleStep(idx)}
                    className={`flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      isDone
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                      isDone
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm sm:text-base leading-relaxed ${
                        isDone 
                          ? 'text-slate-500 dark:text-slate-400 line-through' 
                          : 'text-slate-800 dark:text-slate-200 font-medium'
                      }`}>
                        {stepText.replace(/^\d+\.\s*/, '')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Creative Tips & Variations */}
          {craft.tips && craft.tips.length > 0 && (
            <div className="p-4.5 rounded-2xl bg-violet-50/80 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-900/50">
              <h5 className="flex items-center gap-2 text-sm font-bold text-violet-900 dark:text-violet-200 mb-2">
                <Lightbulb className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span>Creative Pro-Tips & Variations</span>
              </h5>
              <ul className="space-y-1.5 text-xs sm:text-sm text-violet-800 dark:text-violet-300">
                {craft.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-violet-500 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Safety Notes Callout */}
          {craft.safetyNotes && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300/60 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs sm:text-sm">
              <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-0.5">Safety & Handling:</strong>
                <span>{craft.safetyNotes}</span>
              </div>
            </div>
          )}

        </div>

        {/* Modal Action Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied!' : 'Copy Tutorial'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Card</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs sm:text-sm font-bold hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Done Reading
          </button>
        </div>

      </div>
    </div>
  );
};

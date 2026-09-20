import React, { useState, KeyboardEvent } from 'react';
import { Plus, X, Sparkles, Layers, Trash2 } from 'lucide-react';

interface MaterialInputProps {
  materials: string[];
  onAddMaterial: (material: string) => void;
  onRemoveMaterial: (index: number) => void;
  onClearAll: () => void;
}

export const MaterialInput: React.FC<MaterialInputProps> = ({
  materials,
  onAddMaterial,
  onRemoveMaterial,
  onClearAll,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    
    // Check duplicates
    if (materials.some(m => m.toLowerCase() === trimmed.toLowerCase())) {
      setErrorMsg(`"${trimmed}" is already added!`);
      setTimeout(() => setErrorMsg(''), 2500);
      return;
    }

    onAddMaterial(trimmed);
    setInputValue('');
    setErrorMsg('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAdd();
    } else if (e.key === 'Backspace' && !inputValue && materials.length > 0) {
      onRemoveMaterial(materials.length - 1);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
          <Layers className="w-4 h-4 text-amber-500" />
          <span>Materials Available at Hand</span>
          <span className="text-rose-500 text-xs font-semibold">*</span>
        </label>
        
        {materials.length > 0 && (
          <button
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear all ({materials.length})</span>
          </button>
        )}
      </div>

      {/* Interactive Tag Box */}
      <div className="relative rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 focus-within:border-amber-500 dark:focus-within:border-amber-400 p-2.5 transition-all shadow-inner">
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Active Chips */}
          {materials.map((mat, index) => (
            <span
              key={`${mat}-${index}`}
              className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/60 dark:to-orange-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700/60 shadow-xs animate-in fade-in zoom-in-95 duration-200"
            >
              <span>{mat}</span>
              <button
                type="button"
                onClick={() => onRemoveMaterial(index)}
                aria-label={`Remove ${mat}`}
                className="p-0.5 rounded-md hover:bg-amber-200/60 dark:hover:bg-amber-800 text-amber-700 dark:text-amber-400 hover:text-rose-600 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}

          {/* Typing Input */}
          <div className="flex-1 min-w-[200px] flex items-center gap-1">
            <input
              id="material-input-field"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={materials.length === 0 ? "e.g. Cardboard, plastic bottle, wool yarn, paper..." : "Add another material..."}
              className="w-full bg-transparent px-2 py-1.5 text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
            />
            {inputValue.trim() && (
              <button
                type="button"
                onClick={handleAdd}
                className="p-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Helper / Error Feedback */}
      <div className="flex items-center justify-between mt-2 px-1">
        {errorMsg ? (
          <p className="text-xs font-semibold text-rose-500 animate-pulse">{errorMsg}</p>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Type and press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[10px] font-mono">Enter</kbd> or comma to add chips</span>
          </p>
        )}
        <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
          {materials.length} material{materials.length === 1 ? '' : 's'} added
        </span>
      </div>
    </div>
  );
};

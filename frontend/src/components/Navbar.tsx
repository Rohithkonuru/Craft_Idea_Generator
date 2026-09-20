import React from 'react';
import { Scissors, Sparkles, Heart, Moon, Sun, Settings } from 'lucide-react';
import { HealthStatus } from '../types/craft';

interface NavbarProps {
  savedCount: number;
  onOpenSaved: () => void;
  onOpenSettings: () => void;
  onScrollToGenerator: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  health: HealthStatus | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  savedCount,
  onOpenSaved,
  onOpenSettings,
  onScrollToGenerator,
  isDark,
  onToggleTheme,
  health,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={onScrollToGenerator}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/25 group-hover:scale-105 transition-transform duration-300">
            <Scissors className="w-6 h-6 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Craft<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-rose-500">Gen</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/40">
                <Sparkles className="w-3 h-3 text-amber-500" /> AI DIY
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5">
              Turn everyday materials into art
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* AI Engine Status Pill */}
          <button
            onClick={onOpenSettings}
            title={health?.gemini_configured ? "Google Gemini AI active" : "Smart Recipe Engine active"}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{health?.gemini_configured ? "Gemini AI" : "Smart Engine"}</span>
            <span className={`w-2 h-2 rounded-full ${health?.gemini_configured ? "bg-emerald-500 animate-pulse" : "bg-blue-500"}`} />
          </button>

          {/* Saved Crafts Button */}
          <button
            onClick={onOpenSaved}
            className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm shadow-rose-500/10"
          >
            <Heart className={`w-4 h-4 text-rose-500 ${savedCount > 0 ? "fill-rose-500" : ""}`} />
            <span className="hidden sm:inline">Saved Crafts</span>
            {savedCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-rose-500 rounded-full shadow-sm animate-bounce-subtle">
                {savedCount}
              </span>
            )}
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Dark/Light Mode"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            aria-label="Open Settings"
            className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer"
          >
            <Settings className="w-5 h-5 hover:rotate-90 transition-transform duration-300" />
          </button>

        </div>
      </div>
    </header>
  );
};

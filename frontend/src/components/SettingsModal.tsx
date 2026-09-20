import React, { useState } from 'react';
import { X, ShieldCheck, Database, Sparkles, Server, RefreshCw, CheckCircle, Info, Lock } from 'lucide-react';
import { HealthStatus } from '../types/craft';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  health: HealthStatus | null;
  onRefreshHealth: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  health,
  onRefreshHealth,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefreshHealth();
      onShowToast('System status refreshed!', 'success');
    } catch {
      onShowToast('Failed to refresh status', 'error');
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const isServerOnline = health && health.status !== 'offline';
  const isGeminiConfigured = Boolean(health?.gemini_configured);
  const isMongoDb = health?.database === 'mongodb';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        id="settings-modal"
        className="relative w-full max-w-xl flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white">
                System & Connection Status
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Secure backend architecture and runtime telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            aria-label="Close status dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          
          {/* 1. Backend Server Status */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Flask Backend Service</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">REST API at localhost:5000</p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${
              isServerOnline 
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isServerOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
              <span>{isServerOnline ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          {/* 2. Database Status */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Database Storage</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isMongoDb ? 'MongoDB server connected' : 'Local JSON file storage (Automatic fallback)'}
                </p>
              </div>
            </div>
            <span className="font-semibold text-xs text-slate-900 dark:text-white px-2.5 py-1 rounded-xl bg-slate-200/70 dark:bg-slate-700/70">
              {isMongoDb ? 'MongoDB' : 'JSON Fallback'}
            </span>
          </div>

          {/* 3. AI Engine Status */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Craft Idea Engine</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isGeminiConfigured 
                    ? 'Google Gemini AI (Configured on server)' 
                    : 'Smart Recipe Engine (Zero-Config Active)'}
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${
              isGeminiConfigured
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isGeminiConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'}`} />
              <span>{isGeminiConfigured ? 'Gemini AI' : 'Smart Engine'}</span>
            </div>
          </div>

          {/* Security Architecture Box */}
          <div className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-800 dark:text-amber-300">
              <Lock className="w-4 h-4" />
              <span>Zero Client Exposure Architecture</span>
            </div>
            <p className="leading-relaxed">
              The Google Gemini API key and MongoDB credentials reside strictly on the backend server in{' '}
              <code className="px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/60 rounded font-mono font-bold">
                backend/.env
              </code>
              . They are never transmitted to or saved within browser storage.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Status</span>
          </button>
          
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

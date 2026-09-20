import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  CraftIdea, 
  CraftCategory, 
  CraftDifficulty, 
  CraftOccasion, 
  HealthStatus 
} from './types/craft';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MaterialInput } from './components/MaterialInput';
import { CraftFilters } from './components/CraftFilters';
import { CraftCard } from './components/CraftCard';
import { CraftDetailModal } from './components/CraftDetailModal';
import { SavedCraftsModal } from './components/SavedCraftsModal';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { SettingsModal } from './components/SettingsModal';
import { Toast, ToastProps } from './components/Toast';
import { 
  Sparkles, 
  Wand2, 
  Search, 
  Filter, 
  RefreshCw, 
  Heart, 
  Layers, 
  AlertCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export function App() {
  // Theme state
  const [isDark, setIsDark] = useState<boolean>(() => {
    return localStorage.getItem('craft_theme') === 'dark' ||
      (!localStorage.getItem('craft_theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Generator form inputs
  const [materials, setMaterials] = useState<string[]>(['Cardboard', 'Plastic bottle']);
  const [selectedCategory, setSelectedCategory] = useState<CraftCategory>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<CraftDifficulty | 'All'>('All');
  const [selectedOccasion, setSelectedOccasion] = useState<CraftOccasion>('All');
  const [ideaCount, setIdeaCount] = useState<number>(3);

  // Results & Saved state
  const [generatedCrafts, setGeneratedCrafts] = useState<CraftIdea[]>([]);
  const [savedCrafts, setSavedCrafts] = useState<CraftIdea[]>([]);
  const [generationEngine, setGenerationEngine] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Results search & filters
  const [resultSearchQuery, setResultSearchQuery] = useState<string>('');
  const [resultFilterCategory, setResultFilterCategory] = useState<string>('All');

  // Modals state
  const [selectedCraftDetail, setSelectedCraftDetail] = useState<CraftIdea | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // System Health
  const [health, setHealth] = useState<HealthStatus | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: ToastProps['type'] } | null>(null);

  // References for scrolling
  const generatorRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Handle Theme class toggling
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('craft_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('craft_theme', 'light');
    }
  }, [isDark]);

  // Initial data loading (Saved crafts + Health) & Security Key Purge
  useEffect(() => {
    // Purge any legacy client-side stored API keys for security compliance
    localStorage.removeItem('craft_gemini_api_key');
    sessionStorage.removeItem('craft_gemini_api_key');
    loadHealthAndCrafts();
  }, []);

  const loadHealthAndCrafts = async () => {
    try {
      const [h, saved] = await Promise.all([
        api.checkHealth(),
        api.getSavedCrafts(),
      ]);
      setHealth(h);
      setSavedCrafts(saved);
    } catch (err) {
      console.error('Initialization error', err);
    }
  };

  const showToast = (message: string, type: ToastProps['type'] = 'success') => {
    setToast({ message, type });
  };

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const scrollToGenerator = () => {
    generatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAddMaterial = (material: string) => {
    if (!materials.some(m => m.toLowerCase() === material.toLowerCase())) {
      setMaterials(prev => [...prev, material]);
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(prev => prev.filter((_, i) => i !== index));
  };

  const handleClearAllMaterials = () => {
    setMaterials([]);
  };

  // Main AI Generation Handler
  const handleGenerateIdeas = async () => {
    if (materials.length === 0) {
      showToast('Please add at least one material to start crafting!', 'error');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    // Smooth scroll to loading section
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);

    try {
      const response = await api.generateIdeas({
        materials,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        difficulty: selectedDifficulty !== 'All' ? selectedDifficulty : undefined,
        occasion: selectedOccasion !== 'All' ? selectedOccasion : undefined,
        count: ideaCount,
      });

      if (response.success && response.crafts) {
        setGeneratedCrafts(response.crafts);
        setGenerationEngine(response.engine || 'AI Engine');
        showToast(`Generated ${response.crafts.length} creative craft ideas!`, 'success');
        
        // Trigger celebratory confetti
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      } else {
        throw new Error(response.error || 'Failed to generate craft ideas');
      }
    } catch (err: any) {
      console.error('Generation error', err);
      setErrorMsg(err.message || 'Error communicating with generation engine');
      showToast(err.message || 'Generation failed. Please try again.', 'error');
    } finally {
      setIsLoading(false);
      // Ensure results are in view
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  // Toggle Save craft
  const handleToggleSave = async (craft: CraftIdea) => {
    const isAlreadySaved = savedCrafts.some(c => c.id === craft.id);

    if (isAlreadySaved) {
      // Delete
      await api.deleteCraft(craft.id);
      setSavedCrafts(prev => prev.filter(c => c.id !== craft.id));
      showToast(`Removed "${craft.title}" from saved crafts`, 'info');
    } else {
      // Save
      const saved = await api.saveCraft(craft);
      setSavedCrafts(prev => [saved, ...prev]);
      showToast(`Saved "${craft.title}" to favorites! ❤️`, 'success');
      
      // Heart confetti explosion
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0.8, y: 0.8 }
      });
    }
  };

  // Delete craft from Saved modal
  const handleDeleteSavedCraft = async (id: string) => {
    await api.deleteCraft(id);
    setSavedCrafts(prev => prev.filter(c => c.id !== id));
    showToast('Craft deleted from collection', 'info');
  };

  // Generate Similar
  const handleGenerateSimilar = (craft: CraftIdea) => {
    const extractedMaterials = craft.materialsRequired?.slice(0, 3) || materials;
    setMaterials(extractedMaterials);
    if (craft.category) {
      setSelectedCategory(craft.category as CraftCategory);
    }
    showToast(`Spinning off variations for "${craft.title}"...`, 'info');
    generatorRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      handleGenerateIdeas();
    }, 400);
  };

  // Open detail view
  const handleViewDetails = (craft: CraftIdea) => {
    setSelectedCraftDetail(craft);
    setIsDetailOpen(true);
  };

  // Filtered generated crafts
  const displayCrafts = generatedCrafts.filter(craft => {
    const matchesSearch = 
      !resultSearchQuery.trim() ||
      craft.title.toLowerCase().includes(resultSearchQuery.toLowerCase()) ||
      craft.description.toLowerCase().includes(resultSearchQuery.toLowerCase()) ||
      craft.materialsRequired?.some(m => m.toLowerCase().includes(resultSearchQuery.toLowerCase()));

    const matchesCategory = 
      resultFilterCategory === 'All' || 
      craft.category?.toLowerCase() === resultFilterCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. Header & Navigation */}
      <Navbar
        savedCount={savedCrafts.length}
        onOpenSaved={() => setIsSavedModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onScrollToGenerator={scrollToGenerator}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        health={health}
      />

      <main className="flex-1 pb-24">
        
        {/* 2. Hero Landing Page Section */}
        <Hero
          onStartCraft={scrollToGenerator}
          onQuickAddMaterial={handleAddMaterial}
        />

        {/* 3. Craft Generator Form Section */}
        <section 
          ref={generatorRef} 
          id="craft-generator-section"
          className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 scroll-mt-24"
        >
          <div className="glass-panel p-6 sm:p-10 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 border border-slate-200/80 dark:border-slate-800">
            
            {/* Form Section Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                  Craft Idea Generator
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  Select your available materials and preferences to create customized DIY projects
                </p>
              </div>
            </div>

            {/* Step 1: Materials Tag Input */}
            <MaterialInput
              materials={materials}
              onAddMaterial={handleAddMaterial}
              onRemoveMaterial={handleRemoveMaterial}
              onClearAll={handleClearAllMaterials}
            />

            {/* Step 2: Filters (Category, Difficulty, Occasion, Idea Count) */}
            <CraftFilters
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedDifficulty={selectedDifficulty}
              onSelectDifficulty={setSelectedDifficulty}
              selectedOccasion={selectedOccasion}
              onSelectOccasion={setSelectedOccasion}
              ideaCount={ideaCount}
              onSelectIdeaCount={setIdeaCount}
              onGenerate={handleGenerateIdeas}
              isLoading={isLoading}
              canGenerate={materials.length > 0}
            />

          </div>
        </section>

        {/* 4. Results Section */}
        <section 
          ref={resultsRef} 
          id="results-section"
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 scroll-mt-20"
        >
          {/* Loading Animation State */}
          {isLoading && <LoadingSkeleton />}

          {/* Error Message Display */}
          {errorMsg && !isLoading && (
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center max-w-2xl mx-auto my-8">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-rose-800 dark:text-rose-200 mb-1">
                Generation Encountered an Issue
              </h4>
              <p className="text-sm text-rose-600 dark:text-rose-300 mb-4">
                {errorMsg}
              </p>
              <button
                onClick={handleGenerateIdeas}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Generated Ideas Cards Showcase */}
          {!isLoading && generatedCrafts.length > 0 && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Results Header & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/70 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white">
                      Generated Craft Ideas
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {generatedCrafts.length}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Powered by <strong className="text-slate-700 dark:text-slate-300">{generationEngine}</strong> • Tailored to: {materials.join(', ')}
                  </p>
                </div>

                {/* Filter and Search within Results */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[200px]">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="filter-results-input"
                      type="text"
                      value={resultSearchQuery}
                      onChange={(e) => setResultSearchQuery(e.target.value)}
                      placeholder="Search results..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none"
                    />
                  </div>

                  <select
                    value={resultFilterCategory}
                    onChange={(e) => setResultFilterCategory(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    <option value="Home Decor">Home Decor</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Kids">Kids</option>
                    <option value="Art">Art</option>
                    <option value="Recycling">Recycling</option>
                    <option value="Festival">Festival</option>
                    <option value="Fashion">Fashion</option>
                  </select>

                  <button
                    onClick={handleGenerateIdeas}
                    title="Regenerate ideas"
                    className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 hover:bg-amber-100 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              {displayCrafts.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500">No craft ideas match your search filter.</p>
                  <button
                    onClick={() => { setResultSearchQuery(''); setResultFilterCategory('All'); }}
                    className="mt-2 text-xs font-semibold text-amber-500 hover:underline cursor-pointer"
                  >
                    Reset result filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayCrafts.map((craft) => {
                    const isSaved = savedCrafts.some(c => c.id === craft.id);
                    return (
                      <CraftCard
                        key={craft.id}
                        craft={craft}
                        isSaved={isSaved}
                        onSave={handleToggleSave}
                        onViewDetails={handleViewDetails}
                        onGenerateSimilar={handleGenerateSimilar}
                      />
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* Empty / Initial State Invitation */}
          {!isLoading && generatedCrafts.length === 0 && !errorMsg && (
            <div className="text-center py-12 px-4 max-w-xl mx-auto rounded-3xl bg-white/60 dark:bg-slate-900/60 border border-dashed border-slate-300 dark:border-slate-800">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">
                Ready to turn scraps into art?
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-4">
                Add your materials above and click "Generate Creative Ideas" to see AI-crafted DIY project tutorials.
              </p>
              <button
                onClick={handleGenerateIdeas}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/25 transition-all cursor-pointer"
              >
                Generate Now with Demo Materials
              </button>
            </div>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1.5 justify-center">
            <span>Craft Idea Generator</span>
            <span>•</span>
            <span>AI-Powered DIY & Upcycling Assistant</span>
          </p>
          <p className="flex items-center gap-1 justify-center">
            <span>Built with React, TypeScript, Tailwind CSS, Python Flask & MongoDB</span>
          </p>
        </div>
      </footer>

      {/* 5. Modals */}
      <CraftDetailModal
        craft={selectedCraftDetail}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        isSaved={selectedCraftDetail ? savedCrafts.some(c => c.id === selectedCraftDetail.id) : false}
        onToggleSave={handleToggleSave}
        onShowToast={showToast}
      />

      <SavedCraftsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedCrafts={savedCrafts}
        onDeleteCraft={handleDeleteSavedCraft}
        onViewCraft={(craft) => {
          setIsSavedModalOpen(false);
          handleViewDetails(craft);
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        health={health}
        onRefreshHealth={loadHealthAndCrafts}
        onShowToast={showToast}
      />

      {/* Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}

export default App;

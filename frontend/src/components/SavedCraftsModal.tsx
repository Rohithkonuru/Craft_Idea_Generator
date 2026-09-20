import React, { useState, useMemo } from 'react';
import { CraftIdea, CraftCategory, CraftDifficulty } from '../types/craft';
import { 
  X, 
  Search, 
  Trash2, 
  ExternalLink, 
  Heart, 
  Filter, 
  Download, 
  Sparkles,
  Clock,
  Layers
} from 'lucide-react';

interface SavedCraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCrafts: CraftIdea[];
  onDeleteCraft: (id: string) => void;
  onViewCraft: (craft: CraftIdea) => void;
}

export const SavedCraftsModal: React.FC<SavedCraftsModalProps> = ({
  isOpen,
  onClose,
  savedCrafts,
  onDeleteCraft,
  onViewCraft,
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  // Filtered crafts based on search, category, and difficulty
  const filteredCrafts = useMemo(() => {
    return savedCrafts.filter(craft => {
      const matchesSearch = 
        !searchQuery.trim() ||
        craft.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        craft.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        craft.materialsRequired?.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = 
        selectedCategory === 'All' || 
        craft.category?.toLowerCase() === selectedCategory.toLowerCase();

      const matchesDiff = 
        selectedDifficulty === 'All' || 
        craft.difficulty?.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesCat && matchesDiff;
    });
  }, [savedCrafts, searchQuery, selectedCategory, selectedDifficulty]);

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedCrafts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `my_saved_crafts_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        id="saved-crafts-modal"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
                Saved Craft Collection
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {savedCrafts.length} DIY craft project{savedCrafts.length === 1 ? '' : 's'} bookmarked
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedCrafts.length > 0 && (
              <button
                onClick={handleExportJSON}
                title="Export saved crafts to JSON"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search and Filters Bar */}
        {savedCrafts.length > 0 && (
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-saved-crafts"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or material..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
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

            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-rose-500 cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

          </div>
        )}

        {/* Saved List Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {savedCrafts.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-16 h-16 rounded-3xl bg-rose-50 dark:bg-rose-950/40 text-rose-400 mx-auto flex items-center justify-center mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                No saved crafts yet
              </h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
                When you discover a craft you love, click the heart icon on any craft card to save it for your weekend projects!
              </p>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs sm:text-sm font-bold hover:bg-amber-600 transition-colors cursor-pointer"
              >
                Explore Ideas Now
              </button>
            </div>
          ) : filteredCrafts.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No saved crafts match your search or filter criteria.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedDifficulty('All'); }}
                className="mt-3 text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCrafts.map((craft) => (
                <div
                  key={craft.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between hover:border-amber-400 transition-all shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                          {craft.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {craft.difficulty}
                        </span>
                      </div>
                      <button
                        onClick={() => onDeleteCraft(craft.id)}
                        title="Remove from saved"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white mb-1.5">
                      {craft.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                      {craft.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-4">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>{craft.estimatedTime || '20-30 mins'}</span>
                      <span>•</span>
                      <span>{craft.steps?.length || 0} steps</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onViewCraft(craft);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-amber-500 hover:text-white dark:hover:bg-amber-500 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Open DIY Tutorial</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing {filteredCrafts.length} of {savedCrafts.length} items
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

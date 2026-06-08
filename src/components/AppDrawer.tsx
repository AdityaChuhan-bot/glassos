import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLauncher } from '../context/LauncherContext';
import { AppIcon } from './AppIcon';
import { Search, X, Grid, Heart, Compass, LayoutGrid, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export const AppDrawer: React.FC = () => {
  const { appDrawerOpen, setAppDrawerOpen, libraryApps, openApp } = useLauncher();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    return ['All', 'Social', 'Entertainment', 'Productivity', 'Utilities', 'Games'];
  }, []);

  const filteredApps = useMemo(() => {
    return libraryApps.filter(app => {
      const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [libraryApps, search, selectedCategory]);

  const handleClose = () => {
    setAppDrawerOpen(false);
    setSearch('');
  };

  const handleAppClick = (appId: string) => {
    openApp(appId);
    setAppDrawerOpen(false);
  };

  return (
    <AnimatePresence>
      {appDrawerOpen && (
        <motion.div
          id="liquid_glass_app_drawer"
          initial={{ y: '100%', opacity: 0.5 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0.5 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed inset-x-0 bottom-0 top-12 z-40 bg-black/60 backdrop-blur-[40px] border-t border-white/20 rounded-t-[2.5rem] overflow-hidden flex flex-col shadow-[0_-15px_40px_rgba(0,0,0,0.5)] select-none"
        >
          {/* Glass Reflection Lens Highlight */}
          <div className="absolute top-0 left-[-10%] w-[120%] h-[35%] bg-gradient-to-b from-white/10 via-white/1 to-transparent rounded-b-[50%] pointer-events-none z-10" />
          
          {/* Handle Indicator for gesture styling */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mt-4 mb-2 pointer-events-none z-20" />

          {/* Drawer Header with Title and Search */}
          <div className="px-6 pb-3 pt-2 relative z-20 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <Grid size={18} className="text-white/80" /> Applications
                </h2>
                <p className="text-[10px] text-white/50 font-mono">
                  {filteredApps.length} nodes listed in dynamic container
                </p>
              </div>
              
              <button 
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all active:scale-90"
              >
                <X size={14} className="text-white" />
              </button>
            </div>

            {/* Liquid Glass Search Container */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" size={16} />
              
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Glass Apps..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)] focus:ring-1 focus:ring-white/10 transition-all font-sans"
              />
              
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Liquid Glass Pill Categories Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x mt-1">
              {categories.map(cat => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "relative px-4 py-1.5 rounded-full text-xs font-semibold snap-start cursor-pointer border transition-all duration-300 whitespace-nowrap",
                      isActive 
                        ? "bg-white/15 border-white/35 text-white shadow-md shadow-black/25" 
                        : "bg-white/5 border-white/5 hover:border-white/10 text-white/60 hover:text-white/80"
                    )}
                  >
                    {/* Tiny reflective top accent for active state */}
                    {isActive && (
                      <div className="absolute top-0 inset-x-2 h-[1px] bg-white/40 rounded-full" />
                    )}
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Apps Scrolling Container */}
          <div className="flex-1 overflow-y-auto px-6 pb-20 pt-2 custom-scrollbar relative z-10">
            {filteredApps.length > 0 ? (
              <div id="drawer_apps_grid" className="grid grid-cols-4 gap-x-3 gap-y-7 justify-items-center">
                {filteredApps.map(app => (
                  <motion.div
                    key={app.id}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="w-full flex justify-center"
                  >
                    <AppIcon 
                      app={app} 
                      onClick={() => handleAppClick(app.id)} 
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-3 text-white/30 text-sm">
                <LayoutGrid size={32} className="opacity-40 animate-pulse text-white/40" />
                <p className="font-mono text-xs">No local application units match query</p>
              </div>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

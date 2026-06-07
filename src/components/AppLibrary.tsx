import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_APPS } from '../constants';
import { AppIcon } from './AppIcon';
import { Search } from 'lucide-react';

export const AppLibrary: React.FC = () => {
  const categories = ['Social', 'Entertainment', 'Productivity', 'Utilities', 'Games', 'Other'] as const;

  return (
    <div className="p-6 pt-16 pb-32 h-full overflow-y-auto custom-scrollbar">
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
        <input 
          type="text" 
          placeholder="App Library" 
          className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-white/20"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map(category => {
          const categoryApps = MOCK_APPS.filter(app => app.category === category);
          if (categoryApps.length === 0) return null;

          return (
            <div key={category} className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-3 flex flex-col gap-2">
              <span className="text-[10px] text-white/60 font-bold uppercase tracking-wider px-1">
                {category}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {categoryApps.slice(0, 4).map(app => (
                  <AppIcon key={app.id} app={app} size="sm" showLabel={false} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

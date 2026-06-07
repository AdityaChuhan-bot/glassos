import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { MOCK_APPS } from '../constants';
import { AppIcon } from './AppIcon';

export const Spotlight: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  const results = query 
    ? MOCK_APPS.filter(app => app.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xl p-6 pt-20"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="max-w-md mx-auto">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60" size={20} />
              <input 
                autoFocus
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search" 
                className="w-full bg-white/20 border border-white/20 rounded-2xl py-3 pl-12 pr-4 text-white text-lg placeholder:text-white/40 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-4 gap-6">
              {results.map(app => (
                <AppIcon key={app.id} app={app} />
              ))}
            </div>
            
            {query && results.length === 0 && (
              <div className="text-center text-white/40 mt-10">
                No results found for "{query}"
              </div>
            )}
            
            {!query && (
              <div className="flex flex-col gap-4">
                <span className="text-white/60 text-xs font-bold uppercase tracking-widest">Siri Suggestions</span>
                <div className="grid grid-cols-4 gap-6">
                  {MOCK_APPS.slice(0, 4).map(app => (
                    <AppIcon key={app.id} app={app} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

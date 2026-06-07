import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Battery, Phone, Timer, Bell } from 'lucide-react';

export const DynamicIsland: React.FC = () => {
  const [state, setState] = useState<'collapsed' | 'expanded' | 'full'>('collapsed');
  const [activeEvent, setActiveEvent] = useState<string | null>(null);

  useEffect(() => {
    // Simulate a notification or event
    const timer = setTimeout(() => {
      setActiveEvent('Music');
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (state === 'collapsed') setState('expanded');
    else if (state === 'expanded') setState('full');
    else setState('collapsed');
  };

  return (
    <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        layout
        onClick={handleClick}
        initial={{ width: 100, height: 28, borderRadius: 20 }}
        animate={{
          width: state === 'collapsed' ? 100 : state === 'expanded' ? 200 : 350,
          height: state === 'collapsed' ? 28 : state === 'expanded' ? 60 : 160,
          borderRadius: state === 'collapsed' ? 20 : 32,
        }}
        className="bg-black flex items-center justify-center cursor-pointer overflow-hidden shadow-2xl border border-white/10"
      >
        <AnimatePresence mode="wait">
          {state === 'collapsed' && (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 px-3 w-full justify-between"
            >
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <div className="flex gap-1">
                <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse delay-75" />
                <div className="w-1 h-3 bg-green-500 rounded-full animate-pulse delay-150" />
              </div>
            </motion.div>
          )}

          {state === 'expanded' && (
            <motion.div
              key="expanded"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4 px-4 w-full"
            >
              <Music className="text-pink-500" size={24} />
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold">Now Playing</span>
                <span className="text-white/60 text-[10px]">Starboy - The Weeknd</span>
              </div>
            </motion.div>
          )}

          {state === 'full' && (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-4 p-6 w-full h-full"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Music className="text-white" size={32} />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-white text-lg font-bold">Starboy</span>
                  <span className="text-white/60 text-sm">The Weeknd</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '45%' }}
                    className="h-full bg-white" 
                  />
                </div>
                <div className="flex justify-between text-[10px] text-white/40">
                  <span>1:42</span>
                  <span>3:50</span>
                </div>
              </div>

              <div className="flex justify-center gap-8 items-center">
                <button className="text-white/80 hover:text-white">⏮</button>
                <button className="text-white text-2xl">⏸</button>
                <button className="text-white/80 hover:text-white">⏭</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

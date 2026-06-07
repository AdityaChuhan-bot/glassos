import React, { useState } from 'react';
import { motion, useMotionValue, AnimatePresence } from 'motion/react';
import { AppIcon } from './AppIcon';
import { AppLibrary } from './AppLibrary';
import { cn } from '../lib/utils';
import { useLauncher } from '../context/LauncherContext';
import { RotateCcw, Check } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const { isEditMode, setIsEditMode, homeApps, resetHomeScreen } = useLauncher();
  const totalPages = 3; // 2 home pages + 1 library

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (info.offset.x > threshold && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      setIsEditMode(false);
    }
  };

  const page1Apps = homeApps.slice(0, 12);
  const page2Apps = homeApps.slice(12);

  return (
    <div 
      className="relative h-full overflow-hidden"
      onClick={handleBackgroundClick}
    >
      {/* Top Controls Float in Edit Mode */}
      <AnimatePresence>
        {isEditMode && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-12 left-6 right-6 flex justify-between items-center z-50 px-2 select-none"
            onClick={(e) => e.stopPropagation()} // don't bubble click down
          >
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={resetHomeScreen}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 dark:bg-black/40 dark:hover:bg-black/65 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 shadow-lg active:scale-95 transition-all"
            >
              <RotateCcw size={12} />
              Reset Layout
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsEditMode(false)}
              className="flex items-center gap-1 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold px-4.5 py-1.5 rounded-full border border-white/20 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
            >
              <Check size={13} strokeWidth={3} />
              Done
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${currentPage * 100}%` }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="flex h-full w-full cursor-grab active:cursor-grabbing"
      >
        {/* Page 1: Widgets & Apps */}
        <div className="min-w-full h-full p-6 pt-24 grid grid-cols-4 grid-rows-6 gap-x-5 gap-y-7 content-start">
          {/* Large Widget Simulation */}
          <div className="col-span-2 row-span-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col justify-between shadow-xl">
            <div className="flex justify-between items-start">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Weather</span>
              <span className="text-white text-xl font-medium">14°</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold">San Francisco</span>
              <span className="text-white/60 text-[10px]">Mostly Cloudy</span>
            </div>
          </div>
          
          {/* Small Widget Simulation */}
          <div className="col-span-2 row-span-2 bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col justify-between shadow-xl">
             <div className="flex justify-between items-start">
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Calendar</span>
              <span className="text-red-400 text-xs font-bold">MON</span>
            </div>
            <div className="flex flex-col">
              <span className="text-white text-2xl font-light">17</span>
              <span className="text-white/60 text-[10px]">No events today</span>
            </div>
          </div>

          {page1Apps.map(app => (
            <AppIcon key={app.id} app={app} />
          ))}
        </div>

        {/* Page 2: More Apps */}
        <div className="min-w-full h-full p-6 pt-24 grid grid-cols-4 grid-rows-6 gap-x-5 gap-y-7 content-start">
          {page2Apps.map(app => (
            <AppIcon key={app.id} app={app} />
          ))}
          {page2Apps.length === 0 && (
            <div className="col-span-4 row-span-4 flex flex-col items-center justify-center text-center text-white/30 text-xs px-10 gap-2">
              <p>Drag icons from other pages or reset layout to put apps here.</p>
            </div>
          )}
        </div>

        {/* Page 3: App Library */}
        <div className="min-w-full h-full">
          <AppLibrary />
        </div>
      </motion.div>

      {/* Page Indicators */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {Array.from({ length: totalPages }).map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300",
              currentPage === i ? "bg-white scale-125" : "bg-white/30"
            )} 
          />
        ))}
      </div>
    </div>
  );
};

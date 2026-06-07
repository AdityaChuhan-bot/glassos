import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { MOCK_APPS } from '../constants';
import { AppIcon } from './AppIcon';
import { AppLibrary } from './AppLibrary';
import { cn } from '../lib/utils';

export const HomeScreen: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 3; // 2 home pages + 1 library

  const x = useMotionValue(0);
  
  const handleDragEnd = (_: any, info: any) => {
    const threshold = 50;
    if (info.offset.x < -threshold && currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    } else if (info.offset.x > threshold && currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="relative h-full overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={{ x: `-${currentPage * 100}%` }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="flex h-full w-full cursor-grab active:cursor-grabbing"
      >
        {/* Page 1: Widgets & Apps */}
        <div className="min-w-full h-full p-6 pt-16 grid grid-cols-4 grid-rows-6 gap-6">
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

          {MOCK_APPS.slice(0, 12).map(app => (
            <AppIcon key={app.id} app={app} />
          ))}
        </div>

        {/* Page 2: More Apps */}
        <div className="min-w-full h-full p-6 pt-16 grid grid-cols-4 grid-rows-6 gap-6">
          {MOCK_APPS.slice(12).map(app => (
            <AppIcon key={app.id} app={app} />
          ))}
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

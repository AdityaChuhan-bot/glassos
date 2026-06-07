import React, { useRef, useState, useEffect } from 'react';
import { 
  Phone, MessageSquare, Compass, Music, Image, Camera, 
  Mail, Calendar, FileText, Settings, ShoppingBag, Map, 
  Cloud, Clock, Calculator, Folder, List, Wallet, Heart, Zap, X,
  Chrome, Play, Youtube
} from 'lucide-react';
import { AppInfo } from '../types';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useLauncher } from '../context/LauncherContext';

const ICON_MAP: Record<string, any> = {
  Phone, MessageSquare, Compass, Music, Image, Camera, 
  Mail, Calendar, FileText, Settings, ShoppingBag, Map, 
  Cloud, Clock, Calculator, Folder, List, Wallet, Heart, Zap,
  Chrome, Play, Youtube
};

interface AppIconProps {
  app: AppInfo;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const AppIcon: React.FC<AppIconProps> = ({ app, showLabel = true, size = 'md', onClick }) => {
  const { isEditMode, setIsEditMode, removeAppFromHomeScreen } = useLauncher();
  const [showConfirm, setShowConfirm] = useState(false);
  const Icon = ICON_MAP[app.icon] || Folder;
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isLongPress.current = false;
    if (isEditMode) return; // already in edit mode, no need to trigger timer
    
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setIsEditMode(true);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 600); // 600ms hold
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    if (isLongPress.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (!isEditMode && onClick) {
      onClick();
    }
  };

  const handlePointerCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirmRemove = () => {
    removeAppFromHomeScreen(app.id);
    setShowConfirm(false);
  };

  // Organic jiggle characteristics
  const charSeed = app.id.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const rotateAngle = 1.6 + (charSeed % 3) * 0.3; // 1.6 to 2.2 degrees
  const duration = 0.20 + (charSeed % 5) * 0.02; // 0.20s to 0.28s
  const randomDelay = (charSeed % 10) * -0.03; // staggered starts

  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-16 h-16'
  };

  const iconSize = {
    sm: 20,
    md: 28,
    lg: 32
  };

  return (
    <>
      <motion.div 
        className="relative flex flex-col items-center gap-1 cursor-pointer select-none touch-none"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerCancel}
        animate={isEditMode ? {
          rotate: [0, rotateAngle, -rotateAngle, rotateAngle, 0],
          x: [0, -0.4, 0.4, -0.4, 0],
          y: [0, 0.4, -0.4, 0.4, 0]
        } : { rotate: 0, x: 0, y: 0 }}
        transition={isEditMode ? {
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: randomDelay
        } : { duration: 0.1 }}
      >
        {/* Delete Badge */}
        <AnimatePresence>
          {isEditMode && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={handleDeleteClick}
              className="absolute -top-1.5 -left-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full w-5 h-5 flex items-center justify-center border border-white/20 shadow-md backdrop-blur-md z-30 transition-transform active:scale-95"
            >
              <X size={10} strokeWidth={3} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Outer Icon Body with Premium Liquid Glass rendering */}
        <motion.div 
          whileTap={!isEditMode ? { scale: 0.88 } : {}}
          className={cn(
            "relative rounded-[1.3rem] flex items-center justify-center transition-all overflow-hidden border border-white/20 shadow-[0_5px_15px_rgba(0,0,0,0.2)]",
            app.color,
            sizeClasses[size],
            isEditMode && "shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
          )}
        >
          {/* Contrast layer for white/light icons */}
          {app.color === 'bg-white' && (
            <div className="absolute inset-0 bg-[#F2F2F7]/50 mix-blend-multiply pointer-events-none" />
          )}

          {/* Liquid glass refraction base gradient (deep saturated bottom shadow and corner lights) */}
          <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/20 pointer-events-none" />

          {/* Three-dimensional circular inner border ring (soft inner shadow glow) */}
          <div className="absolute inset-[1px] rounded-[1.2rem] bg-gradient-to-b from-white/25 via-transparent to-black/30 pointer-events-none" />

          {/* Curved liquid glass lens bubble sheen (renders the classic rounded iOS glossy lens cap) */}
          <div className="absolute top-0 left-[-15%] w-[130%] h-[48%] bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-b-[45%] pointer-events-none" />

          {/* Extreme top high-intensity reflection shine overlay */}
          <div className="absolute top-[2px] right-[4px] w-[88%] h-[12%] bg-white/25 blur-[0.5px] rotate-[8deg] rounded-full pointer-events-none" />

          {/* Bottom fluid horizon glow reflecting back up canva */}
          <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[65%] h-[12%] bg-white/15 blur-[0.5px] rounded-full pointer-events-none" />

          {/* Main Original App Icon rendered center with deep dimensional drop shadow */}
          <Icon 
            size={iconSize[size]} 
            className={cn(
              "relative z-10 transition-transform filter drop-shadow-[0_3px_5px_rgba(0,0,0,0.35)]",
              app.color === 'bg-white' ? 'text-gray-800' : 'text-white'
            )} 
          />
        </motion.div>

        {showLabel && (
          <span className="text-[11px] text-white font-medium drop-shadow-md truncate w-full text-center px-1">
            {app.name}
          </span>
        )}
      </motion.div>

      {/* iOS Apple style beautiful confirm modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/45 backdrop-blur-md z-[100] px-8">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/90 dark:bg-[#1C1C1E]/95 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[20px] max-w-[270px] w-full text-center p-5 shadow-2xl flex flex-col items-center"
            >
              <span className="text-black dark:text-white font-semibold text-[17px] mb-1">
                Remove "{app.name}"?
              </span>
              <span className="text-[#3A3A3C] dark:text-[#E5E5EA]/70 text-[13px] leading-tight px-1 mb-5">
                Removing from Home Screen will keep the app in your App Library.
              </span>
              
              <div className="flex flex-col w-full border-t border-gray-300/40 dark:border-white/10">
                <button 
                  onClick={handleConfirmRemove}
                  className="w-full py-3 text-red-500 font-semibold text-[17px] text-center active:bg-gray-200/50 dark:active:bg-white/5 transition-colors border-b border-gray-300/40 dark:border-white/10"
                >
                  Remove from Home Screen
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-3 text-[#0A84FF] font-normal text-[17px] text-center active:bg-gray-200/50 dark:active:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

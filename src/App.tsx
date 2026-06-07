import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AOD } from './components/AOD';
import { LockScreen } from './components/LockScreen';
import { HomeScreen } from './components/HomeScreen';
import { Dock } from './components/Dock';
import { DynamicIsland } from './components/DynamicIsland';
import { StatusBar } from './components/StatusBar';
import { Spotlight } from './components/Spotlight';
import { ScreenState } from './types';
import { LauncherProvider, useLauncher } from './context/LauncherContext';
import { AppOverlayContainer } from './components/AppOverlayContainer';
import { AppDrawer } from './components/AppDrawer';
import { ControlCenterShade } from './components/ControlCenterShade';

function DeviceFrame() {
  const [screen, setScreen] = useState<ScreenState>('AOD');
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const { 
    wallpaper, 
    controlCenterOpen, 
    setControlCenterOpen,
    flashlightActive,
    batterySaverActive
  } = useLauncher();

  // Handle global shortcuts/gestures
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSpotlightOpen) setIsSpotlightOpen(false);
        else setScreen('AOD');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSpotlightOpen]);

  const handleWake = () => {
    setScreen('LOCK');
  };

  const handleUnlock = () => {
    setScreen('HOME');
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden select-none">
      
      {/* Background custom wallpaper layered with ambient screen filters */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-[1.04]"
        style={{ 
          backgroundImage: `url(${wallpaper})`,
          filter: screen === 'AOD' 
            ? 'brightness(0.12) blur(30px)' 
            : screen === 'LOCK'
              ? 'brightness(0.68) blur(6px)'
              : batterySaverActive
                ? 'brightness(0.65)'
                : 'brightness(0.9)'
        }}
      />
      
      {/* Subtle overlay shading for beautiful contrast */}
      <div className="absolute inset-0 bg-[#000]/15 pointer-events-none z-0" />

      <AnimatePresence mode="wait">
        {screen === 'AOD' ? (
          <AOD key="aod" onWake={handleWake} />
        ) : screen === 'LOCK' ? (
          <LockScreen key="lock" onUnlock={handleUnlock} />
        ) : (
          <motion.div
            key="launcher"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative w-full h-full"
          >
            {/* Interactive Status Bar (tapping it slides down the stock quick tiles) */}
            <div 
              className="absolute top-0 left-0 right-0 h-10 z-[45] pointer-events-auto cursor-pointer"
              onClick={() => setControlCenterOpen(!controlCenterOpen)}
            >
              <StatusBar />
            </div>

            <DynamicIsland />
            
            <HomeScreen />
            
            <Dock />
            
            <AppOverlayContainer />
            
            {/* Slide Down Stock Controls & Notifications Liquid Glass Shade */}
            <ControlCenterShade />

            {/* Slide Up Applications Liquid Glass Drawer */}
            <AppDrawer />
            
            <Spotlight 
              isOpen={isSpotlightOpen} 
              onClose={() => setIsSpotlightOpen(false)} 
            />

            {/* Subtle swipe down detector near the top for quick-access shade trigger */}
            <div 
              className="absolute top-0 left-0 right-0 h-16 z-10"
              onMouseDown={(e) => {
                const startY = e.clientY;
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  if (moveEvent.clientY - startY > 15) {
                    setControlCenterOpen(true);
                    document.removeEventListener('mousemove', handleMouseMove);
                  }
                };
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', () => {
                  document.removeEventListener('mousemove', handleMouseMove);
                }, { once: true });
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glossy Hardware Frame Pill Button (Locks or steps system clock down) */}
      {screen !== 'AOD' && (
        <div 
          id="hardware_locking_line"
          className="fixed bottom-2.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/45 rounded-full z-50 cursor-pointer hover:bg-white/70 active:scale-95 transition-all"
          onClick={() => {
            if (screen === 'HOME') {
              setScreen('LOCK');
            } else if (screen === 'LOCK') {
              setScreen('AOD');
            }
          }}
        />
      )}

      {/* Interactive Flashlight Glow top beam indicator */}
      <AnimatePresence>
        {flashlightActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 right-0 h-2 bg-amber-400 blur-[3px] shadow-[0_0_20px_5px_rgba(245,158,11,0.7)] pointer-events-none z-[100] animate-pulse" 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <LauncherProvider>
      <div className="w-full h-screen bg-[#111115] flex items-center justify-center p-0 md:p-3">
        {/* Device screen size constraints representing premium flagship frame */}
        <div className="w-full h-full md:max-w-[430px] md:max-h-[880px] md:rounded-[3rem] md:border-8 md:border-neutral-800 md:shadow-2xl relative overflow-hidden transition-all bg-black flex-shrink-0">
          <DeviceFrame />
        </div>
      </div>
    </LauncherProvider>
  );
}

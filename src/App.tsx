import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AOD } from './components/AOD';
import { HomeScreen } from './components/HomeScreen';
import { Dock } from './components/Dock';
import { DynamicIsland } from './components/DynamicIsland';
import { StatusBar } from './components/StatusBar';
import { Spotlight } from './components/Spotlight';
import { ScreenState } from './types';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('AOD');
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  // Handle global gestures
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
    setScreen('HOME');
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-sans select-none">
      {/* Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-110"
        style={{ 
          backgroundImage: 'url(https://picsum.photos/seed/glassy/1920/1080)',
          filter: screen === 'AOD' ? 'brightness(0.2) blur(20px)' : 'brightness(0.8)'
        }}
      />

      <AnimatePresence mode="wait">
        {screen === 'AOD' ? (
          <AOD key="aod" onWake={handleWake} />
        ) : (
          <motion.div
            key="launcher"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="relative w-full h-full"
          >
            <StatusBar />
            <DynamicIsland />
            
            <HomeScreen />
            
            <Dock />
            
            <Spotlight 
              isOpen={isSpotlightOpen} 
              onClose={() => setIsSpotlightOpen(false)} 
            />

            {/* Swipe down gesture area for Spotlight */}
            <div 
              className="absolute top-0 left-0 right-0 h-40 z-10"
              onMouseDown={(e) => {
                const startY = e.clientY;
                const handleMouseMove = (moveEvent: MouseEvent) => {
                  if (moveEvent.clientY - startY > 50) {
                    setIsSpotlightOpen(true);
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

      {/* Home Indicator */}
      {screen !== 'AOD' && (
        <div 
          className="fixed bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-50 cursor-pointer hover:bg-white/60 transition-colors"
          onClick={() => setScreen('AOD')}
        />
      )}
    </div>
  );
}

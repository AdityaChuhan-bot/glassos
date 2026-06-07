import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLauncher } from '../context/LauncherContext';
import { PhoneApp } from './apps/PhoneApp';
import { HeatingCenter } from './apps/HeatingCenter';
import { ControlCenter } from './apps/ControlCenter';
import { DecoyApp } from './apps/DecoyApp';

export const AppOverlayContainer: React.FC = () => {
  const { activeAppId, closeActiveApp } = useLauncher();

  const renderActiveApp = () => {
    switch (activeAppId) {
      case 'phone':
        return <PhoneApp onClose={closeActiveApp} />;
      case 'heating':
        return <HeatingCenter onClose={closeActiveApp} />;
      case 'control':
        return <ControlCenter onClose={closeActiveApp} />;
      case 'decoy':
        return <DecoyApp onClose={closeActiveApp} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {activeAppId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-md rounded-[2.5rem] overflow-hidden"
        >
          {renderActiveApp()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

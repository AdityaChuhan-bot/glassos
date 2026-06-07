import React from 'react';
import { AppIcon } from './AppIcon';
import { useLauncher } from '../context/LauncherContext';

export const Dock: React.FC = () => {
  const { dockApps, openApp } = useLauncher();

  return (
    <div className="fixed bottom-4 left-4 right-4 h-24 bg-white/20 backdrop-blur-2xl rounded-[2.5rem] border border-white/20 flex items-center justify-evenly px-4 shadow-2xl z-30">
      {dockApps.map(app => (
        <AppIcon key={app.id} app={app} showLabel={false} size="lg" onClick={() => openApp(app.id)} />
      ))}
    </div>
  );
};

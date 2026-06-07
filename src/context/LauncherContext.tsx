import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_APPS } from '../constants';
import { AppInfo } from '../types';

interface LauncherContextType {
  isEditMode: boolean;
  setIsEditMode: (val: boolean) => void;
  homeApps: AppInfo[];
  dockApps: AppInfo[];
  libraryApps: AppInfo[];
  removeAppFromHomeScreen: (appId: string) => void;
  resetHomeScreen: () => void;
}

const LauncherContext = createContext<LauncherContextType | undefined>(undefined);

export const LauncherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [homeAppIds, setHomeAppIds] = useState<string[]>(() => {
    // Default home apps: MOCK_APPS excluding the dock apps
    const dockIds = ['phone', 'messages', 'chrome', 'music'];
    return MOCK_APPS.filter(app => !dockIds.includes(app.id)).map(app => app.id);
  });
  const [dockAppIds, setDockAppIds] = useState<string[]>(['phone', 'messages', 'chrome', 'music']);

  // Close edit mode on Esc or custom triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const homeApps = MOCK_APPS.filter(app => homeAppIds.includes(app.id));
  const dockApps = MOCK_APPS.filter(app => dockAppIds.includes(app.id));
  const libraryApps = MOCK_APPS; // Library always has all apps!

  const removeAppFromHomeScreen = (appId: string) => {
    // If it's a home app, remove it from the home screen
    setHomeAppIds(prev => prev.filter(id => id !== appId));
    // If it's in dock, remove it from the dock
    setDockAppIds(prev => prev.filter(id => id !== appId));
  };

  const resetHomeScreen = () => {
    const dockIds = ['phone', 'messages', 'chrome', 'music'];
    setHomeAppIds(MOCK_APPS.filter(app => !dockIds.includes(app.id)).map(app => app.id));
    setDockAppIds(dockIds);
    setIsEditMode(false);
  };

  return (
    <LauncherContext.Provider value={{
      isEditMode,
      setIsEditMode,
      homeApps,
      dockApps,
      libraryApps,
      removeAppFromHomeScreen,
      resetHomeScreen
    }}>
      {children}
    </LauncherContext.Provider>
  );
};

export const useLauncher = () => {
  const context = useContext(LauncherContext);
  if (!context) {
    throw new Error('useLauncher must be used within a LauncherProvider');
  }
  return context;
};

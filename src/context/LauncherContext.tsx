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
  activeAppId: string | null;
  openApp: (appId: string) => void;
  closeActiveApp: () => void;
  
  // Custom Wallpaper State
  wallpaper: string;
  setWallpaper: (val: string) => void;
  
  // Custom Glass App Drawer State
  appDrawerOpen: boolean;
  setAppDrawerOpen: (val: boolean) => void;
  
  // Stock Android-Style Control Center Shade State
  controlCenterOpen: boolean;
  setControlCenterOpen: (val: boolean) => void;
  
  // Quick Settings States (Stock Android Simulators)
  wifiActive: boolean;
  setWifiActive: (val: boolean) => void;
  bluetoothActive: boolean;
  setBluetoothActive: (val: boolean) => void;
  dndActive: boolean;
  setDndActive: (val: boolean) => void;
  airplaneActive: boolean;
  setAirplaneActive: (val: boolean) => void;
  flashlightActive: boolean;
  setFlashlightActive: (val: boolean) => void;
  batterySaverActive: boolean;
  setBatterySaverActive: (val: boolean) => void;
  autoRotateActive: boolean;
  setAutoRotateActive: (val: boolean) => void;
  
  // System sliders
  brightness: number;
  setBrightness: (val: number) => void;
  volume: number;
  setVolume: (val: number) => void;
}

const LauncherContext = createContext<LauncherContextType | undefined>(undefined);

export const LauncherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeAppId, setActiveAppId] = useState<string | null>(null);
  const [homeAppIds, setHomeAppIds] = useState<string[]>(() => {
    // Default home apps: MOCK_APPS excluding the dock apps
    const dockIds = ['phone', 'messages', 'chrome', 'music'];
    return MOCK_APPS.filter(app => !dockIds.includes(app.id)).map(app => app.id);
  });
  const [dockAppIds, setDockAppIds] = useState<string[]>(['phone', 'messages', 'chrome', 'music']);

  // Dynamic customization states
  const [wallpaper, setWallpaper] = useState<string>(() => {
    const cached = localStorage.getItem('glassy_os_wallpaper');
    return cached || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop';
  });

  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);

  // Quick settings simulator states
  const [wifiActive, setWifiActive] = useState(true);
  const [bluetoothActive, setBluetoothActive] = useState(true);
  const [dndActive, setDndActive] = useState(false);
  const [airplaneActive, setAirplaneActive] = useState(false);
  const [flashlightActive, setFlashlightActive] = useState(false);
  const [batterySaverActive, setBatterySaverActive] = useState(false);
  const [autoRotateActive, setAutoRotateActive] = useState(true);

  const [brightness, setBrightness] = useState(72);
  const [volume, setVolume] = useState(55);

  useEffect(() => {
    localStorage.setItem('glassy_os_wallpaper', wallpaper);
  }, [wallpaper]);

  // Close edit mode on Esc or custom triggers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditMode(false);
        setActiveAppId(null);
        setAppDrawerOpen(false);
        setControlCenterOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const homeApps = MOCK_APPS.filter(app => homeAppIds.includes(app.id));
  const dockApps = MOCK_APPS.filter(app => dockAppIds.includes(app.id));
  const libraryApps = MOCK_APPS; // Library always has all apps!

  const openApp = (appId: string) => {
    setActiveAppId(appId);
  };

  const closeActiveApp = () => {
    setActiveAppId(null);
  };

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
    setActiveAppId(null);
  };

  return (
    <LauncherContext.Provider value={{
      isEditMode,
      setIsEditMode,
      homeApps,
      dockApps,
      libraryApps,
      removeAppFromHomeScreen,
      resetHomeScreen,
      activeAppId,
      openApp,
      closeActiveApp,
      
      wallpaper,
      setWallpaper,
      appDrawerOpen,
      setAppDrawerOpen,
      controlCenterOpen,
      setControlCenterOpen,
      
      wifiActive,
      setWifiActive,
      bluetoothActive,
      setBluetoothActive,
      dndActive,
      setDndActive,
      airplaneActive,
      setAirplaneActive,
      flashlightActive,
      setFlashlightActive,
      batterySaverActive,
      setBatterySaverActive,
      autoRotateActive,
      setAutoRotateActive,
      
      brightness,
      setBrightness,
      volume,
      setVolume
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

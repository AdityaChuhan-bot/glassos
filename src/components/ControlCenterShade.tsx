import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLauncher } from '../context/LauncherContext';
import { 
  Wifi, Bluetooth, Moon, Plane, Sliders, Sun, Volume2, 
  Battery, Clock, BatteryCharging, ChevronUp, Bell, Trash2, 
  Settings, Image as ImageIcon, Camera, Check, Sparkles, Lightbulb, X
} from 'lucide-react';
import { cn } from '../lib/utils';

// Static notify records
interface SystemNotification {
  id: string;
  app: string;
  time: string;
  title: string;
  body: string;
  iconColor: string;
}

const WALLPAPER_PRESETS = [
  { id: 'sapphire', name: 'Sapphire Glass', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop', color: 'from-blue-600 to-indigo-900' },
  { id: 'frost', name: 'Nordic Frost', url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1280&auto=format&fit=crop', color: 'from-sky-300 to-slate-500' },
  { id: 'sunset', name: 'Sunset Amber', url: 'https://images.unsplash.com/photo-1618005198143-d366883d6a6d?q=80&w=1280&auto=format&fit=crop', color: 'from-amber-500 to-rose-700' },
  { id: 'emerald', name: 'Emerald Forest', url: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1280&auto=format&fit=crop', color: 'from-emerald-500 to-teal-800' },
  { id: 'midnight', name: 'Cosmic Onyx', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1280&auto=format&fit=crop', color: 'from-purple-800 to-black' }
];

export const ControlCenterShade: React.FC = () => {
  const {
    controlCenterOpen,
    setControlCenterOpen,
    
    // Quick settings states from context
    wifiActive, setWifiActive,
    bluetoothActive, setBluetoothActive,
    dndActive, setDndActive,
    airplaneActive, setAirplaneActive,
    flashlightActive, setFlashlightActive,
    batterySaverActive, setBatterySaverActive,
    autoRotateActive, setAutoRotateActive,
    
    wallpaper, setWallpaper,
    brightness, setBrightness,
    volume, setVolume
  } = useLauncher();

  // Selected sub-tab for setting menu (wallpapers vs notifications)
  const [activeTab, setActiveTab] = useState<'quick' | 'wallpaper'>('quick');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showCustomSuccess, setShowCustomSuccess] = useState(false);

  // Mock Notification logs
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    { id: '1', app: 'Gmail', time: '10m ago', title: 'System Security Alert', body: 'New node connection request authorized from trusted device.', iconColor: 'bg-red-500' },
    { id: '2', app: 'Messages', time: '1hr ago', title: 'Alpha Node', body: 'Warp relay completed. Decoy vaults fully loaded.', iconColor: 'bg-blue-500' }
  ]);

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleCustomWallpaperApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrlInput.trim()) return;
    setWallpaper(customUrlInput.trim());
    setShowCustomSuccess(true);
    setTimeout(() => setShowCustomSuccess(false), 2500);
  };

  return (
    <AnimatePresence>
      {controlCenterOpen && (
        <motion.div
          id="liquid_glass_control_center_shade"
          initial={{ y: '-100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0.8 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed inset-x-0 top-0 bottom-12 z-50 bg-[#0E0F12]/80 backdrop-blur-[45px] border-b border-white/25 rounded-b-[2.5rem] flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.6)] select-none overflow-hidden"
        >
          {/* Top light lens curve highlighting the panel */}
          <div className="absolute top-0 left-[-10%] w-[120%] h-[30%] bg-gradient-to-b from-white/10 via-transparent to-transparent rounded-b-[50%] pointer-events-none" />
          
          {/* Scrollable Container */}
          <div className="flex-1 overflow-y-auto px-6 pt-14 pb-8 flex flex-col gap-6 custom-scrollbar relative z-10">
            
            {/* Core Header info (clock + battery + quick action headers) */}
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-sans tracking-tight">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono text-white/60">
                  Android 15 S
                </span>
              </div>

              <div className="flex items-center gap-3 text-white/80">
                <div className="flex items-center gap-1 font-mono text-xs">
                  <BatteryCharging size={13} className="text-emerald-400 animate-pulse" />
                  <span>88%</span>
                </div>
                {/* Expandable Tab controls for Panel Settings */}
                <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/5 text-[11px] font-semibold">
                  <button 
                    onClick={() => setActiveTab('quick')}
                    className={cn(
                      "px-3 py-1 rounded-lg transition-all",
                      activeTab === 'quick' ? "bg-white/15 text-white font-bold" : "text-white/50"
                    )}
                  >
                    Quick Tiles
                  </button>
                  <button 
                    onClick={() => setActiveTab('wallpaper')}
                    className={cn(
                      "px-3 py-1 rounded-lg transition-all flex items-center gap-1",
                      activeTab === 'wallpaper' ? "bg-white/15 text-white font-bold text-emerald-400" : "text-white/50"
                    )}
                  >
                    <ImageIcon size={11} /> Wallpaper
                  </button>
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'quick' ? (
                <motion.div 
                  key="quick"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-5"
                >
                  {/* Stock Android 15 Quick Settings Tiles Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Wi-Fi Quick Tile */}
                    <button
                      onClick={() => setWifiActive(!wifiActive)}
                      className={cn(
                        "relative flex items-center gap-3 p-3.5 rounded-[1.3rem] border text-left transition-all overflow-hidden group",
                        wifiActive 
                          ? "bg-sky-500/20 border-sky-400/40 text-sky-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]" 
                          : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/3 to-transparent pointer-events-none" />
                      <div className={cn(
                        "p-2 rounded-xl bg-white/5",
                        wifiActive ? "bg-sky-400/25 text-sky-300" : "text-white/40"
                      )}>
                        <Wifi size={17} className={wifiActive ? "animate-pulse" : ""} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Internet</div>
                        <div className="text-[10px] opacity-70 truncate font-mono">
                          {wifiActive ? "GlassyRelay" : "Disabled"}
                        </div>
                      </div>
                    </button>

                    {/* Bluetooth Quick Tile */}
                    <button
                      onClick={() => setBluetoothActive(!bluetoothActive)}
                      className={cn(
                        "relative flex items-center gap-3 p-3.5 rounded-[1.3rem] border text-left transition-all overflow-hidden group",
                        bluetoothActive 
                          ? "bg-indigo-500/20 border-indigo-400/40 text-indigo-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]" 
                          : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/3 to-transparent pointer-events-none" />
                      <div className={cn(
                        "p-2 rounded-xl bg-white/5",
                        bluetoothActive ? "bg-indigo-400/25 text-indigo-300" : "text-white/40"
                      )}>
                        <Bluetooth size={17} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Bluetooth</div>
                        <div className="text-[10px] opacity-70 truncate font-mono">
                          {bluetoothActive ? "On (NFC)" : "Disabled"}
                        </div>
                      </div>
                    </button>

                    {/* Flashlight Quick Tile */}
                    <button
                      onClick={() => setFlashlightActive(!flashlightActive)}
                      className={cn(
                        "relative flex items-center gap-3 p-3.5 rounded-[1.3rem] border text-left transition-all overflow-hidden group",
                        flashlightActive 
                          ? "bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05),0_0_15px_rgba(245,158,11,0.2)]" 
                          : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/3 to-transparent pointer-events-none" />
                      <div className={cn(
                        "p-2 rounded-xl bg-white/5",
                        flashlightActive ? "bg-amber-400/25 text-amber-300" : "text-white/40"
                      )}>
                        <Lightbulb size={17} className={flashlightActive ? "text-amber-300 animate-bounce" : ""} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Flashlight</div>
                        <div className="text-[10px] opacity-70 truncate font-mono">
                          {flashlightActive ? "ACTIVE" : "Off"}
                        </div>
                      </div>
                    </button>

                    {/* Battery Saver Quick Tile */}
                    <button
                      onClick={() => setBatterySaverActive(!batterySaverActive)}
                      className={cn(
                        "relative flex items-center gap-3 p-3.5 rounded-[1.3rem] border text-left transition-all overflow-hidden group",
                        batterySaverActive 
                          ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]" 
                          : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/3 to-transparent pointer-events-none" />
                      <div className={cn(
                        "p-2 rounded-xl bg-white/5",
                        batterySaverActive ? "bg-emerald-400/25 text-emerald-300" : "text-white/40"
                      )}>
                        <Battery size={17} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Battery Saver</div>
                        <div className="text-[10px] opacity-70 truncate font-mono">
                          {batterySaverActive ? "Eco Saver" : "Disabled"}
                        </div>
                      </div>
                    </button>

                    {/* Dnd Mode Quick Tile */}
                    <button
                      onClick={() => setDndActive(!dndActive)}
                      className={cn(
                        "relative flex items-center gap-3 p-3.5 rounded-[1.3rem] border text-left transition-all overflow-hidden group",
                        dndActive 
                          ? "bg-purple-500/20 border-purple-400/40 text-purple-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]" 
                          : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/3 to-transparent pointer-events-none" />
                      <div className={cn(
                        "p-2 rounded-xl bg-white/5",
                        dndActive ? "bg-purple-400/25 text-purple-300" : "text-white/40"
                      )}>
                        <Moon size={17} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Do Not Disturb</div>
                        <div className="text-[10px] opacity-70 truncate font-mono">
                          {dndActive ? "Silent Mode" : "Off"}
                        </div>
                      </div>
                    </button>

                    {/* Airplane Mode Quick Tile */}
                    <button
                      onClick={() => setAirplaneActive(!airplaneActive)}
                      className={cn(
                        "relative flex items-center gap-3 p-3.5 rounded-[1.3rem] border text-left transition-all overflow-hidden group",
                        airplaneActive 
                          ? "bg-orange-500/20 border-orange-400/40 text-orange-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]" 
                          : "bg-white/5 border-white/5 text-white/50 hover:bg-white/10"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/3 to-transparent pointer-events-none" />
                      <div className={cn(
                        "p-2 rounded-xl bg-white/5",
                        airplaneActive ? "bg-orange-400/25 text-orange-300" : "text-white/40"
                      )}>
                        <Plane size={17} />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">Airplane Mode</div>
                        <div className="text-[10px] opacity-70 truncate font-mono">
                          {airplaneActive ? "Active" : "Off"}
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Slider controls adjusted in liquid glass */}
                  <div className="p-5 rounded-[1.8rem] bg-white/5 border border-white/10 shadow-lg flex flex-col gap-4 relative overflow-hidden">
                    {/* Top glass bubble */}
                    <div className="absolute inset-x-0 top-0 h-4 bg-white/5 pointer-events-none" />
                    
                    {/* Brightness Control */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider text-white/60">
                        <span className="flex items-center gap-1 uppercase">
                          <Sun size={13} className="text-amber-400" /> Device Brightness
                        </span>
                        <span className="font-mono">{brightness}%</span>
                      </div>
                      <div className="relative w-full h-8 bg-black/45 rounded-xl border border-white/5 overflow-hidden flex items-center">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-sky-400/30 to-sky-300/40 border-r border-white/20"
                          style={{ width: `${brightness}%` }}
                        />
                        <input
                          type="range"
                          min="10"
                          max="100"
                          value={brightness}
                          onChange={(e) => setBrightness(parseInt(e.target.value))}
                          className="w-full h-full opacity-0 cursor-pointer absolute z-10"
                        />
                        <Sun size={12} className="absolute left-3 text-white/40 pointer-events-none" />
                      </div>
                    </div>

                    {/* Volume Control */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-[11px] font-semibold tracking-wider text-white/60">
                        <span className="flex items-center gap-1 uppercase">
                          <Volume2 size={13} className="text-indigo-400" /> Audio Volume
                        </span>
                        <span className="font-mono">{volume}%</span>
                      </div>
                      <div className="relative w-full h-8 bg-black/45 rounded-xl border border-white/5 overflow-hidden flex items-center">
                        <div 
                          className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-400/30 to-indigo-300/40 border-r border-white/20"
                          style={{ width: `${volume}%` }}
                        />
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={volume}
                          onChange={(e) => setVolume(parseInt(e.target.value))}
                          className="w-full h-full opacity-0 cursor-pointer absolute z-10"
                        />
                        <Volume2 size={12} className="absolute left-3 text-white/40 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Glass Notification Shade */}
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Bell size={11} /> Notification Log ({notifications.length})
                      </span>
                      {notifications.length > 0 && (
                        <button 
                          onClick={handleClearNotifications}
                          className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 font-semibold"
                        >
                          <Trash2 size={10} /> Clear Logs
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {notifications.map(n => (
                        <motion.div
                          key={n.id}
                          layout
                          className="relative p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-1 relative overflow-hidden group hover:border-white/20 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className={cn("w-2 h-2 rounded-full", n.id === '1' ? "bg-red-400" : "bg-sky-400")} />
                              <span className="text-[10px] font-bold tracking-tight text-white/80">{n.app}</span>
                            </div>
                            <span className="text-[9px] font-mono text-white/30">{n.time}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-0.5">{n.title}</h4>
                          <p className="text-[11px] text-white/60 font-mono leading-tight">{n.body}</p>
                          
                          {/* Slide overlay close button */}
                          <button
                            onClick={() => handleDismissNotification(n.id)}
                            className="absolute top-3 right-3 text-white/30 hover:text-white/80 hover:bg-white/5 rounded-full p-1 transition-all"
                          >
                            <X size={10} />
                          </button>
                        </motion.div>
                      ))}

                      {notifications.length === 0 && (
                        <div className="text-center py-6 rounded-2xl bg-white/3 border border-dashed border-white/5 text-[11px] font-mono text-white/30">
                          Secure notification directory empty
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Interactive Wallpaper Settings Dashboard with Custom URL Input */
                <motion.div 
                  key="wallpaper"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-5"
                >
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <ImageIcon size={14} className="text-emerald-400" /> Wallpaper Presets
                      </h4>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        Select a curated ambient look for lock or home screen.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 mt-1">
                      {WALLPAPER_PRESETS.map(p => {
                        const isCurrent = wallpaper === p.url;
                        return (
                          <button
                            key={p.id}
                            onClick={() => setWallpaper(p.url)}
                            className={cn(
                              "relative h-18 rounded-xl border overflow-hidden text-left flex items-end p-2 transition-all cursor-pointer group active:scale-95",
                              isCurrent ? "border-emerald-500 ring-1 ring-emerald-500/50 scale-[1.01]" : "border-white/10 hover:border-white/25"
                            )}
                          >
                            <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-300" style={{ backgroundImage: `url(${p.url})` }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            
                            <div className="relative z-10 w-full flex justify-between items-center">
                              <span className="text-[10px] font-bold text-white truncate pr-2">{p.name}</span>
                              {isCurrent && (
                                <div className="w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <Check size={8} className="text-white" strokeWidth={3} />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Fully Customizable URL Section */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col gap-3">
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                        <Sparkles size={14} className="text-amber-400" /> Apply Custom Wallpaper URL
                      </h4>
                      <p className="text-[10px] text-white/40 mt-0.5">
                        Paste any online JPG/PNG path link below to style the system dynamically.
                      </p>
                    </div>

                    <form onSubmit={handleCustomWallpaperApply} className="flex flex-col gap-2.5 mt-1">
                      <div className="relative">
                        <input
                          type="text"
                          value={customUrlInput}
                          onChange={(e) => setCustomUrlInput(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50"
                        />
                      </div>
                      
                      <div className="flex gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setCustomUrlInput('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1280&auto=format&fit=crop')}
                          className="bg-white/5 hover:bg-white/10 text-[10px] px-3 py-1.5 rounded-lg border border-white/5 font-mono"
                        >
                          Reset Input
                        </button>
                        <button
                          type="submit"
                          className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 text-[10px] text-white font-bold px-4.5 py-1.5 rounded-lg active:scale-95 transition-all"
                        >
                          Apply Wallpaper
                        </button>
                      </div>
                    </form>

                    <AnimatePresence>
                      {showCustomSuccess && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="text-[10px] text-emerald-400 font-mono text-center flex items-center justify-center gap-1 font-semibold"
                        >
                          <Check size={11} /> Wallpaper loaded successfully across units!
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Swipe indicator / Close bar area */}
          <div 
            onClick={() => setControlCenterOpen(false)}
            className="h-10 pb-2 border-t border-white/5 bg-white/5 hover:bg-white/10 text-white/50 active:text-white/80 transition-all flex items-center justify-center flex-col cursor-pointer mt-auto"
          >
            <ChevronUp size={16} />
            <span className="text-[8.5px] font-mono tracking-widest uppercase mt-0.5">Collapse Panel</span>
          </div>

          {/* Flashlight simulator screen glow simulation */}
          <AnimatePresence>
            {flashlightActive && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.12 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-amber-400 pointer-events-none mix-blend-color-dodge z-30"
              />
            )}
          </AnimatePresence>

          {/* System Battery Saver contrasts */}
          <AnimatePresence>
            {batterySaverActive && (
              <div className="absolute inset-0 bg-black/15 pointer-events-none mix-blend-darken z-30" />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

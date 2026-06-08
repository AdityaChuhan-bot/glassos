import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, Battery, Phone, Timer, Bell, BellOff, Volume2, 
  Play, Pause, SkipForward, SkipBack, Lightbulb, 
  Mic, MicOff, RotateCcw, PhoneCall, PhoneOff, Bolt, Save, Check
} from 'lucide-react';
import { useLauncher } from '../context/LauncherContext';

// Mock high-quality tracks
const SONGS = [
  { title: "Starboy", artist: "The Weeknd", duration: 230, albumArt: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=120&h=120&q=80", gradient: "from-[#FF007A]/40 to-[#7928CA]/40" },
  { title: "Blinding Lights", artist: "The Weeknd", duration: 200, albumArt: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=120&h=120&q=80", gradient: "from-amber-500/40 to-pink-500/40" },
  { title: "Save Your Tears", artist: "The Weeknd", duration: 215, albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=120&h=120&q=80", gradient: "from-cyan-500/40 to-blue-600/40" },
  { title: "Cruel Summer", artist: "Taylor Swift", duration: 178, albumArt: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=120&h=120&q=80", gradient: "from-[#FF4E50]/40 to-[#F9D423]/40" }
];

// Mock contacts for caller simulator
const CONTACTS = [
  { name: "Sarah Connor", label: "Mobile", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" },
  { name: "Tony Stark", label: "Stark Industries", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" },
  { name: "Google AI Studio", label: "Warp Relay", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80" }
];

export const DynamicIsland: React.FC = () => {
  const { 
    flashlightActive, 
    setFlashlightActive, 
    batterySaverActive,
    volume, 
    setVolume 
  } = useLauncher();

  // Island states
  const [state, setState] = useState<'collapsed' | 'expanded' | 'full'>('collapsed');
  const [currentActivity, setCurrentActivity] = useState<'music' | 'call' | 'timer' | 'battery' | 'flashlight' | 'record' | 'silent'>('music');
  const [isHovered, setIsHovered] = useState(false);

  // 1. Music track simulation state
  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songProgress, setSongProgress] = useState(102); // starting at 1:42

  // 2. Call Simulation state
  const [callState, setCallState] = useState<'idle' | 'ringing' | 'connected'>('idle');
  const [callContactIndex, setCallContactIndex] = useState(0);
  const [callSeconds, setCallSeconds] = useState(0);

  // 3. Timer State
  const [timerDuration, setTimerDuration] = useState(300); // 5 min initially
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerAlert, setTimerAlert] = useState(false);

  // 4. Battery / Charging state
  const [batteryLevel, setBatteryLevel] = useState(84);
  const [isCharging, setIsCharging] = useState(false);
  const [showChargingFlash, setShowChargingFlash] = useState(false);

  // 5. Recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [savedMemos, setSavedMemos] = useState<string[]>([
    "Warp Drive Audio Log - 0:12",
    "Synth Waves Draft 4 - 0:45"
  ]);

  // 6. Silent state
  const [isSilent, setIsSilent] = useState(false);
  const [showSilentToast, setShowSilentToast] = useState(false);

  const activeSong = SONGS[trackIndex];
  const activeContact = CONTACTS[callContactIndex];

  // System effect listeners for deep OS integration!
  // A. Listen to hardware Flashlight adjustments
  const prevFlashlightRef = useRef(flashlightActive);
  useEffect(() => {
    if (flashlightActive !== prevFlashlightRef.current) {
      prevFlashlightRef.current = flashlightActive;
      setCurrentActivity('flashlight');
      setState('expanded');
      const timer = setTimeout(() => {
        setState('collapsed');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [flashlightActive]);

  // B. Listen to Battery Saver trigger (simulate a low battery alert)
  const prevSaverRef = useRef(batterySaverActive);
  useEffect(() => {
    if (batterySaverActive !== prevSaverRef.current) {
      prevSaverRef.current = batterySaverActive;
      if (batterySaverActive) {
        setBatteryLevel(15);
      } else {
        setBatteryLevel(84);
      }
      setCurrentActivity('battery');
      setState('expanded');
      const timer = setTimeout(() => {
        setState('collapsed');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [batterySaverActive]);

  // Handle music ticking interval
  useEffect(() => {
    let interval: any;
    if (isPlaying && currentActivity === 'music') {
      interval = setInterval(() => {
        setSongProgress(prev => {
          if (prev >= activeSong.duration) {
            // cycle track
            setTrackIndex(t => (t + 1) % SONGS.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, trackIndex, currentActivity, activeSong.duration]);

  // Handle call duration interval
  useEffect(() => {
    let interval: any;
    if (callState === 'connected' && currentActivity === 'call') {
      interval = setInterval(() => {
        setCallSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState, currentActivity]);

  // Handle countdown timer ticking
  useEffect(() => {
    let interval: any;
    if (timerRunning && timerSeconds > 0 && currentActivity === 'timer') {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            setTimerAlert(true);
            setState('full'); // Force show the ringing alarm state
            // Flash alarm alert for 5 seconds
            setTimeout(() => setTimerAlert(false), 5000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds, currentActivity]);

  // Handle Voice Recording ticking
  useEffect(() => {
    let interval: any;
    if (isRecording && currentActivity === 'record') {
      interval = setInterval(() => {
        setRecordSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, currentActivity]);

  // Trigger Charger plugging animation HUD sequence
  const handlePlugToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newChargingState = !isCharging;
    setIsCharging(newChargingState);
    if (newChargingState) {
      setBatteryLevel(84);
      setShowChargingFlash(true);
      setCurrentActivity('battery');
      setState('expanded');
      setTimeout(() => {
        setShowChargingFlash(false);
        setState('collapsed');
      }, 3500);
    }
  };

  // Trigger Silent mode Toast sequence
  const handleSilentToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const silentNext = !isSilent;
    setIsSilent(silentNext);
    setShowSilentToast(true);
    setCurrentActivity('silent');
    setState('expanded');
    setTimeout(() => {
      setShowSilentToast(false);
      setState('collapsed');
    }, 3000);
  };

  // Helper formatting for time counters
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  // Trigger dynamic size dimensions based on state and current activity
  const getDimensions = () => {
    if (state === 'collapsed') {
      switch (currentActivity) {
        case 'call': return { width: callState === 'ringing' ? 180 : 130, height: 28, borderRadius: 14 };
        case 'silent': return { width: 140, height: 28, borderRadius: 14 };
        case 'battery': return { width: 120, height: 28, borderRadius: 14 };
        case 'timer': return { width: 125, height: 28, borderRadius: 14 };
        default: return { width: 110, height: 28, borderRadius: 14 };
      }
    } else if (state === 'expanded') {
      switch (currentActivity) {
        case 'music': return { width: 230, height: 50, borderRadius: 25 };
        case 'call': return { width: callState === 'ringing' ? 320 : 220, height: 56, borderRadius: 28 };
        case 'timer': return { width: 200, height: 50, borderRadius: 25 };
        case 'battery': return { width: 220, height: 52, borderRadius: 26 };
        case 'flashlight': return { width: 180, height: 48, borderRadius: 24 };
        case 'record': return { width: 190, height: 48, borderRadius: 24 };
        default: return { width: 200, height: 50, borderRadius: 25 };
      }
    } else { // full details mode
      switch (currentActivity) {
        case 'music': return { width: 356, height: 245, borderRadius: 36 };
        case 'call': return { width: 356, height: 220, borderRadius: 36 };
        case 'timer': return { width: 356, height: 215, borderRadius: 36 };
        case 'battery': return { width: 356, height: 200, borderRadius: 36 };
        case 'flashlight': return { width: 356, height: 185, borderRadius: 36 };
        case 'record': return { width: 356, height: 215, borderRadius: 36 };
        default: return { width: 356, height: 185, borderRadius: 36 };
      }
    }
  };

  const dims = getDimensions();

  // Dynamic seek clicking inside music timeline
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressPerc = clickX / rect.width;
    setSongProgress(Math.floor(progressPerc * activeSong.duration));
  };

  // Safe volume scroll inside dynamic island
  const handleVolumeScroll = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const volLevel = Math.max(0, Math.min(100, Math.floor((clickX / rect.width) * 100)));
    setVolume(volLevel);
  };

  // Handle island click routing
  const handleIslandClick = () => {
    if (state === 'collapsed') {
      setState('expanded');
    } else if (state === 'expanded') {
      setState('full');
    } else {
      setState('collapsed');
    }
  };

  return (
    <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center select-none">
      <motion.div
        layout
        onClick={handleIslandClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ width: 110, height: 28, borderRadius: 14 }}
        animate={{
          width: dims.width,
          height: dims.height,
          borderRadius: dims.borderRadius,
          boxShadow: isHovered ? "0 10px 30px -5px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.15)" : "0 8px 24px -8px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)"
        }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="bg-[#000] flex flex-col items-center justify-between cursor-pointer overflow-hidden border border-white/5"
      >
        <AnimatePresence mode="wait">
          {/* 1. COLLAPSED VIEW LAYER */}
          {state === 'collapsed' && (
            <motion.div
              key="collapsed-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between w-full h-full px-3.5 text-xs text-white"
            >
              {currentActivity === 'music' && (
                <>
                  {/* Left: Little rotating record vinyl or album icon */}
                  <div className="flex items-center gap-1">
                    <motion.div 
                      animate={{ rotate: isPlaying ? 360 : 0 }}
                      transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                      className="w-4 h-4 rounded-full border border-pink-500/30 flex items-center justify-center bg-zinc-900"
                    >
                      <Music size={8} className="text-pink-400" />
                    </motion.div>
                  </div>

                  {/* Right: Real animation Audio Spectrum Waveform */}
                  <div className="flex items-end gap-[1.5px] h-3">
                    {[4, 11, 7, 13, 5].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: isPlaying ? [3, h, 3] : 3 }}
                        transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, delay: i * 0.05 }}
                        className="w-0.5 bg-pink-500 rounded-full"
                      />
                    ))}
                  </div>
                </>
              )}

              {currentActivity === 'call' && (
                <>
                  {callState === 'ringing' ? (
                    <>
                      <div className="flex items-center gap-1.5 text-green-400">
                        <PhoneCall size={10} className="animate-bounce" />
                        <span className="text-[10px] uppercase font-bold tracking-wider">Incoming</span>
                      </div>
                      <span className="text-[10px] text-white/50">{activeContact.name.split(" ")[0]}</span>
                    </>
                  ) : callState === 'connected' ? (
                    <>
                      <span className="text-[10px] font-mono font-medium text-green-400">{formatTime(callSeconds)}</span>
                      <div className="flex items-center gap-[1px]">
                        <span className="w-0.5 h-2 bg-green-500 rounded-full animate-pulse delay-75" />
                        <span className="w-0.5 h-3 bg-green-500 rounded-full animate-pulse" />
                        <span className="w-0.5 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Phone size={10} className="text-white/40" />
                      <span className="text-[9px] text-white/30">Idle</span>
                    </>
                  )}
                </>
              )}

              {currentActivity === 'timer' && (
                <>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Timer size={10} className={timerRunning ? "animate-spin" : ""} style={{ animationDuration: '4s' }} />
                    <span className="text-[10.5px] font-mono leading-none">{formatTime(timerSeconds)}</span>
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </>
              )}

              {currentActivity === 'battery' && (
                <>
                  <div className="flex items-center gap-1 text-emerald-400">
                    {isCharging ? <Bolt size={9} className="animate-pulse" /> : <Battery size={10} />}
                    <span className="text-[10px] font-mono font-bold leading-none">{batteryLevel}%</span>
                  </div>
                  <div className="w-5 h-2.5 bg-zinc-800 rounded-[3px] p-[1px] border border-white/10 relative">
                    <div 
                      className={`h-full rounded-[1px] ${isCharging ? 'bg-emerald-400' : batteryLevel <= 20 ? 'bg-red-500' : 'bg-white'}`} 
                      style={{ width: `${batteryLevel}%` }} 
                    />
                    <div className="absolute right-[-2.5px] top-[1.5px] w-[2px] h-[5px] bg-zinc-600 rounded-r-[1px]" />
                  </div>
                </>
              )}

              {currentActivity === 'flashlight' && (
                <>
                  <div className="flex items-center gap-1.5">
                    <Lightbulb size={11} className={flashlightActive ? "text-yellow-400 fill-yellow-400/20" : "text-white/35"} />
                    <span className="text-[9.5px] font-bold tracking-widest text-white/70 uppercase">Torch</span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full ${flashlightActive ? 'bg-yellow-400' : 'bg-white/20'}`} />
                </>
              )}

              {currentActivity === 'record' && (
                <>
                  <div className="flex items-center gap-1.5">
                    <Mic size={10} className="text-red-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-bold text-red-500">{formatTime(recordSeconds)}</span>
                  </div>
                  <div className="flex gap-[1.5px] h-2.5 items-end">
                    {[3, 8, 4, 10, 2].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: isRecording ? [2, h, 2] : 2 }}
                        transition={{ repeat: Infinity, duration: 0.4 + i * 0.08, delay: i * 0.03 }}
                        className="w-[1.5px] bg-red-500 rounded-full"
                      />
                    ))}
                  </div>
                </>
              )}

              {currentActivity === 'silent' && (
                <>
                  <div className="flex items-center gap-1.5 text-indigo-400">
                    {isSilent ? <BellOff size={11} className="text-red-400" /> : <Bell size={11} className="animate-bounce" />}
                    <span className="text-[9.5px] font-bold tracking-wider uppercase">{isSilent ? "Mute" : "Ring"}</span>
                  </div>
                  <span className="text-[8px] opacity-40 font-mono">HUD</span>
                </>
              )}
            </motion.div>
          )}

          {/* 2. EXPANDED MEDIUM COMPACT BAR */}
          {state === 'expanded' && (
            <motion.div
              key="expanded-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between w-full h-full px-4 text-xs text-white"
            >
              {currentActivity === 'music' && (
                <>
                  <div className="flex items-center gap-3">
                    <img 
                      src={activeSong.albumArt} 
                      alt="album" 
                      className="w-8 h-8 rounded-lg object-cover border border-white/10"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-white text-[11px] font-bold truncate max-w-[120px]">{activeSong.title}</span>
                      <span className="text-white/50 text-[9px] truncate max-w-[120px]">{activeSong.artist}</span>
                    </div>
                  </div>
                  
                  {/* Miniature Equalizer spectrum in action */}
                  <div className="flex gap-1 h-5 px-1 items-end">
                    {[5, 16, 9, 21, 6, 12, 4].map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: isPlaying ? [3, h, 3] : 3 }}
                        transition={{ repeat: Infinity, duration: 0.6 + i * 0.08, delay: i * 0.04 }}
                        className="w-1 bg-[#FF007A] rounded-full"
                      />
                    ))}
                  </div>
                </>
              )}

              {currentActivity === 'call' && (
                <>
                  {callState === 'ringing' ? (
                    <div className="flex items-center justify-between w-full gap-2">
                      <div className="flex items-center gap-2">
                        <img src={activeContact.avatar} alt="call-avatar" className="w-8 h-8 rounded-full border border-green-500/30" referrerPolicy="no-referrer" />
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold leading-tight">{activeContact.name}</span>
                          <span className="text-[9px] text-green-400">Ringing...</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCallState('idle'); }}
                          className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center border border-white/10 active:scale-90 transition-all text-white"
                        >
                          <PhoneOff size={12} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCallState('connected'); setCallSeconds(0); }}
                          className="w-8 h-8 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center border border-white/10 active:scale-90 transition-all text-white"
                        >
                          <Phone size={12} fill="white" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2.5">
                        <img src={activeContact.avatar} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-emerald-500/40" referrerPolicy="no-referrer" />
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-bold text-white">{activeContact.name}</span>
                          <span className="text-[9px] text-green-400/80 font-mono">Active Call • SIP</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-white/50">{formatTime(callSeconds)}</span>
                        <div className="flex items-end gap-[1.5px] h-4">
                          {[3, 10, 5, 8].map((h, i) => (
                            <motion.div
                              key={i}
                              animate={{ height: [2, h, 2] }}
                              transition={{ repeat: Infinity, duration: 0.6 + i * 0.1, delay: i * 0.05 }}
                              className="w-0.5 bg-emerald-400 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              {currentActivity === 'timer' && (
                <>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] text-amber-500 uppercase tracking-wider font-extrabold font-sans">Timer Alert</span>
                    <span className="text-white text-xs font-bold font-mono">T-minus {formatTime(timerSeconds)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setTimerRunning(!timerRunning); }}
                      className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/25 flex items-center justify-center active:scale-90 transition-all text-[10px]"
                    >
                      {timerRunning ? <Pause size={10} /> : <Play size={10} fill="currentColor" />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setTimerSeconds(timerDuration); setTimerRunning(false); }}
                      className="w-6 h-6 rounded-full bg-white/10 text-white/70 border border-white/10 flex items-center justify-center active:scale-90 transition-all text-[10px]"
                    >
                      <RotateCcw size={10} />
                    </button>
                  </div>
                </>
              )}

              {currentActivity === 'battery' && (
                <>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
                      <Bolt size={14} className="animate-bounce" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-white/60 font-medium">Charger Detected</span>
                      <span className="text-emerald-400 text-xs font-bold">Charging {batteryLevel}%</span>
                    </div>
                  </div>
                  {/* Growing green pulse aura */}
                  <span className="text-[9px] font-mono text-emerald-400/50 bg-[#0c1810] px-2 py-0.5 rounded border border-emerald-500/15">
                    Fast Charge
                  </span>
                </>
              )}

              {currentActivity === 'flashlight' && (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg border flex items-center justify-center ${flashlightActive ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' : 'bg-white/5 border-white/10 text-white/40'}`}>
                      <Lightbulb size={12} className={flashlightActive ? "animate-pulse" : ""} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] text-white/50 leading-tight">Flashlight</span>
                      <span className={`text-[11px] font-black ${flashlightActive ? 'text-yellow-400' : 'text-white/60'}`}>{flashlightActive ? "BEAM ACTIVE" : "Beam Disabled"}</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFlashlightActive(!flashlightActive); }}
                    className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase transition-all ${flashlightActive ? 'bg-yellow-400 text-black' : 'bg-white/10 text-white/80 hover:bg-white/15'}`}
                  >
                    Toggle
                  </button>
                </>
              )}

              {currentActivity === 'record' && (
                <>
                  <div className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                      <Mic size={10} className="animate-pulse" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-white/40 uppercase tracking-widest font-mono">Voice Memo</span>
                      <span className="text-white text-xs font-bold">Rec. {formatTime(recordSeconds)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="text-[9px] text-red-400 font-bold uppercase tracking-wider">LIVE</span>
                  </div>
                </>
              )}

              {currentActivity === 'silent' && (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-2 rounded-xl border ${isSilent ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-indigo-500/15 border-indigo-500/20 text-indigo-400'}`}>
                      {isSilent ? <BellOff size={14} /> : <Bell size={14} className="animate-bounce" />}
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] text-white/50 leading-none">System Volume Profile</span>
                      <span className={`text-xs font-bold mt-1 ${isSilent ? 'text-red-400' : 'text-indigo-400'}`}>{isSilent ? "Silent Mode Enabled" : "Ring Mode Active"}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40 font-mono">Muted</span>
                </div>
              )}
            </motion.div>
          )}

          {/* 3. FULL DETAILS ACTIVE INTERFACE */}
          {state === 'full' && (
            <motion.div
              key="full-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col w-full h-full p-4 justify-between"
            >
              {/* Main Content Pane */}
              <div className="flex-1 flex flex-col justify-start w-full">
                
                {/* 3.1 Now Playing Dashboard */}
                {currentActivity === 'music' && (
                  <div className="flex flex-col gap-3 font-sans">
                    <div className="flex items-center gap-3.5">
                      {/* Album Art Frame */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${activeSong.gradient} p-[1.5px] shadow-lg relative border border-white/10 shrink-0`}>
                        <img 
                          src={activeSong.albumArt} 
                          alt="art" 
                          className="w-full h-full rounded-2xl object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/10 rounded-2xl" />
                      </div>
                      
                      <div className="flex flex-col text-left flex-1 min-w-0">
                        <span className="text-white text-[14px] font-black tracking-tight truncate">{activeSong.title}</span>
                        <span className="text-white/60 text-[10.5px] truncate">{activeSong.artist}</span>
                      </div>

                      {/* Animated audio spikes list */}
                      <div className="flex items-end gap-[2px] h-7 px-1">
                        {[1, 2, 3, 2, 4, 1].map((r, i) => (
                          <motion.div 
                            key={i} 
                            animate={{ height: isPlaying ? [r * 4, r * 10, r * 4] : 4 }} 
                            transition={{ repeat: Infinity, duration: 0.4 + i*0.08 }}
                            className="w-[3px] bg-pink-500 rounded-full" 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Timeline Slider & Click seeker */}
                    <div className="flex flex-col gap-1.5 mt-1.5" onClick={(e) => e.stopPropagation()}>
                      <div 
                        onClick={handleSeek} 
                        className="h-1.5 bg-white/15 rounded-full overflow-hidden relative cursor-pointer group"
                      >
                        <motion.div 
                          className="h-full bg-white relative rounded-full" 
                          style={{ width: `${(songProgress / activeSong.duration) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-white/35 font-mono font-bold">
                        <span>{formatTime(songProgress)}</span>
                        <span>{formatTime(activeSong.duration)}</span>
                      </div>
                    </div>

                    {/* Media Control Deck */}
                    <div className="flex justify-center items-center gap-8 mt-1" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => { setTrackIndex((t) => (t - 1 + SONGS.length) % SONGS.length); setSongProgress(0); }}
                        className="text-white/70 hover:text-white p-1 hover:scale-110 active:scale-95 transition-all"
                      >
                        <SkipBack size={16} fill="currentColor" />
                      </button>
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all ${isPlaying ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
                      >
                        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                      </button>
                      <button 
                        onClick={() => { setTrackIndex((t) => (t + 1) % SONGS.length); setSongProgress(0); }}
                        className="text-white/70 hover:text-white p-1 hover:scale-110 active:scale-95 transition-all"
                      >
                        <SkipForward size={16} fill="currentColor" />
                      </button>
                    </div>

                    {/* Connected Volume Sync Bar */}
                    <div className="flex items-center gap-2 px-2 mt-1 z-10" onClick={(e) => e.stopPropagation()}>
                      <Volume2 size={11} className="text-white/40" />
                      <div 
                        onClick={handleVolumeScroll}
                        className="h-1 bg-white/10 rounded-full flex-1 relative cursor-pointer"
                      >
                        <div className="h-full bg-white/40 rounded-full" style={{ width: `${volume}%` }} />
                      </div>
                      <span className="text-[8px] font-mono font-bold text-white/30">{volume}%</span>
                    </div>
                  </div>
                )}

                {/* 3.2 Relational Contact & Calls system */}
                {currentActivity === 'call' && (
                  <div className="flex flex-col gap-2.5 font-sans" onClick={(e) => e.stopPropagation()}>
                    {callState === 'idle' ? (
                      <div className="flex flex-col gap-2 text-left">
                        <span className="text-[10px] text-white/50 uppercase tracking-widest font-extrabold">Simulate Telephone</span>
                        <div className="grid grid-cols-3 gap-2 mt-1">
                          {CONTACTS.map((c, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setCallContactIndex(idx);
                                setCallState('ringing');
                              }}
                              className="bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 rounded-2xl p-2.5 flex flex-col items-center gap-1.5 transition-all active:scale-95 text-center min-w-0"
                            >
                              <img src={c.avatar} alt="avatar" className="w-8 h-8 rounded-full border border-white/15" referrerPolicy="no-referrer" />
                              <span className="text-[9px] font-bold text-white/90 truncate w-full">{c.name.split(" ")[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="flex justify-between items-center bg-white/5 border border-white/5 rounded-2xl p-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img src={activeContact.avatar} alt="avatar" className={`w-11 h-11 rounded-full object-cover border ${callState === 'connected' ? 'border-emerald-500 p-[1px]' : 'border-white/10'}`} referrerPolicy="no-referrer" />
                              {callState === 'connected' && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                              )}
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="text-[13px] font-black">{activeContact.name}</span>
                              <span className="text-[9px] text-white/50 font-mono leading-none">{activeContact.label} • {callState === 'ringing' ? 'Incoming Ringing' : 'Secure Connected'}</span>
                            </div>
                          </div>

                          <div className="text-right flex flex-col justify-center items-end">
                            {callState === 'connected' ? (
                              <span className="text-green-400 font-mono text-xs font-bold bg-green-500/10 border border-green-500/15 px-2 py-0.5 rounded-full">
                                {formatTime(callSeconds)}
                              </span>
                            ) : (
                              <span className="text-emerald-400 text-[10px] font-bold animate-pulse uppercase tracking-widest bg-emerald-400/15 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">Ringing</span>
                            )}
                          </div>
                        </div>

                        {/* Controls view */}
                        <div className="flex justify-center items-center gap-12 mt-3">
                          {callState === 'ringing' ? (
                            <>
                              <button 
                                onClick={() => setCallState('idle')}
                                className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white font-bold border border-white/10 shadow-lg hover:scale-105 active:scale-95 transition-all"
                              >
                                <PhoneOff size={18} />
                              </button>
                              <button 
                                onClick={() => { setCallState('connected'); setCallSeconds(0); }}
                                className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white font-bold border border-white/10 shadow-lg hover:scale-105 active:scale-95 transition-all"
                              >
                                <Phone size={18} fill="white" />
                              </button>
                            </>
                          ) : (
                            <button 
                              onClick={() => setCallState('idle')}
                              className="w-24 h-10 rounded-2xl bg-red-600 hover:bg-red-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 text-white stroke-white border border-white/10 shadow-lg hover:brightness-110 active:scale-95 transition-all"
                            >
                              <PhoneOff size={12} /> End Call
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 3.3 Dynamic Clock and Countdown Timer */}
                {currentActivity === 'timer' && (
                  <div className="flex flex-col gap-2 font-sans" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-2.5">
                      <div className="flex items-center gap-3">
                        {/* Circular progress SVG */}
                        <div className="relative w-12 h-12 flex items-center justify-center">
                          <svg className="w-12 h-12 transform -rotate-90">
                            <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.06)" strokeWidth="2.5" fill="transparent" />
                            <circle 
                              cx="24" 
                              cy="24" 
                              r="18" 
                              stroke="#f59e0b" 
                              strokeWidth="2.6" 
                              fill="transparent" 
                              strokeDasharray="113" 
                              strokeDashoffset={113 - (113 * (timerSeconds / timerDuration))} 
                              className="transition-all duration-1000"
                              strokeLinecap="round"
                            />
                          </svg>
                          <Timer size={14} className="absolute text-amber-500" />
                        </div>

                        <div className="flex flex-col text-left">
                          <span className={`${timerAlert ? 'text-red-500' : 'text-amber-500'} font-mono text-xl font-black leading-tight tracking-wider`}>
                            {formatTime(timerSeconds)}
                          </span>
                          <span className="text-[9.5px] text-white/50">{timerAlert ? '⭐ Alarm Active ⭐' : timerRunning ? 'Timer Counting...' : 'Stopped'}</span>
                        </div>
                      </div>
                      
                      {/* Operational Controllers */}
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => { setTimerRunning(!timerRunning); setTimerAlert(false); }}
                          className={`w-9 h-9 rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-all ${timerRunning ? 'bg-white text-black' : 'bg-amber-500 text-white border-amber-500/20'}`}
                        >
                          {timerRunning ? <Pause size={14} /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                        </button>
                        <button 
                          onClick={() => { setTimerSeconds(timerDuration); setTimerRunning(false); setTimerAlert(false); }}
                          className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/15 text-white/80 border border-white/10 flex items-center justify-center active:scale-90 transition-all"
                        >
                          <RotateCcw size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Countdown presets */}
                    <div className="flex gap-1.5 justify-between">
                      {[60, 180, 300, 600].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setTimerDuration(s);
                            setTimerSeconds(s);
                            setTimerRunning(true);
                            setTimerAlert(false);
                          }}
                          className={`flex-1 py-1.5 rounded-xl border font-mono text-[9px] font-bold tracking-wider uppercase transition-all active:scale-95 ${timerDuration === s ? 'bg-amber-500/25 border-amber-500/30 text-amber-400' : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'}`}
                        >
                          +{s / 60}m
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3.4 Interactive Battery HUD state */}
                {currentActivity === 'battery' && (
                  <div className="flex flex-col gap-2.5 font-sans" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Battery size={24} className={isCharging ? "text-emerald-400" : "text-white/65"} />
                          {isCharging && <Bolt size={12} className="absolute top-1.5 left-1.5 text-emerald-300 animate-bounce" />}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[12px] font-black">{isCharging ? 'AC Power Connected' : 'Discharging Battery'}</span>
                          <span className="text-[10px] text-white/50 leading-none">Status: {batteryLevel}% Power Remaining</span>
                        </div>
                      </div>

                      <div className="flex flex-col text-right">
                        <span className="text-[9.5px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">38.2°C</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={handlePlugToggle}
                        className={`flex-1 py-1.5 rounded-xl border font-bold text-[10px] uppercase tracking-wider transition-all active:scale-95 ${isCharging ? 'bg-red-500/20 border-red-500/20 text-red-400' : 'bg-emerald-500/20 border-emerald-500/20 text-emerald-400'}`}
                      >
                        {isCharging ? 'Disconnect Charger' : '🔌 Connect Virtual Charger'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 3.5 Torch Flashlight Dashboard */}
                {currentActivity === 'flashlight' && (
                  <div className="flex flex-col gap-2.5 font-sans" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${flashlightActive ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : 'bg-white/5 border-white/10 text-white/30'}`}>
                          <Lightbulb size={18} className={flashlightActive ? "animate-pulse" : ""} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[12px] font-black">Camera Flash Torch</span>
                          <span className="text-[10px] text-white/50 mt-0.5">{flashlightActive ? 'Luminous beam emitter is ON' : 'Flashlight deactivated'}</span>
                        </div>
                      </div>

                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" style={{ opacity: flashlightActive ? 1 : 0.1 }} />
                    </div>

                    <button 
                      onClick={() => setFlashlightActive(!flashlightActive)}
                      className={`py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${flashlightActive ? 'bg-yellow-400 text-black border-yellow-500/10' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'}`}
                    >
                      {flashlightActive ? 'Shutdown Light Beam' : 'Activate Torch Beam'}
                    </button>
                  </div>
                )}

                {/* 3.6 Voice Memo Recorder */}
                {currentActivity === 'record' && (
                  <div className="flex flex-col gap-2 font-sans" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-600/15 border border-red-500/25 flex items-center justify-center text-red-400">
                          <Mic size={14} className={isRecording ? "animate-pulse text-red-500" : ""} />
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[11px] font-black">Voice Note Capture</span>
                          <span className="text-red-500 font-mono text-[13px] font-bold tracking-wider">{formatTime(recordSeconds)}</span>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => setIsRecording(!isRecording)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-all ${isRecording ? 'bg-white text-black' : 'bg-red-600 text-white'}`}
                        >
                          {isRecording ? <Pause size={12} /> : <Play size={12} fill="currentColor" className="ml-0.5" />}
                        </button>
                        
                        <button 
                          onClick={() => {
                            if (recordSeconds > 0) {
                              setSavedMemos(prev => [
                                `Voice Memo ${prev.length + 1} - ${formatTime(recordSeconds)}`, 
                                ...prev
                              ]);
                              setRecordSeconds(0);
                              setIsRecording(false);
                            }
                          }}
                          disabled={recordSeconds === 0}
                          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/15 text-white disabled:opacity-30 border border-white/10 flex items-center justify-center active:scale-90 transition-all"
                        >
                          <Save size={12} />
                        </button>
                      </div>
                    </div>

                    {/* List of saved recordings inside the full island widget */}
                    <div className="flex flex-col gap-1 max-h-[46px] overflow-y-auto pr-1 text-left scrollbar-none border-t border-white/5 pt-1">
                      {savedMemos.map((memo, idx) => (
                        <div key={idx} className="flex justify-between text-[8px] font-mono text-white/50 py-0.5 border-b border-white/5">
                          <span>🎙️ {memo}</span>
                          <span className="text-emerald-400">Saved</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3.7 Silent HUD */}
                {currentActivity === 'silent' && (
                  <div className="flex flex-col gap-2.5 font-sans" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl p-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl border ${isSilent ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-indigo-500/15 border-indigo-500/20 text-indigo-400'}`}>
                          {isSilent ? <BellOff size={16} /> : <Bell size={16} className="animate-bounce" />}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[12px] font-black">System Notification Sound</span>
                          <span className="text-[10px] text-white/55">Current profile active: {isSilent ? "Silence/Muted" : "Ringer On"}</span>
                        </div>
                      </div>

                      <div className="text-indigo-400 text-[10px] font-mono">
                        {isSilent ? "🔕 SILENT" : "🔔 SOUND"}
                      </div>
                    </div>

                    <button 
                      onClick={handleSilentToggle}
                      className={`py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 ${isSilent ? 'bg-indigo-600 text-white border-indigo-500/10' : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'}`}
                    >
                      {isSilent ? 'Switch to Ringer Profile' : 'Mute System Sounds'}
                    </button>
                  </div>
                )}

              </div>

              {/* Selector menu containing clean Apple live activity mini selectors */}
              <div 
                className="flex justify-around items-center w-full px-2 py-1.5 bg-neutral-900/60 border border-white/5 rounded-2xl gap-1 text-white/40 backdrop-blur-inner overflow-x-auto scrollbar-none mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button 
                  onClick={() => { setCurrentActivity('music'); }}
                  className={`p-1.5 rounded-xl transition-all ${currentActivity === 'music' ? 'bg-pink-500/25 text-pink-400 border border-pink-500/20' : 'hover:bg-white/5 hover:text-white'}`}
                  title="Now Playing"
                >
                  <Music size={12} />
                </button>
                <button 
                  onClick={() => { setCurrentActivity('call'); }}
                  className={`p-1.5 rounded-xl transition-all ${currentActivity === 'call' ? 'bg-green-500/25 text-green-400 border border-green-500/20' : 'hover:bg-white/5 hover:text-white'}`}
                  title="Phone Call"
                >
                  <Phone size={12} />
                </button>
                <button 
                  onClick={() => { setCurrentActivity('timer'); }}
                  className={`p-1.5 rounded-xl transition-all ${currentActivity === 'timer' ? 'bg-amber-500/25 text-amber-400 border border-amber-500/20' : 'hover:bg-white/5 hover:text-white'}`}
                  title="Timer"
                >
                  <Timer size={12} />
                </button>
                <button 
                  onClick={() => { setCurrentActivity('battery'); }}
                  className={`p-1.5 rounded-xl transition-all ${currentActivity === 'battery' ? 'bg-emerald-500/25 text-emerald-400 border border-emerald-500/20' : 'hover:bg-white/5 hover:text-white'}`}
                  title="Battery"
                >
                  <Battery size={12} />
                </button>
                <button 
                  onClick={() => { setCurrentActivity('flashlight'); }}
                  className={`p-1.5 rounded-xl transition-all ${currentActivity === 'flashlight' ? 'bg-yellow-500/25 text-yellow-400 border border-yellow-500/20' : 'hover:bg-white/5 hover:text-white'}`}
                  title="Torch"
                >
                  <Lightbulb size={12} />
                </button>
                <button 
                  onClick={() => { setCurrentActivity('record'); }}
                  className={`p-1.5 rounded-xl transition-all ${currentActivity === 'record' ? 'bg-red-500/25 text-red-300 border border-red-500/20' : 'hover:bg-white/5 hover:text-white'}`}
                  title="Mic Recorder"
                >
                  <Mic size={12} />
                </button>
                <button 
                  onClick={() => { setCurrentActivity('silent'); }}
                  className={`p-1.5 rounded-xl transition-all ${currentActivity === 'silent' ? 'bg-indigo-500/25 text-indigo-400 border border-indigo-500/20' : 'hover:bg-white/5 hover:text-white'}`}
                  title="Sound"
                >
                  <Bell size={12} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

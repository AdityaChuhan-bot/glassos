import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { useLauncher } from '../context/LauncherContext';
import { 
  Lock, ArrowUp, Sun, Sparkles, Battery, CloudRain, Bell, 
  Settings, Phone, MessageSquare, Play, Pause, Music, Volume2,
  Fingerprint, ScanFace, Key, X, Check, CheckCircle2, ShieldAlert,
  RefreshCw, Delete, ArrowLeft, ShieldCheck
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LockScreenProps {
  onUnlock: () => void;
}

type SecurityMethod = 'pin' | 'fingerprint' | 'face';

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const { wallpaper, flashlightActive, brightness } = useLauncher();
  const [time, setTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(true);

  // Security layer states
  const [securityActive, setSecurityActive] = useState(false);
  const [authMethod, setAuthMethod] = useState<SecurityMethod>('pin');
  
  // PIN states
  const [enteredPin, setEnteredPin] = useState('');
  const [defaultPin, setDefaultPin] = useState('1234');
  const [pinError, setPinError] = useState<string | null>(null);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [newPinBuffer, setNewPinBuffer] = useState('');

  // Fingerprint states
  const [fingerprintScanning, setFingerprintScanning] = useState(false);
  const [fingerprintProgress, setFingerprintProgress] = useState(0);
  const [fingerprintStatus, setFingerprintStatus] = useState('Ready for authorization');
  const fingerTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Face states
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceProgress, setFaceProgress] = useState(0);
  const [faceStatus, setFaceStatus] = useState('Position face inside scanner');
  const faceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto wakeup face ID scan states
  const [autoScanActive, setAutoScanActive] = useState(true);
  const [autoScanProgress, setAutoScanProgress] = useState(0);
  const [autoScanStatus, setAutoScanStatus] = useState('Aligning Face ID Lens...');
  const autoScanTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Auto initiate biometric scan simulation on wake-up (mount)
    setAutoScanActive(true);
    setAutoScanProgress(0);
    setAutoScanStatus('Aligning Face ID Lens...');
    
    let progress = 0;
    autoScanTimerRef.current = setInterval(() => {
      progress += 10;
      setAutoScanProgress(progress);
      
      if (progress === 30) setAutoScanStatus('Analyzing ocular landmarks...');
      if (progress === 60) setAutoScanStatus('Matching dynamic face mesh...');
      if (progress === 90) setAutoScanStatus('Face verified: Aditya Chauhan');
      
      if (progress >= 100) {
        if (autoScanTimerRef.current) clearInterval(autoScanTimerRef.current);
        setAutoScanStatus('Unlocking...');
        setTimeout(() => {
          onUnlock();
        }, 400);
      }
    }, 180);

    return () => {
      clearInterval(timer);
      if (fingerTimerRef.current) clearInterval(fingerTimerRef.current);
      if (faceTimerRef.current) clearInterval(faceTimerRef.current);
      if (autoScanTimerRef.current) clearInterval(autoScanTimerRef.current);
    };
  }, [onUnlock]);

  // Drag-up-to-unlock mechanism using Framer Motion
  const dragY = useMotionValue(0);
  const opacity = useTransform(dragY, [0, -150], [1, 0]);
  const scale = useTransform(dragY, [0, -150], [1, 0.95]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y < -80) {
      setSecurityActive(true);
    }
  };

  const triggerSystemAccessMock = () => {
    // Show authorized animation, brief success and unlock
    setTimeout(() => {
      onUnlock();
    }, 600);
  };

  // PIN Actions
  const handlePinKeyPress = (num: string) => {
    setPinError(null);
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + num;
      setEnteredPin(nextPin);
      
      // Auto-validate at 4 digits
      if (nextPin.length === 4) {
        if (isChangingPin) {
          // Setting new PIN
          setDefaultPin(nextPin);
          setIsChangingPin(false);
          setEnteredPin('');
          setPinError('New Security PIN Configured.');
          setTimeout(() => setPinError(null), 3000);
        } else {
          // Authentication
          if (nextPin === defaultPin) {
            triggerSystemAccessMock();
          } else {
            setTimeout(() => {
              setPinError('Invalid Code - Access Prohibited');
              setEnteredPin('');
            }, 300);
          }
        }
      }
    }
  };

  const handlePinBackspace = () => {
    setPinError(null);
    setEnteredPin(prev => prev.slice(0, -1));
  };

  const handleAutoFillPin = () => {
    setEnteredPin(defaultPin);
    triggerSystemAccessMock();
  };

  // Fingerprint Events
  const handleFingerprintStart = () => {
    setFingerprintScanning(true);
    setFingerprintProgress(0);
    setFingerprintStatus('Analyzing ridge blueprint...');

    fingerTimerRef.current = setInterval(() => {
      setFingerprintProgress(prev => {
        if (prev >= 100) {
          if (fingerTimerRef.current) clearInterval(fingerTimerRef.current);
          setFingerprintStatus('Biometric Signature Validated!');
          triggerSystemAccessMock();
          return 100;
        }
        
        // Log simulator text based on progress
        if (prev === 20) setFingerprintStatus('Reading tactile epidermis map...');
        if (prev === 55) setFingerprintStatus('Validating crypto core token...');
        if (prev === 80) setFingerprintStatus('Access authority authorized');
        
        return prev + 10;
      });
    }, 120);
  };

  const handleFingerprintEnd = () => {
    setFingerprintScanning(false);
    if (fingerTimerRef.current) {
      clearInterval(fingerTimerRef.current);
    }
    if (fingerprintProgress < 100) {
      setFingerprintProgress(0);
      setFingerprintStatus('Biometric scan aborted - Hold scanner');
    }
  };

  // Face scanner trigger
  const triggerFaceScan = () => {
    if (faceScanning) return;
    setFaceScanning(true);
    setFaceProgress(0);
    setFaceStatus('Initializing dynamic camera eye...');

    faceTimerRef.current = setInterval(() => {
      setFaceProgress(prev => {
        if (prev >= 100) {
          if (faceTimerRef.current) clearInterval(faceTimerRef.current);
          setFaceStatus('Admin matched successfully!');
          triggerSystemAccessMock();
          return 100;
        }
        
        // Face detection logs
        if (prev === 15) setFaceStatus('Locating spatial ocular vectors...');
        if (prev === 40) setFaceStatus('Mapping facial landmark points...');
        if (prev === 70) setFaceStatus('Admin face identified');
        if (prev === 90) setFaceStatus('Verifying security signature...');
        
        return prev + 5;
      });
    }, 90);
  };

  return (
    <motion.div
      id="liquid_glass_lock_screen"
      style={{ scale }}
      className="fixed inset-0 z-30 select-none overflow-hidden flex flex-col justify-between p-6 pb-12 cursor-pointer"
    >
      {/* Absolute Wallpaper layer specific to the lock screen with custom controls */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1500 scale-[1.03] z-0"
        style={{ 
          backgroundImage: `url(${wallpaper})`,
          filter: `brightness(${brightness < 50 ? 0.45 : 0.72}) contrast(1.05) drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.1))`
        }}
      />
      
      {/* Bottom overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none z-0" />
      <div className="absolute inset-0 bg-black/15 pointer-events-none z-0" />

      {/* TOP Face ID Auto-Scan Pod / Simulated Biometric alignment */}
      <div className="relative z-10 flex flex-col items-center pt-8 pointer-events-auto">
        <AnimatePresence mode="wait">
          {autoScanActive ? (
            <motion.div 
              key="autoscan-capsule"
              initial={{ scale: 0.9, opacity: 0, y: -8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -12 }}
              className={cn(
                "flex items-center gap-2.5 px-4 py-1.5 rounded-full border backdrop-blur-3xl text-[10.5px] font-medium transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.25)]",
                autoScanProgress >= 100 
                  ? "bg-emerald-500/10 border-emerald-400/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                  : "bg-white/10 border-white/20 text-white/80"
              )}
            >
              {/* Spinning/progress loader ring */}
              <div className="relative w-4 h-4 flex items-center justify-center flex-shrink-0">
                {autoScanProgress < 100 ? (
                  <>
                    <ScanFace size={11} className="text-sky-400 animate-pulse" />
                    <svg className="absolute inset-0 -rotate-90 w-full h-full">
                      <circle 
                        cx="8" 
                        cy="8" 
                        r="6.5" 
                        stroke="rgba(255,255,255,0.12)" 
                        strokeWidth="1.2" 
                        fill="transparent" 
                      />
                      <circle 
                        cx="8" 
                        cy="8" 
                        r="6.5" 
                        stroke="#38bdf8" 
                        strokeWidth="1.2" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 6.5}
                        strokeDashoffset={2 * Math.PI * 6.5 * (1 - autoScanProgress / 100)}
                        className="transition-all duration-150"
                      />
                    </svg>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white"
                  >
                    <Check size={9} strokeWidth={3} />
                  </motion.div>
                )}
              </div>

              <div className="flex flex-col text-left leading-none">
                <span className="font-mono text-[8px] text-white/40 uppercase tracking-wider">Face Recognition</span>
                <span className={cn(
                  "font-sans font-bold text-[10px] mt-0.5",
                  autoScanProgress >= 100 ? "text-emerald-400" : "text-white/90"
                )}>
                  {autoScanStatus}
                </span>
              </div>
              
              {/* Optional bypass/dismiss button to key in manually */}
              <button 
                onClick={(e) => { e.stopPropagation(); setAutoScanActive(false); }}
                className="ml-1 p-0.5 hover:bg-white/10 rounded-full text-white/30 hover:text-white transition-all"
                title="Bypass scanner"
              >
                <X size={10} />
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="manual-fallback"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[9px] text-white/50 tracking-widest font-mono uppercase"
            >
              <Lock size={9} className="text-amber-400" /> Swipe up to unlock with passcode
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CENTER: Massive Liquid Glass Clock & Widgets */}
      <div className="relative z-10 flex flex-col items-center gap-4 mt-6">
        
        {/* Master Glass Panel surrounding clock */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/20 hover:border-white/30 backdrop-blur-2xl rounded-[2.5rem] p-7 w-full max-w-[320px] text-center shadow-[0_15px_30px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          {/* Top gloss arc light flare */}
          <div className="absolute top-0 left-[-15%] w-[130%] h-[35%] bg-gradient-to-b from-white/15 via-white/2 to-transparent rounded-b-[45%] pointer-events-none" />
          
          <span className="text-[10px] uppercase font-bold text-white/40 tracking-[0.2em] block mb-1">
            {format(time, 'EEEE, d MMMM')}
          </span>
          
          <h1 className="text-5xl font-black tracking-tighter text-white font-sans">
            {format(time, 'HH:mm')}
          </h1>
          
          <div className="flex justify-center items-center gap-3 mt-4 text-[10px] text-white/60 font-mono">
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-full border border-white/5 mx-auto">
              <Battery size={12} className="text-emerald-400" /> 88% Volts
            </span>
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/5 rounded-full border border-white/5 mx-auto">
              <CloudRain size={12} className="text-sky-400" /> Rain 14°C
            </span>
          </div>
        </motion.div>

        {/* Dynamic Glass Music Player (Shows only if we simulate active audio) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white/5 border border-white/15 backdrop-blur-2xl rounded-3xl p-4 w-full max-w-[320px] flex items-center gap-4 shadow-lg relative overflow-hidden text-left"
        >
          {/* Gloss */}
          <div className="absolute top-0 inset-x-0 h-3 bg-white/5 pointer-events-none" />
          
          <div className="w-11 h-11 bg-cover bg-center rounded-xl border border-white/10 relative shadow-md" style={{ backgroundImage: 'url(https://picsum.photos/seed/synth/120/120)' }}>
            <div className="absolute inset-0 bg-black/10" />
            <Music size={14} className="absolute bottom-1 right-1 text-white/60" />
          </div>

          <div className="flex-grow min-w-0">
            <h5 className="font-bold text-xs text-white truncate">Silent Signal Waves</h5>
            <p className="text-[10px] text-white/50 truncate font-mono">P2P Synthetics</p>
          </div>

          <button 
            onClick={(e) => { e.stopPropagation(); setIsPlaying(!isPlaying); }}
            className="interactive-click w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white active:scale-90 transition-all hover:bg-white/20"
          >
            {isPlaying ? <Pause size={12} fill="white" /> : <Play size={12} fill="white" className="ml-0.5" />}
          </button>
        </motion.div>

        {/* Unread Glass Notification Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/3 border border-white/10 backdrop-blur-2xl rounded-3xl p-3.5 w-full max-w-[320px] flex gap-3 shadow-md relative overflow-hidden"
        >
          <div className="w-8 h-8 rounded-xl bg-red-500 flex items-center justify-center border border-white/10 shadow-sm flex-shrink-0">
            <Bell size={14} className="text-white" />
          </div>
          <div className="text-left font-sans flex-grow min-w-0">
            <div className="flex justify-between items-center w-full">
              <span className="font-bold text-[10px] text-white/80 uppercase tracking-tight">Gmail Alert</span>
              <span className="text-[8px] text-white/40 font-mono">10m ago</span>
            </div>
            <h6 className="text-[11px] font-bold text-white mt-0.5 truncate">System Security Alert</h6>
            <p className="text-[10px] text-white/50 truncate font-mono">New node connection request authorized.</p>
          </div>
        </motion.div>
      </div>

      {/* BOTTOM: Swipe to unlock and action buttons */}
      <div className="relative z-10 flex flex-col items-center gap-6 mt-auto">
        
        {/* Swipe Handle Drag Controller */}
        <motion.div
          drag="y"
          dragConstraints={{ top: -200, bottom: 0 }}
          style={{ y: dragY, opacity }}
          onDragEnd={handleDragEnd}
          className="flex flex-col items-center gap-2 cursor-grab active:cursor-grabbing text-white/80 active:text-white"
        >
          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="flex flex-col items-center justify-center"
          >
            <ArrowUp size={18} className="text-white animate-pulse" />
          </motion.div>
          <span className="text-xs font-bold tracking-[0.15em] font-sans text-center">
            PULL UP TO AUTHENTICATE
          </span>
          <div className="w-16 h-1 bg-white/40 rounded-full mt-1" />
        </motion.div>

        {/* Shortcuts row */}
        <div className="flex justify-between w-full px-6 max-w-[320px] items-center">
          {/* Quick Phone contact shortcut */}
          <button 
            onClick={(e) => { e.stopPropagation(); setSecurityActive(true); }}
            className="interactive-click w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90 shadow-md"
          >
            <Phone size={15} />
          </button>

          {/* Simple Button fallback unlock */}
          <button 
            onClick={() => setSecurityActive(true)}
            className="interactive-click bg-white/10 hover:bg-white/15 border border-white/20 backdrop-blur-xl px-5 py-2.5 rounded-full text-xs font-bold font-sans tracking-wider text-white shadow-lg flex items-center gap-1.5"
          >
            <Lock size={11} className="text-emerald-400" /> Security Options
          </button>

          {/* Quick Messenger shortcut */}
          <button 
            onClick={(e) => { e.stopPropagation(); setSecurityActive(true); }}
            className="interactive-click w-11 h-11 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 flex items-center justify-center text-white/60 hover:text-white transition-all active:scale-90 shadow-md"
          >
            <MessageSquare size={15} />
          </button>
        </div>
      </div>

      {/* Simulated Flashlight ray overlay */}
      {flashlightActive && (
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-amber-400/10 to-transparent pointer-events-none mix-blend-color-dodge z-0 animate-pulse" />
      )}

      {/* DYNAMIC SECURITY MODAL SHEET (Liquid Glass) */}
      <AnimatePresence>
        {securityActive && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
            className="absolute inset-0 bg-[#0A0C11]/88 backdrop-blur-[50px] z-40 border-t border-white/20 flex flex-col justify-between p-6 pt-12 cursor-default select-none"
          >
            <div className="absolute top-0 left-[-10%] w-[120%] h-[35%] bg-gradient-to-b from-white/10 to-transparent rounded-b-[50%] pointer-events-none" />

            {/* Shield/Status Header */}
            <div className="relative z-10 flex flex-col items-center gap-2 text-center mt-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-base font-bold tracking-tight text-white font-sans uppercase">
                System Knox Authorization
              </h3>
              <p className="text-[10px] text-white/50 font-mono tracking-wider">
                LOCK-CHANNEL SECURE // VERIFICATION ACTIVE
              </p>
            </div>

            {/* Dynamic Verification Mode Workspace */}
            <div className="relative z-10 flex-1 flex flex-col justify-center max-w-[340px] mx-auto w-full py-2">
              <AnimatePresence mode="wait">
                {/* 1. PIN PASSWORD MODULE */}
                {authMethod === 'pin' && (
                  <motion.div
                    key="method-pin"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-5 w-full"
                  >
                    {/* PIN Display Indicators */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex gap-4 justify-center items-center h-10">
                        {Array.from({ length: 4 }).map((_, i) => {
                          const isActive = enteredPin.length > i;
                          return (
                            <motion.div
                              key={i}
                              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                              className={cn(
                                "w-4 h-4 rounded-full border transition-all duration-200",
                                isActive 
                                  ? "bg-amber-400 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.6)]" 
                                  : "bg-white/5 border-white/20"
                              )}
                            />
                          );
                        })}
                      </div>
                      
                      {pinError ? (
                        <p className={cn("text-[10px] font-mono", pinError.includes('Access Prohibited') ? "text-red-400 animate-bounce" : "text-emerald-400")}>
                          {pinError}
                        </p>
                      ) : (
                        <p className="text-[10px] font-mono text-white/40">
                          {isChangingPin ? "Setup your custom PIN" : `Enter Secure Passcode`}
                        </p>
                      )}
                    </div>

                    {/* Numeric Keypad layout */}
                    <div className="grid grid-cols-3 gap-x-4 gap-y-3 w-full px-4">
                      {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                        <button
                          key={num}
                          onClick={() => handlePinKeyPress(num)}
                          className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 border border-white/10 flex items-center justify-center font-bold text-white text-lg transition-all focus:outline-none shadow-[rgba(0,0,0,0.15)_0px_4px_12px]"
                        >
                          {num}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePinBackspace()}
                        className="w-14 h-14 rounded-full bg-red-950/20 hover:bg-red-900/30 border border-red-500/20 flex items-center justify-center text-red-400 active:scale-90 transition-all focus:outline-none"
                        title="Delete symbol"
                      >
                        <Delete size={18} />
                      </button>

                      <button
                        onClick={() => handlePinKeyPress('0')}
                        className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 active:scale-90 border border-white/10 flex items-center justify-center font-bold text-white text-lg transition-all focus:outline-none"
                      >
                        0
                      </button>

                      <button
                        onClick={() => setIsChangingPin(!isChangingPin)}
                        className={cn(
                          "w-14 h-14 rounded-full border flex flex-col items-center justify-center text-[8px] font-bold font-mono active:scale-90 transition-all focus:outline-none",
                          isChangingPin ? "bg-amber-400/25 border-amber-400 text-amber-300" : "bg-white/5 border-white/10 text-white/40"
                        )}
                        title="Set custom passkey credential"
                      >
                        <Settings size={14} className="mb-0.5" />
                        SET PIN
                      </button>
                    </div>

                    {/* Quick Simulation tip */}
                    <button 
                      onClick={handleAutoFillPin}
                      className="text-[9px] font-mono text-emerald-400/80 hover:text-emerald-300 flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full border border-white/5 hover:border-emerald-500/25 transition-all mt-1"
                    >
                      <Sparkles size={11} className="animate-spin duration-3000" /> Touch to autofill PIN ({defaultPin})
                    </button>
                  </motion.div>
                )}

                {/* 2. NEON FINGERPRINT SCANNER MODULE */}
                {authMethod === 'fingerprint' && (
                  <motion.div
                    key="method-fingerprint"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-6 w-full text-center"
                  >
                    <div className="relative w-36 h-36 flex items-center justify-center mt-2">
                      {/* Ambient scanning laser rotation */}
                      <div className={cn(
                        "absolute inset-0 rounded-full border-2 border-dashed border-sky-500/20 transition-all duration-1000",
                        fingerprintScanning ? "animate-spin text-emerald-500 border-sky-400/60" : ""
                      )} />
                      
                      {/* Pulse ring overlay */}
                      <AnimatePresence>
                        {fingerprintScanning && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{ scale: 1.3, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.2 }}
                            className="absolute inset-0 rounded-full bg-emerald-400/20 border border-emerald-400/40 pointer-events-none"
                          />
                        )}
                      </AnimatePresence>

                      {/* Scanning interactive touch trigger */}
                      <button
                        onMouseDown={handleFingerprintStart}
                        onMouseUp={handleFingerprintEnd}
                        onMouseLeave={handleFingerprintEnd}
                        onTouchStart={(e) => { e.preventDefault(); handleFingerprintStart(); }}
                        onTouchEnd={(e) => { e.preventDefault(); handleFingerprintEnd(); }}
                        className={cn(
                          "w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-300 border backdrop-blur-md shadow-2xl relative z-10 active:scale-95 cursor-pointer touch-none",
                          fingerprintScanning 
                            ? "bg-emerald-500/20 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.4)] text-emerald-300" 
                            : "bg-white/5 border-white/10 hover:border-white/20 text-sky-400"
                        )}
                        title="Scanner trigger"
                      >
                        {/* High density fingerprint path */}
                        <Fingerprint size={48} className={cn("transition-transform duration-300", fingerprintScanning ? "scale-105" : "")} />
                        
                        {fingerprintScanning && (
                          <span className="absolute bottom-3 font-mono text-[10px] text-emerald-400 font-bold">
                            {fingerprintProgress}% SCAN
                          </span>
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col gap-1 px-4">
                      <p className={cn(
                        "text-xs font-semibold tracking-tight transition-all",
                        fingerprintScanning ? "text-emerald-400" : "text-white/80"
                      )}>
                        {fingerprintStatus}
                      </p>
                      <p className="text-[10px] font-mono text-white/30 leading-relaxed">
                        Press and hold your finger on physical glass scanning tile to match secure lock profile
                      </p>
                    </div>

                    {/* Progress slider bar matching fingerprint status */}
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-emerald-500 h-full transition-all duration-150"
                        style={{ width: `${fingerprintProgress}%` }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* 3. FACE UNLOCK LASER SCANNER MODULE */}
                {authMethod === 'face' && (
                  <motion.div
                    key="method-face"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center gap-5 w-full text-center"
                  >
                    {/* Simulated High-tech Camera Frame */}
                    <div className="relative w-40 h-40 rounded-[2.5rem] bg-black/40 border border-white/15 overflow-hidden flex items-center justify-center shadow-inner">
                      
                      {/* Glass gradient reflection */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
                      
                      {/* Scanning vertical line sweep */}
                      <AnimatePresence>
                        {faceScanning && (
                          <motion.div
                            initial={{ y: -5 }}
                            animate={{ y: 160 }}
                            transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                            className="absolute left-0 right-0 h-[2.5px] bg-[#22c55e] shadow-[0_0_15px_3px_#22c55e] z-10"
                          />
                        )}
                      </AnimatePresence>

                      {/* Vector circular face alignment indicator */}
                      <div className={cn(
                        "w-28 h-28 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-500",
                        faceScanning ? "border-emerald-500/50 scale-102 bg-emerald-500/5" : "border-white/10"
                      )}>
                        <ScanFace size={38} className={faceScanning ? "text-emerald-400 animate-pulse" : "text-white/40"} />
                      </div>

                      {/* Focus crosshairs */}
                      <div className="absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-white/30" />
                      <div className="absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-white/30" />
                      <div className="absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-white/30" />
                      <div className="absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-white/30" />

                      {faceScanning && (
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 border border-emerald-500/30 rounded-full px-2 py-0.5 text-[8.5px] font-mono text-emerald-400 z-20 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                          LIVE_SCAN
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 px-4">
                      <p className={cn(
                        "text-xs font-semibold tracking-tight transition-all",
                        faceScanning ? "text-emerald-400" : "text-white/80"
                      )}>
                        {faceStatus}
                      </p>
                      
                      {!faceScanning ? (
                        <button
                          onClick={triggerFaceScan}
                          className="mt-1.5 bg-white/10 hover:bg-white/15 active:scale-95 text-white text-[11px] font-bold px-4 py-2 rounded-xl border border-white/10 transition-all flex items-center gap-1.5 mx-auto"
                        >
                          <RefreshCw size={11} className="animate-spin duration-[4000ms]" /> Initialize Face Scanner
                        </button>
                      ) : (
                        <div className="flex justify-center items-center gap-1 text-[9.5px] font-mono text-white/40">
                          Matching node points: <span className="text-emerald-400 font-bold">{faceProgress}% completed</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Authenticator Chooser & Exit Panel */}
            <div className="relative z-10 flex flex-col gap-4 mt-auto">
              
              {/* Segmented Controller Tab */}
              <div className="grid grid-cols-3 bg-white/5 border border-white/10 p-1 rounded-2xl w-full text-xs font-semibold shadow-inner">
                <button
                  onClick={() => { setAuthMethod('pin'); setPinError(null); }}
                  className={cn(
                    "py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 focus:outline-none",
                    authMethod === 'pin' ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/50 hover:text-white/80"
                  )}
                >
                  <Key size={13} /> PIN
                </button>
                <button
                  onClick={() => { setAuthMethod('fingerprint'); }}
                  className={cn(
                    "py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 focus:outline-none",
                    authMethod === 'fingerprint' ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/50 hover:text-white/80"
                  )}
                >
                  <Fingerprint size={13} /> Fingerprint
                </button>
                <button
                  onClick={() => { setAuthMethod('face'); }}
                  className={cn(
                    "py-2 px-1 rounded-xl transition-all flex items-center justify-center gap-1.5 focus:outline-none",
                    authMethod === 'face' ? "bg-white/10 text-white shadow-md border border-white/10" : "text-white/50 hover:text-white/80"
                  )}
                >
                  <ScanFace size={13} /> Face
                </button>
              </div>

              {/* Close security mode */}
              <button
                onClick={() => { 
                  setSecurityActive(false); 
                  setEnteredPin(''); 
                  setPinError(null);
                  if (fingerTimerRef.current) clearInterval(fingerTimerRef.current);
                  if (faceTimerRef.current) clearInterval(faceTimerRef.current);
                }}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/5 text-white/50 py-2.5 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 transition-all"
              >
                <ArrowLeft size={13} /> Return to Lock Screen
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};


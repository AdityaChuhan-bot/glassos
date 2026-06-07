import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Sun, Snowflake, Wind, Plus, Minus, X, 
  Settings, Zap, ShieldAlert, Wifi, BatteryCharging
} from 'lucide-react';

interface HeatingCenterProps {
  onClose: () => void;
}

export const HeatingCenter: React.FC<HeatingCenterProps> = ({ onClose }) => {
  const [targetTemp, setTargetTemp] = useState<number>(21.5);
  const [currentTemp, setCurrentTemp] = useState<number>(19.8);
  const [mode, setMode] = useState<'eco' | 'comfort' | 'booster' | 'off'>('comfort');
  const [isFanOn, setIsFanOn] = useState<boolean>(true);
  const [timerLeft, setTimerLeft] = useState<number>(0);

  const handleAdjustTemp = (amount: number) => {
    setTargetTemp(prev => {
      const next = prev + amount;
      return parseFloat(next.toFixed(1));
    });
  };

  // Convert temperature to circle percentage for dial track (between 16C and 30C)
  const getDialPercentage = () => {
    const min = 16;
    const max = 30;
    const clamped = Math.max(min, Math.min(max, targetTemp));
    return ((clamped - min) / (max - min)) * 100;
  };

  const getHeatIntensityColor = () => {
    if (mode === 'off') return 'from-[#2F3037] to-[#1E1F24]';
    if (targetTemp < 19) return 'from-[#0ea5e9]/20 to-[#0284c7]/5';
    if (targetTemp < 23) return 'from-orange-500/20 to-amber-600/5';
    return 'from-rose-600/30 to-orange-500/5';
  };

  const getLiquidColor = () => {
    if (mode === 'off') return 'bg-gray-500/20';
    if (targetTemp < 19) return 'bg-[#0ea5e9]/40 shadow-[#0ea5e9]/30';
    if (targetTemp < 23) return 'bg-orange-500/50 shadow-orange-500/40';
    return 'bg-red-500/60 shadow-red-500/50';
  };

  return (
    <div id="heating_app_modal" className="absolute inset-0 bg-gradient-to-b from-[#18191E] to-[#0A0A0C] text-white flex flex-col z-40 select-none overflow-hidden rounded-[2.5rem]">
      {/* Dynamic Fluid Liquid Background simulating Heat Rise */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Dynamic moving temperature fluid capsule (Interactive state liquid glass!) */}
        <motion.div 
          animate={{ 
            y: `${100 - getDialPercentage()}%`,
            scale: [1, 1.03, 1],
          }}
          transition={{
            y: { type: 'spring', damping: 20, stiffness: 60 },
            scale: { repeat: Infinity, duration: 4, ease: 'easeInOut' }
          }}
          className={`absolute bottom-[-10%] left-[-10%] w-[120%] h-[120%] rounded-t-[40%] transition-colors duration-1000 blur-3xl opacity-30 ${getLiquidColor()}`}
        />
        {/* Extreme Top glossy highlight lens cap */}
        <div className="absolute top-0 left-[-15%] w-[130%] h-[35%] bg-gradient-to-b from-white/10 via-white/2 to-transparent rounded-b-[45%]" />
      </div>

      {/* App Header */}
      <div className="relative pt-12 px-6 pb-4 flex justify-between items-center border-b border-white/5 bg-white/5 backdrop-blur-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30" />
            <Flame size={15} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Thermodial</h1>
            <p className="text-[10px] text-white/50 flex items-center gap-1 font-mono">
              <Wifi size={10} className="text-orange-400 animate-pulse" />
              Living Room Node
            </p>
          </div>
        </div>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all active:scale-90"
        >
          <X size={15} />
        </button>
      </div>

      {/* Scrollable Container */}
      <div className="flex-grow overflow-y-auto px-6 py-6 flex flex-col justify-start gap-6 relative z-10 custom-scrollbar">

        {/* Central Thermodynamic Rotary Dial */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-64 rounded-full flex items-center justify-center bg-[#15161A]/80 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.05)] overflow-hidden">
            
            {/* Liquid Glass top lens highlighting the dial */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-black/60 via-transparent to-white/15 pointer-events-none z-10" />
            <div className="absolute top-1 left-[-5%] w-[110%] h-[40%] bg-gradient-to-b from-white/20 via-white/2 to-transparent rounded-b-[45%] pointer-events-none z-10" />

            {/* Glowing thermal capsule background */}
            <div className="absolute inset-4 rounded-full bg-black/40 border border-white/5 flex flex-col items-center justify-center" />
            
            {/* Dial arc indicator track using SVG */}
            <svg className="absolute w-[86%] h-[86%] transform -rotate-90 pointer-events-none">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                className="stroke-white/5 fill-none"
                strokeWidth="6"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="45%"
                className={`fill-none transition-all duration-300 ${
                  mode === 'off' ? 'stroke-white/20' : 
                  targetTemp < 19 ? 'stroke-sky-400' : 
                  targetTemp < 23 ? 'stroke-orange-500' : 'stroke-red-500'
                }`}
                strokeWidth="6"
                strokeDasharray="283"
                animate={{ strokeDashoffset: 283 - (283 * getDialPercentage()) / 100 }}
                transition={{ type: 'spring', damping: 20 }}
              />
            </svg>

            {/* Temperature & Stats Overlay Panel */}
            <div className="relative text-center flex flex-col items-center z-20">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">
                Target Air Temp
              </span>
              
              <div className="flex items-start justify-center mt-1">
                <span className="text-5xl font-light tracking-tighter">{targetTemp.toFixed(1)}</span>
                <span className="text-lg font-semibold text-orange-400 mt-1">°C</span>
              </div>
              
              <div className="mt-4 flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 rounded-full backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-white/60 font-mono">
                  Room: {currentTemp.toFixed(1)}°C
                </span>
              </div>
            </div>
          </div>

          {/* Liquid Dial Adjustment Buttons */}
          <div className="flex gap-8 mt-5 relative z-20">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAdjustTemp(-0.5)}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <div className="absolute top-1 left-2 w-8 h-4 bg-white/5 rounded-b-xl group-hover:bg-white/10 transition-all pointer-events-none" />
              <Minus size={18} />
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAdjustTemp(0.5)}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.3)] flex items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <div className="absolute top-1 left-2 w-8 h-4 bg-white/5 rounded-b-xl group-hover:bg-white/10 transition-all pointer-events-none" />
              <Plus size={18} />
            </motion.button>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-white/40 uppercase tracking-widest pl-1">
            Presets & Modes
          </span>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'off', label: 'Off', desc: 'Disabled', icon: Wind, color: 'text-gray-400', activeBg: 'bg-white/10 border-white/20' },
              { id: 'eco', label: 'Eco', desc: '18.0°C Saving', icon: Snowflake, color: 'text-emerald-400', activeBg: 'bg-emerald-500/20 border-emerald-500/30' },
              { id: 'comfort', label: 'Comfort', desc: '21.5°C Active', icon: Sun, color: 'text-amber-400', activeBg: 'bg-amber-500/20 border-amber-500/30' },
              { id: 'booster', label: 'Booster', desc: '26.0°C Maximum', icon: Flame, color: 'text-red-400', activeBg: 'bg-red-500/20 border-red-500/30' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setMode(item.id as any);
                  if (item.id === 'off') {
                    // Turn heating off essentially
                  } else if (item.id === 'eco') {
                    setTargetTemp(18.0);
                  } else if (item.id === 'comfort') {
                    setTargetTemp(21.5);
                  } else if (item.id === 'booster') {
                    setTargetTemp(26.0);
                  }
                }}
                className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                  mode === item.id 
                    ? `${item.activeBg} shadow-lg shadow-black/20` 
                    : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/8'
                }`}
              >
                <div className={`p-2 rounded-xl bg-white/5 border border-white/5 ${item.color}`}>
                  <item.icon size={16} />
                </div>
                <div className="flex-grow">
                  <h4 className="font-semibold text-xs text-white">{item.label}</h4>
                  <p className="text-[10px] text-white/40 font-mono mt-0.5">{item.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thermodynamic Diagnostics Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-white/50 uppercase tracking-widest">
              Environmental Stats
            </span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/10 uppercase font-semibold">
              EFFICIENT
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center mt-1">
            <div className="bg-[#1A1A22] border border-white/5 rounded-xl p-3">
              <p className="text-[9px] text-white/40 uppercase tracking-wider font-semibold">Current Humidity</p>
              <p className="text-base font-bold font-mono text-blue-400 mt-1">48%</p>
            </div>
            <div className="bg-[#1A1A22] border border-white/5 rounded-xl p-3">
              <p className="text-[9px] text-white/40 uppercase tracking-wider font-semibold">Flow Energy</p>
              <p className="text-base font-bold font-mono text-purple-400 mt-1">1.2 kW/h</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

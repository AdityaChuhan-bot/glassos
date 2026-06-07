import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, Bluetooth, Plane, Moon, ShieldCheck, Sun, 
  Volume2, Play, Pause, SkipForward, SkipBack, X, Battery,
  Camera, Mic, Radio, Network, Laptop, EyeOff
} from 'lucide-react';

interface ControlCenterProps {
  onClose: () => void;
}

export const ControlCenter: React.FC<ControlCenterProps> = ({ onClose }) => {
  const [wifi, setWifi] = useState(true);
  const [bluetooth, setBluetooth] = useState(true);
  const [airplane, setAirplane] = useState(false);
  const [dnd, setDnd] = useState(false);
  
  const [brightness, setBrightness] = useState(72);
  const [volume, setVolume] = useState(48);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState({
    title: 'Silent Signal Waves',
    artist: 'P2P Synthetics',
    cover: 'https://picsum.photos/seed/synth/120/120'
  });

  // Privacy Shield States (keeping privacy in mind!)
  const [camShieldEnabled, setCamShieldEnabled] = useState(true);
  const [micShieldEnabled, setMicShieldEnabled] = useState(false);
  const [vpnEnabled, setVpnEnabled] = useState(true);

  return (
    <div id="control_app_modal" className="absolute inset-0 bg-[#0E0F12]/92 backdrop-blur-3xl text-white flex flex-col z-40 select-none overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
      {/* Immersive radial glowing centers in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[180%] h-[50%] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[90%] h-[30%] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Gloss Cap */}
      <div className="absolute top-0 left-[-15%] w-[130%] h-[30%] bg-gradient-to-b from-white/12 via-white/1 to-transparent rounded-b-[45%] pointer-events-none" />

      {/* Header */}
      <div className="relative pt-12 px-6 pb-4 flex justify-between items-center border-b border-white/5 bg-white/3 backdrop-blur-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30" />
            <Network size={15} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Control Center</h1>
            <p className="text-[10px] text-white/50 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
              Main Dashboard
            </p>
          </div>
        </div>
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all active:scale-95 z-20"
        >
          <X size={15} />
        </button>
      </div>

      {/* Panels Area */}
      <div className="flex-grow overflow-y-auto px-6 py-6 flex flex-col gap-5 relative z-10 custom-scrollbar">
        
        {/* First Row: Connection Grid & Music Player */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Bento-style Toggles Capsule */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 p-y-5 grid grid-cols-2 gap-4 shadow-xl relative overflow-hidden">
            {/* Liquid glass light rays */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            {/* Wifi Toggle */}
            <button 
              onClick={() => setWifi(!wifi)}
              className={`flex flex-col items-center justify-center aspect-square rounded-2xl border transition-all ${
                wifi ? 'bg-blue-500/25 border-blue-500/40 text-blue-400 font-bold' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <Wifi size={20} className={wifi ? 'animate-pulse' : ''} />
              <span className="text-[10px] uppercase font-semibold mt-1">Wi-Fi</span>
            </button>

            {/* Bluetooth Toggle */}
            <button 
              onClick={() => setBluetooth(!bluetooth)}
              className={`flex flex-col items-center justify-center aspect-square rounded-2xl border transition-all ${
                bluetooth ? 'bg-indigo-500/25 border-indigo-500/40 text-indigo-400' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <Bluetooth size={20} />
              <span className="text-[10px] uppercase font-semibold mt-1">BT</span>
            </button>

            {/* Airplane Toggle */}
            <button 
              onClick={() => setAirplane(!airplane)}
              className={`flex flex-col items-center justify-center aspect-square rounded-2xl border transition-all ${
                airplane ? 'bg-amber-500/25 border-amber-500/40 text-amber-400' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <Plane size={20} />
              <span className="text-[10px] uppercase font-semibold mt-1">Plane</span>
            </button>

            {/* Quiet/Dnd Toggle */}
            <button 
              onClick={() => setDnd(!dnd)}
              className={`flex flex-col items-center justify-center aspect-square rounded-2xl border transition-all ${
                dnd ? 'bg-purple-500/25 border-purple-500/40 text-purple-400' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
              }`}
            >
              <Moon size={20} />
              <span className="text-[10px] uppercase font-semibold mt-1">DND</span>
            </button>
          </div>

          {/* Bento-style Music Widget */}
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 flex flex-col justify-between shadow-xl relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/45 via-transparent to-white/5 pointer-events-none" />
            
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10 relative shadow-md">
                <img src={currentSong.cover} alt="Cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10" />
              </div>
              <h4 className="font-semibold text-xs mt-2.5 truncate w-full px-1">{currentSong.title}</h4>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">{currentSong.artist}</p>
            </div>

            <div className="flex justify-center items-center gap-4 mt-2">
              <button className="text-white/60 hover:text-white transition-colors">
                <SkipBack size={15} />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all shadow-md"
              >
                {isPlaying ? <Pause size={14} fill="white" /> : <Play size={14} fill="white" className="ml-0.5" />}
              </button>
              <button className="text-white/60 hover:text-white transition-colors">
                <SkipForward size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Second Row: Sliders Area (Vertical or Grid) */}
        <div className="p-5 rounded-[2rem] bg-white/5 border border-white/10 shadow-xl flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-white/3 to-transparent pointer-events-none" />
          
          {/* Brightness Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-semibold px-0.5">
              <span className="text-white/80 flex items-center gap-1.5 font-sans uppercase tracking-[0.03em]">
                <Sun size={14} className="text-amber-400" /> Brightness
              </span>
              <span className="font-mono text-white/40">{brightness}%</span>
            </div>
            <div className="relative w-full h-8 bg-black/35 rounded-xl border border-white/5 overflow-hidden flex items-center">
              {/* Slidable glass indicator */}
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500/20 to-blue-400/30 border-r border-white/20 flex items-center pr-3 justify-end active:opacity-90"
                style={{ width: `${brightness}%` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full h-full opacity-0 cursor-pointer absolute z-10"
              />
            </div>
          </div>

          {/* Volume Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center text-xs font-semibold px-0.5">
              <span className="text-white/80 flex items-center gap-1.5 font-sans uppercase tracking-[0.03em]">
                <Volume2 size={14} className="text-blue-400" /> Sound Chamber
              </span>
              <span className="font-mono text-white/40">{volume}%</span>
            </div>
            <div className="relative w-full h-8 bg-black/35 rounded-xl border border-white/5 overflow-hidden flex items-center">
              {/* Slidable glass indicator */}
              <div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-500/20 to-indigo-400/30 border-r border-white/20 flex items-center pr-3 justify-end"
                style={{ width: `${volume}%` }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-full opacity-0 cursor-pointer absolute z-10"
              />
            </div>
          </div>
        </div>

        {/* Third Row: Privacy Shield Controls (keeps privacy in mind!) */}
        <div className="p-5 rounded-[2rem] bg-gradient-to-b from-indigo-500/5 to-transparent border border-[#2E334D] shadow-xl flex flex-col gap-3.5 relative overflow-hidden">
          <div className="flex justify-between items-center pb-1 border-b border-white/5">
            <span className="text-xs font-bold text-white/40 uppercase tracking-widest">
              Lockout Privacy Shield
            </span>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/15 font-semibold">
              HARDWARE SIM
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {/* Camera Gate Shield */}
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 border ${
                  camShieldEnabled ? 'border-red-500/30 text-red-400' : 'border-white/5 text-white/50'
                }`}>
                  <Camera size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-bold">Camera Block Filter</h5>
                  <p className="text-[9px] text-white/40">Inject dummy video proxy loop</p>
                </div>
              </div>
              <button 
                onClick={() => setCamShieldEnabled(!camShieldEnabled)}
                className={`w-9 h-5.5 rounded-full p-0.5 transition-all flex items-center ${
                  camShieldEnabled ? 'bg-red-500 justify-end' : 'bg-white/10 justify-start'
                }`}
              >
                <div className="w-4.5 h-4.5 bg-white rounded-full shadow-md" />
              </button>
            </div>

            {/* Microphone Lock Shield */}
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 border ${
                  micShieldEnabled ? 'border-red-500/30 text-red-400' : 'border-white/5 text-white/50'
                }`}>
                  <Mic size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-bold">Mic Lockout Gate</h5>
                  <p className="text-[9px] text-white/40">Drown background noise completely</p>
                </div>
              </div>
              <button 
                onClick={() => setMicShieldEnabled(!micShieldEnabled)}
                className={`w-9 h-5.5 rounded-full p-0.5 transition-all flex items-center ${
                  micShieldEnabled ? 'bg-red-500 justify-end' : 'bg-white/10 justify-start'
                }`}
              >
                <div className="w-4.5 h-4.5 bg-white rounded-full shadow-md" />
              </button>
            </div>

            {/* VPN proxy relay switch */}
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-white/3 hover:bg-white/5 transition-all">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-white/5 border ${
                  vpnEnabled ? 'border-emerald-500/30 text-emerald-400' : 'border-white/5 text-white/50'
                }`}>
                  <EyeOff size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-bold">Onion Proxy Relay</h5>
                  <p className="text-[9px] text-white/40">Encrypt router headers recursively</p>
                </div>
              </div>
              <button 
                onClick={() => setVpnEnabled(!vpnEnabled)}
                className={`w-9 h-5.5 rounded-full p-0.5 transition-all flex items-center ${
                  vpnEnabled ? 'bg-emerald-500 justify-end' : 'bg-white/10 justify-start'
                }`}
              >
                <div className="w-4.5 h-4.5 bg-white rounded-full shadow-md" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

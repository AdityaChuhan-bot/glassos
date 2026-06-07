import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, Users, Clock, ShieldCheck, Delete, X, 
  Volume2, MicOff, Grid, Video, Play, ShieldAlert, Check
} from 'lucide-react';

interface CallRecord {
  id: string;
  name: string;
  number: string;
  time: string;
  type: 'incoming' | 'outgoing' | 'missed';
  private: boolean;
}

interface PhoneAppProps {
  onClose: () => void;
}

export const PhoneApp: React.FC<PhoneAppProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'dial' | 'contacts' | 'recent' | 'privacy'>('dial');
  const [dialNum, setDialNum] = useState<string>('');
  const [isCalling, setIsCalling] = useState<boolean>(false);
  const [callTimer, setCallTimer] = useState<number>(0);
  const [activeCallInterval, setActiveCallInterval] = useState<any>(null);
  
  // Call Configuration State (Privacy focused)
  const [isIncognito, setIsIncognito] = useState<boolean>(false);
  const [autoMaskNum, setAutoMaskNum] = useState<boolean>(true);
  const [zeroLog, setZeroLog] = useState<boolean>(false);
  const [speakerOn, setSpeakerOn] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);

  const [recents, setRecents] = useState<CallRecord[]>([
    { id: '1', name: 'Private Line 2A', number: '+1 (555) 321-4921', time: '10:42 AM', type: 'incoming', private: true },
    { id: '2', name: 'Secure Router Gateway', number: '+1 (415) 880-1112', time: 'Yesterday', type: 'outgoing', private: true },
    { id: '3', name: 'Unknown User', number: '+1 (212) 670-8201', time: 'June 5', type: 'missed', private: false },
    { id: '4', name: 'Corporate Router', number: '+1 (800) 441-2093', time: 'June 3', type: 'outgoing', private: false },
  ]);

  const contacts = [
    { name: 'Alpha Guard Node', num: '+1 (555) 123-4567', type: 'Decentralized IP' },
    { name: 'Central Control Hub', num: '+1 (555) 987-6543', type: 'Encrypted VOIP' },
    { name: 'Private Relay Line', num: '+1 (800) 992-0192', type: 'Dynamic Gateway' },
    { name: 'Secured Terminal 1', num: '+1 (415) 673-9021', type: 'Off-grid Fiber' },
    { name: 'Decoy Line Router', num: '+1 (212) 555-0100', type: 'SIP Protocol' },
  ];

  const handleKeyPress = (num: string) => {
    if (dialNum.length < 16) {
      setDialNum(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    setDialNum(prev => prev.slice(0, -1));
  };

  const startCall = (numberToDial: string) => {
    if (!numberToDial) return;
    setIsCalling(true);
    setCallTimer(0);
    const interval = setInterval(() => {
      setCallTimer(prev => prev + 1);
    }, 1000);
    setActiveCallInterval(interval);

    // Save call to log if zeroLog is disabled
    if (!zeroLog) {
      const isContact = contacts.find(c => c.num === numberToDial);
      const newRecord: CallRecord = {
        id: Date.now().toString(),
        name: isIncognito ? 'Secured Proxy Call' : (isContact?.name || 'Dialed Number'),
        number: numberToDial,
        time: 'Just now',
        type: 'outgoing',
        private: isIncognito || autoMaskNum,
      };
      setRecents(prev => [newRecord, ...prev]);
    }
  };

  const endCall = () => {
    if (activeCallInterval) {
      clearInterval(activeCallInterval);
      setActiveCallInterval(null);
    }
    setIsCalling(false);
    setCallTimer(0);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const formatDialString = (num: string) => {
    if (autoMaskNum && activeTab !== 'dial' && num.length > 5) {
      return `${num.slice(0, 4)} ***-*** ${num.slice(-2)}`;
    }
    return num;
  };

  return (
    <div id="phone_app_modal" className="absolute inset-0 bg-gradient-to-b from-[#1C1D24] to-[#0D0E12] text-white flex flex-col z-40 select-none overflow-hidden rounded-[2.5rem]">
      {/* Liquid Glass Overlay Design Background */}
      <div className="absolute top-[-30%] left-[-20%] w-[140%] h-[60%] bg-gradient-to-b from-blue-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      {/* Dynamic Header */}
      <div className="relative pt-12 px-6 pb-4 flex justify-between items-center border-b border-white/5 bg-white/5 backdrop-blur-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30" />
            <Phone size={15} className="text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">Liquid Phone</h1>
            <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure Tunnel Active
            </p>
          </div>
        </div>
        
        {/* Close Button with Glass Design */}
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all active:scale-90"
        >
          <X size={15} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col relative">
        <AnimatePresence mode="wait">
          {/* Dialer Tab */}
          {activeTab === 'dial' && !isCalling && (
            <motion.div 
              key="dial"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-grow flex flex-col justify-end gap-6 max-h-[80%] pb-6"
            >
              {/* Dial Input Panel */}
              <div className="flex flex-col items-center justify-center min-h-[4rem] px-4">
                <input 
                  type="text" 
                  readOnly 
                  value={dialNum} 
                  placeholder="Enter Passcode or Number"
                  className="bg-transparent text-center text-3xl font-light tracking-widest text-white placeholder:text-white/20 w-full outline-none"
                />
                {dialNum && (
                  <button 
                    onClick={handleBackspace}
                    className="mt-2 text-white/50 hover:text-white/80 active:scale-95 flex items-center gap-1 text-xs font-medium"
                  >
                    <Delete size={14} /> Clear
                  </button>
                )}
              </div>

              {/* Number Pad Grid - Premium Liquid Glass Buttons */}
              <div className="grid grid-cols-3 gap-x-5 gap-y-4 max-w-[280px] mx-auto w-full">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((char) => (
                  <motion.button
                    key={char}
                    whileTap={{ scale: 0.90, rotate: (char === '*' ? -8 : char === '#' ? 8 : 0) }}
                    onClick={() => handleKeyPress(char)}
                    className="relative aspect-square rounded-full flex flex-col items-center justify-center bg-white/5 hover:bg-white/10 select-none border border-white/10 shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.3)] transition-all overflow-hidden group"
                  >
                    {/* Liquid highlights */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent opacity-50 pointer-events-none" />
                    <div className="absolute top-1 left-2 w-[70%] h-[35%] bg-white/10 rounded-b-xl group-hover:bg-white/15 transition-all pointer-events-none" />
                    
                    <span className="text-2xl font-light tracking-wide relative z-10">{char}</span>
                    <span className="text-[8px] text-white/40 font-semibold absolute bottom-2 tracking-widest relative z-10">
                      {char === '2' && 'ABC'}
                      {char === '3' && 'DEF'}
                      {char === '4' && 'GHI'}
                      {char === '5' && 'JKL'}
                      {char === '6' && 'MNO'}
                      {char === '7' && 'PQRS'}
                      {char === '8' && 'TUV'}
                      {char === '9' && 'WXYZ'}
                      {char === '0' && '+'}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Action Button: Dial Call */}
              <div className="flex justify-center mt-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => startCall(dialNum)}
                  disabled={!dialNum}
                  className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center shadow-lg shadow-emerald-500/20 border border-white/15 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                  <div className="absolute top-1 left-2 w-[75%] h-[40%] bg-white/25 rounded-b-xl leading-none pointer-events-none" />
                  <Phone size={24} className="text-white relative z-10" />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Active Call UI overlay */}
          {isCalling && (
            <motion.div
              key="calling"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="flex-grow flex flex-col justify-between items-center py-10"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/15 relative overflow-hidden flex items-center justify-center shadow-2xl">
                  {/* Glass elements */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                  <div className="absolute top-[3px] left-[5px] w-[90%] h-[40%] bg-gradient-to-b from-white/20 to-transparent rounded-b-full pointer-events-none" />
                  
                  <Phone size={42} className="text-emerald-400 animate-pulse relative z-10" />
                </div>
                
                <h2 className="text-2xl font-semibold mt-4">
                  {isIncognito ? 'Secured Temporary Proxy' : formatDialString(dialNum)}
                </h2>
                
                <p className="text-sm font-mono text-white/50 tracking-wide bg-white/5 border border-white/5 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  {formatTimer(callTimer)}
                </p>
              </div>

              {/* Action grid (Speaker, Mute, Keypad) */}
              <div className="grid grid-cols-3 gap-6 w-full max-w-[260px] my-6">
                <button 
                  onClick={() => setSpeakerOn(!speakerOn)}
                  className={`aspect-square rounded-full border flex flex-col items-center justify-center gap-1 transition-all ${
                    speakerOn ? 'bg-white/20 border-white/35 text-white' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Volume2 size={20} />
                  <span className="text-[10px] font-medium">Speaker</span>
                </button>

                <button 
                  onClick={() => setMuted(!muted)}
                  className={`aspect-square rounded-full border flex flex-col items-center justify-center gap-1 transition-all ${
                    muted ? 'bg-red-500/20 border-red-500/45 text-red-300' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <MicOff size={20} />
                  <span className="text-[10px] font-medium">Mute</span>
                </button>

                <button 
                  onClick={() => setIsIncognito(!isIncognito)}
                  className={`aspect-square rounded-full border flex flex-col items-center justify-center gap-1 transition-all ${
                    isIncognito ? 'bg-blue-500/20 border-blue-500/45 text-blue-300' : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck size={20} />
                  <span className="text-[10px] font-medium">Incognito</span>
                </button>
              </div>

              {/* End Call Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={endCall}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 flex items-center justify-center shadow-lg shadow-red-600/20 border border-white/15 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none" />
                <div className="absolute top-[2px] left-[5px] w-[88%] h-[38%] bg-white/25 rounded-b-xl pointer-events-none" />
                <Phone size={24} className="text-white rotate-[135deg] relative z-10" />
              </motion.button>
            </motion.div>
          )}

          {/* Contacts Tab */}
          {activeTab === 'contacts' && (
            <motion.div 
              key="contacts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-grow flex flex-col gap-4 overflow-hidden"
            >
              <div className="text-xs font-semibold text-white/40 uppercase tracking-widest px-1 mt-2">
                Secure Contat List
              </div>
              <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
                {contacts.map((contact, i) => (
                  <div 
                    key={i} 
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-semibold text-sm">{contact.name}</h4>
                      <p className="text-xs text-white/40 font-mono mt-0.5">{formatDialString(contact.num)}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/10 rounded px-2 py-0.5 self-center font-mono uppercase tracking-wider">
                        {contact.type}
                      </span>
                      <button 
                        onClick={() => { setDialNum(contact.num); startCall(contact.num); }}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-emerald-400 active:scale-95 transition-all"
                      >
                        <Phone size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recents Tab */}
          {activeTab === 'recent' && (
            <motion.div 
              key="recent"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-grow flex flex-col gap-4 overflow-hidden"
            >
              <div className="flex justify-between items-center mt-2 px-1">
                <span className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                  Encryption Logs
                </span>
                <button 
                  onClick={() => setRecents([])}
                  className="text-[10px] text-red-400 hover:text-red-300 transition-colors font-semibold"
                >
                  Clear All
                </button>
              </div>

              <div className="flex-grow overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
                {recents.map((recent) => (
                  <div 
                    key={recent.id} 
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-white/5 border ${
                        recent.type === 'missed' ? 'border-red-500/20 text-red-400' : 'border-white/10 text-emerald-400'
                      }`}>
                        <Phone size={14} className={recent.type === 'outgoing' ? 'rotate-[135deg]' : ''} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{recent.name}</h4>
                          {recent.private && (
                            <span className="text-[8px] bg-emerald-500/20 text-emerald-300 rounded px-1.5 font-mono">
                              PRIVATE
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/40 font-mono mt-0.5">{formatDialString(recent.number)}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1.5">
                      <span className="text-[10px] text-white/40 font-mono">{recent.time}</span>
                      <button 
                        onClick={() => { setDialNum(recent.number); startCall(recent.number); }}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium"
                      >
                        Callback
                      </button>
                    </div>
                  </div>
                ))}
                {recents.length === 0 && (
                  <div className="flex flex-col items-center justify-center flex-1 py-12 text-center text-white/20 gap-2">
                    <ShieldCheck size={28} />
                    <p className="text-xs leading-relaxed">No call records loaded.<br />Zero-Log or Privacy Wipe active.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Privacy Controls Tab */}
          {activeTab === 'privacy' && (
            <motion.div 
              key="privacy"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-grow flex flex-col gap-5 overflow-hidden mt-2"
            >
              <div className="bg-gradient-to-b from-indigo-500/10 to-transparent border border-indigo-500/20 rounded-2xl p-4 flex gap-3 text-white/80">
                <ShieldCheck className="text-indigo-400 flex-shrink-0 mt-0.5" size={18} />
                <div className="text-xs leading-relaxed">
                  <h4 className="font-semibold text-white mb-0.5">End-to-End Cryptography Gate</h4>
                  This phone engine is routed through localized peer-to-peer security proxies. Call history is completely zero-knowledge.
                </div>
              </div>

              <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 custom-scrollbar">
                {/* Auto Mask Number */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-sm">Interactive Number Masking</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">Automatically encrypt layout digits with asterisks</p>
                  </div>
                  <button 
                    onClick={() => setAutoMaskNum(!autoMaskNum)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-all flex items-center ${
                      autoMaskNum ? 'bg-emerald-500 justify-end' : 'bg-white/10 border border-white/10 justify-start'
                    }`}
                  >
                    <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-md" />
                  </button>
                </div>

                {/* Zero Logs Mode */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-sm">Disappearing Session Logs</h4>
                    <p className="text-[10px] text-white/40 mt-0.5">Never save call timers, records, or dialed sequences</p>
                  </div>
                  <button 
                    onClick={() => setZeroLog(!zeroLog)}
                    className={`w-10 h-6 rounded-full p-0.5 transition-all flex items-center ${
                      zeroLog ? 'bg-emerald-500 justify-end' : 'bg-white/10 border border-white/10 justify-start'
                    }`}
                  >
                    <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-md" />
                  </button>
                </div>

                {/* Secure Line Simulator */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-sm">Dynamic Outbound Relay</h4>
                      <p className="text-[10px] text-white/40 mt-0.5">Current simulation node server proxy location</p>
                    </div>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 font-mono rounded px-2 py-0.5 border border-purple-500/10">
                      SECURE TUNNEL
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <div className="bg-white/3 border border-white/5 rounded-xl p-2 text-center text-xs">
                      <p className="text-white/40 text-[9px] uppercase tracking-wider font-semibold">Proxy Latency</p>
                      <p className="font-bold font-mono text-emerald-400 mt-0.5">14ms</p>
                    </div>
                    <div className="bg-white/3 border border-white/5 rounded-xl p-2 text-center text-xs">
                      <p className="text-white/40 text-[9px] uppercase tracking-wider font-semibold">Node Code</p>
                      <p className="font-bold font-mono text-blue-400 mt-0.5">AES-256</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      {!isCalling && (
        <div className="pb-8 pt-3 border-t border-white/5 bg-white/5 backdrop-blur-3xl flex justify-around">
          <button 
            onClick={() => setActiveTab('dial')}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 transition-all ${
              activeTab === 'dial' ? 'text-blue-400' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Grid size={18} />
            <span className="text-[10px] font-medium">Keypad</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('recent')}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 transition-all ${
              activeTab === 'recent' ? 'text-blue-400' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Clock size={18} />
            <span className="text-[10px] font-medium">Recents</span>
          </button>

          <button 
            onClick={() => setActiveTab('contacts')}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 transition-all ${
              activeTab === 'contacts' ? 'text-blue-400' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Users size={18} />
            <span className="text-[10px] font-medium">Contacts</span>
          </button>

          <button 
            onClick={() => setActiveTab('privacy')}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 transition-all ${
              activeTab === 'privacy' ? 'text-blue-400' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <ShieldCheck size={18} />
            <span className="text-[10px] font-medium">Privacy</span>
          </button>
        </div>
      )}
    </div>
  );
};

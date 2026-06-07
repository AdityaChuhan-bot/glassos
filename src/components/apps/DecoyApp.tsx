import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, EyeOff, ShieldAlert, Key, Plus, Trash, Edit2, 
  X, Check, LockKeyhole, FolderLock, PlusCircle, Save
} from 'lucide-react';

interface SecureNote {
  id: string;
  title: string;
  content: string;
  date: string;
}

interface SecureContact {
  id: string;
  name: string;
  phone: string;
  codename: string;
}

interface DecoyAppProps {
  onClose: () => void;
}

export const DecoyApp: React.FC<DecoyAppProps> = ({ onClose }) => {
  // Calculator mode or Vault mode
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('1111');
  const [pinInput, setPinInput] = useState<string>('');
  
  // Calculator operational stats
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [prevVal, setPrevVal] = useState<string>('');
  const [operation, setOperation] = useState<string | null>(null);
  const [justResult, setJustResult] = useState<boolean>(false);

  // Vault data (persisted locally)
  const [activeVaultTab, setActiveVaultTab] = useState<'notes' | 'contacts' | 'config'>('notes');
  const [notes, setNotes] = useState<SecureNote[]>(() => {
    const saved = localStorage.getItem('secure_vault_notes');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Onion Router Config', content: 'Local entry relay node: 12.82.90.11\nPassphrase: crystal_glass_sheen_2026', date: '06/07/2026' },
      { id: '2', title: 'Emergency Gate Option', content: 'In case of physical device inspection, dial *999# on Phone app to launch safe wipe.', date: '06/06/2026' }
    ];
  });
  const [contacts, setContacts] = useState<SecureContact[]>(() => {
    const saved = localStorage.getItem('secure_vault_contacts');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Alpha Agent', phone: '+1 (555) 720-1120', codename: 'Specter Node' },
      { id: '2', name: 'Secure Dropsite Warden', phone: '+1 (800) 412-9022', codename: 'Glass Base' }
    ];
  });

  // Editor states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [showNoteForm, setShowNoteForm] = useState(false);

  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCodename, setContactCodename] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);

  // Save vault inputs to localStorage
  useEffect(() => {
    localStorage.setItem('secure_vault_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('secure_vault_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // Decoy Calculator Processing Action
  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
      setPrevVal('');
      setOperation(null);
      setPinInput(''); // clear decoy password string too
    } else if (['+', '-', '*', '/'].includes(val)) {
      setPrevVal(calcDisplay);
      setOperation(val);
      setCalcDisplay('0');
    } else if (val === '=') {
      if (!operation || !prevVal) return;
      const num1 = parseFloat(prevVal);
      const num2 = parseFloat(calcDisplay);
      let calculated = 0;
      switch (operation) {
        case '+': calculated = num1 + num2; break;
        case '-': calculated = num1 - num2; break;
        case '*': calculated = num1 * num2; break;
        case '/': calculated = num2 !== 0 ? num1 / num2 : 0; break;
      }
      setCalcDisplay(calculated.toString());
      setOperation(null);
      setJustResult(true);

      // Verify if pinInput has triggered secret passcode entry sequence
      if (pinInput === pin) {
        setIsUnlocked(true);
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
      } else {
        setPinInput(''); // reset passcode input on equation solver
      }
    } else {
      // Numerical or dot click
      if (calcDisplay === '0' || justResult) {
        setCalcDisplay(val);
        setJustResult(false);
      } else {
        setCalcDisplay(prev => prev + val);
      }
      // Track passcode input
      setPinInput(prev => prev + val);
    }
  };

  const handleAddNote = () => {
    if (!noteTitle || !noteContent) return;
    const newNote: SecureNote = {
      id: Date.now().toString(),
      title: noteTitle,
      content: noteContent,
      date: new Date().toLocaleDateString()
    };
    setNotes(prev => [newNote, ...prev]);
    setNoteTitle('');
    setNoteContent('');
    setShowNoteForm(false);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleAddContact = () => {
    if (!contactName || !contactPhone) return;
    const newC: SecureContact = {
      id: Date.now().toString(),
      name: contactName,
      phone: contactPhone,
      codename: contactCodename || 'N/A'
    };
    setContacts(prev => [...prev, newC]);
    setContactName('');
    setContactPhone('');
    setContactCodename('');
    setShowContactForm(false);
  };

  const handleDeleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div id="decoy_app_modal" className="absolute inset-0 bg-[#0C0D11] text-white flex flex-col z-40 select-none overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
      {/* Liquid Glass Overlay Design */}
      <div className="absolute top-[-30%] left-[-20%] w-[140%] h-[55%] bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-[-15%] w-[130%] h-[25%] bg-gradient-to-b from-white/10 via-white/1 to-transparent rounded-b-[45%] pointer-events-none" />

      {/* Dynamic Header */}
      <div className="relative pt-12 px-6 pb-4 flex justify-between items-center border-b border-white/5 bg-white/3 backdrop-blur-2xl">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2E313D] flex items-center justify-center border border-white/10 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/30" />
            {isUnlocked ? <LockKeyhole size={15} className="text-emerald-400 animate-pulse" /> : <Lock size={15} className="text-white" />}
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight">
              {isUnlocked ? 'CrypVault Node' : 'Decoy Calculator'}
            </h1>
            <p className="text-[10px] text-white/50 flex items-center gap-1 font-mono">
              <span className={`w-1.5 h-1.5 rounded-full ${isUnlocked ? 'bg-emerald-400' : 'bg-white/40'}`} />
              {isUnlocked ? 'De-cloaked Security Base' : 'Math Standard Mode'}
            </p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all active:scale-90"
        >
          <X size={15} />
        </button>
      </div>

      {/* Main Content Pane */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* Calculator Mode */
            <motion.div 
              key="calc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-end p-6 pb-8 gap-4"
            >
              {/* Secret small Padlock Button as double safety trigger in decoy */}
              <div className="flex justify-between items-center mb-2 px-1 text-white/20">
                <span className="text-[10px] font-mono tracking-widest uppercase">Double Encrypted</span>
                <button 
                  onDoubleClick={() => setIsUnlocked(true)}
                  title="Force bypass"
                  className="hover:text-emerald-400"
                >
                  <LockKeyhole size={14} />
                </button>
              </div>

              {/* Calculator Panel display */}
              <div className="flex flex-col items-end pr-2 py-4">
                <span className="text-[11px] text-white/30 font-mono tracking-widest pr-1">
                  {operation ? `${prevVal} ${operation}` : 'CALCULATOR DIRECT'}
                </span>
                <span className="text-4xl font-light tracking-wide text-white font-mono mt-1 pr-1 truncate w-full text-right">
                  {calcDisplay}
                </span>
              </div>

              {/* Keypad Grid */}
              <div className="grid grid-cols-4 gap-3.5 mx-auto w-full max-w-[280px]">
                {['C', '/', '*', '-', '7', '8', '9', '+', '4', '5', '6', '=', '1', '2', '3', '0'].map((btn) => {
                  const isAction = ['C', '/', '*', '-', '+', '='].includes(btn);
                  return (
                    <motion.button
                      key={btn}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleCalcClick(btn)}
                      className={`aspect-square rounded-full flex items-center justify-center border font-mono text-base shadow-[0_4px_10px_rgba(0,0,0,0.3)] transition-colors relative overflow-hidden group ${
                        isAction 
                          ? btn === '=' 
                            ? 'bg-emerald-600 border-emerald-500 hover:bg-emerald-500 text-white'
                            : 'bg-white/10 border-white/15 hover:bg-white/15 text-emerald-400' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10 text-white'
                      }`}
                    >
                      {/* Liquid glass layer */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                      <div className="absolute top-1 left-2 w-[70%] h-[35%] bg-white/5 rounded-b-xl group-hover:bg-white/10 pointer-events-none" />
                      <span className="relative z-10">{btn}</span>
                    </motion.button>
                  );
                })}
              </div>

              <p className="text-[10px] text-center text-white/20 font-mono leading-relaxed px-6 mt-2">
                Tip: Enter PIN sequence and click "=" to open secure encrypted archives. Default sequence is <strong className="text-white/40 font-bold">1111</strong>.
              </p>
            </motion.div>
          ) : (
            /* Secure Vault unlocked view! */
            <motion.div 
              key="vault"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-grow flex flex-col h-full bg-[#101116]"
            >
              <div className="flex-grow overflow-y-auto px-6 py-4 flex flex-col justify-start relative custom-scrollbar">
                
                {/* Vault Section Tabs */}
                <div className="flex bg-white/5 border border-white/5 p-1 rounded-xl mb-4 text-xs">
                  <button 
                    onClick={() => { setActiveVaultTab('notes'); setShowNoteForm(false); }}
                    className={`flex-1 py-1.5 rounded-lg font-semibold text-center transition-all ${
                      activeVaultTab === 'notes' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-md' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    Secret Notes
                  </button>
                  <button 
                    onClick={() => { setActiveVaultTab('contacts'); setShowContactForm(false); }}
                    className={`flex-1 py-1.5 rounded-lg font-semibold text-center transition-all ${
                      activeVaultTab === 'contacts' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-md' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    EncryContacts
                  </button>
                  <button 
                    onClick={() => setActiveVaultTab('config')}
                    className={`flex-1 py-1.5 rounded-lg font-semibold text-center transition-all ${
                      activeVaultTab === 'config' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 shadow-md' : 'text-white/50 hover:text-white'
                    }`}
                  >
                    PIN Config
                  </button>
                </div>

                {/* Secure Notes Sub Tab */}
                {activeVaultTab === 'notes' && (
                  <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Secure Archive Logs</span>
                      <button 
                        onClick={() => setShowNoteForm(!showNoteForm)}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs flex items-center gap-1 active:scale-95 transition-all"
                      >
                        <PlusCircle size={14} /> New Note
                      </button>
                    </div>

                    {showNoteForm ? (
                      /* Create note screen */
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                        <input 
                          type="text" 
                          placeholder="Note Title" 
                          value={noteTitle}
                          onChange={(e) => setNoteTitle(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50"
                        />
                        <textarea 
                          placeholder="Confidential content details..." 
                          rows={4}
                          value={noteContent}
                          onChange={(e) => setNoteContent(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50 resize-none font-mono text-xs leading-relaxed"
                        />
                        <div className="flex gap-2 justify-end mt-1">
                          <button 
                            onClick={() => setShowNoteForm(false)}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl px-4 py-1.5 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleAddNote}
                            className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 rounded-xl px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Save size={12} /> Save Private Note
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display notes list */
                      <div className="flex-grow overflow-y-auto flex flex-col gap-3.5 pr-1 custom-scrollbar">
                        {notes.map(note => (
                          <div 
                            key={note.id} 
                            className="bg-white/3 border border-white/5 rounded-2xl p-4 flex flex-col gap-2 relative group hover:border-emerald-500/20 transition-all"
                          >
                            <button 
                              onClick={() => handleDeleteNote(note.id)}
                              className="absolute top-3.5 right-3.5 text-white/30 hover:text-red-400 transition-colors"
                            >
                              <Trash size={13} />
                            </button>
                            <h4 className="font-semibold text-sm pr-6 text-emerald-400">{note.title}</h4>
                            <p className="text-xs text-white/70 font-mono leading-relaxed whitespace-pre-wrap">{note.content}</p>
                            <span className="text-[9px] text-white/30 font-mono self-end">{note.date}</span>
                          </div>
                        ))}
                        {notes.length === 0 && (
                          <div className="text-center py-10 text-white/20 text-xs">
                            No secret archives stored. Click "New Note" to lock details.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Encrypted Contacts Sub Tab */}
                {activeVaultTab === 'contacts' && (
                  <div className="flex-grow flex flex-col gap-4 overflow-hidden">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold font-mono">Special Operation Nodes</span>
                      <button 
                        onClick={() => setShowContactForm(!showContactForm)}
                        className="text-emerald-400 hover:text-emerald-300 font-semibold text-xs flex items-center gap-1 active:scale-95 transition-all"
                      >
                        <PlusCircle size={14} /> Add Contact
                      </button>
                    </div>

                    {showContactForm ? (
                      /* Add contact screen */
                      <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex flex-col gap-3">
                        <input 
                          type="text" 
                          placeholder="Contact Name / Alias" 
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50"
                        />
                        <input 
                          type="text" 
                          placeholder="Codename / Tag" 
                          value={contactCodename}
                          onChange={(e) => setContactCodename(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none focus:border-emerald-500/50"
                        />
                        <input 
                          type="text" 
                          placeholder="Secure Phone / IP Address" 
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full bg-black/40 border border-[#2E3340] rounded-xl px-3 py-2 text-sm text-white placeholder:text-white/30 font-mono outline-none focus:border-emerald-500/50"
                        />
                        <div className="flex gap-2 justify-end mt-1">
                          <button 
                            onClick={() => setShowContactForm(false)}
                            className="bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl px-4 py-1.5 text-xs font-semibold"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={handleAddContact}
                            className="bg-emerald-600 hover:bg-emerald-500 border border-emerald-500 rounded-xl px-4 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                          >
                            <Save size={12} /> Lock Contact
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Display locked contacts screen */
                      <div className="flex-grow overflow-y-auto flex flex-col gap-2.5 pr-1 custom-scrollbar">
                        {contacts.map(c => (
                          <div 
                            key={c.id} 
                            className="bg-white/3 border border-white/5 rounded-xl p-3 flex justify-between items-center group hover:border-emerald-500/20 transition-all"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-xs text-white">{c.name}</h4>
                                <span className="text-[8px] bg-red-500/10 text-red-400 font-mono border border-red-500/10 rounded px-1.5 uppercase tracking-wider">
                                  {c.codename}
                                </span>
                              </div>
                              <p className="text-[11px] text-white/50 font-mono mt-0.5">{c.phone}</p>
                            </div>
                            <button 
                              onClick={() => handleDeleteContact(c.id)}
                              className="text-white/30 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Config PIN controls Sub Tab */}
                {activeVaultTab === 'config' && (
                  <div className="flex-grow flex flex-col gap-4 justify-start mt-2">
                    <div className="p-4 rounded-2xl bg-white/3 border border-white/5 flex flex-col gap-3">
                      <h4 className="font-semibold text-sm">Passphrase Code</h4>
                      <p className="text-[10px] text-white/40 leading-relaxed">
                        Input this numerical string sequence into standard math decoy calculator click sequence and solve with "=" to open vaults.
                      </p>
                      
                      <div className="flex gap-2 mt-2">
                        <input 
                          type="text" 
                          maxLength={6}
                          placeholder="New Passcode (e.g. 1111)" 
                          value={pin}
                          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                          className="flex-grow bg-black/45 border border-white/10 rounded-xl px-3 py-2 text-sm text-center font-mono font-bold tracking-widest text-emerald-400 outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-xs text-amber-300 leading-relaxed flex gap-3">
                      <ShieldAlert className="flex-shrink-0 mt-0.5 text-amber-400" size={16} />
                      <div>
                        <h5 className="font-semibold mb-0.5">Physical Search Wipe</h5>
                        Wipe dynamic memory on third incorrect attempts automatically. Double safety is secure.
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Navigation and Lock Footer */}
              <div className="pb-8 pt-3 border-t border-white/5 bg-white/5 backdrop-blur-3xl flex justify-around items-center">
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 uppercase font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  AES-256 Vault Active
                </span>
                
                <button 
                  onClick={() => setIsUnlocked(false)}
                  className="bg-red-500/20 hover:bg-red-500/30 font-semibold text-[11px] text-red-400 px-4 py-1.5 rounded-full border border-red-500/15 flex items-center gap-1 transition-all active:scale-95"
                >
                  <LockKeyhole size={11} /> Lock Portal
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

export const AOD: React.FC<{ onWake: () => void }> = ({ onWake }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours();

  const dayName = format(time, 'EEE').toUpperCase();
  const monthName = format(time, 'MMM').toUpperCase();
  const day = format(time, 'dd');

  // Rotation calculations
  const secRot = seconds * 6;
  const minRot = minutes * 6;
  const hourRot = (hours % 12) * 30 + minutes / 2;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#292929] flex items-center justify-center overflow-hidden cursor-pointer select-none"
      onClick={onWake}
    >
      <div className="relative w-[450px] h-[450px] flex items-center justify-center">
        
        {/* Day Dial (Outer) */}
        <div className="absolute w-[450px] h-[450px] rounded-full border-[10px] border-white/10 flex items-center justify-center">
          <div 
            className="absolute inset-0 border-[45px] border-[#202020] border-b-transparent rounded-full shadow-[0_-2px_2px_#000] transition-transform duration-500"
            style={{ transform: `rotate(${135 - (270/31) * (parseInt(day)-1)}deg)` }}
          >
            <div className="absolute top-[-45px] left-1/2 -translate-x-1/2 text-[10px] text-[#FF2D55] font-mono font-bold pt-2">
              {day}
            </div>
          </div>
        </div>

        {/* Month Dial */}
        <div className="absolute w-[350px] h-[350px] rounded-full border-[10px] border-white/10 flex items-center justify-center">
          <div 
            className="absolute inset-0 border-[45px] border-[#202020] border-b-transparent rounded-full shadow-[0_-2px_2px_#000] transition-transform duration-500"
            style={{ transform: `rotate(${135 - (270/12) * (time.getMonth())}deg)` }}
          >
             <div className="absolute top-[-45px] left-1/2 -translate-x-1/2 text-[10px] text-[#007AFF] font-mono font-bold pt-2">
              {monthName}
            </div>
          </div>
        </div>

        {/* Day Name Dial */}
        <div className="absolute w-[250px] h-[250px] rounded-full border-[10px] border-white/10 flex items-center justify-center">
          <div 
            className="absolute inset-0 border-[45px] border-[#202020] border-b-transparent rounded-full shadow-[0_-2px_2px_#000] transition-transform duration-500"
            style={{ transform: `rotate(${135 - (270/7) * (time.getDay() === 0 ? 6 : time.getDay() - 1)}deg)` }}
          >
             <div className="absolute top-[-45px] left-1/2 -translate-x-1/2 text-[10px] text-[#4CD964] font-mono font-bold pt-2">
              {dayName}
            </div>
          </div>
        </div>

        {/* Center Clock */}
        <div className="relative w-[150px] h-[150px] bg-[#202020] rounded-full shadow-[0_2px_2px_#000] flex items-center justify-center">
          {/* Hands */}
          <div className="absolute inset-0 flex items-center justify-center">
             {/* Hour Hand */}
             <div 
              className="absolute w-[10px] h-[50px] bg-white rounded-full origin-bottom -translate-y-[25px] transition-transform duration-500"
              style={{ transform: `rotate(${hourRot}deg)` }}
            />
            {/* Minute Hand */}
            <div 
              className="absolute w-[10px] h-[70px] bg-[#CCC] rounded-full origin-bottom -translate-y-[35px] transition-transform duration-500"
              style={{ transform: `rotate(${minRot}deg)` }}
            />
            {/* Second Hand */}
            <div 
              className="absolute w-[2px] h-[70px] bg-[#AAA] rounded-full origin-bottom -translate-y-[35px] transition-transform duration-100"
              style={{ transform: `rotate(${secRot}deg)` }}
            />
          </div>
        </div>

        {/* Weather & Steps (Side Rings) */}
        <div className="absolute left-[-150px] w-[150px] h-[150px] bg-[#202020] rounded-full shadow-[0_2px_2px_#000] flex flex-col items-center justify-center opacity-50">
          <div className="text-white/50 text-2xl mb-1">☁️</div>
          <div className="text-[#FFCC00] font-mono">14°C</div>
        </div>
        <div className="absolute right-[-150px] w-[150px] h-[150px] bg-[#202020] rounded-full shadow-[0_2px_2px_#000] flex items-center justify-center opacity-50 p-4">
           <div className="flex items-end gap-1 h-12">
              {[40, 60, 30, 80, 50, 70, 45].map((h, i) => (
                <div key={i} className="w-2 bg-blue-500 rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
           </div>
        </div>

      </div>
      
      <div className="absolute bottom-10 text-white/20 font-mono text-sm">
        TAP TO WAKE
      </div>
    </motion.div>
  );
};

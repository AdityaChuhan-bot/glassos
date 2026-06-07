import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Battery, Wifi, Signal } from 'lucide-react';

export const StatusBar: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-10 flex items-center justify-between px-6 z-40 pointer-events-none">
      <div className="text-white text-[13px] font-bold">
        {format(time, 'HH:mm')}
      </div>
      
      <div className="flex items-center gap-1.5">
        <Signal size={14} className="text-white" />
        <Wifi size={14} className="text-white" />
        <div className="flex items-center gap-0.5 border border-white/40 rounded-[2px] px-[2px] py-[1px]">
          <div className="w-4 h-2 bg-white rounded-[1px]" />
          <div className="w-[1px] h-1 bg-white/40 rounded-r-sm" />
        </div>
      </div>
    </div>
  );
};

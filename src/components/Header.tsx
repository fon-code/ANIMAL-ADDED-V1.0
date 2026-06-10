import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Box } from 'lucide-react';

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  };

  return (
    <header className="bg-transparent border-b border-slate-200/50 px-6 py-3 flex justify-between items-center z-10">
      {/* Left side: Workspace Title */}
      <div className="flex items-center gap-3">
        <div className="text-[#ab8a3b] p-1 border border-[#ab8a3b]/20 rounded-md">
          <Box size={22} strokeWidth={2} />
        </div>
        <div className="flex items-center gap-1.5 text-base font-black tracking-widest uppercase">
          <span className="text-[#111f42]">WMS</span>
          <span className="text-[#E3624A]">MASTER</span>
          <span className="text-[#111f42]">CORE</span>
        </div>
      </div>

      {/* Right side: Date and Time */}
      <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 px-4 py-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(currentTime)}
          </span>
          <span className="text-xs font-black text-[#111f42] uppercase tracking-wider">
            {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(currentTime)}
          </span>
        </div>
        <div className="flex items-center gap-2 bg-[#111f42] text-white px-4 py-1.5 rounded-full">
          <Clock size={14} className="text-[#ab8a3b]" />
          <span className="text-xs font-black font-mono tracking-wider">
            {new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }).format(currentTime)}
          </span>
        </div>
      </div>
    </header>
  );
}

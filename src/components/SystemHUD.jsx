"use client";
import React, { useEffect, useState } from 'react';
import { Zap, Lock } from 'lucide-react';

const SystemHUD = () => {
  const [latency, setLatency] = useState(14);

  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 5) + 12);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-[100] px-6 py-2">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse"></div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Core_Status: Optimal</span>
          </div>
          <div className="hidden md:flex items-center space-x-2 border-l border-slate-800 pl-6">
            <Lock size={12} className="text-emerald-500" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">AES-256 Quantum_Hardened</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Zap size={12} className="text-amber-500" />
            <span className="text-[10px] font-mono text-slate-400 uppercase">Latency: {latency}ms</span>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 rounded">
            <span className="text-[9px] font-mono text-cyan-500 font-bold tracking-tighter">NODE_ID: COMPLI-PRIME-01</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemHUD;

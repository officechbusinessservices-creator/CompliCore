"use client";
import React, { useEffect, useState } from 'react';

const SystemPulse = () => {
  const [networkLoad, setNetworkLoad] = useState(12);
  const [tvl, setTvl] = useState(1.24);
  const [blockHeight, setBlockHeight] = useState(882104221);

  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkLoad((prev) => Math.max(8, Math.min(25, prev + Math.floor(Math.random() * 5) - 2)));
      setTvl((prev) => Math.max(1.12, Math.min(1.39, Number((prev + (Math.random() * 0.02 - 0.01)).toFixed(2)))));
      setBlockHeight((prev) => prev + Math.floor(Math.random() * 5 + 1));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sticky top-0 z-50 w-full bg-cyan-500/10 border-b border-cyan-500/20 py-1 px-4 flex justify-between items-center backdrop-blur-md">
      <div className="flex items-center space-x-4">
        <span className="text-[9px] font-mono text-cyan-500 tracking-tighter uppercase">Network_Load: {networkLoad}%</span>
        <span className="text-[9px] font-mono text-emerald-500 tracking-tighter uppercase">
          Total_Value_Locked: ${tvl.toFixed(2)}T
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-ping"></div>
        <span className="text-[9px] font-mono text-slate-400 tracking-tighter uppercase">Block_Height: {blockHeight.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default SystemPulse;

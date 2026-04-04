"use client";
import React, { useState, useEffect } from 'react';
import { Share2, Globe, Landmark, ShieldAlert } from 'lucide-react';

const ProtocolBridge = () => {
  const [logs, setLogs] = useState([
    { id: 1, msg: "INITIALIZING PROTOCOL BRIDGE...", type: "system" },
  ]);

  const eventTypes = [
    { label: "BANK_SWIFT", msg: "Liquidity verified for Asset_882", icon: <Landmark size={12} /> },
    { label: "GOV_REGISTRY", msg: "Deed hash confirmed on-chain", icon: <Globe size={12} /> },
    { label: "IOT_CORE", msg: "Structural sensor sync complete", icon: <ShieldAlert size={12} /> }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const event = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      const newLog = {
        id: Date.now(),
        msg: `${event.label}: ${event.msg}`,
        type: "event",
        icon: event.icon
      };
      setLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group w-full max-w-4xl mx-auto mt-2">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-10"></div>

      <div className="relative bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Share2 className="text-blue-400" size={16} />
            <h3 className="text-white font-mono text-sm font-bold tracking-widest">EXTERNAL_INTEGRATION_HUB</h3>
          </div>
          <div className="text-[10px] font-mono text-slate-500">ENCRYPTED_TUNNEL: ACTIVE</div>
        </div>

        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-center space-x-3 animate-in fade-in slide-in-from-left-2 duration-500">
              <span className="text-blue-500">{log.icon || ">"}</span>
              <span className="text-[11px] font-mono text-slate-300 tracking-tight italic">{log.msg}</span>
              <span className="ml-auto text-[9px] font-mono text-slate-600">[{new Date().toLocaleTimeString()}]</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-around border-t border-slate-900 pt-4">
          {['FINANCE', 'GOVERNMENT', 'PHYSICAL'].map((node) => (
            <div key={node} className="flex flex-col items-center group/node">
              <div className="h-1 w-12 bg-slate-800 rounded-full overflow-hidden mb-1">
                <div className="h-full bg-blue-500 animate-pulse"></div>
              </div>
              <span className="text-[9px] font-mono text-slate-500 group-hover/node:text-blue-400 transition-colors cursor-default">{node}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProtocolBridge;

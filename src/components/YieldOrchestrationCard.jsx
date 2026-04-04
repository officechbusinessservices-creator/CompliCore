"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, ArrowUpRight } from "lucide-react";

const YieldOrchestrationCard = () => {
  const [value, setValue] = useState(14205.85);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.random() * 0.5 - 0.1;
      setValue((prev) => prev + change);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group w-full max-w-md mx-auto">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>

      <div className="relative bg-slate-950 border border-slate-800 rounded-lg p-6 h-full flex flex-col justify-between overflow-hidden">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-emerald-400 font-mono text-xs tracking-widest uppercase mb-1">
              {"// MODULE: REVENUE_OPT"}
            </h3>
            <h2 className="text-white text-xl font-bold tracking-tight">Yield Orchestration</h2>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900/50 px-2 py-1 rounded border border-emerald-900/30">
            <ArrowUpRight size={14} className="text-emerald-500" />
            <span className="text-emerald-500 text-[10px] font-mono">OPTIMIZING</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-slate-400 text-sm leading-relaxed">
            Predictive AI models adjust rental pricing in real-time based on
            micro-market liquidity. We eliminate vacancy downtime to maximize Net
            Operating Income (NOI).
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-950/30 rounded border border-emerald-900/50 text-emerald-400">
              <TrendingUp size={20} />
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase font-mono">Est. Asset Value (Live)</span>
              <span className="text-lg text-white font-mono tracking-wider">
                ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="text-xs text-emerald-500 font-mono flex items-center">
            +2.4% <span className="text-slate-500 ml-1">24H</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YieldOrchestrationCard;

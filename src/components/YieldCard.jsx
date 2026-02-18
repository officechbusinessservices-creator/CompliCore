"use client";
import React from 'react';
import { TrendingUp, Landmark, Timer } from 'lucide-react';
import VerificationBadge from '@/components/VerificationBadge';

const YieldCard = () => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-purple-500/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-purple-400" size={18} />
          <h4 className="text-sm font-bold text-white">Offense Yield</h4>
        </div>
        <span className="text-[10px] font-mono text-purple-400">LIVE</span>
      </div>

      <div className="mb-3">
        <VerificationBadge compact hash="0x882f...b72" />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        Autonomous treasury and collateral orchestration turns rent flow into capital-ready liquidity.
      </p>

      <div className="space-y-2 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-2"><Landmark size={12} className="text-cyan-400" /> Float window: 72h</div>
        <div className="flex items-center gap-2"><TrendingUp size={12} className="text-emerald-400" /> Yield spread: +2.8%</div>
        <div className="flex items-center gap-2"><Timer size={12} className="text-amber-400" /> Collateral package: 410ms</div>
      </div>
    </div>
  );
};

export default YieldCard;

"use client";
import React from 'react';
import { ShieldCheck, Scale, AlertTriangle } from 'lucide-react';
import VerificationBadge from '@/components/VerificationBadge';

const RegulatoryCard = () => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-cyan-500/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-cyan-400" size={18} />
          <h4 className="text-sm font-bold text-white">Defensive Shield</h4>
        </div>
        <span className="text-[10px] font-mono text-cyan-400">ACTIVE</span>
      </div>

      <div className="mb-3">
        <VerificationBadge compact hash="0x882f...a11" />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        Legal-as-code policy checks run before asset actions, keeping registration and operations compliant by default.
      </p>

      <div className="space-y-2 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-2"><Scale size={12} className="text-amber-400" /> Jurisdiction profiles: 38</div>
        <div className="flex items-center gap-2"><ShieldCheck size={12} className="text-emerald-400" /> Pass rate: 99.7%</div>
        <div className="flex items-center gap-2"><AlertTriangle size={12} className="text-orange-400" /> Open exceptions: 2</div>
      </div>
    </div>
  );
};

export default RegulatoryCard;

"use client";
import React from 'react';
import { DatabaseZap, Globe2, BrainCircuit } from 'lucide-react';
import VerificationBadge from '@/components/VerificationBadge';

const DeepDataCard = () => {
  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/40 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DatabaseZap className="text-emerald-400" size={18} />
          <h4 className="text-sm font-bold text-white">Intelligence Ledger</h4>
        </div>
        <span className="text-[10px] font-mono text-emerald-400">SYNCED</span>
      </div>

      <div className="mb-3">
        <VerificationBadge compact hash="0x882f...c94" />
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-4">
        Unified data plane combining legal, financial, and physical telemetry into a persistent machine-verifiable truth graph.
      </p>

      <div className="space-y-2 text-[11px] font-mono text-slate-300">
        <div className="flex items-center gap-2"><Globe2 size={12} className="text-cyan-400" /> Coverage: 122 metros</div>
        <div className="flex items-center gap-2"><BrainCircuit size={12} className="text-purple-400" /> CompliScore refresh: 12m</div>
        <div className="flex items-center gap-2"><DatabaseZap size={12} className="text-emerald-400" /> Ledger integrity: 99.99%</div>
      </div>
    </div>
  );
};

export default DeepDataCard;

"use client";
import React from 'react';
import { BadgeCheck } from 'lucide-react';

const VerificationBadge = ({ hash = '0x882f...d31', compact = false }) => {
  return (
    <div className="group relative inline-flex items-center">
      <span
        className={`inline-flex items-center gap-1 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[9px] font-mono uppercase tracking-wider text-emerald-300 ${
          compact ? 'px-1.5 py-0.5 text-[8px]' : ''
        }`}
      >
        <BadgeCheck size={compact ? 10 : 12} />
        Verified
      </span>
      <div className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max -translate-x-1/2 rounded border border-slate-700 bg-slate-950 px-2 py-1 text-[9px] font-mono text-slate-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100">
        Cryptographically Verified via Merkle-Root Hash: {hash}
      </div>
    </div>
  );
};

export default VerificationBadge;

"use client";
import React, { useState } from 'react';
import { Send, FileCode, ShieldQuestion, Globe } from 'lucide-react';

const ProposalCreator = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [optimisticMessage, setOptimisticMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOptimisticMessage('Consensus reached. Syncing with nodes.');

    setTimeout(() => {
      setIsSubmitting(false);
      setOptimisticMessage('');
    }, 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-12 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl relative">
      {isSubmitting && (
        <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center backdrop-blur-sm">
          <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-mono text-cyan-500 text-xs tracking-widest animate-pulse uppercase">
            Broadcasting to Consensus Nodes...
          </p>
        </div>
      )}

      <div className="p-8">
        <div className="flex items-center space-x-3 mb-8 border-b border-slate-900 pb-6">
          <div className="p-3 bg-amber-500/10 rounded-lg">
            <FileCode className="text-amber-500" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Draft Protocol Proposal</h3>
            <p className="text-slate-500 text-xs font-mono uppercase">Authority Level: Institutional Tier-1</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {optimisticMessage && (
            <div className="rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] font-mono text-emerald-300">
              {optimisticMessage}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Proposal Title</label>
              <input
                type="text"
                placeholder="e.g., CCP-201: Cross-Border Liquidity Bridge"
                className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Target Jurisdiction</label>
              <select className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-sm text-white focus:outline-none focus:border-cyan-500">
                <option>GLOBAL_PROTOCOL_V4</option>
                <option>EU_REGULATORY_ZONE</option>
                <option>APAC_LIQUIDITY_HUB</option>
                <option>NORTH_AMERICA_CORE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-500 uppercase mb-2">Executive Summary</label>
            <textarea
              rows="4"
              placeholder="Define the logic of the protocol change..."
              className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
            ></textarea>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-lg">
            <div className="flex items-center space-x-4 text-xs text-slate-400">
              <div className="flex items-center space-x-1">
                <ShieldQuestion size={14} className="text-cyan-500" />
                <span>Requires 66% Quorum</span>
              </div>
              <div className="flex items-center space-x-1">
                <Globe size={14} className="text-purple-500" />
                <span>Auto-Deploy Enabled</span>
              </div>
            </div>
            <button
              type="submit"
              className="flex items-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-2 rounded font-bold transition-all shadow-lg shadow-amber-900/20 active:scale-95 text-xs tracking-widest uppercase"
            >
              <Send size={14} />
              <span>Submit to Council</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalCreator;

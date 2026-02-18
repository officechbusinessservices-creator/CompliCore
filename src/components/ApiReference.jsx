"use client";
import React, { useMemo, useState } from 'react';
import { Play, Copy, Check } from 'lucide-react';

const ApiReference = () => {
  const [method, setMethod] = useState('GET');
  const [copied, setCopied] = useState(false);

  const codeSnippet = useMemo(
    () => `${method} /v1/assets/yield_sync
Host: api.complicore.io
Authorization: Bearer COMPLI_LIVE_TRK_8829...
Content-Type: application/json

{
  "asset_id": "NYC-FIN-001",
  "sync_mode": "REAL_TIME",
  "protocol": "KINETIC_VAULT_V4"
}`,
    [method],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500/50"></div>
        </div>
        <div className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">
          Protocol Explorer v1.0.4
        </div>
      </div>

      <div className="flex flex-col md:flex-row h-[450px]">
        <div className="w-full md:w-64 bg-slate-950 border-r border-slate-900 p-4 space-y-6">
          <div>
            <h4 className="text-[10px] font-mono text-slate-500 uppercase mb-3">Asset Ledger</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li
                onClick={() => setMethod('GET')}
                className={`${method === 'GET' ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'} cursor-pointer hover:bg-slate-900 p-1 rounded transition-colors`}
              >
                GET /assets
              </li>
              <li
                onClick={() => setMethod('POST')}
                className={`${method === 'POST' ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'} cursor-pointer hover:bg-slate-900 p-1 rounded transition-colors`}
              >
                POST /register
              </li>
              <li
                onClick={() => setMethod('PUT')}
                className={`${method === 'PUT' ? 'text-cyan-400 bg-slate-900' : 'text-slate-400'} cursor-pointer hover:bg-slate-900 p-1 rounded transition-colors`}
              >
                PUT /yield_sync
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-mono text-slate-500 uppercase mb-3">Compliance</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li className="text-slate-400 cursor-pointer hover:bg-slate-900 p-1 rounded transition-colors">GET /verify_deed</li>
              <li className="text-slate-400 cursor-pointer hover:bg-slate-900 p-1 rounded transition-colors">POST /tax_emit</li>
            </ul>
          </div>
        </div>

        <div className="flex-1 p-6 bg-slate-900/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 text-sm">
              <span className="text-emerald-400 font-bold font-mono bg-emerald-400/10 px-2 py-1 rounded">{method}</span>
              <span className="text-slate-200 font-mono tracking-tight">/v1/assets/yield_sync</span>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400"
              aria-label="Copy API request"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
            </button>
          </div>

          <div className="bg-slate-950 rounded-lg p-4 h-64 border border-slate-800 relative font-mono text-sm leading-relaxed overflow-auto">
            <pre className="text-slate-300 whitespace-pre-wrap">{codeSnippet}</pre>
            <div className="absolute bottom-4 right-4">
              <button className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded font-bold transition-all shadow-lg shadow-cyan-900/20 active:scale-95">
                <Play size={14} fill="white" />
                <span>TEST CALL</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center space-x-2 text-[10px] font-mono text-slate-500">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span>READY FOR INTEGRATION: 200 OK (24ms)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiReference;

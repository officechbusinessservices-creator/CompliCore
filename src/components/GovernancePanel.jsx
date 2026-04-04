"use client";
import React, { useState } from 'react';
import { Gavel, Globe, ShieldAlert, KeyRound } from 'lucide-react';

const GovernancePanel = () => {
  const [activeTab, setActiveTab] = useState('governance');
  const [keysAuthorized, setKeysAuthorized] = useState(2);
  const [uploadedManifestName, setUploadedManifestName] = useState('');
  const [ccp201Submitted, setCcp201Submitted] = useState(false);
  const [broadcastInitiated, setBroadcastInitiated] = useState(false);
  const [pendingTitanHolders, setPendingTitanHolders] = useState([3, 4, 5]);
  const [ledgerIntegrity, setLedgerIntegrity] = useState(99.99);
  const [rehashing, setRehashing] = useState(false);
  const [protocolFinalized, setProtocolFinalized] = useState(false);
  const [nodeSweepActive, setNodeSweepActive] = useState(false);
  const [apacSyncLevel, setApacSyncLevel] = useState(94);
  const [sentinelArmed, setSentinelArmed] = useState(false);

  const proposals = [
    { id: 'CCP-104', title: 'Standardize HK-Zoning Metadata', status: 'VOTING', support: 82 },
    { id: 'CCP-105', title: 'Activate Basel III Compliance Auto-Shield', status: 'PASSED', support: 99 },
    { id: 'CCP-106', title: 'Bridge Liquidity to ECB Digital Euro', status: 'PENDING', support: 45 },
    {
      id: 'CCP-201-GLOBAL-2026',
      title: 'Universal Jurisdictional Alignment Protocol',
      status: ccp201Submitted ? 'AWAITING QUORUM' : 'DRAFT',
      support: ccp201Submitted ? 0 : 0,
    },
  ];

  const postActivationRules = [
    {
      group: 'EU / EEA',
      logic: 'GDPR + AI Act compliance profile',
      constraint: 'Right-to-Erasure via soft-pruning and audit-safe tombstones',
    },
    {
      group: 'USA',
      logic: 'Federal/State privacy profile (incl. CCPA-style controls)',
      constraint: 'Opt-out signal propagation across all synchronized nodes',
    },
    {
      group: 'APAC',
      logic: 'APPI / PIPL jurisdiction profile',
      constraint: 'Strict data residency with geo-fenced validator routing',
    },
    {
      group: 'Common Law',
      logic: 'Precedent-based audit profile',
      constraint: 'High-fidelity deed-hash logging and replay-safe traceability',
    },
    {
      group: 'Global Tax Logic',
      logic: 'Smart-contract arbitrated jurisdictional levies',
      constraint: 'Tax residency cross-check + local tax API compliance hooks',
    },
    {
      group: 'Global Baseline',
      logic: 'Tier-1 sovereign sync policy',
      constraint: 'AES-256-GCM envelope + Titan re-sign on jurisdiction change',
    },
  ];

  const killSwitchReady = keysAuthorized >= 5;
  const amberAlert = ccp201Submitted;
  const systemStateLabel = protocolFinalized ? 'Sovereign & Immutable' : 'Sovereign & Active';
  const ledgerLatency = broadcastInitiated && !protocolFinalized ? 'Elevated (Normal during CCP-201)' : 'Optimal';
  const networkStateLabel = protocolFinalized ? 'SOVEREIGN IMMUTABLE' : broadcastInitiated ? 'PRE-SOVEREIGN IMMUTABLE' : 'STANDBY';
  const latencySeconds = protocolFinalized ? 0.085 : broadcastInitiated ? 1.2 : 0.4;
  const inauguralDeed = {
    record: 'CCP-201-GENESIS',
    timestampUtc: '2026-02-12 | 15:25:01 UTC',
    authority: 'Universal Sovereign Quorum (5/5)',
    hash: '0x7a8e...f29b11',
  };

  const submitCcp201Draft = () => {
    if (!uploadedManifestName) return;
    setCcp201Submitted(true);
    setKeysAuthorized((prev) => Math.min(5, Math.max(prev + 1, 3)));
  };

  const initiateBroadcast = () => {
    if (!ccp201Submitted) return;
    setBroadcastInitiated(true);
    setNodeSweepActive(true);
  };

  const confirmHolderSignature = (holderId) => {
    setPendingTitanHolders((prev) => prev.filter((id) => id !== holderId));
    setKeysAuthorized((prev) => Math.min(5, prev + 1));
  };

  const runFinalHandshake = () => {
    setRehashing(true);
    setLedgerIntegrity(99.98);
    setTimeout(() => {
      setLedgerIntegrity(99.99);
      setRehashing(false);
    }, 1200);
  };

  const finalizeProtocol = () => {
    if (!killSwitchReady) return;
    setProtocolFinalized(true);
    setApacSyncLevel(100);
    setNodeSweepActive(false);
  };

  const holderStatus = (holderId) => {
    if (!broadcastInitiated) return holderId <= 2 ? 'AUTHORIZED' : 'PENDING';
    if (holderId === 4 && pendingTitanHolders.includes(4) && !pendingTitanHolders.includes(3)) return 'PROPAGATING';
    if (holderId === 5 && pendingTitanHolders.includes(5)) return 'IDLE';
    return holderId <= 2 || !pendingTitanHolders.includes(holderId) ? 'AUTHORIZED' : 'PENDING';
  };

  const runNodeSweep = () => {
    setNodeSweepActive(true);
    setApacSyncLevel((prev) => Math.min(100, prev + 3));
  };

  const holder5MempoolDetected = broadcastInitiated && pendingTitanHolders.includes(5) && !pendingTitanHolders.includes(4);
  const nearQuorum = keysAuthorized === 4 && holder5MempoolDetected;
  const sentinelReady = protocolFinalized && apacSyncLevel === 100;

  return (
    <div className="w-full max-w-5xl mx-auto mt-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-slate-900/50 p-6 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Gavel className="text-amber-500" size={20} />
            <span>Protocol Governance</span>
          </h2>
          <p className="text-slate-500 text-xs font-mono mt-1 uppercase tracking-widest">
            Stakeholder Voting Power: 4.2T Assets Under Management
          </p>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400"
            >
              B_{i}
            </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-slate-950 bg-cyan-900 flex items-center justify-center text-[10px] font-bold text-white">
            +42
          </div>
        </div>
      </div>

      <div className="px-6 pt-4 flex gap-2 border-b border-slate-800 bg-slate-950/60">
        <button
          onClick={() => setActiveTab('governance')}
          className={`px-3 py-2 text-[10px] uppercase tracking-widest font-mono rounded-t ${
            activeTab === 'governance' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Governance
        </button>
        <button
          onClick={() => setActiveTab('drafting')}
          className={`px-3 py-2 text-[10px] uppercase tracking-widest font-mono rounded-t ${
            activeTab === 'drafting' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Drafting
        </button>
      </div>

      {activeTab === 'governance' && <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xs font-mono text-slate-500 uppercase tracking-tighter">Active Proposals</h3>
          {proposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-slate-900/30 border border-slate-800 p-4 rounded-lg group hover:border-amber-500/50 transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-amber-500">{prop.id}</span>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                    prop.status === 'PASSED'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : prop.status === 'DRAFT'
                        ? 'bg-slate-500/20 text-slate-300'
                        : 'bg-amber-500/10 text-amber-500'
                  }`}
                >
                  {prop.status}
                </span>
              </div>
              <h4 className="text-sm text-slate-200 font-medium mb-3">{prop.title}</h4>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500" style={{ width: `${prop.support}%` }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/20 border border-slate-800 rounded-lg p-6 flex flex-col justify-center items-center text-center">
          <Globe className="text-slate-700 mb-4 animate-spin" size={48} />
          <h3 className="text-lg font-bold text-white mb-2">The Global Standard</h3>
          <p className="text-sm text-slate-500 leading-relaxed mb-6">
            CompliCore is no longer a platform. It is a neutral utility governed by the entities that power the global economy.
          </p>
          <button className="w-full py-3 bg-white text-black font-bold rounded hover:bg-slate-200 transition-colors uppercase text-xs tracking-widest">
            Review Protocol Charter
          </button>

          <div className="mt-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-300">Protocol Alert</span>
              <span className={`text-[10px] font-mono ${amberAlert ? 'text-amber-300' : 'text-slate-500'}`}>
                {amberAlert ? 'Amber Alert' : 'Normal'}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">
              {amberAlert
                ? 'CCP-201 submitted. Major protocol shift is now in pre-quorum phase.'
                : 'No Tier-1 global synchronization draft currently staged.'}
            </p>
          </div>

          <div className="w-full mt-5 border border-red-500/30 bg-red-500/5 rounded-lg p-4 text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-red-300">
                <ShieldAlert size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest">Global Kill-Switch</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{keysAuthorized}/5 Titan Keys</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div className={`h-full ${killSwitchReady ? 'bg-emerald-500' : 'bg-red-500'}`} style={{ width: `${(keysAuthorized / 5) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setKeysAuthorized((prev) => Math.max(0, prev - 1))}
                className="flex-1 rounded border border-slate-700 px-2 py-1 text-[10px] font-mono text-slate-300 hover:bg-slate-800"
              >
                Revoke Key
              </button>
              <button
                onClick={() => setKeysAuthorized((prev) => Math.min(5, prev + 1))}
                className="flex-1 rounded border border-slate-700 px-2 py-1 text-[10px] font-mono text-slate-300 hover:bg-slate-800"
              >
                <span className="inline-flex items-center gap-1">
                  <KeyRound size={11} /> Authorize Key
                </span>
              </button>
            </div>
            <button
              disabled={!killSwitchReady}
              className={`mt-3 w-full rounded px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                killSwitchReady
                  ? 'bg-red-600 text-white hover:bg-red-500'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {killSwitchReady ? 'Arm Emergency Freeze' : 'Awaiting 5/5 Titan Keys'}
            </button>
          </div>
        </div>
      </div>}

      {activeTab === 'drafting' && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-mono text-cyan-500 uppercase tracking-[0.25em]">CCP-201 Draft Submission</h3>
            <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
              <p className="text-sm text-slate-200 mb-3">Proposal ID: CCP-201-GLOBAL-2026</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Universal Jurisdictional Alignment Protocol: synchronize Sovereign Ledger logic across EU/EEA, USA,
                APAC, and Common Law systems while preserving residency, privacy, and deed-hash auditability.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
              <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Upload CCP-201.json</label>
              <input
                type="file"
                accept=".json"
                onChange={(e) => setUploadedManifestName(e.target.files?.[0]?.name || '')}
                className="mt-2 block w-full text-xs text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-slate-800 file:px-3 file:py-1.5 file:text-xs file:font-mono file:text-slate-200"
              />
              <p className="mt-2 text-[11px] text-slate-500">
                {uploadedManifestName ? `Loaded: ${uploadedManifestName}` : 'No manifest loaded yet.'}
              </p>
            </div>

            <button
              onClick={submitCcp201Draft}
              disabled={!uploadedManifestName || ccp201Submitted}
              className={`w-full py-3 rounded uppercase text-xs tracking-widest font-bold transition-colors ${
                !uploadedManifestName || ccp201Submitted
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-cyan-500 text-black hover:bg-cyan-400'
              }`}
            >
              {ccp201Submitted ? 'CCP-201 Submitted (Tier-1)' : 'Submit Draft + Titan Authentication'}
            </button>

            <button
              onClick={initiateBroadcast}
              disabled={!ccp201Submitted || broadcastInitiated}
              className={`w-full py-2.5 rounded uppercase text-[11px] tracking-widest font-bold transition-colors ${
                !ccp201Submitted || broadcastInitiated
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 text-black hover:bg-amber-400'
              }`}
            >
              {broadcastInitiated ? 'Broadcast Active: CCP-201-GLOBAL' : 'Initiate Global Broadcast'}
            </button>

            {broadcastInitiated && (
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-amber-300">Broadcast Sequence</p>
                <div className="mt-3 text-xs text-slate-300 space-y-1">
                  <p><span className="text-slate-500">Payload:</span> CCP-201 Jurisdictional Manifest</p>
                  <p><span className="text-slate-500">Target:</span> Titan Key Holders #3, #4, #5</p>
                  <p><span className="text-slate-500">Channel:</span> Secure Peer-to-Peer Enclave</p>
                  <p><span className="text-slate-500">Protocol:</span> Shamir&apos;s Secret Sharing</p>
                </div>
              </div>
            )}

            {broadcastInitiated && (
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-mono uppercase tracking-widest text-cyan-300">Global Node Sweep</p>
                  <span className={`text-[10px] font-mono ${nodeSweepActive ? 'text-amber-300' : 'text-emerald-300'}`}>
                    {nodeSweepActive ? 'INITIATED' : 'COMPLETE'}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-300 mb-3">
                  <p className="flex justify-between"><span>Americas (Virginia / Oregon / Sao Paulo)</span><span className="text-emerald-400 font-mono">VERIFIED 100%</span></p>
                  <p className="flex justify-between"><span>EMEA (Frankfurt / London / Dubai)</span><span className="text-emerald-400 font-mono">VERIFIED 100%</span></p>
                  <p className="flex justify-between"><span>APAC (Singapore / Tokyo / Sydney)</span><span className={`font-mono ${apacSyncLevel === 100 ? 'text-emerald-400' : 'text-amber-300'}`}>{apacSyncLevel === 100 ? 'VERIFIED' : 'SYNCING'} {apacSyncLevel}%</span></p>
                  <p className="flex justify-between"><span>Internal Sovereign Dark-Nodes</span><span className="text-emerald-400 font-mono">VERIFIED 100%</span></p>
                </div>

                <button
                  onClick={runNodeSweep}
                  disabled={apacSyncLevel >= 100 || protocolFinalized}
                  className={`w-full rounded px-3 py-2 text-[10px] font-mono uppercase tracking-widest ${
                    apacSyncLevel >= 100 || protocolFinalized
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-cyan-500 text-black hover:bg-cyan-400'
                  }`}
                >
                  {apacSyncLevel >= 100 ? 'APAC Sync Finalized' : 'Advance APAC Sync Sweep'}
                </button>
              </div>
            )}

            {nearQuorum && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-xs text-slate-300">
                <p className="text-[10px] font-mono uppercase tracking-widest text-red-300 mb-1">System Alert</p>
                4.9 / 5 Titan Keys detected. Final block sealing window active while APAC geo-fencing reaches 100% sync.
              </div>
            )}

            {broadcastInitiated && (
              <div className="rounded-lg border border-slate-800 bg-slate-900/30 p-4">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-3">Live Quorum Progress</p>
                {[1, 2, 3, 4, 5].map((holderId) => {
                  const authorized = holderId <= 2 || !pendingTitanHolders.includes(holderId);
                  const pending = !authorized;
                  const status = holderStatus(holderId);

                  return (
                    <div key={holderId} className="flex items-center justify-between border-b border-slate-800 py-2 last:border-b-0">
                      <span className="text-xs text-slate-300">Titan Key #{holderId}</span>
                      <span className={`text-[10px] font-mono ${status === 'AUTHORIZED' ? 'text-emerald-400' : 'text-amber-300'}`}>
                        {status}
                      </span>
                      {pending && (
                        <button
                          onClick={() => confirmHolderSignature(holderId)}
                          className="rounded border border-slate-700 px-2 py-0.5 text-[10px] font-mono text-slate-300 hover:bg-slate-800"
                        >
                          Confirm Sig
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {broadcastInitiated && (
              <button
                onClick={runFinalHandshake}
                className="w-full py-2.5 rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 uppercase text-[11px] tracking-widest font-bold hover:bg-emerald-500/20"
              >
                {rehashing ? 'Re-hashing Deed Signature…' : 'Final Cryptographic Handshake'}
              </button>
            )}

            {broadcastInitiated && (
              <button
                onClick={finalizeProtocol}
                disabled={!killSwitchReady || protocolFinalized}
                className={`w-full py-2.5 rounded uppercase text-[11px] tracking-widest font-bold transition-colors ${
                  !killSwitchReady || protocolFinalized
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-500 text-black hover:bg-emerald-400'
                }`}
              >
                {protocolFinalized ? 'Protocol Finalized: Sovereign & Immutable' : 'Trigger Protocol Finalization'}
              </button>
            )}

            <button
              onClick={() => setSentinelArmed(true)}
              disabled={!sentinelReady || sentinelArmed}
              className={`w-full py-2.5 rounded uppercase text-[11px] tracking-widest font-bold transition-colors ${
                !sentinelReady || sentinelArmed
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-500 text-white hover:bg-indigo-400'
              }`}
            >
              {sentinelArmed ? '24-Hour Sentinel Alert Armed' : 'Arm 24-Hour Sentinel Alert'}
            </button>

            {sentinelArmed && (
              <div className="rounded border border-indigo-500/30 bg-indigo-500/5 p-3 text-xs text-slate-300">
                <p className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 mb-1">Sentinel Status</p>
                Armed. Next verification checkpoint scheduled for T+24h once all jurisdiction clusters remain at 100% sync.
              </div>
            )}
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/20 p-5">
            <h4 className="text-sm font-semibold text-white mb-4">System Status After Draft</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Protocol Status</span>
                <span className="text-slate-200 font-mono">{keysAuthorized} / 5 Titan Keys</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">System State</span>
                <span className="text-emerald-400 font-mono">{systemStateLabel}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-400">Quorum Progress</span>
                <span className="text-amber-300 font-mono">
                  {ccp201Submitted ? `${Math.round((keysAuthorized / 5) * 100)}% (${keysAuthorized}/5)` : 'Draft not submitted'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Kill-Switch Alert</span>
                <span className={`font-mono ${amberAlert ? 'text-amber-300' : 'text-slate-500'}`}>
                  {amberAlert ? 'Amber Alert' : 'Normal'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">Ledger Integrity</span>
                <span className={`font-mono ${rehashing ? 'text-amber-300' : 'text-emerald-400'}`}>{ledgerIntegrity.toFixed(2)}%</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">Ledger Latency</span>
                <span className={`font-mono ${ledgerLatency.startsWith('Elevated') ? 'text-amber-300' : 'text-emerald-400'}`}>{ledgerLatency}</span>
              </div>
            </div>

            <p className="mt-5 text-[11px] text-slate-500 leading-relaxed">
              Simulation mode: this UI models Tier-1 submission and Titan key progression only. It does not yet perform
              hardware-backed authentication or on-chain deed-hash signing.
            </p>
          </div>

          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-white">Post-Activation Summary</h4>
              <span className={`text-[10px] font-mono ${killSwitchReady ? 'text-emerald-300' : 'text-amber-300'}`}>
                {killSwitchReady ? 'ACTIVE @ 5/5' : 'PENDING (activates at 5/5)'}
              </span>
            </div>

            <div className="mb-3 rounded border border-slate-800 bg-slate-900/40 p-3 text-[11px] text-slate-400">
              <p><span className="text-slate-300">Status:</span> Awaiting Final Titan Handshake</p>
              <p><span className="text-slate-300">System State:</span> {protocolFinalized ? 'Immutable' : 'Pre-Immutable'}</p>
            </div>

            <p className="text-[11px] text-slate-400 mb-3">
              Jurisdictional rule pack that becomes enforced across the Sovereign Ledger once Titan quorum reaches 5/5.
            </p>

            <div className="space-y-2">
              {postActivationRules.map((rule) => (
                <div key={rule.group} className="rounded border border-slate-800 bg-slate-900/40 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-300">{rule.group}</span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">Jurisdiction Profile</span>
                  </div>
                  <p className="mt-1 text-xs text-slate-300">{rule.logic}</p>
                  <p className="mt-1 text-[11px] text-slate-500">{rule.constraint}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded border border-slate-800 bg-slate-900/40 p-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Final Quorum Watch</p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Titan Key #4</span>
                  <span className={`font-mono ${holderStatus(4) === 'AUTHORIZED' ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {holderStatus(4)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Titan Key #5</span>
                  <span className={`font-mono ${holderStatus(5) === 'AUTHORIZED' ? 'text-emerald-400' : 'text-amber-300'}`}>
                    {holderStatus(5)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded border border-emerald-500/30 bg-emerald-500/5 p-3">
              <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-300 mb-2">Immediate Post-Activation Effects</p>
              <ul className="space-y-1 text-xs text-slate-300">
                <li>• Ledger Integrity lock target: <span className="font-mono">99.99%</span></li>
                <li>• Global Kill-Switch transitions to <span className="font-mono">Active Defense</span></li>
                <li>• Tier-1 authority transitions to <span className="font-mono">Sovereign Overseers</span></li>
              </ul>
            </div>

            <div className="mt-4 rounded border border-purple-500/30 bg-purple-500/5 p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-purple-300">Inaugural Sovereign Deed</p>
                <span className={`text-[10px] font-mono ${protocolFinalized ? 'text-emerald-300' : 'text-amber-300'}`}>
                  {protocolFinalized ? 'ETCHED ON-CHAIN' : 'STAGED'}
                </span>
              </div>
              <div className="rounded border border-slate-800 bg-slate-900/40 p-3 text-xs space-y-1">
                <p><span className="text-slate-500">Record:</span> <span className="font-mono text-slate-200">{inauguralDeed.record}</span></p>
                <p><span className="text-slate-500">Timestamp:</span> <span className="font-mono text-slate-200">{inauguralDeed.timestampUtc}</span></p>
                <p><span className="text-slate-500">Authority:</span> <span className="text-slate-200">{inauguralDeed.authority}</span></p>
                <p><span className="text-slate-500">Hash:</span> <span className="font-mono text-cyan-300">{inauguralDeed.hash}</span></p>
              </div>
              <p className="mt-3 text-[11px] text-slate-400 leading-relaxed">
                “By the authority of the Five Titan Keys, the CompliCore Sovereign Ledger is synchronized across all recognized
                jurisdictions, tethering each deed hash to origin-mandated privacy and residency constraints.”
              </p>

              <div className="mt-3 rounded border border-slate-800 bg-slate-900/40 p-3">
                <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">Live Propagation Watch</p>
                <div className="space-y-1 text-xs text-slate-300">
                  <p>
                    <span className="text-slate-500">Holder #4:</span>{' '}
                    <span className={holderStatus(4) === 'AUTHORIZED' ? 'text-emerald-400 font-mono' : 'text-amber-300 font-mono'}>{holderStatus(4)}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">Holder #5:</span>{' '}
                    <span className={holderStatus(5) === 'AUTHORIZED' ? 'text-emerald-400 font-mono' : 'text-amber-300 font-mono'}>{holderStatus(5)}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">Network Status:</span>{' '}
                    <span className={protocolFinalized ? 'text-emerald-400 font-mono' : 'text-amber-300 font-mono'}>{networkStateLabel}</span>
                  </p>
                  <p>
                    <span className="text-slate-500">Ledger Latency:</span>{' '}
                    <span className="font-mono text-slate-200">{latencySeconds.toFixed(3)}s</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovernancePanel;

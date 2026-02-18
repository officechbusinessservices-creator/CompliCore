'use client';

import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  AlertCircle,
  BarChart3,
  Box,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  CloudLightning,
  DollarSign,
  FileText,
  FileSearch,
  Globe,
  Clock,
  Landmark,
  Lock,
  Mail,
  Map as MapIcon,
  Map,
  MessageSquare,
  Mic,
  Network,
  Rocket,
  RefreshCw,
  Server,
  ShieldCheck,
  ShieldAlert,
  ShoppingBag,
  Smartphone,
  Star,
  Target,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Users,
  Volume2,
  Wrench,
  Zap,
  Coins,
  MapPin,
  Timer,
  Send,
} from 'lucide-react';

type TabId = 'host' | 'guest' | 'corp' | 'integrations' | 'finance' | 'ops' | 'security' | 'marketplace';

type CardActionContextValue = {
  simulateCard: (id: string) => void;
  openWorkflow: (id: string) => void;
  togglePin: (id: string) => void;
  getSignal: (id: string) => number;
  isPinned: (id: string) => boolean;
  getIntensity: (id: string) => number;
  setIntensity: (id: string, value: number) => void;
};

const CardActionContext = React.createContext<CardActionContextValue | null>(null);

const useCardActions = () => {
  const context = useContext(CardActionContext);
  if (!context) {
    throw new Error('CardActionContext is missing');
  }
  return context;
};

const RentalOSPlayground = () => {
  const [activeTab, setActiveTab] = useState<TabId>('host');

  const [price, setPrice] = useState(245);
  const [eventMode, setEventMode] = useState(false);
  const [occupancy, setOccupancy] = useState(62);
  const [sentiment, setSentiment] = useState<'Positive' | 'Neutral' | 'Negative'>('Neutral');
  const [doorStatus, setDoorStatus] = useState<'Locked' | 'Unlocked'>('Locked');
  const [upsellRevenue, setUpsellRevenue] = useState(0);
  const [thermoMode, setThermoMode] = useState<'Eco' | 'Comfort'>('Eco');
  const [complianceScore, setComplianceScore] = useState(70);
  const [rfpStatus, setRfpStatus] = useState<'Draft' | 'Submitted' | 'Won'>('Draft');
  const [noiseLevel, setNoiseLevel] = useState(45);
  const [cleanerStatus, setCleanerStatus] = useState<'Idle' | 'Dispatched' | 'Completed'>('Idle');
  const [inventory, setInventory] = useState(8);
  const [co2Savings, setCo2Savings] = useState(18);
  const [syncHealth, setSyncHealth] = useState(97);
  const [cashReady, setCashReady] = useState(4250);
  const [liveMode, setLiveMode] = useState(true);
  const [cardSignals, setCardSignals] = useState<Record<string, number>>({});
  const [pinnedCards, setPinnedCards] = useState<Record<string, boolean>>({});
  const [cardIntensity, setCardIntensity] = useState<Record<string, number>>({});
  const [workflow, setWorkflow] = useState<{ open: boolean; title: string; step: number }>({
    open: false,
    title: '',
    step: 0,
  });

  const categories = [
    { id: 'host', label: 'Host Core', icon: Building2, color: 'text-cyan-400', bg: 'bg-cyan-950/40', border: 'border-cyan-500/50' },
    { id: 'guest', label: 'Guest Exp', icon: Users, color: 'text-amber-400', bg: 'bg-amber-950/40', border: 'border-amber-500/50' },
    { id: 'corp', label: 'Corp Travel', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-950/40', border: 'border-emerald-500/50' },
    { id: 'integrations', label: 'Integrations', icon: Network, color: 'text-violet-400', bg: 'bg-violet-950/40', border: 'border-violet-500/50' },
    { id: 'finance', label: 'Finance', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-950/40', border: 'border-green-500/50' },
    { id: 'ops', label: 'Ops Center', icon: Wrench, color: 'text-orange-400', bg: 'bg-orange-950/40', border: 'border-orange-500/50' },
    { id: 'security', label: 'Security', icon: ShieldCheck, color: 'text-red-400', bg: 'bg-red-950/40', border: 'border-red-500/50' },
    { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, color: 'text-pink-400', bg: 'bg-pink-950/40', border: 'border-pink-500/50' },
  ] as const;

  const activeTheme = categories.find((category) => category.id === activeTab) ?? categories[0];

  const demandLift = eventMode ? '+40% Surge' : '+10% Baseline';
  const upsellLift = useMemo(() => Math.min(30, Math.max(8, Math.round((upsellRevenue / 300) * 30))), [upsellRevenue]);

  const workflowSteps = [
    { title: 'Analyze', description: 'Pull real-time signals, detect anomalies, and flag opportunities.' },
    { title: 'Simulate', description: 'Run scenario tests against pricing, ops, and risk models.' },
    { title: 'Deploy', description: 'Ship optimized actions to channels and notify stakeholders.' },
  ];

  const randomBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const simulateCard = (id: string) => {
    setCardSignals((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  };

  const togglePin = (id: string) => {
    setPinnedCards((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const setIntensity = (id: string, value: number) => {
    setCardIntensity((prev) => ({ ...prev, [id]: value }));
  };

  const openWorkflow = (id: string) => {
    setWorkflow({ open: true, title: id, step: 0 });
  };

  const closeWorkflow = () => {
    setWorkflow((prev) => ({ ...prev, open: false }));
  };

  const advanceWorkflow = () => {
    setWorkflow((prev) => ({ ...prev, step: Math.min(prev.step + 1, workflowSteps.length - 1) }));
  };

  const rewindWorkflow = () => {
    setWorkflow((prev) => ({ ...prev, step: Math.max(prev.step - 1, 0) }));
  };

  useEffect(() => {
    if (!liveMode) {
      return;
    }

    const interval = setInterval(() => {
      setOccupancy((prev) => clamp(prev + randomBetween(-4, 4), 55, 99));
      setNoiseLevel((prev) => clamp(prev + randomBetween(-8, 8), 35, 88));
      setSyncHealth((prev) => clamp(prev + randomBetween(-1, 1), 92, 100));
      setCashReady((prev) => Math.max(0, prev + randomBetween(-50, 120)));
      setCo2Savings((prev) => clamp(prev + randomBetween(0, 2), 10, 60));
      setPrice((prev) => (eventMode ? prev : clamp(prev + randomBetween(-8, 8), 190, 320)));
    }, 2500);

    return () => clearInterval(interval);
  }, [eventMode, liveMode]);

  const cardActionContext = useMemo<CardActionContextValue>(
    () => ({
      simulateCard,
      openWorkflow,
      togglePin,
      getSignal: (id) => cardSignals[id] ?? 0,
      isPinned: (id) => pinnedCards[id] ?? false,
      getIntensity: (id) => cardIntensity[id] ?? 50,
      setIntensity,
    }),
    [cardSignals, cardIntensity, openWorkflow, pinnedCards, setIntensity, simulateCard, togglePin],
  );

  const simulateEvent = () => {
    setEventMode((prev) => !prev);
    if (!eventMode) {
      setPrice(450);
      setOccupancy(98);
    } else {
      setPrice(245);
      setOccupancy(62);
    }
  };

  const analyzeSentiment = (text: string) => {
    if (text.toLowerCase().includes('angry') || text.toLowerCase().includes('dirty')) {
      setSentiment('Negative');
    } else if (text.toLowerCase().includes('love') || text.toLowerCase().includes('great')) {
      setSentiment('Positive');
    } else {
      setSentiment('Neutral');
    }
  };

  return (
    <CardActionContext.Provider value={cardActionContext}>
      <div className="min-h-screen bg-[#0b1120] text-white font-sans selection:bg-cyan-500/30 flex flex-col md:flex-row overflow-hidden">
        <nav className="w-full md:w-72 bg-[#0B1120] border-r border-white/5 flex flex-col shrink-0 z-20">
        <div className="p-5 border-b border-white/5 bg-[#0B1120]">
          <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
            RENTAL<span className={activeTheme.color}>OS</span>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-400 font-mono">PRO</span>
          </h1>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">Real-Time Data Engine V2.4 • Signal Mesh</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 group relative overflow-hidden ${
                activeTab === category.id
                  ? `${category.bg} text-white border-l-4 ${category.border.replace('/50', '')}`
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" />
              <category.icon size={18} className={activeTab === category.id ? category.color : 'text-slate-500 group-hover:text-white'} />
              {category.label}
              {activeTab === category.id && <div className="ml-auto w-2 h-2 rounded-full bg-white" />}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] text-green-500 font-mono tracking-[0.2em]">SYSTEM OPERATIONAL</span>
          </div>
          <MasterDeploy />
        </div>
        </nav>

        <main className="flex-1 p-5 md:p-10 overflow-y-auto h-screen relative">
        <div className="absolute inset-0 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${activeTheme.bg} ${activeTheme.color} text-[10px] font-bold uppercase tracking-widest border border-white/10 mb-4`}
              >
                <activeTheme.icon size={12} /> {activeTheme.label} Module
              </div>
              <h2 className="text-5xl font-black mb-2 tracking-tight">Command Center</h2>
              <p className="text-slate-400 text-lg max-w-2xl">
                Real-time orchestration &amp; control logic for <span className={activeTheme.color}>{activeTheme.label}</span> operations.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold text-slate-300 border border-white/5 hover:bg-slate-700 hover:translate-y-[-1px] transition-transform">
                Export Snapshot
              </button>
              <button className="px-4 py-2 bg-slate-800 rounded-lg text-xs font-bold text-slate-300 border border-white/5 hover:bg-slate-700 hover:translate-y-[-1px] transition-transform">
                Ops Settings
              </button>
              <button
                onClick={() => setLiveMode((prev) => !prev)}
                className={`px-4 py-2 rounded-lg text-xs font-bold border border-white/5 transition-colors ${
                  liveMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {liveMode ? 'Live Feeds: ON' : 'Live Feeds: OFF'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pb-16">
            {activeTab === 'host' && (
              <>
                <MiniApp title="Hyper-Local Pricing" icon={TrendingUp} theme={activeTheme} stat={demandLift} statLabel="Revenue Lift">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Nightly Rate</span>
                      <span className={`font-mono text-2xl font-bold ${eventMode ? 'text-pink-500' : 'text-white'}`}>${price}</span>
                    </div>
                    <div className="h-32 bg-slate-900/50 rounded-lg border border-white/5 relative overflow-hidden flex items-end px-2 gap-1">
                      {[40, 60, 30, 50, eventMode ? 90 : 45, eventMode ? 95 : 50, 60].map((height, index) => (
                        <div
                          key={index}
                          className={`flex-1 rounded-t transition-all duration-500 ${
                            eventMode && index > 3 ? 'bg-pink-500' : 'bg-cyan-500/20'
                          }`}
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg border border-white/5">
                      <div className="text-xs">
                        <div className="font-bold text-slate-200">Micro-Season Event</div>
                        <div className="text-slate-500">Taylor Swift concert detected</div>
                      </div>
                      <button
                        onClick={simulateEvent}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          eventMode ? 'bg-pink-500 text-white' : 'bg-slate-700 text-slate-400'
                        }`}
                      >
                        {eventMode ? '🎉 Event Active' : 'Simulate Concert'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Projected Occupancy</span>
                      <span className="text-cyan-400 font-bold">{occupancy}%</span>
                    </div>
                  </div>
                </MiniApp>

                <MiniApp title="Sentiment Inbox" icon={MessageSquare} theme={activeTheme} stat={sentiment} statLabel="AI Analysis">
                  <div className="space-y-3">
                    <input
                      onChange={(event) => analyzeSentiment(event.target.value)}
                      placeholder="Simulate guest message (e.g., 'Angry', 'Love')..."
                      className="w-full bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-400 outline-none transition-colors"
                    />
                    <div className="flex gap-2">
                      <div
                        className={`flex-1 p-2 rounded-lg border ${
                          sentiment === 'Negative' ? 'bg-red-500/10 border-red-500/50' : 'bg-slate-800 border-white/5'
                        } transition-colors`}
                      >
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Tone</div>
                        <div className={`text-sm font-bold ${sentiment === 'Negative' ? 'text-red-400' : 'text-slate-300'}`}>
                          {sentiment}
                        </div>
                      </div>
                      <div className="flex-1 p-2 rounded-lg bg-slate-800 border border-white/5">
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Priority</div>
                        <div className="text-sm font-bold text-slate-300">
                          {sentiment === 'Negative' ? 'High' : 'Low'}
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold hover:bg-cyan-500/20 transition-all">
                      Draft AI Reply
                    </button>
                  </div>
                </MiniApp>
                <OrdinanceWatchdogCard theme={activeTheme} liveMode={liveMode} onEscalate={() => openWorkflow('Sentiment Inbox')} />
                <UtilityArbitrageCard theme={activeTheme} liveMode={liveMode} />
                <CompetitorGhostingCard theme={activeTheme} />
                <DynamicCleaningDispatchCard theme={activeTheme} />
              </>
            )}

            {activeTab === 'guest' && (
              <>
                <MiniApp title="Smart Lock" icon={Lock} theme={activeTheme} stat={doorStatus} statLabel="Current Status">
                  <div className="flex flex-col items-center justify-center py-2">
                    <button
                      onClick={() => setDoorStatus(doorStatus === 'Locked' ? 'Unlocked' : 'Locked')}
                      className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-300 ${
                        doorStatus === 'Unlocked'
                          ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                          : 'border-slate-700 bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Lock size={32} className="mb-1" />
                      <span className="text-[10px] font-bold uppercase">{doorStatus}</span>
                    </button>
                    <div className="mt-4 flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-slate-800 rounded text-slate-400">
                        Bluetooth: <span className="text-green-500">Connected</span>
                      </span>
                      <span className="px-2 py-1 bg-slate-800 rounded text-slate-400">
                        Code: <span className="text-white font-mono">9482</span>
                      </span>
                    </div>
                  </div>
                </MiniApp>

                <MiniApp title="Upsell Calculator" icon={ShoppingBag} theme={activeTheme} stat={`$${upsellRevenue}`} statLabel={`${upsellLift}% Lift`}>
                  <p className="text-xs text-slate-500 mb-3">Research range: 8-30% revenue lift. Select items to simulate.</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Early Check-in (1pm)', price: 45 },
                      { label: 'Late Check-out (12pm)', price: 45 },
                      { label: 'Pet Fee', price: 75 },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => setUpsellRevenue((prev) => prev + item.price)}
                        className="w-full flex justify-between items-center p-2 rounded bg-slate-800 border border-white/5 hover:border-amber-500/50 hover:bg-slate-700 transition-all"
                      >
                        <span className="text-xs font-bold text-slate-300">{item.label}</span>
                        <span className="text-xs text-amber-400 font-mono">+${item.price}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setUpsellRevenue(0)} className="w-full mt-2 text-[10px] text-slate-500 hover:text-white">
                    Reset
                  </button>
                </MiniApp>

                <MiniApp title="Local Guide" icon={Map} theme={activeTheme} stat="12 Spots" statLabel="Curated">
                  <div className="h-24 bg-slate-800 rounded-lg mb-3 overflow-hidden relative group cursor-pointer">
                    <div className="absolute inset-0 z-10" />
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=600')] bg-cover opacity-70 group-hover:scale-110 transition-transform" />
                    <div className="absolute bottom-2 left-2 z-20">
                      <div className="text-xs font-bold text-white">Best Coffee: "The Daily"</div>
                      <div className="text-[10px] text-amber-400">0.2 miles away</div>
                    </div>
                  </div>
                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/5">
                    Share via SMS
                  </button>
                </MiniApp>

                <MiniApp title="Eco-Comfort" icon={Thermometer} theme={activeTheme} stat={thermoMode} statLabel="HVAC Mode">
                  <div className="flex justify-between items-center mb-4 bg-slate-800 p-2 rounded-lg border border-white/5">
                    <button
                      onClick={() => setThermoMode('Eco')}
                      className={`flex-1 py-1 rounded text-xs font-bold ${
                        thermoMode === 'Eco' ? 'bg-green-500/20 text-green-400' : 'text-slate-500'
                      }`}
                    >
                      Eco
                    </button>
                    <button
                      onClick={() => setThermoMode('Comfort')}
                      className={`flex-1 py-1 rounded text-xs font-bold ${
                        thermoMode === 'Comfort' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-500'
                      }`}
                    >
                      Comfort
                    </button>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-1">72°</div>
                    <div className="text-xs text-slate-500">Humidity: 45%</div>
                  </div>
                </MiniApp>
              </>
            )}

            {activeTab === 'corp' && (
              <>
                <MiniApp title="Duty of Care" icon={ShieldCheck} theme={activeTheme} stat={`${complianceScore}/100`} statLabel="Safety Score">
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Fire Extinguisher</span>
                      <span className="text-green-500">Verified</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">CO Detector</span>
                      <span className="text-green-500">Verified</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">24/7 Support</span>
                      <span className="text-orange-500">Pending</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setComplianceScore(100)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors"
                  >
                    Run Safety Audit
                  </button>
                </MiniApp>

                <MiniApp title="CO2 Tracker" icon={Globe} theme={activeTheme} stat={`${co2Savings}kg`} statLabel="CO2 Saved">
                  <p className="text-xs text-slate-500 mb-3">RFPs in 2025 require CO2 reporting for duty of care.</p>
                  <div className="flex items-center justify-between bg-slate-800 p-3 rounded-lg border border-white/5">
                    <div>
                      <div className="text-xs text-slate-400">Trip Emissions</div>
                      <div className="text-lg font-bold text-emerald-400">{co2Savings} kg</div>
                    </div>
                  <button
                      onClick={() => setCo2Savings((prev) => prev + 6)}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-xs"
                    >
                    Sync Emissions
                    </button>
                  </div>
                </MiniApp>

                <MiniApp title="RFP Builder" icon={FileText} theme={activeTheme} stat={rfpStatus} statLabel="Proposal Status">
                  <div className="bg-slate-900 border border-white/5 rounded p-3 mb-3">
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Client Requirement</div>
                    <div className="text-xs text-slate-300">
                      “Must have <span className="text-emerald-400">CO2 Tracking</span> & laptop workspace.”
                    </div>
                  </div>
                  <div className="flex gap-2">
                  <button
                      onClick={() => setRfpStatus('Submitted')}
                      className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg text-xs font-bold"
                    >
                    Attach CO2 Data
                    </button>
                    <button
                      onClick={() => setRfpStatus('Won')}
                      className="flex-1 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold"
                    >
                    Submit Bid
                    </button>
                  </div>
                </MiniApp>

                <MiniApp title="GDS Channel" icon={Globe} theme={activeTheme} stat="Live" statLabel="Sabre/Amadeus">
                  <div className="space-y-2">
                    {['Sabre', 'Amadeus', 'Travelport'].map((gds) => (
                      <div key={gds} className="flex justify-between items-center p-2 rounded bg-slate-800 border border-white/5">
                        <span className="text-xs font-bold text-slate-300">{gds}</span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-emerald-500">Connected</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                      </div>
                    ))}
                  </div>
                </MiniApp>
              </>
            )}

            {activeTab === 'integrations' && (
              <>
                <MiniApp title="Workflow Builder" icon={Network} theme={activeTheme} stat="98%" statLabel="Automation Rate">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 justify-center h-16">
                    <span className="border border-white/10 p-1 rounded">Booking</span>
                    <span className="text-violet-500">→</span>
                    <span className="border p-1 rounded border-violet-500 text-violet-400">Send Code</span>
                    <span className="text-violet-500">→</span>
                    <span className="border border-white/10 p-1 rounded">Alert</span>
                  </div>
                  <div className="text-xs text-slate-500 text-center mt-2">Latency: 240ms average</div>
                </MiniApp>

                <MiniApp title="Channel Health" icon={Server} theme={activeTheme} stat={`${syncHealth}%`} statLabel="Sync SLA">
                  <div className="space-y-2">
                    {['Airbnb', 'Vrbo', 'Booking.com'].map((channel) => (
                      <div key={channel} className="flex justify-between text-xs text-slate-300">
                        <span>{channel}</span> <span className="text-green-500">● Synced</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSyncHealth((prev) => Math.min(100, prev + 1))}
                    className="w-full mt-3 py-2 bg-violet-500/10 text-violet-300 border border-violet-500/30 rounded text-xs"
                  >
                    Run Health Check
                  </button>
                </MiniApp>

                <MiniApp title="IoT Telemetry" icon={Zap} theme={activeTheme} stat="72°" statLabel="Avg Temp">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-900 p-2 rounded text-center">
                      <Zap size={16} className="mx-auto mb-1 text-yellow-400" />
                      <span className="text-[10px]">Lights OK</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded text-center">
                      <Thermometer size={16} className="mx-auto mb-1 text-red-400" />
                      <span className="text-[10px]">HVAC Eco</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-500 text-center mt-2">Smart devices streaming every 15s.</div>
                </MiniApp>

                <MiniApp title="Webhook Monitor" icon={Activity} theme={activeTheme} stat="Live" statLabel="Queue">
                  <div className="bg-black p-2 rounded text-[8px] font-mono text-green-400 h-24 overflow-hidden">
                    {'> POST /api/booking'}
                    <br />
                    {'> 200 OK'}
                    <br />
                    {'> TRIGGER: Lock_Update'}
                    <br />
                    {'> SENT'}
                  </div>
                </MiniApp>
              </>
            )}

            {activeTab === 'finance' && (
              <>
                <MiniApp title="P&L Snapshot" icon={BarChart3} theme={activeTheme} stat="18%" statLabel="Margin">
                  <div className="flex items-end gap-1 h-20 pb-2">
                    {[30, 40, 35, 50, 60, 75, 90].map((height, index) => (
                      <div
                        key={index}
                        className="flex-1 bg-green-500/20 border-t-2 border-green-500 hover:bg-green-500/40 transition-colors"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </MiniApp>

                <MiniApp title="Owner Payouts" icon={DollarSign} theme={activeTheme} stat={`$${cashReady}`} statLabel="Ready">
                  <div className="text-xs text-slate-500 mb-3">Next transfer in 3 days • ACH batch ready.</div>
                  <button
                    onClick={() => setCashReady((prev) => prev + 250)}
                    className="w-full py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded text-xs"
                  >
                    Initiate Transfer
                  </button>
                </MiniApp>

                <RevenueAuditorCard theme={activeTheme} />

                <MiniApp title="Tax Vault" icon={FileText} theme={activeTheme} stat="12" statLabel="Docs">
                  <div className="space-y-2">
                    {['2024_1099_K.pdf', 'Expense_Report.csv'].map((doc) => (
                      <div key={doc} className="flex items-center gap-2 p-2 border border-white/5 rounded hover:bg-white/5 cursor-pointer">
                        <FileText size={14} className="text-slate-400" />
                        <span className="text-xs">{doc}</span>
                      </div>
                    ))}
                  </div>
                </MiniApp>

                <MiniApp title="Fraud Watch" icon={ShieldCheck} theme={activeTheme} stat="Low" statLabel="Risk">
                  <div className="bg-slate-800 p-3 rounded-lg border border-white/5 text-xs text-slate-300">
                    No abnormal chargebacks detected. Velocity checks normal.
                  </div>
                </MiniApp>
              </>
            )}

            {activeTab === 'ops' && (
              <>
                <MiniApp title="Ticket Dispatch" icon={AlertTriangle} theme={activeTheme} stat="2" statLabel="Open">
                  <div className="bg-slate-800 p-3 rounded-lg border-l-4 border-red-500 mb-3">
                    <div className="font-bold text-xs">Broken HVAC - Unit 401</div>
                    <div className="text-[10px] text-slate-400 mt-1">Reported 10m ago by Guest</div>
                  </div>
                  <div className="flex gap-2">
                  <button
                      onClick={() => setCleanerStatus('Dispatched')}
                      className={`flex-1 py-1.5 rounded text-xs font-bold ${
                        cleanerStatus === 'Dispatched' ? 'bg-orange-500 text-black' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                    Dispatch
                    </button>
                    <button
                      onClick={() => setCleanerStatus('Completed')}
                      className="flex-1 py-1.5 bg-slate-800 text-slate-400 rounded text-xs font-bold hover:text-white"
                    >
                    Resolve
                    </button>
                  </div>
                </MiniApp>

                <MiniApp title="Cleaner SLA" icon={Smartphone} theme={activeTheme} stat={cleanerStatus} statLabel="Status">
                  <div className="space-y-1">
                    {['Strip Beds', 'Sanitize Bath', 'Restock Coffee'].map((task) => (
                      <div key={task} className="flex items-center gap-2 text-xs text-slate-300">
                        <input type="checkbox" className="accent-orange-400 rounded" /> {task}
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs font-bold">
                    Mark Clean
                  </button>
                </MiniApp>

                <MiniApp title="Stock Tracker" icon={Box} theme={activeTheme} stat={`${inventory}`} statLabel="Kits Left">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setInventory(Math.max(0, inventory - 1))}
                      className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:text-black"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setInventory(inventory + 1)}
                      className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:text-black"
                    >
                      +
                    </button>
                  </div>
                </MiniApp>

                <MiniApp title="Vendor Map" icon={Map} theme={activeTheme} stat="2m" statLabel="ETA">
                  <div className="h-24 bg-slate-800 rounded-lg relative overflow-hidden mb-2">
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="absolute bottom-1 right-1 text-[8px] bg-black/50 px-1 rounded text-white">
                      Plumber (2m away)
                    </div>
                  </div>
                  <div className="text-center text-[10px] text-slate-500">Live GPS Tracking</div>
                </MiniApp>
              </>
            )}

            {activeTab === 'security' && (
              <>
                <MiniApp title="Noise Monitor" icon={Activity} theme={activeTheme} stat={`${noiseLevel}dB`} statLabel="Current Level">
                  <div className="relative h-20 bg-slate-900 rounded-lg border border-white/5 mb-3 flex items-end gap-1 px-1 pb-1 overflow-hidden">
                    {[30, 45, 60, 40, 50, 75, 45, 30, 40].map((height, index) => (
                      <div
                        key={index}
                        className={`flex-1 rounded-t transition-all duration-300 ${noiseLevel > 70 ? 'bg-red-500' : 'bg-red-500/30'}`}
                        style={{ height: `${index === 5 ? noiseLevel : height}%` }}
                      />
                    ))}
                    <div className="absolute top-2 right-2 text-[10px] text-red-400 font-bold">Limit: 75dB</div>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="90"
                    value={noiseLevel}
                    onChange={(event) => setNoiseLevel(parseInt(event.target.value, 10))}
                    className="w-full h-2 bg-slate-800 rounded-lg accent-red-500"
                  />
                </MiniApp>

                <MiniApp title="Crowd Detect" icon={Users} theme={activeTheme} stat="4 Devices" statLabel="Occupancy">
                  <p className="text-xs text-slate-500 mb-3">Device counting detects parties without cameras.</p>
                  <div className="flex justify-center gap-4 mb-3">
                    <div className="text-center">
                      <Smartphone size={24} className="mx-auto text-slate-400 mb-1" />
                      <div className="text-xs font-bold">4 Phones</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <Users size={24} className="mx-auto text-slate-400 mb-1" />
                      <div className="text-xs font-bold">~4 Guests</div>
                    </div>
                  </div>
                  <div className="bg-green-500/10 text-green-400 text-center py-1 rounded text-xs font-bold border border-green-500/20">
                    Within Limit (Max 6)
                  </div>
                </MiniApp>

                <MiniApp title="ID Verification" icon={ShieldCheck} theme={activeTheme} stat="Stripe" statLabel="Provider">
                  <div className="bg-slate-800 p-3 rounded-lg border border-white/5 mb-3 text-center">
                    <div className="w-12 h-8 bg-slate-700 rounded mx-auto mb-2 border border-slate-600 relative overflow-hidden">
                      <div className="absolute inset-0" />
                    </div>
                    <div className="text-xs text-slate-300 font-bold">Scanning Gov ID...</div>
                  </div>
                  <button className="w-full py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500/20">
                    Verify Guest
                  </button>
                </MiniApp>

                <MiniApp title="Access Log" icon={Activity} theme={activeTheme} stat="Live" statLabel="Audit Trail">
                  <div className="bg-black p-2 rounded-lg font-mono text-[10px] text-slate-400 h-24 overflow-y-auto space-y-1">
                    <div>
                      <span className="text-green-500">10:42</span> Guest (Code 9924) UNLOCK
                    </div>
                    <div>
                      <span className="text-slate-500">11:00</span> Auto-Lock Engaged
                    </div>
                    <div className="text-red-400">
                      <span className="text-red-500">11:05</span> Failed Attempt (Code 0000)
                    </div>
                    <div>
                      <span className="text-blue-400">11:15</span> Cleaner (Code 1122) UNLOCK
                    </div>
                  </div>
                </MiniApp>
              </>
            )}

            {activeTab === 'marketplace' && (
              <>
                <MiniApp title="AI Writer" icon={Mic} theme={activeTheme} stat="42%" statLabel="CTR Lift">
                  <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-300 italic mb-3">
                    “Experience urban luxury in this sun-drenched penthouse..."
                  </div>
                  <button className="w-full py-1.5 bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded text-xs font-bold hover:bg-pink-500/30">
                    ✨ Generate Description
                  </button>
                </MiniApp>

                <MiniApp title="Smart Pricing" icon={TrendingUp} theme={activeTheme} stat="Live" statLabel="Dynamic">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold">PriceLabs</span>
                    <span className="text-[10px] bg-green-500 text-black px-1 rounded font-bold">INSTALLED</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded overflow-hidden">
                    <div className="w-full h-full bg-green-500" />
                  </div>
                </MiniApp>

                <MiniApp title="Insurance" icon={ShieldCheck} theme={activeTheme} stat="$1M" statLabel="Coverage">
                  <p className="text-[10px] text-slate-400 mb-2">Safely™ protection per booking.</p>
                  <button className="w-full py-1 border border-white/10 rounded text-xs hover:bg-white/5">Configure</button>
                </MiniApp>

                <MiniApp title="Email Bot" icon={Mail} theme={activeTheme} stat="42%" statLabel="Open Rate">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-400">42%</div>
                    <div className="text-xs text-slate-500">Last Campaign: Winter Promo</div>
                  </div>
                </MiniApp>
              </>
            )}
          </div>
        </div>
        {workflow.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0b1120] p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-slate-500">Workflow</div>
                  <div className="text-lg font-bold text-white">{workflow.title}</div>
                </div>
                <button onClick={closeWorkflow} className="text-slate-400 hover:text-white text-sm">
                  Close
                </button>
              </div>
              <div className="space-y-4">
                <div className="text-sm text-slate-300">Step {workflow.step + 1} of {workflowSteps.length}</div>
                <div className="rounded-xl border border-white/10 bg-slate-900 p-4">
                  <div className="text-sm font-bold text-white">{workflowSteps[workflow.step].title}</div>
                  <div className="text-xs text-slate-400 mt-2">{workflowSteps[workflow.step].description}</div>
                </div>
                <div className="flex items-center justify-between">
                  <button
                    onClick={rewindWorkflow}
                    disabled={workflow.step === 0}
                    className="px-3 py-2 text-xs font-bold rounded-lg bg-slate-800 text-slate-400 disabled:opacity-40"
                  >
                    Back
                  </button>
                  <button
                    onClick={advanceWorkflow}
                    className="px-3 py-2 text-xs font-bold rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  >
                    {workflow.step === workflowSteps.length - 1 ? 'Complete' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </CardActionContext.Provider>
  );
};

type MiniAppProps = {
  title: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  theme: { color: string; bg: string };
  stat: string | number;
  statLabel: string;
  children: React.ReactNode;
};

type HostCardProps = {
  theme: { color: string; bg: string };
  liveMode: boolean;
  onEscalate?: () => void;
};

type FinanceCardProps = {
  theme: { color: string; bg: string };
};

const OrdinanceWatchdogCard = ({ theme, liveMode, onEscalate }: HostCardProps) => {
  const { getIntensity, simulateCard } = useCardActions();
  const intensity = getIntensity('Ordinance Watchdog');
  const [decibels, setDecibels] = useState(58);
  const [status, setStatus] = useState<'Compliant' | 'Violation Risk'>('Compliant');
  const [autoAlert, setAutoAlert] = useState(false);

  useEffect(() => {
    if (!liveMode) {
      return;
    }

    const interval = setInterval(() => {
      const noise = Math.floor(Math.random() * (78 - 50 + 1)) + 50;
      setDecibels(noise);
      setStatus(noise > 75 ? 'Violation Risk' : 'Compliant');
    }, 3000);

    return () => clearInterval(interval);
  }, [liveMode]);

  useEffect(() => {
    if (status === 'Violation Risk' && intensity >= 70) {
      setAutoAlert(true);
      simulateCard('Ordinance Watchdog');
      onEscalate?.();
    } else {
      setAutoAlert(false);
    }
  }, [intensity, onEscalate, simulateCard, status]);

  return (
    <MiniApp title="Ordinance Watchdog" icon={ShieldAlert} theme={theme} stat={status} statLabel="Noise & Law">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Volume2 size={14} className="text-cyan-400" /> Live Feed
        </div>
        <span
          className={`text-[10px] px-2 py-1 rounded ${
            status === 'Compliant' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <div className="text-4xl font-bold text-white">
          {decibels}
          <span className="text-lg text-gray-500 ml-1">dB</span>
        </div>
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-500 ${decibels > 75 ? 'bg-red-500' : 'bg-cyan-500'}`}
            style={{ width: `${(decibels / 100) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 text-[10px] uppercase font-bold text-gray-400">
        <div className="bg-[#111827] p-2 rounded border border-gray-800">
          <p className="flex items-center gap-1">
            <Clock size={12} /> Quiet Hours
          </p>
          <p className="text-white">10PM - 8AM</p>
        </div>
        <div className="bg-[#111827] p-2 rounded border border-gray-800">
          <p>Local Limit</p>
          <p className="text-white">75 dB</p>
        </div>
      </div>

      <div className="text-[10px] text-slate-500 mb-3">
        Auto-alert {intensity >= 70 ? 'armed' : 'standing by'} at {intensity}% intensity.
      </div>
      {autoAlert && (
        <div className="text-[10px] text-red-300 bg-red-500/10 border border-red-500/20 rounded px-2 py-1 mb-3">
          Guest warning queued • Sentiment Inbox notified.
        </div>
      )}

      <button
        onClick={() => {
          simulateCard('Ordinance Watchdog');
          onEscalate?.();
        }}
        className="w-full py-2 bg-transparent border border-cyan-500/50 text-cyan-400 text-xs font-bold rounded hover:bg-cyan-500/10 transition-colors"
      >
        APPLY NOISE SHIELD
      </button>
    </MiniApp>
  );
};

const UtilityArbitrageCard = ({ theme, liveMode }: HostCardProps) => {
  const { getIntensity } = useCardActions();
  const intensity = getIntensity('Utility Arbitrage');
  const [price, setPrice] = useState(0.42);
  const [gridStatus, setGridStatus] = useState<'Peak Demand' | 'Balanced' | 'Off-Peak'>('Peak Demand');

  useEffect(() => {
    if (!liveMode) {
      return;
    }

    const interval = setInterval(() => {
      const next = Math.max(0.18, Math.min(0.6, price + (Math.random() * 0.12 - 0.06)));
      setPrice(Number(next.toFixed(2)));
      setGridStatus(next > 0.45 ? 'Peak Demand' : next > 0.3 ? 'Balanced' : 'Off-Peak');
    }, 3200);

    return () => clearInterval(interval);
  }, [liveMode, price]);

  const tempDrop = Math.max(1, Math.round((intensity / 100) * 4));
  const savings = (4.2 * (intensity / 100)).toFixed(2);

  return (
    <MiniApp title="Utility Arbitrage" icon={Zap} theme={theme} stat={`$${price}/kWh`} statLabel="Live Rate">
      <div className="flex justify-between text-xs text-gray-400 mb-3">
        <span>Grid Intensity</span>
        <span className={gridStatus === 'Peak Demand' ? 'text-red-400' : 'text-emerald-400'}>{gridStatus}</span>
      </div>

      <div className="flex items-end gap-1 h-12 mb-4">
        {[40, 60, 45, 90, 85, 100, 70].map((height, index) => (
          <div
            key={index}
            className="flex-1 bg-cyan-900/40 rounded-t-sm border-t border-cyan-500/30"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      <div className="bg-[#111827] p-4 rounded-lg flex items-center justify-between border border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/10 rounded-full">
            <Thermometer className="text-cyan-400" size={18} />
          </div>
          <div>
            <p className="text-white text-xs font-bold">Auto-Adjustment</p>
            <p className="text-gray-500 text-[10px]">Saving ~${savings}/day</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-cyan-400 text-sm font-bold">-{tempDrop}°F</p>
          <p className="text-gray-500 text-[10px]">Eco-Mode</p>
        </div>
      </div>
    </MiniApp>
  );
};

const RevenueAuditorCard = ({ theme }: FinanceCardProps) => {
  const { getIntensity } = useCardActions();
  const intensity = getIntensity('Revenue Integrity');
  const [discrepancyFound, setDiscrepancyFound] = useState(true);

  const transactions = [
    { id: 'BK-9021', guest: 'J. Miller', platform: 'Airbnb', expected: 450.0, actual: 450.0, status: 'Matched' },
    { id: 'BK-8842', guest: 'S. Chen', platform: 'VRBO', expected: 1200.0, actual: 1182.0, status: 'Mismatch' },
    { id: 'BK-7731', guest: 'R. Taylor', platform: 'Direct', expected: 850.0, actual: 850.0, status: 'Matched' },
  ];
  const mismatchThreshold = 5;

  return (
    <MiniApp title="Revenue Integrity" icon={Landmark} theme={theme} stat="100%" statLabel="Scanned">
      {discrepancyFound && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 mb-4 flex items-center gap-3">
          <AlertCircle className="text-red-500" size={18} />
          <div className="text-[11px]">
            <p className="text-red-200 font-bold">Discrepancy Detected: $18.00</p>
            <p className="text-red-300/70 text-[10px]">Missing cleaning fee on Booking BK-8842</p>
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-36 overflow-y-auto pr-1">
        {transactions.map((tx) => {
          const delta = Math.abs(tx.expected - tx.actual);
          const needsDispute = delta > mismatchThreshold;
          return (
            <div
              key={tx.id}
              className="bg-[#111827] p-3 rounded border border-gray-800 flex justify-between items-center group hover:border-cyan-500/50 transition-colors"
            >
              <div>
                <p className="text-white text-[11px] font-bold">{tx.id} • {tx.guest}</p>
                <p className="text-gray-500 text-[10px]">{tx.platform}</p>
              </div>
              <div className="text-right">
                <p className={`text-[11px] font-bold ${tx.status === 'Matched' ? 'text-gray-300' : 'text-red-400'}`}>
                  ${tx.actual.toFixed(2)}
                </p>
                <p className="text-[9px] text-gray-600">Expected: ${tx.expected.toFixed(2)}</p>
                {needsDispute && (
                  <button className="mt-1 text-[9px] text-red-400 font-bold uppercase tracking-wide">
                    Dispute
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-800 flex gap-2">
        <button className="flex-1 py-2 bg-cyan-500 text-[#0f172a] text-[10px] font-black rounded uppercase tracking-tighter hover:bg-cyan-400 transition-all">
          Generate Dispute Ticket
        </button>
        <button
          onClick={() => setDiscrepancyFound((prev) => !prev)}
          className="p-2 border border-gray-700 rounded hover:bg-gray-800"
        >
          <FileSearch className="text-gray-400" size={16} />
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between text-[10px]">
        <span className="text-gray-500 uppercase">Auto-Reconcile</span>
        <div className="w-8 h-4 bg-cyan-900/50 rounded-full relative border border-cyan-500/30 cursor-pointer">
          <div
            className={`absolute top-1 w-2 h-2 bg-cyan-400 rounded-full transition-all ${
              intensity >= 70 ? 'right-1' : 'left-1'
            }`}
          />
        </div>
      </div>
    </MiniApp>
  );
};

const CompetitorGhostingCard = ({ theme }: FinanceCardProps) => {
  const { getIntensity, simulateCard } = useCardActions();
  const intensity = getIntensity('Competitor Ghosting');
  const competitors = [
    { id: 1, name: 'Urban Loft A', distance: '0.2mi', rate: '$245', gap: 'High', status: 'Vulnerable' },
    { id: 2, name: 'Skyline Suite', distance: '0.4mi', rate: '$210', gap: 'Med', status: 'Stable' },
    { id: 3, name: 'Garden Unit', distance: '0.1mi', rate: '$280', gap: 'Crit', status: 'Vulnerable' },
  ];

  return (
    <MiniApp title="Competitor Ghosting" icon={MapIcon} theme={theme} stat="0.5mi" statLabel="Live Radius">
      <div className="relative h-32 bg-[#111827] rounded-lg mb-6 border border-gray-800 overflow-hidden">
        <div className="absolute inset-0 opacity-0" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 bg-cyan-500 rounded-full" />
          <div className="w-3 h-3 bg-cyan-400 rounded-full border-2 border-white absolute top-0.5 left-0.5" />
        </div>
        <div className="absolute top-4 right-10 w-2 h-2 bg-red-500 rounded-full opacity-60" />
        <div className="absolute bottom-8 left-12 w-2 h-2 bg-red-500 rounded-full opacity-60" />
        <div className="absolute top-20 right-24 w-2 h-2 bg-orange-500 rounded-full opacity-60" />
      </div>

      <div className="space-y-3">
        {competitors.map((comp) => (
          <div key={comp.id} className="flex items-center justify-between p-2 rounded bg-[#0f172a] border border-gray-800/50">
            <div className="flex items-center gap-3">
              <Target size={14} className={comp.status === 'Vulnerable' ? 'text-red-400' : 'text-gray-500'} />
              <div>
                <p className="text-white text-[10px] font-bold">{comp.name}</p>
                <p className="text-gray-500 text-[9px]">{comp.distance} • {comp.rate}/night</p>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                  comp.gap === 'Crit' ? 'bg-red-900/40 text-red-400' : 'bg-gray-800 text-gray-400'
                }`}
              >
                {comp.gap} GAP
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-[10px] text-slate-400">
        Demand spike detected • Suggested +15% price hike for open dates.
      </div>
      <button
        onClick={() => simulateCard('Competitor Ghosting')}
        className="w-full mt-3 py-2.5 bg-slate-800 text-white text-[10px] font-black rounded uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
      >
        <TrendingDown size={14} /> Execute Under-Cut Logic
      </button>
      <div className="mt-3 text-[10px] text-slate-500">Optimization intensity at {intensity}%.</div>
    </MiniApp>
  );
};

const MasterDeploy = () => {
  const { simulateCard } = useCardActions();
  const [isDeploying, setIsDeploying] = useState(false);
  const [progress, setProgress] = useState(0);

  const startSequence = () => {
    if (isDeploying) {
      return;
    }
    setIsDeploying(true);
    let step = 0;
    const interval = setInterval(() => {
      step += 20;
      setProgress(step);

      switch (step) {
        case 20:
          simulateCard('Revenue Integrity');
          break;
        case 40:
          simulateCard('Utility Arbitrage');
          break;
        case 60:
          simulateCard('Ordinance Watchdog');
          break;
        case 80:
          simulateCard('Competitor Ghosting');
          break;
        default:
          break;
      }

      if (step >= 100) {
        clearInterval(interval);
        simulateCard('Dynamic Cleaning Dispatch');
        setTimeout(() => {
          setIsDeploying(false);
          setProgress(0);
        }, 1500);
      }
    }, 600);
  };

  const steps = [
    { label: 'Audit: Scan 30-day revenue for missing fees', icon: <Coins size={14} />, color: 'text-emerald-400', status: 'COMPLETE' },
    { label: 'Arbitrage: Sync HVAC to $0.29/kWh', icon: <Zap size={14} />, color: 'text-yellow-400', status: 'SYNCED' },
    { label: 'Watchdog: Calibrate Noise Shield to 75dB', icon: <ShieldCheck size={14} />, color: 'text-cyan-400', status: 'ACTIVE' },
    { label: 'Ghosting: Undercut Urban Loft A by $5', icon: <MapPin size={14} />, color: 'text-purple-400', status: 'DEPLOYED' },
  ];

  return (
    <div className="bg-[#0f172a] p-1 rounded-2xl border-2 border-dashed border-cyan-500/30">
      <button
        onClick={startSequence}
        disabled={isDeploying}
        className={`w-full group relative overflow-hidden rounded-xl py-5 transition-all duration-500 ${
          isDeploying ? 'bg-cyan-900/20' : 'bg-cyan-700 hover:scale-[1.02]'
        }`}
      >
        <div className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-500" style={{ width: `${progress}%` }} />

        <div className="flex flex-col items-center justify-center gap-2">
          <Rocket className={`${isDeploying ? 'animate-bounce text-cyan-400' : 'text-white group-hover:rotate-12 transition-transform'}`} />
          <span className="text-white font-black uppercase tracking-[0.2em] text-sm">
            {isDeploying ? 'Executing Logic...' : 'Deploy Global OS'}
          </span>
        </div>
      </button>

      {isDeploying && (
        <div className="p-4 space-y-3 bg-[#1a2332] rounded-b-xl mt-1 border-t border-gray-800 animate-in fade-in slide-in-from-top-2">
          {steps.map((step, idx) => (
            <div
              key={step.label}
              className={`flex items-center gap-3 transition-opacity duration-300 ${
                progress < (idx + 1) * 25 ? 'opacity-30' : 'opacity-100'
              }`}
            >
              <span className={step.color}>{step.icon}</span>
              <span className="text-[10px] font-mono text-gray-300 uppercase">{step.label}</span>
              {progress >= (idx + 1) * 25 && (
                <span className="text-cyan-400 text-[8px] ml-auto">{step.status}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DynamicCleaningDispatchCard = ({ theme }: FinanceCardProps) => {
  const { getIntensity, simulateCard } = useCardActions();
  const intensity = getIntensity('Dynamic Cleaning Dispatch');
  const [minutesLeft, setMinutesLeft] = useState(42);
  const [event, setEvent] = useState<'In Stay' | 'Guest Left'>('In Stay');

  useEffect(() => {
    if (event === 'Guest Left') {
      return;
    }
    const interval = setInterval(() => {
      setMinutesLeft((prev) => Math.max(0, prev - 1));
    }, 1500);
    return () => clearInterval(interval);
  }, [event]);

  return (
    <MiniApp title="Dynamic Cleaning Dispatch" icon={Send} theme={theme} stat={`${minutesLeft}m`} statLabel="Checkout ETA">
      <div className="bg-[#111827] p-3 rounded-lg border border-gray-800 mb-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Unit 402 • Checkout Window</span>
          <span className="text-cyan-400 font-bold">{event}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Timer size={14} className="text-amber-400" />
          <span className="text-sm font-bold text-white">{minutesLeft} mins until turnover</span>
        </div>
      </div>
      <button
        onClick={() => {
          setEvent('Guest Left');
          simulateCard('Dynamic Cleaning Dispatch');
        }}
        className="w-full py-2 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded text-xs font-bold hover:bg-amber-500/20"
      >
        Trigger Guest Left Event
      </button>
      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
        <span>Auto-dispatch via WhatsApp/SMS</span>
        <span className="text-amber-300">{intensity}% active</span>
      </div>
    </MiniApp>
  );
};

const MiniApp = ({ title, icon: Icon, theme, stat, statLabel, children }: MiniAppProps) => {
  const { simulateCard, openWorkflow, togglePin, getSignal, isPinned, getIntensity, setIntensity } = useCardActions();
  const runs = getSignal(title);
  const pinned = isPinned(title);
  const intensity = getIntensity(title);

  return (
    <div className="bg-[#0f172a] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5">
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg bg-[#1e293b] border border-white/5 ${theme.color}`}>
            <Icon size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-200">{title}</h3>
            {pinned && <span className="text-[10px] text-emerald-400 font-bold">Pinned</span>}
          </div>
        </div>
        <div className="text-right">
          <div className={`text-lg font-black ${theme.color}`}>{stat}</div>
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{statLabel}</div>
        </div>
      </div>
      <div className="relative z-10">{children}</div>
      <div className="relative z-10 mt-3 flex items-center justify-between text-[10px] text-slate-500">
        <span>Runs: {runs}</span>
        <div className="flex gap-2">
          <button
            onClick={() => simulateCard(title)}
            className="px-2 py-1 rounded bg-white/5 text-slate-300 hover:bg-white/10"
          >
            Simulate
          </button>
          <button
            onClick={() => openWorkflow(title)}
            className="px-2 py-1 rounded bg-white/5 text-slate-300 hover:bg-white/10"
          >
            Workflow
          </button>
          <button
            onClick={() => togglePin(title)}
            className="px-2 py-1 rounded bg-white/5 text-slate-300 hover:bg-white/10"
          >
            {pinned ? 'Unpin' : 'Pin'}
          </button>
        </div>
      </div>
      <div className="relative z-10 mt-3">
        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
          <span>Optimization Intensity</span>
          <span className="text-slate-300 font-bold">{intensity}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={intensity}
          onChange={(event) => setIntensity(title, parseInt(event.target.value, 10))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <button
          onClick={() => simulateCard(title)}
          className="mt-3 w-full py-2 text-xs font-bold rounded-lg bg-white/5 text-slate-200 hover:bg-white/10"
        >
          Apply Optimization
        </button>
      </div>
    </div>
  );
};

export default RentalOSPlayground;
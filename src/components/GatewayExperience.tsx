'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';

const RentalOSPlayground = dynamic(() => import('@/components/RentalOSPlayground'), { ssr: false, loading: () => null });

type Phase = 'idle' | 'transition' | 'landed';

const statusLines = [
  'NEURAL VAULT: UNLOCKED',
  'SENTIENCE SYNC: COMPLETE',
  'OPENING COMMAND CENTER V2.4...',
];

export default function GatewayExperience() {
  const [phase, setPhase] = useState<Phase>('idle');
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const introRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const vaultDialRef = useRef<HTMLButtonElement | null>(null);
  const platesRef = useRef<HTMLSpanElement[]>([]);
  const rippleRef = useRef<HTMLSpanElement | null>(null);
  const streakRef = useRef<HTMLDivElement | null>(null);
  const statusRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<HTMLDivElement | null>(null);
  const promptRef = useRef<HTMLDivElement | null>(null);
  const dashboardRef = useRef<HTMLDivElement | null>(null);
  const prefetchedRef = useRef(false);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (phase !== 'transition' || prefetchedRef.current) {
      return;
    }
    prefetchedRef.current = true;
    void import('@/components/RentalOSPlayground');
  }, [phase]);

  const handleInitialize = () => {
    if (phase !== 'idle') {
      return;
    }

    setPhase('transition');
    timelineRef.current?.kill();

    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate?.([18, 36, 18]);
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => setPhase('landed'),
    });

    tl.set(
      [rippleRef.current, streakRef.current, statusRef.current, streamRef.current, promptRef.current],
      { opacity: 0 },
    )
      .to(vaultDialRef.current, { rotate: 360, duration: 1.2, ease: 'back.inOut(1.7)' }, 0)
      .to(rippleRef.current, { opacity: 1, scale: 1.2, duration: 0.25 }, 0)
      .to(rippleRef.current, { opacity: 0, scale: 1.8, duration: 0.4 }, 0.1)
      .to(streamRef.current, { opacity: 0, y: 20, duration: 0.35 }, 0.1)
      .to(promptRef.current, { opacity: 0, y: 10, duration: 0.35 }, 0.1)
      .to(platesRef.current, { scale: 1.5, opacity: 0, stagger: 0.1, duration: 0.8, ease: 'power4.out' }, 0.35)
      .to([heroRef.current, streakRef.current], { scale: 0.6, filter: 'blur(20px)', opacity: 0, duration: 1, ease: 'power2.in' }, 0.55)
      .to(statusRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.9)
      .to(statusRef.current, { opacity: 0, duration: 0.4 }, 1.5)
      .fromTo(
        dashboardRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.55,
      );

    timelineRef.current = tl;
  };

  const portalText = useMemo(() => statusLines, []);

  const plateAngles = [0, 60, 120, 180, 240, 300];

  return (
    <div className="relative min-h-screen bg-[#050507] text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.2),_transparent_55%)] opacity-70" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0.9),_transparent_70%)]" />

      <div className="pointer-events-none absolute inset-0 z-20">
        <div ref={streakRef} className="absolute inset-0 gateway-data-streaks opacity-0" />
      </div>

      {phase !== 'landed' && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <div
            ref={statusRef}
            className="absolute top-16 right-10 text-xs md:text-sm font-mono text-cyan-200/70 space-y-2 opacity-0 translate-y-4"
          >
            {portalText.map((line) => (
              <div key={line} className="gateway-flicker">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      <div
        ref={introRef}
        className={`relative z-10 flex min-h-screen items-center justify-center transition-opacity duration-700 ${
          phase === 'landed' ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="w-full max-w-5xl px-6 text-center flex flex-col items-center gap-10">
          <div ref={heroRef} className="space-y-3 hero-text">
            <p className="text-xs uppercase tracking-[0.6em] text-cyan-200/70">Kinetic Neural Vault</p>
            <h1 className="text-4xl md:text-6xl font-semibold tracking-[0.25em]">COMPLICORE</h1>
            <p className="text-sm md:text-base text-slate-300 uppercase tracking-[0.2em]">
              Beyond Property Management. Autonomous Asset Orchestration.
            </p>
            <p className="text-base md:text-lg text-slate-200 max-w-2xl mx-auto">
              We don’t just host; we harmonize. CompliCore bridges the gap between static operations and hyper-responsive intelligence.
            </p>
          </div>

          <button
            ref={vaultDialRef}
            type="button"
            onClick={handleInitialize}
            className="vault-dial relative"
            aria-label="Unlock neural vault"
          >
            <span className="vault-brain" />
            {plateAngles.map((angle, index) => (
              <span
                key={angle}
                ref={(el) => {
                  if (el) {
                    platesRef.current[index] = el;
                  }
                }}
                className="vault-plate"
                style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
              />
            ))}
            <span ref={rippleRef} className="absolute inset-0 neural-ripple opacity-0" />
          </button>

          <div className="flex flex-col items-center gap-3">
            <div ref={streamRef} className="neural-particle-stream" />
            <div ref={promptRef} className="text-xs text-cyan-200/70 font-mono tracking-[0.35em] uppercase">
              [ CLICK TO UNLOCK NEURAL VAULT ]
            </div>
          </div>
        </div>
      </div>

      <div
        ref={dashboardRef}
        className={`absolute inset-0 z-0 ${phase === 'landed' ? 'pointer-events-auto' : 'pointer-events-none'} opacity-0`}
      >
        {phase === 'landed' && <RentalOSPlayground />}
      </div>
    </div>
  );
}
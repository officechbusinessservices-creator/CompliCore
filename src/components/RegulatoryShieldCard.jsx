import { Activity, ShieldCheck } from "lucide-react";

function Metric({ label, value, accent = false }) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 ${
        accent
          ? "border-emerald-300/40 bg-emerald-300/10"
          : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <p className="text-[11px] uppercase tracking-wider text-zinc-400">{label}</p>
      <p
        className={`mt-1 text-sm font-medium ${
          accent ? "text-emerald-200" : "text-zinc-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default function RegulatoryShieldCard() {
  return (
    <section className="group relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/30 bg-zinc-950/80 p-6 shadow-[0_0_60px_rgba(0,255,255,0.08)] backdrop-blur-sm transition-all duration-300 hover:border-cyan-400/60 hover:shadow-[0_0_70px_rgba(0,255,255,0.18)]">
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-cyan-400/20" />
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent animate-[scan_2.6s_linear_infinite]" />

      <div className="relative z-10 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-cyan-300/70">
            Sovereignty Layer
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Regulatory Shield</h2>
          <p className="mt-2 text-sm text-zinc-300">
            Institutional-grade compliance orchestration for global assets.
          </p>
        </div>

        <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-3 text-cyan-300">
          <ShieldCheck className="h-6 w-6" />
        </div>
      </div>

      <div className="relative z-10 mt-6 grid grid-cols-2 gap-3">
        <Metric label="Jurisdictions" value="184" />
        <Metric label="Threat Surface" value="Low" accent />
        <Metric label="Audit Sync" value="Live" />
        <Metric label="Sentience Mesh" value="Active" />
      </div>

      <div className="relative z-10 mt-5 flex items-center gap-2 text-xs text-cyan-200/90">
        <Activity className="h-4 w-4" />
        <span>Scanning policy deltas in real time…</span>
      </div>
    </section>
  );
}

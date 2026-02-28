import RegulatoryShieldCard from "@/components/RegulatoryShieldCard";
import YieldOrchestrationCard from "@/components/YieldOrchestrationCard";

export const metadata = {
  title: "CompliCore OS",
  description: "Institutional Infrastructure for the Sentient Asset Economy.",
};

export default function CompliCoreOSPage() {
  return (
    <main className="min-h-screen bg-black text-white p-10 flex flex-col items-center justify-center">
      <div className="max-w-4xl w-full mb-12 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">
          COMPLICORE<span className="text-cyan-500">_OS</span>
        </h1>
        <p className="text-slate-400 text-lg">
          Institutional Infrastructure for the Sentient Asset Economy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <RegulatoryShieldCard />
        <YieldOrchestrationCard />
      </div>
    </main>
  );
}

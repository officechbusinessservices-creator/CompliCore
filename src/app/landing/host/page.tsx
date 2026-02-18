import Link from "next/link";

export default function HostLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold">Unified Travel Ecosystem</Link>
          <div className="flex items-center gap-3">
            <Link href="/prototype/dashboard" className="text-sm">Host Dashboard</Link>
            <Link href="/portal/host" className="text-sm px-3 py-1.5 bg-emerald-600 text-white rounded-lg">Host Portal</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wide bg-emerald-100 text-emerald-700 rounded-full">
            Host Club
          </span>
          <h1 className="text-4xl font-bold mb-4 mt-4">Grow your rentals with Host Club.</h1>
          <p className="text-lg text-zinc-500 mb-6">
            $18/property/month for up to 10 properties. Automate pricing, messaging, payouts, and operations with verified workflows.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/prototype/dashboard" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">View dashboard</Link>
            <Link href="/prototype/pricing" className="px-4 py-2 bg-zinc-800 text-white rounded-lg">See pricing</Link>
            <Link href="/landing/enterprise" className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">Enterprise tier</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-500">
            <span>10-property limit for Host Club</span>
            <span>AI Power-Up add-on: $28/month</span>
            <span>24/7 support + compliance checks</span>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold mb-3">Host Snapshot</h2>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li>✔ Calendar sync + channel manager</li>
            <li>✔ Smart lock code automation</li>
            <li>✔ Cleaning + maintenance scheduling</li>
            <li>✔ Owner payouts and tax reports</li>
          </ul>
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
            $18/property/month. Upgrade when you cross 10 properties.
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-4">
        {[
          { title: "Calendar sync", desc: "Connect Airbnb, Vrbo, Booking.com." },
          { title: "Smart locks", desc: "Auto-generate access codes per booking." },
          { title: "Operations", desc: "Cleaning + maintenance schedules." },
        ].map((item) => (
          <div key={item.title} className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-zinc-500">{item.desc}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold mb-2">Per-property pricing</h3>
            <p className="text-sm text-zinc-500 mb-4">
              Host Club scales with your portfolio. Add AI Power-Up and marketplace modules à la carte.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-zinc-600">
              <div>✔ $18/property/month</div>
              <div>✔ Up to 10 properties</div>
              <div>✔ AI add-on $28/month</div>
              <div>✔ Marketplace modules</div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900 text-white">
            <h3 className="font-semibold mb-2">Ready to scale past 10 properties?</h3>
            <p className="text-sm text-zinc-300 mb-4">
              Enterprise unlocks API access, team management, and multi-entity accounting for $888/month.
            </p>
            <Link href="/landing/enterprise" className="inline-flex px-4 py-2 bg-white text-zinc-900 rounded-lg">Explore enterprise</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

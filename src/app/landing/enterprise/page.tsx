import Link from "next/link";

export default function EnterpriseLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold">Unified Travel Ecosystem</Link>
          <div className="flex items-center gap-3">
            <Link href="/portal/corporate" className="text-sm">Corporate Portal</Link>
            <Link href="/prototype/pricing" className="text-sm px-3 py-1.5 bg-emerald-600 text-white rounded-lg">Enterprise Pricing</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wide bg-emerald-100 text-emerald-700 rounded-full">
            Enterprise & Corporate
          </span>
          <h1 className="text-4xl font-bold mb-4 mt-4">Enterprise rentals at scale.</h1>
          <p className="text-lg text-zinc-500 mb-6">
            $888/month flat for 10+ properties. Includes API access, team management, multi-entity accounting, and forecasting.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/portal/corporate" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Corporate portal</Link>
            <Link href="/prototype/pricing" className="px-4 py-2 bg-zinc-800 text-white rounded-lg">Compare plans</Link>
            <Link href="/landing/host" className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">Host Club</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-500">
            <span>Flat $888/month tier</span>
            <span>Corporate SME: 8% commission</span>
            <span>Optional AI Power-Up $28/month</span>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold mb-3">Enterprise Snapshot</h2>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li>✔ API access + white-label options</li>
            <li>✔ Team management & approvals</li>
            <li>✔ Multi-entity accounting</li>
            <li>✔ Corporate travel policy engine</li>
          </ul>
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
            Built for 10+ properties and corporate travel programs.
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-4">
        {[
          { title: "Policy controls", desc: "Rate caps, approvals, ESG tracking." },
          { title: "Integrations", desc: "Concur, Navan, Amex GBT, CWT." },
          { title: "Commission tools", desc: "8% corporate SME commission & markup." },
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
            <h3 className="font-semibold mb-2">Corporate SME bookings</h3>
            <p className="text-sm text-zinc-500 mb-4">
              8% commission per booking with optional host markup to cover the fee. Corporate listings require compliance + discount range.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-zinc-600">
              <div>✔ Rate caps + approvals</div>
              <div>✔ Discount range enforcement</div>
              <div>✔ ESG tracking + reporting</div>
              <div>✔ Expense system exports</div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900 text-white">
            <h3 className="font-semibold mb-2">Launch enterprise at scale</h3>
            <p className="text-sm text-zinc-300 mb-4">
              Coordinate enterprise operations, supplier onboarding, and corporate travel policies in one platform.
            </p>
            <Link href="/portal/corporate" className="inline-flex px-4 py-2 bg-white text-zinc-900 rounded-lg">Enter corporate portal</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

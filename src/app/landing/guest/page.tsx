import Link from "next/link";

export default function GuestLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold">Unified Travel Ecosystem</Link>
          <div className="flex items-center gap-3">
            <Link href="/prototype" className="text-sm">Explore stays</Link>
            <Link href="/portal/guest" className="text-sm px-3 py-1.5 bg-emerald-600 text-white rounded-lg">Guest Portal</Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-12 grid lg:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
        <div>
          <span className="inline-flex items-center gap-2 px-3 py-1 text-xs uppercase tracking-wide bg-emerald-100 text-emerald-700 rounded-full">
            Guest Experience
          </span>
          <h1 className="text-4xl font-bold mb-4 mt-4">Stay smarter with a unified travel platform.</h1>
          <p className="text-lg text-zinc-500 mb-6">
            Book short-, mid-, or long-term stays with transparent pricing, verified hosts, and unified support.
            Create trip albums, share itineraries, and manage every stay in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/prototype" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Search stays</Link>
            <Link href="/portal/guest" className="px-4 py-2 bg-zinc-800 text-white rounded-lg">Manage trips</Link>
            <Link href="/landing/host" className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">Host a property</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-xs text-zinc-500">
            <span>Trusted by 2,400+ travelers</span>
            <span>4.9★ average stay rating</span>
            <span>24/7 guest support</span>
          </div>
        </div>
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold mb-3">Guest Snapshot</h2>
          <ul className="space-y-3 text-sm text-zinc-500">
            <li>✔ Unified messaging with hosts and support</li>
            <li>✔ Trip albums + shared itineraries</li>
            <li>✔ Budget planning and receipt tracking</li>
            <li>✔ Verified stays with trusted reviews</li>
          </ul>
          <div className="mt-4 p-3 rounded-lg bg-emerald-50 text-emerald-700 text-sm">
            No fees to browse. Book with flexible policies.
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-4">
        {[
          { title: "Trip albums", desc: "Share memories with travel companions." },
          { title: "Unified messaging", desc: "Contact hosts and support in one place." },
          { title: "Budget planning", desc: "Track spend and manage receipts." },
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
            <h3 className="font-semibold mb-2">Why guests choose us</h3>
            <p className="text-sm text-zinc-500 mb-4">
              A single account connects stays, messaging, and support across every trip.
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-zinc-600">
              <div>✔ Safe check-in flows</div>
              <div>✔ Verified host network</div>
              <div>✔ Flexible stays</div>
              <div>✔ Rewards + loyalty</div>
            </div>
          </div>
          <div className="p-6 rounded-xl bg-zinc-900 text-white">
            <h3 className="font-semibold mb-2">Ready to plan your next trip?</h3>
            <p className="text-sm text-zinc-300 mb-4">
              Start exploring curated stays for business, leisure, and long-term travel.
            </p>
            <Link href="/prototype" className="inline-flex px-4 py-2 bg-white text-zinc-900 rounded-lg">Explore stays</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

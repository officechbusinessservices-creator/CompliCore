const featureHighlights = [
  {
    title: "Unified Operations",
    description: "Connect guests, hosts, and enterprise teams in a single command center with real-time visibility.",
    icon: "M12 6v6l4 2",
  },
  {
    title: "Smart Automation",
    description: "Automate pricing, messaging, and tasks with AI guardrails and always-on compliance.",
    icon: "M12 3v18m9-9H3",
  },
  {
    title: "Revenue Intelligence",
    description: "Forecast occupancy, benchmark performance, and optimize rates across every channel.",
    icon: "M3 12h18M5 8h14M7 16h10",
  },
  {
    title: "Trusted Experiences",
    description: "Verified listings, secure payments, and 24/7 support that builds repeat stays.",
    icon: "M9 12l2 2 4-4",
  },
];

const testimonials = [
  {
    quote:
      "The 3D visualization of our inventory and operations is stunning. Teams finally understand the full stack at a glance.",
    name: "Amira Lopez",
    title: "Head of Strategy, Horizon Stays",
  },
  {
    quote:
      "We consolidated six tools into one platform. Automated check-ins and AI pricing made our margins jump 18%.",
    name: "Jonas Patel",
    title: "Portfolio Manager, Northwind Rentals",
  },
  {
    quote:
      "Guests love the transparent trip experience and our ops team finally has actionable insights every morning.",
    name: "Claire Roberts",
    title: "Chief Experience Officer, Meridian Suites",
  },
];

const steps = [
  {
    title: "Discover",
    description: "Explore our platform map and see how every feature connects across the guest lifecycle.",
  },
  {
    title: "Design",
    description: "Shape the workflows that match your brand, compliance requirements, and portfolio size.",
  },
  {
    title: "Deploy",
    description: "Launch quickly with modular rollouts, training, and a dedicated success roadmap.",
  },
];

export default function AnimatedLandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.2),_transparent_55%),radial-gradient(circle_at_20%_20%,_rgba(16,185,129,0.2),_transparent_45%),radial-gradient(circle_at_80%_40%,_rgba(139,92,246,0.2),_transparent_45%)]" />
      <div className="relative">
        <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl bg-zinc-950/70">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Rental OS</p>
                <h1 className="text-lg font-semibold">Unified 3D Platform</h1>
              </div>
            </div>
            <nav className="flex items-center gap-4 text-sm text-zinc-300">
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#testimonials" className="hover:text-white transition">Testimonials</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
              <a
                href="#contact"
                className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition"
              >
                Book a demo
              </a>
            </nav>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-[1.05fr,0.95fr] gap-16 items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Compliance-first rental platform</p>
            <h2 className="text-4xl md:text-6xl font-semibold leading-tight mt-4">
              The compliance-first rental platform built for multi-property performance.
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300">
                Scale faster, stay audit-ready.
              </span>
            </h2>
            <p className="mt-6 text-lg text-zinc-300 max-w-xl">
              Unify bookings, pricing, and guest operations in one secure command center—so your portfolio scales faster, stays compliant, and earns more revenue per stay.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#contact"
                className="px-6 py-3 rounded-full bg-emerald-400 text-zinc-900 font-semibold shadow-[0_0_25px_rgba(16,185,129,0.6)]"
              >
                Get my compliance & revenue blueprint
              </a>
              <a
                href="#features"
                className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
              >
                See the 3D platform tour
              </a>
            </div>
            <p className="mt-4 text-xs text-emerald-200/80">
              30-minute session → tailored roadmap + risk audit included.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 text-sm text-zinc-400">
              <div>
                <p className="text-xl font-semibold text-white">42%</p>
                <p>Faster check-ins</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">18%</p>
                <p>RevPAR uplift</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-white">96%</p>
                <p>Guest satisfaction</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-xs text-zinc-300">
              <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1">Rental platform for portfolio-scale operators</span>
              <span className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1">Compliance-first booking engine</span>
              <span className="rounded-full border border-violet-400/40 bg-violet-500/10 px-3 py-1">AI pricing + audit-ready reporting</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-gradient-to-br from-emerald-500/30 via-cyan-500/10 to-violet-500/30 blur-3xl" />
            <div className="relative grid gap-6 [perspective:1400px]">
              <div className="relative rounded-[36px] border border-white/10 bg-zinc-900/70 backdrop-blur p-8 shadow-[0_0_40px_rgba(56,189,248,0.25)]">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-emerald-300">3D Command Core</span>
                  <span className="text-xs text-zinc-400">Realtime</span>
                </div>
                <div className="mt-6 relative h-56 rounded-3xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-violet-500/20 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-44 w-32 rounded-[42%] border border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-transparent shadow-[0_0_24px_rgba(255,255,255,0.15)]" />
                  </div>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-zinc-400">
                  <span className="rounded-full border border-white/10 px-3 py-1">Live bookings</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">AI pricing</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Guest ops</span>
                  <span className="rounded-full border border-white/10 px-3 py-1">Compliance</span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-5 rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur animate-float-slow transform-gpu [transform:rotateX(12deg)_rotateY(-14deg)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-cyan-300 uppercase tracking-[0.2em]">Guest View</span>
                    <span className="text-xs text-zinc-400">4.9★</span>
                  </div>
                  <div className="h-28 rounded-2xl bg-gradient-to-br from-cyan-500/30 via-sky-500/10 to-emerald-500/20" />
                  <p className="mt-3 text-sm text-zinc-400">
                    Immersive stays, personalized itineraries, and instant support.
                  </p>
                </div>

                <div className="p-5 rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur animate-float-reverse transform-gpu [transform:rotateX(-8deg)_rotateY(16deg)]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-violet-300 uppercase tracking-[0.2em]">Revenue Lab</span>
                    <span className="text-xs text-zinc-400">Forecast</span>
                  </div>
                  <div className="h-28 rounded-2xl bg-gradient-to-br from-violet-500/40 via-fuchsia-500/20 to-emerald-500/20" />
                  <p className="mt-3 text-sm text-zinc-400">
                    Adaptive pricing, demand sensing, and performance benchmarks.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur animate-float-slow transform-gpu [transform:rotateX(6deg)_rotateY(8deg)]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-emerald-300 uppercase tracking-[0.2em]">Roadmap Stack</span>
                  <span className="text-xs text-zinc-400">Phase 1 → 3</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs text-zinc-300">
                  <div className="rounded-2xl border border-white/10 p-3">MVP launch</div>
                  <div className="rounded-2xl border border-white/10 p-3">Enterprise ops</div>
                  <div className="rounded-2xl border border-white/10 p-3">Marketplace</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-[0.9fr,1.1fr] gap-12 items-center">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-10 shadow-[0_0_40px_rgba(56,189,248,0.2)]">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">About us</p>
              <h3 className="text-3xl font-semibold mt-4">We blend hospitality, data, and motion design.</h3>
              <p className="mt-4 text-zinc-300">
                Our team builds rental platforms that feel alive. Every layer — from booking logic to staff workflows — is translated into 3D motion so that stakeholders
                can understand the product instantly and guests feel the brand energy the moment they land.
              </p>
              <div className="mt-8 grid gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Vendor-neutral architecture with privacy-first design.
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Modular deployment for host, guest, and enterprise operations.
                </div>
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-violet-400" />
                  AI guardrails, compliance tooling, and transparent analytics.
                </div>
              </div>
            </div>
            <div className="grid gap-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="p-6 rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur hover:border-emerald-400/40 transition"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Step 0{index + 1}</p>
                  <h4 className="text-xl font-semibold mt-2">{step.title}</h4>
                  <p className="mt-3 text-sm text-zinc-400">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="features" className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Website features</p>
              <h3 className="text-3xl font-semibold mt-4">Everything your rental brand needs — broken down clearly.</h3>
            </div>
            <div className="text-sm text-zinc-400 max-w-md">
              The landing experience highlights booking, operations, revenue, and trust pillars so investors, owners, and guests immediately understand your value.
            </div>
          </div>
          <div className="mt-6 text-sm text-emerald-200/80">
            Built for property managers who need a multi-property rental management platform with compliance baked in.
          </div>
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            {featureHighlights.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-3xl border border-white/10 bg-zinc-900/50 backdrop-blur hover:border-emerald-400/40 transition"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition">
                  <svg className="w-6 h-6 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold">{feature.title}</h4>
                <p className="mt-3 text-sm text-zinc-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent p-10">
            <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-200">Live modules</p>
                <h3 className="text-3xl font-semibold mt-4">Break down the platform modules in one glance.</h3>
                <p className="mt-4 text-zinc-300">
                  Showcase booking flows, operational playbooks, and revenue intelligence in a modular stack that animates in 3D. Each module is production-ready and
                  can be enabled as you grow.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-zinc-300">
                  <div className="p-4 rounded-2xl border border-white/10 bg-zinc-900/40">Booking Engine</div>
                  <div className="p-4 rounded-2xl border border-white/10 bg-zinc-900/40">Channel Manager</div>
                  <div className="p-4 rounded-2xl border border-white/10 bg-zinc-900/40">Guest CRM</div>
                  <div className="p-4 rounded-2xl border border-white/10 bg-zinc-900/40">Revenue Lab</div>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                <div className="h-56 rounded-2xl bg-gradient-to-br from-emerald-500/30 via-cyan-500/20 to-violet-500/20 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-2xl border border-white/30" />
                </div>
                <p className="mt-6 text-sm text-zinc-400">
                  Animated 3D nodes represent each system — booking, pricing, messaging, and compliance — connected through a single data layer.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Testimonials</p>
              <h3 className="text-3xl font-semibold mt-4">Teams trust the experience.</h3>
            </div>
            <div className="text-sm text-zinc-400 max-w-md">
              From boutique hosts to enterprise operators, our platform and 3D storytelling make complex operations feel effortless.
            </div>
          </div>
          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="p-6 rounded-3xl border border-white/10 bg-zinc-900/50">
                <p className="text-sm text-zinc-300">“{testimonial.quote}”</p>
                <div className="mt-6">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-zinc-400">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Contact us</p>
              <h3 className="text-3xl font-semibold mt-4">Ready to launch your 3D rental experience?</h3>
              <p className="mt-4 text-zinc-300">
                Tell us about your portfolio and we will map your operations, design your launch sequence, and deliver a landing experience that converts.
              </p>
              <div className="mt-8 space-y-4 text-sm text-zinc-400">
                <div>📍 New York · Miami · Dubai</div>
                <div>✉️ partnerships@rentalos.com</div>
                <div>☎️ +1 (212) 555-0181</div>
              </div>
            </div>
            <form className="p-8 rounded-3xl border border-white/10 bg-zinc-900/60 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">Full name</label>
                <input
                  className="mt-2 w-full rounded-2xl bg-zinc-950/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  placeholder="Jordan Smith"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">Email address</label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-2xl bg-zinc-950/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">Portfolio size</label>
                <input
                  className="mt-2 w-full rounded-2xl bg-zinc-950/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  placeholder="e.g. 30 properties"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.3em] text-zinc-400">Message</label>
                <textarea
                  rows={4}
                  className="mt-2 w-full rounded-2xl bg-zinc-950/60 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400/60"
                  placeholder="Tell us about your goals"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-full bg-emerald-400 text-zinc-900 font-semibold py-3 shadow-[0_0_25px_rgba(16,185,129,0.6)]"
              >
                Submit request
              </button>
            </form>
          </div>
        </section>

        <footer className="border-t border-white/10 py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-500">
            <p>© 2026 Rental OS. Animated 3D booking experience.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#about" className="hover:text-white transition">About</a>
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#testimonials" className="hover:text-white transition">Testimonials</a>
              <a href="#contact" className="hover:text-white transition">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
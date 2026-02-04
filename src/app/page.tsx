import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ExportButton } from "@/components/ExportButton";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="font-semibold text-lg">Rental Platform Architecture</h1>
              <p className="text-xs text-zinc-500">v1.0 | February 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Vendor Neutral
            </span>
            <span className="hidden sm:inline-block text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              Privacy First
            </span>
            <ExportButton />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              Short-Term Rental Platform
            </h2>
            <p className="text-xl text-zinc-400 mb-6">
              A comprehensive, vendor-neutral architecture for property managers, hosts, and guests.
              Built with privacy-by-design, ethical AI, and global compliance.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#documents" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-medium transition-colors">
                View Documentation
              </a>
              <a href="/diagrams" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors">
                Interactive Diagrams
              </a>
              <a href="/prototype" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg font-medium transition-colors border border-amber-500/30">
                Booking Prototype
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Key Principles */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-6">Key Principles</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-violet-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-1">Privacy by Design</h4>
              <p className="text-sm text-zinc-500">GDPR/CCPA compliant with data minimization and consent-first approach.</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-1">Vendor Neutral</h4>
              <p className="text-sm text-zinc-500">Multi-cloud ready with swappable components and open standards.</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-1">AI with Guardrails</h4>
              <p className="text-sm text-zinc-500">Transparent, explainable AI with human oversight for all decisions.</p>
            </div>
            <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-1">Security First</h4>
              <p className="text-sm text-zinc-500">Zero-trust architecture with encryption everywhere and audit logging.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section id="overview" className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-8">Platform Overview</h3>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Capabilities */}
            <div className="lg:col-span-2 p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <h4 className="font-semibold mb-4 text-zinc-300">Platform Capabilities</h4>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-emerald-400 mb-2">Core Features</h5>
                  <ul className="space-y-1.5 text-sm text-zinc-400">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Listing Management</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Booking Engine</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Payment Processing</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Guest Communications</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Review System</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Analytics Dashboard</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-blue-400 mb-2">AI/ML Features</h5>
                  <ul className="space-y-1.5 text-sm text-zinc-400">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Dynamic Pricing</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Listing Optimizer</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Smart Messaging</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Demand Forecasting</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Guest Screening</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Review Analysis</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-amber-400 mb-2">Integrations</h5>
                  <ul className="space-y-1.5 text-sm text-zinc-400">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> OTA Channels (Airbnb, VRBO)</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> PMS Systems</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Smart Locks</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Insurance Providers</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Accounting Systems</li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-violet-400 mb-2">Compliance</h5>
                  <ul className="space-y-1.5 text-sm text-zinc-400">
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> GDPR / CCPA</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> PCI DSS</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Audit Logging</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Consent Management</li>
                    <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Data Subject Rights</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <h4 className="font-semibold mb-4 text-zinc-300">MVP Timeline</h4>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-sm font-mono text-zinc-400">P0</div>
                  <div>
                    <div className="font-medium text-sm">Foundation</div>
                    <div className="text-xs text-zinc-500">8 weeks - Infra, Auth, Core API</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-sm font-mono text-emerald-400">P1</div>
                  <div>
                    <div className="font-medium text-sm">MVP Launch</div>
                    <div className="text-xs text-zinc-500">12 weeks - Core Platform</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-sm font-mono text-zinc-400">P2</div>
                  <div>
                    <div className="font-medium text-sm">Growth</div>
                    <div className="text-xs text-zinc-500">16 weeks - OTAs, Smart Locks</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-sm font-mono text-zinc-400">P3</div>
                  <div>
                    <div className="font-medium text-sm">Enterprise</div>
                    <div className="text-xs text-zinc-500">20 weeks - API, PM Tools</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-sm font-mono text-zinc-400">P4</div>
                  <div>
                    <div className="font-medium text-sm">Platform</div>
                    <div className="text-xs text-zinc-500">16 weeks - Marketplace</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Documents */}
      <section id="documents" className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-2">Architecture Documents</h3>
          <p className="text-zinc-500 mb-8">Complete documentation suite for engineering teams and stakeholders.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <DocumentCard
              number="01"
              title="Architecture"
              description="High-level system design, data model, security architecture, and data flows."
              tags={["System Design", "Security"]}
              color="emerald"
            />
            <DocumentCard
              number="02"
              title="MVP Features"
              description="Core features, user stories with acceptance criteria, and success metrics."
              tags={["Product", "User Stories"]}
              color="blue"
            />
            <DocumentCard
              number="03"
              title="AI Features"
              description="AI capabilities, guardrails, consent requirements, and transparency rules."
              tags={["AI/ML", "Ethics"]}
              color="amber"
            />
            <DocumentCard
              number="04"
              title="Tech Stack"
              description="Technology choices, vendor-neutral options, and non-functional requirements."
              tags={["Engineering", "NFRs"]}
              color="violet"
            />
            <DocumentCard
              number="05"
              title="Roadmap"
              description="Phased development plan, milestones, timelines, and success criteria."
              tags={["Planning", "Milestones"]}
              color="rose"
            />
            <DocumentCard
              number="06"
              title="Risks"
              description="Risk assessment, mitigation strategies, and monitoring requirements."
              tags={["Risk", "Compliance"]}
              color="orange"
            />
            <DocumentCard
              number="07"
              title="Data Models"
              description="Entity definitions with TypeScript types, relationships, and MVP backlog."
              tags={["Database", "Backlog"]}
              color="cyan"
            />
            <DocumentCard
              number="08"
              title="Constraints"
              description="Scope boundaries, assumptions, dependencies, and decision log."
              tags={["Scope", "Decisions"]}
              color="pink"
            />
          </div>
        </div>
      </section>

      {/* Tech Stack Summary */}
      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-8">Technology Stack</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Frontend</h4>
              <div className="space-y-2">
                <TechBadge name="Next.js 14+" type="primary" />
                <TechBadge name="TypeScript" type="primary" />
                <TechBadge name="Tailwind CSS" type="secondary" />
                <TechBadge name="shadcn/ui" type="secondary" />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Backend</h4>
              <div className="space-y-2">
                <TechBadge name="Node.js 20+" type="primary" />
                <TechBadge name="Fastify" type="primary" />
                <TechBadge name="GraphQL Yoga" type="secondary" />
                <TechBadge name="Drizzle ORM" type="secondary" />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Data</h4>
              <div className="space-y-2">
                <TechBadge name="PostgreSQL 16+" type="primary" />
                <TechBadge name="Redis Cluster" type="primary" />
                <TechBadge name="Elasticsearch" type="secondary" />
                <TechBadge name="S3-compatible" type="secondary" />
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">AI/ML</h4>
              <div className="space-y-2">
                <TechBadge name="OpenAI / Anthropic" type="primary" />
                <TechBadge name="LiteLLM Gateway" type="primary" />
                <TechBadge name="XGBoost" type="secondary" />
                <TechBadge name="Pinecone" type="secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-8">User Roles</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <RoleCard
              role="Guest"
              description="Books accommodations for short-term stays"
              capabilities={["Search properties", "Book & pay", "Message hosts", "Leave reviews"]}
              icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
            <RoleCard
              role="Host"
              description="Lists and manages their own properties"
              capabilities={["Create listings", "Manage calendar", "Set pricing", "Receive payouts"]}
              icon="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
            <RoleCard
              role="Property Manager"
              description="Manages multiple properties for owners"
              capabilities={["Portfolio view", "Team management", "Owner reporting", "API access"]}
              icon="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
            <RoleCard
              role="Admin"
              description="Platform operations and moderation"
              capabilities={["User management", "Content moderation", "Analytics", "Support tools"]}
              icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-2">Interactive Features</h3>
          <p className="text-zinc-500 mb-8">Explore the architecture through interactive visualizations and prototypes.</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="/diagrams" className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <svg className="w-6 h-6 text-emerald-500 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Architecture Diagrams</h4>
              <p className="text-sm text-zinc-500">Interactive Mermaid diagrams for system, booking flows, data pipelines, and RBAC.</p>
            </a>

            <a href="/diagrams" className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-6 h-6 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Gantt Chart Roadmap</h4>
              <p className="text-sm text-zinc-500">Visual timeline of the 18-month development plan with phases and milestones.</p>
            </a>

            <a href="/prototype" className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-amber-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <svg className="w-6 h-6 text-amber-500 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">Booking Prototype</h4>
              <p className="text-sm text-zinc-500">Working prototype with property search, filtering, and booking flow.</p>
            </a>

            <a href="/prototype/dashboard" className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-violet-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <svg className="w-6 h-6 text-violet-500 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">Host Dashboard</h4>
              <p className="text-sm text-zinc-500">Dashboard with bookings list, analytics, calendar, and performance metrics.</p>
            </a>

            <a href="/api-docs" className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-rose-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 group-hover:bg-rose-500/20 transition-colors">
                <svg className="w-6 h-6 text-rose-500 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">API Documentation</h4>
              <p className="text-sm text-zinc-500">Interactive API docs with 30+ endpoints, request/response schemas.</p>
            </a>

            <a href="/prototype/messages" className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-cyan-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                <svg className="w-6 h-6 text-cyan-500 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">Guest Messaging</h4>
              <p className="text-sm text-zinc-500">Real-time messaging interface with conversation management and quick replies.</p>
            </a>

            <a href="/prototype/pricing" className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-teal-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 group-hover:bg-teal-500/20 transition-colors">
                <svg className="w-6 h-6 text-teal-500 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">Dynamic Pricing</h4>
              <p className="text-sm text-zinc-500">Rule-based pricing editor with seasonal rates, discounts, and AI suggestions.</p>
            </a>

            <a href="/prototype/dashboard" className="group p-6 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-orange-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                <svg className="w-6 h-6 text-orange-500 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="font-semibold mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Availability Calendar</h4>
              <p className="text-sm text-zinc-500">Property calendar component with availability, pricing, and booking management.</p>
            </a>
          </div>
        </div>
      </section>

      {/* API & Database */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h3 className="text-2xl font-bold mb-2">Technical Assets</h3>
          <p className="text-zinc-500 mb-8">Ready-to-use specifications and schemas for development.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">OpenAPI Specification</h4>
                  <p className="text-xs text-zinc-500">/specs/openapi.yaml</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-4">
                Complete REST API specification with 30+ endpoints covering authentication, properties, bookings, payments, messaging, reviews, and AI features.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Authentication</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Properties</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Bookings</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Payments</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Messages</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">AI</span>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold">PostgreSQL Schema</h4>
                  <p className="text-xs text-zinc-500">/database/schema.sql</p>
                </div>
              </div>
              <p className="text-sm text-zinc-400 mb-4">
                Complete database schema with 15+ tables, enums, indexes, triggers, and seed data for roles. Includes PostGIS for geolocation.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Users</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Properties</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Bookings</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Payments</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Audit Logs</span>
                <span className="text-xs px-2 py-1 bg-zinc-800 rounded">Consent</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-zinc-500">
              Short-Term Rental Platform Architecture v1.0 | February 2026
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="/diagrams" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">Diagrams</a>
              <a href="/prototype" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">Prototype</a>
              <a href="/prototype/dashboard" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">Dashboard</a>
              <a href="/api-docs" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200">API Docs</a>
              <span className="text-zinc-400">Full docs in <code className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded text-xs">/docs</code></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DocumentCard({ number, title, description, tags, color }: {
  number: string;
  title: string;
  description: string;
  tags: string[];
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
  };

  return (
    <div className="group p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className={`px-2 py-0.5 text-xs font-mono rounded ${colorClasses[color]} border`}>
          {number}
        </span>
      </div>
      <h4 className="font-semibold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{title}</h4>
      <p className="text-sm text-zinc-500 mb-3">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function TechBadge({ name, type }: { name: string; type: "primary" | "secondary" }) {
  return (
    <div className={`px-3 py-1.5 rounded-lg text-sm ${
      type === "primary"
        ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium"
        : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800"
    }`}>
      {name}
    </div>
  );
}

function RoleCard({ role, description, capabilities, icon }: {
  role: string;
  description: string;
  capabilities: string[];
  icon: string;
}) {
  return (
    <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4">
        <svg className="w-6 h-6 text-zinc-500 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
        </svg>
      </div>
      <h4 className="font-semibold mb-1">{role}</h4>
      <p className="text-sm text-zinc-500 mb-3">{description}</p>
      <ul className="space-y-1">
        {capabilities.map((cap) => (
          <li key={cap} className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            {cap}
          </li>
        ))}
      </ul>
    </div>
  );
}

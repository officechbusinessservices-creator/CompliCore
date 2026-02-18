import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about CompliCore and our mission.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">
          ← Back to CompliCore
        </Link>

        <h1 className="text-4xl font-bold mb-4">About Us</h1>
        <p className="text-lg text-muted-foreground leading-relaxed mb-8">
          CompliCore helps hosts and property managers run short-term rentals with confidence.
          We combine automation, compliance, and practical AI so teams can scale faster while
          keeping guest trust and regulatory standards first.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-2">Our Mission</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Make rental operations simple, transparent, and compliance-first for every property team.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-2">What We Build</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unified automation for pricing, messaging, channels, and operations in one platform.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-2">Why CompliCore</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Privacy, reliability, and practical AI designed for real-world rental teams.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );
}

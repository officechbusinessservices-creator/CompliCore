import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CompliCore Privacy Policy — how we collect, use, and protect your data.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">
          ← Back to CompliCore
        </Link>

        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: February 18, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Who We Are</h2>
            <p>
              CompliCore (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the platform available at{" "}
              <a href="https://complicore.live" className="text-emerald-500 hover:underline">complicore.live</a>.
              We are committed to protecting your personal data and complying with applicable privacy laws including GDPR and CCPA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Account data:</strong> name, email address, password (hashed), and profile information you provide when registering.</li>
              <li><strong className="text-foreground">Usage data:</strong> pages visited, features used, timestamps, and device/browser information.</li>
              <li><strong className="text-foreground">Property data:</strong> listing details, booking records, pricing, and calendar information you enter.</li>
              <li><strong className="text-foreground">Communications:</strong> messages sent through the platform between hosts and guests.</li>
              <li><strong className="text-foreground">Payment data:</strong> billing information processed by our payment provider (we do not store raw card numbers).</li>
              <li><strong className="text-foreground">Cookies:</strong> session tokens and preference cookies. See our Cookie Policy for details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide, operate, and improve the CompliCore platform.</li>
              <li>To process bookings, payments, and host payouts.</li>
              <li>To send transactional emails (booking confirmations, receipts, alerts).</li>
              <li>To comply with legal obligations (tax reporting, regulatory compliance).</li>
              <li>To detect and prevent fraud and abuse.</li>
              <li>To send product updates and marketing communications (you may opt out at any time).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Legal Basis for Processing (GDPR)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong className="text-foreground">Contract:</strong> processing necessary to perform our service agreement with you.</li>
              <li><strong className="text-foreground">Legitimate interests:</strong> fraud prevention, security, and platform improvement.</li>
              <li><strong className="text-foreground">Legal obligation:</strong> tax, financial, and regulatory compliance.</li>
              <li><strong className="text-foreground">Consent:</strong> marketing communications and non-essential cookies.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Sharing</h2>
            <p>We do not sell your personal data. We share data only with:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Payment processors (e.g., Stripe) to handle transactions.</li>
              <li>Cloud infrastructure providers (e.g., Render, Netlify) to host the platform.</li>
              <li>Analytics providers under data processing agreements.</li>
              <li>Law enforcement or regulators when legally required.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Retention</h2>
            <p>
              We retain your data for as long as your account is active or as required by law. You may request deletion of your account and associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Your Rights</h2>
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Access the personal data we hold about you.</li>
              <li>Correct inaccurate data.</li>
              <li>Request deletion of your data (&quot;right to be forgotten&quot;).</li>
              <li>Object to or restrict certain processing.</li>
              <li>Data portability (receive your data in a machine-readable format).</li>
              <li>Withdraw consent at any time (for consent-based processing).</li>
              <li>Lodge a complaint with your local data protection authority.</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, contact us at <a href="mailto:privacy@complicore.live" className="text-emerald-500 hover:underline">privacy@complicore.live</a>.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Security</h2>
            <p>
              We use industry-standard security measures including encryption at rest and in transit, access controls, and regular security audits. No system is 100% secure; we will notify you of any breach as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. International Transfers</h2>
            <p>
              Your data may be processed in countries outside your own. Where required, we use Standard Contractual Clauses or equivalent safeguards to protect cross-border transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this policy from time to time. We will notify you of material changes by email or by posting a notice on the platform. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact</h2>
            <p>
              For privacy-related questions or requests:<br />
              <a href="mailto:privacy@complicore.live" className="text-emerald-500 hover:underline">privacy@complicore.live</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex gap-6 text-sm text-muted-foreground">
          <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "CompliCore Terms of Service — the rules and conditions for using our platform.",
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">
          ← Back to CompliCore
        </Link>

        <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-muted-foreground mb-10">Last updated: February 18, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing or using CompliCore (&quot;the Platform&quot;) at{" "}
              <a href="https://complicore.live" className="text-emerald-500 hover:underline">complicore.live</a>,
              you agree to be bound by these Terms of Service. If you do not agree, do not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Description of Service</h2>
            <p>
              CompliCore is a compliance-first short-term rental management platform that provides tools for property listing management, booking automation, channel synchronization, dynamic pricing, guest communications, and regulatory compliance reporting.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Eligibility</h2>
            <p>
              You must be at least 18 years old and legally capable of entering into a binding contract to use the Platform. By using CompliCore, you represent that you meet these requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Account Registration</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must provide accurate and complete information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
              <li>You must notify us immediately of any unauthorized use of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>Use the Platform for any unlawful purpose or in violation of any regulations.</li>
              <li>Upload false, misleading, or fraudulent listing information.</li>
              <li>Attempt to gain unauthorized access to any part of the Platform or its infrastructure.</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Platform.</li>
              <li>Use automated tools to scrape, crawl, or extract data without written permission.</li>
              <li>Transmit malware, viruses, or any other harmful code.</li>
              <li>Harass, abuse, or harm other users of the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Subscription and Payments</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Access to certain features requires a paid subscription.</li>
              <li>Subscription fees are billed in advance on a monthly or annual basis.</li>
              <li>All fees are non-refundable except as required by law or as stated in our refund policy.</li>
              <li>We reserve the right to change pricing with 30 days&apos; notice.</li>
              <li>Failure to pay may result in suspension or termination of your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Intellectual Property</h2>
            <p>
              All content, features, and functionality of the Platform — including but not limited to software, text, graphics, logos, and data — are owned by CompliCore and protected by applicable intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written consent.
            </p>
            <p className="mt-3">
              You retain ownership of the data and content you upload to the Platform. By uploading content, you grant CompliCore a limited license to use that content solely to provide the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Third-Party Integrations</h2>
            <p>
              The Platform integrates with third-party services (e.g., Airbnb, VRBO, Booking.com, Stripe). Your use of those services is governed by their respective terms. CompliCore is not responsible for the availability, accuracy, or conduct of third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Disclaimers</h2>
            <p>
              The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. We do not warrant that the Platform will be uninterrupted, error-free, or free of harmful components. We do not provide legal, tax, or financial advice — consult qualified professionals for those matters.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, CompliCore shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or goodwill, arising from your use of or inability to use the Platform. Our total liability to you for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless CompliCore and its officers, directors, employees, and agents from any claims, damages, losses, or expenses (including legal fees) arising from your use of the Platform, your violation of these Terms, or your violation of any third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Termination</h2>
            <p>
              We may suspend or terminate your account at any time for violation of these Terms or for any other reason with reasonable notice. You may cancel your account at any time through your account settings. Upon termination, your right to use the Platform ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Governing Law</h2>
            <p>
              These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes shall be resolved in the courts of Delaware, and you consent to personal jurisdiction there.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">14. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. We will notify you of material changes by email or platform notice. Continued use after changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">15. Contact</h2>
            <p>
              For questions about these Terms:<br />
              <a href="mailto:legal@complicore.live" className="text-emerald-500 hover:underline">legal@complicore.live</a>
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex gap-6 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
          <Link href="/cookies" className="hover:text-foreground transition-colors">Cookie Policy</Link>
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        </div>
      </div>
    </div>
  );
}

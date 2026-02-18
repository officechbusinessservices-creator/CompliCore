import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "CompliCore Cookie Policy — how we use cookies and similar tracking technologies.",
};

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 inline-block">
          ← Back to CompliCore
        </Link>

        <h1 className="text-4xl font-bold mb-2">Cookie Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: February 18, 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-sm leading-relaxed text-muted-foreground">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences, keep you logged in, and understand how you use the platform. Similar technologies include local storage, session storage, and pixel tags.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. How CompliCore Uses Cookies</h2>
            <p>We use cookies for the following purposes:</p>

            <div className="mt-4 space-y-4">
              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-1">Essential Cookies</h3>
                <p className="text-xs text-muted-foreground mb-2">Always active — required for the platform to function</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Session authentication token (keeps you logged in)</li>
                  <li>CSRF protection token (prevents cross-site request forgery)</li>
                  <li>Load balancer routing (ensures consistent server routing)</li>
                </ul>
              </div>

              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-1">Preference Cookies</h3>
                <p className="text-xs text-muted-foreground mb-2">Remember your settings</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Theme preference (dark/light mode)</li>
                  <li>Language and locale settings</li>
                  <li>Dashboard layout preferences</li>
                </ul>
              </div>

              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-1">Analytics Cookies</h3>
                <p className="text-xs text-muted-foreground mb-2">Help us understand how the platform is used (requires consent)</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Page views and navigation paths</li>
                  <li>Feature usage and engagement metrics</li>
                  <li>Error and performance monitoring</li>
                </ul>
              </div>

              <div className="border border-border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-1">Marketing Cookies</h3>
                <p className="text-xs text-muted-foreground mb-2">Used to measure campaign effectiveness (requires consent)</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Conversion tracking from ads</li>
                  <li>Referral source attribution</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Cookie Details</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 text-foreground font-semibold">Cookie Name</th>
                    <th className="text-left py-2 pr-4 text-foreground font-semibold">Type</th>
                    <th className="text-left py-2 pr-4 text-foreground font-semibold">Duration</th>
                    <th className="text-left py-2 text-foreground font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="py-2 pr-4 font-mono">session_token</td>
                    <td className="py-2 pr-4">Essential</td>
                    <td className="py-2 pr-4">Session</td>
                    <td className="py-2">Authentication</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">csrf_token</td>
                    <td className="py-2 pr-4">Essential</td>
                    <td className="py-2 pr-4">Session</td>
                    <td className="py-2">Security</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">theme</td>
                    <td className="py-2 pr-4">Preference</td>
                    <td className="py-2 pr-4">1 year</td>
                    <td className="py-2">Dark/light mode</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono">_analytics</td>
                    <td className="py-2 pr-4">Analytics</td>
                    <td className="py-2 pr-4">2 years</td>
                    <td className="py-2">Usage analytics</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Cookies</h2>
            <p>
              Some features of the Platform use third-party services that may set their own cookies:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong className="text-foreground">Stripe:</strong> payment processing cookies for fraud prevention.</li>
              <li><strong className="text-foreground">Analytics providers:</strong> usage and performance tracking (only with your consent).</li>
            </ul>
            <p className="mt-3">
              These third parties have their own privacy and cookie policies. We recommend reviewing them directly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Managing Cookies</h2>
            <p>You can control cookies in several ways:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li>
                <strong className="text-foreground">Browser settings:</strong> most browsers allow you to block or delete cookies. Note that blocking essential cookies will prevent the Platform from functioning correctly.
              </li>
              <li>
                <strong className="text-foreground">Platform preferences:</strong> you can manage analytics and marketing cookie consent through your account settings.
              </li>
              <li>
                <strong className="text-foreground">Opt-out tools:</strong> for analytics, you may use browser opt-out extensions or your browser&apos;s built-in privacy controls.
              </li>
            </ul>

            <div className="mt-4 space-y-2">
              <p className="text-foreground font-medium">Browser cookie management guides:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">Google Chrome</a></li>
                <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">Mozilla Firefox</a></li>
                <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">Apple Safari</a></li>
                <li><a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">Microsoft Edge</a></li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Do Not Track</h2>
            <p>
              Some browsers send a &quot;Do Not Track&quot; (DNT) signal. We currently do not alter our data collection practices in response to DNT signals, but we respect your right to opt out of analytics cookies through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Changes to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of material changes by posting a notice on the Platform. Continued use after changes constitutes acceptance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Contact</h2>
            <p>
              For questions about our use of cookies:<br />
              <a href="mailto:privacy@complicore.live" className="text-emerald-500 hover:underline">privacy@complicore.live</a>
            </p>
          </section>
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

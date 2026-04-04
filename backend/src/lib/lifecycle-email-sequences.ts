export type LifecycleEmailStep = {
  id: string;
  dayOffset: number;
  subject: string;
  ctaLabel: string;
  body: string;
};

export function renderLifecycleTemplate(
  template: string,
  context: Record<string, string>,
) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    return context[key] ?? "";
  });
}

export const TRIAL_WELCOME_SEQUENCE: LifecycleEmailStep[] = [
  {
    id: "trial_day_1_welcome",
    dayOffset: 0,
    subject: "Welcome to CompliCore! Let's bulletproof your portfolio.",
    ctaLabel: "Connect My First Listing",
    body: `Hi {{firstName}},

Welcome to CompliCore. You've just taken a strong step toward scaling your rental business with fewer operational headaches.

Over the next 14 days, you have full access to AI-driven revenue optimization and built-in regulatory compliance.

To see the impact quickly, connect your first property. It usually takes less than 3 minutes.

Once connected, CompliCore starts analyzing your local market and compliance status.

If you get stuck, reply to this email and we will help.

The CompliCore Team`,
  },
  {
    id: "trial_day_3_ai_pricing",
    dayOffset: 2,
    subject: "Are you leaving money on the table, {{firstName}}?",
    ctaLabel: "Turn On AI Pricing",
    body: `Hi {{firstName}},

Properties using static pricing often miss revenue during high-demand periods.

During your trial, you have full access to the AI Dynamic Pricing Engine.

Today's quick action:
1. Open your dashboard.
2. Go to AI Pricing.
3. Enable Auto-Sync for one active property.

CompliCore will continuously optimize rates using demand, events, and competitive occupancy signals.

The CompliCore Team`,
  },
  {
    id: "trial_day_6_compliance",
    dayOffset: 5,
    subject: "How to scale without getting fined",
    ctaLabel: "View My Compliance Dashboard",
    body: `Hi {{firstName}},

Revenue growth matters, but protecting that revenue matters just as much.

As portfolios grow, local STR permits, tax workflows, and regulation tracking become difficult to manage manually.

CompliCore's compliance architecture monitors local requirements, flags risk before violations, and keeps audit trails ready.

Take one minute today to review your Compliance Dashboard.

The CompliCore Team`,
  },
  {
    id: "trial_day_10_portfolio_pro",
    dayOffset: 9,
    subject: "Managing multiple properties? You should not do it alone.",
    ctaLabel: "View Plans and Upgrade",
    body: `Hi {{firstName}},

You're nearing the end of your trial.

If you're managing multiple properties or operating on behalf of owners, Portfolio Pro is designed for that stage.

Portfolio Pro includes:
- Team access for cleaners, co-hosts, and maintenance
- Automated owner statements
- Bulk portfolio updates for messages and pricing rules

If you're scaling operations, this plan is built for that workload.

The CompliCore Team`,
  },
  {
    id: "trial_day_13_last_call",
    dayOffset: 12,
    subject: "Action required: your CompliCore trial ends tomorrow",
    ctaLabel: "Secure My Account Now",
    body: `Hi {{firstName}},

Your 14-day trial ends in 24 hours.

To keep calendar sync, smart lock code automation, and AI pricing active, select a plan today.

CompliCore offers flat-fee plans for operators of different portfolio sizes with no hidden fees.

If you need help choosing the right plan, reply directly to this email.

The CompliCore Team`,
  },
];

export const TRIAL_WIN_BACK_SEQUENCE: LifecycleEmailStep[] = [
  {
    id: "winback_day_1_paused",
    dayOffset: 1,
    subject: "Your CompliCore account is currently paused",
    ctaLabel: "Reactivate My Account",
    body: `Hi {{firstName}},

Your free trial has ended and your account is paused.

AI pricing, automated messaging, and real-time compliance tracking are currently inactive.

Your data and setup are still saved, so you can resume quickly.

Reactivate anytime to continue where you left off.

The CompliCore Team`,
  },
  {
    id: "winback_day_4_extension",
    dayOffset: 4,
    subject: "Need a little more time, {{firstName}}?",
    ctaLabel: "Extend My Trial by 7 Days",
    body: `Hi {{firstName}},

If you did not have enough time to fully evaluate CompliCore, we can extend your trial by 7 more days.

No credit card is required for the extension.

If plan selection is the blocker, reply and we will help map the most cost-effective option for your portfolio.

The CompliCore Team`,
  },
  {
    id: "winback_day_10_downsell",
    dayOffset: 10,
    subject: "Are you managing the hard way?",
    ctaLabel: "Start for $18 per month",
    body: `Hi {{firstName}},

Manual operations can quickly absorb your margin and time.

If advanced tiers were not the right fit yet, Host Club starts at $18/property/month and includes channel sync, smart lock automation, cleaning schedules, and support.

Start with the essentials and scale up when you're ready.

The CompliCore Team`,
  },
  {
    id: "winback_day_21_feedback",
    dayOffset: 21,
    subject: "Closing your file for now (one quick question)",
    ctaLabel: "Share Feedback",
    body: `Hi {{firstName}},

We'll pause email follow-up for now.

Before we close this out, could you reply with one sentence on why you chose not to upgrade?

For example:
- Missing feature
- Pricing mismatch
- Not enough setup time

Your feedback directly improves the product.

The CompliCore Team`,
  },
];

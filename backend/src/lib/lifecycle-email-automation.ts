import type { FastifyInstance } from "fastify";
import { env } from "./env";
import {
  renderLifecycleTemplate,
  TRIAL_WELCOME_SEQUENCE,
  TRIAL_WIN_BACK_SEQUENCE,
  type LifecycleEmailStep,
} from "./lifecycle-email-sequences";
import { Email } from "../utils/email";

type TrialEnrollment = {
  email: string;
  firstName: string;
  lastName: string;
  enrolledAtMs: number;
  trialEndsAtMs: number;
  sentStepIds: Set<string>;
  lastSentAtMs?: number;
};

type SequenceName = "trial_welcome" | "trial_win_back";

type ScheduledStep = {
  sequence: SequenceName;
  step: LifecycleEmailStep;
  dueAtMs: number;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const DEFAULT_TICK_MS = 60 * 1000;

const CTA_PATH_BY_STEP_ID: Record<string, string> = {
  trial_day_1_welcome: "/onboarding",
  trial_day_3_ai_pricing: "/pricing",
  trial_day_6_compliance: "/settings",
  trial_day_10_portfolio_pro: "/#pricing",
  trial_day_13_last_call: "/#pricing",
  winback_day_1_paused: "/login",
  winback_day_4_extension: "/signup?trial_extension=7",
  winback_day_10_downsell: "/#pricing",
  winback_day_21_feedback: "/login",
};

export class LifecycleEmailAutomation {
  private enrollments = new Map<string, TrialEnrollment>();
  private timer: NodeJS.Timeout | null = null;
  private isTickRunning = false;

  constructor(private readonly fastify: FastifyInstance) {}

  start() {
    if (!this.enabled()) {
      this.fastify.log.info("lifecycle email automation is disabled");
      return;
    }
    const tickMs = this.resolveTickMs();
    this.fastify.log.info({ tickMs }, "starting lifecycle email automation");
    this.timer = setInterval(() => {
      void this.runTick();
    }, tickMs);
    void this.runTick();
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  enrollTrial(input: {
    email: string;
    firstName?: string;
    lastName?: string;
    enrolledAt?: string | number | Date;
  }) {
    const email = input.email.toLowerCase();
    const existing = this.enrollments.get(email);
    if (existing) {
      if (input.firstName) existing.firstName = input.firstName;
      if (input.lastName) existing.lastName = input.lastName;
      return existing;
    }

    const enrolledAtMs = this.resolveEnrolledAtMs(input.enrolledAt);
    const trialEndsAtMs = enrolledAtMs + this.resolveTrialDurationDays() * DAY_MS;
    const enrollment: TrialEnrollment = {
      email,
      firstName: input.firstName || "User",
      lastName: input.lastName || "",
      enrolledAtMs,
      trialEndsAtMs,
      sentStepIds: new Set<string>(),
    };

    this.enrollments.set(email, enrollment);
    this.fastify.log.info(
      {
        email,
        enrolledAt: new Date(enrolledAtMs).toISOString(),
        trialEndsAt: new Date(trialEndsAtMs).toISOString(),
      },
      "trial lifecycle enrollment created",
    );

    if (this.enabled()) {
      void this.processEnrollment(enrollment, Date.now());
    }

    return enrollment;
  }

  getSequenceSteps(sequence: SequenceName) {
    const steps = this.sequenceFor(sequence);
    return steps.map((step) => ({
      id: step.id,
      dayOffset: step.dayOffset,
      subject: step.subject,
      ctaLabel: step.ctaLabel,
    }));
  }

  previewStep(input: {
    sequence: SequenceName;
    stepId: string;
    firstName?: string;
    ctaUrl?: string;
  }) {
    const step = this.findStep(input.sequence, input.stepId);
    if (!step) return null;

    const firstName = input.firstName || "User";
    const ctaUrl = input.ctaUrl || this.resolveCtaUrl(step.id);

    return {
      sequence: input.sequence,
      stepId: step.id,
      dayOffset: step.dayOffset,
      ctaLabel: step.ctaLabel,
      ctaUrl,
      subject: renderLifecycleTemplate(step.subject, { firstName }),
      body: renderLifecycleTemplate(step.body, { firstName }),
    };
  }

  async sendTestStep(input: {
    to: string;
    firstName?: string;
    lastName?: string;
    sequence: SequenceName;
    stepId: string;
    ctaUrl?: string;
  }) {
    const step = this.findStep(input.sequence, input.stepId);
    if (!step) {
      return { ok: false as const, error: "step_not_found" };
    }

    const ctaUrl = input.ctaUrl || this.resolveCtaUrl(step.id);
    await new Email(
      {
        email: input.to,
        firstName: input.firstName,
        lastName: input.lastName,
      },
      ctaUrl,
    ).sendLifecycleStep(step, ctaUrl);

    return { ok: true as const, stepId: step.id, ctaUrl };
  }

  listEnrollments() {
    return [...this.enrollments.values()].map((entry) => ({
      email: entry.email,
      firstName: entry.firstName,
      lastName: entry.lastName,
      enrolledAt: new Date(entry.enrolledAtMs).toISOString(),
      trialEndsAt: new Date(entry.trialEndsAtMs).toISOString(),
      sentStepIds: [...entry.sentStepIds],
      lastSentAt: entry.lastSentAtMs
        ? new Date(entry.lastSentAtMs).toISOString()
        : null,
    }));
  }

  async runTick() {
    if (!this.enabled()) return;
    if (this.isTickRunning) return;

    this.isTickRunning = true;
    const nowMs = Date.now();

    try {
      for (const enrollment of this.enrollments.values()) {
        await this.processEnrollment(enrollment, nowMs);
      }
    } finally {
      this.isTickRunning = false;
    }
  }

  private enabled() {
    if (env.NODE_ENV === "test") return false;
    return env.LIFECYCLE_EMAILS_ENABLED;
  }

  private resolveTickMs() {
    return env.LIFECYCLE_EMAIL_TICK_MS > 0
      ? env.LIFECYCLE_EMAIL_TICK_MS
      : DEFAULT_TICK_MS;
  }

  private resolveTrialDurationDays() {
    return env.TRIAL_DURATION_DAYS > 0 ? env.TRIAL_DURATION_DAYS : 14;
  }

  private resolveEnrolledAtMs(input?: string | number | Date) {
    if (typeof input === "number" && Number.isFinite(input)) {
      return input;
    }

    if (typeof input === "string") {
      const parsed = Date.parse(input);
      if (!Number.isNaN(parsed)) return parsed;
    }

    if (input instanceof Date && !Number.isNaN(input.getTime())) {
      return input.getTime();
    }

    return Date.now();
  }

  private findStep(sequence: SequenceName, stepId: string) {
    return this.sequenceFor(sequence).find((step) => step.id === stepId);
  }

  private sequenceFor(sequence: SequenceName) {
    return sequence === "trial_welcome"
      ? TRIAL_WELCOME_SEQUENCE
      : TRIAL_WIN_BACK_SEQUENCE;
  }

  private resolveCtaUrl(stepId: string) {
    const path = CTA_PATH_BY_STEP_ID[stepId] || "/";
    const base = this.resolvePublicWebBaseUrl();
    return `${base}${path}`;
  }

  private resolvePublicWebBaseUrl() {
    const explicit = env.PUBLIC_WEB_BASE_URL.trim();
    if (explicit) return explicit.replace(/\/+$/, "");

    const fallbackFromApi = env.PUBLIC_API_BASE_URL.trim();
    if (fallbackFromApi) {
      return fallbackFromApi.replace(/\/+$/, "").replace(/\/v1$/, "");
    }

    return "http://localhost:3000";
  }

  private buildSchedule(enrollment: TrialEnrollment) {
    const schedule: ScheduledStep[] = [];

    for (const step of TRIAL_WELCOME_SEQUENCE) {
      schedule.push({
        sequence: "trial_welcome",
        step,
        dueAtMs: enrollment.enrolledAtMs + step.dayOffset * DAY_MS,
      });
    }

    for (const step of TRIAL_WIN_BACK_SEQUENCE) {
      schedule.push({
        sequence: "trial_win_back",
        step,
        dueAtMs: enrollment.trialEndsAtMs + step.dayOffset * DAY_MS,
      });
    }

    return schedule.sort((a, b) => a.dueAtMs - b.dueAtMs);
  }

  private async processEnrollment(enrollment: TrialEnrollment, nowMs: number) {
    const schedule = this.buildSchedule(enrollment);
    for (const item of schedule) {
      if (item.dueAtMs > nowMs) continue;
      if (enrollment.sentStepIds.has(item.step.id)) continue;

      const ctaUrl = this.resolveCtaUrl(item.step.id);
      try {
        await new Email(
          {
            email: enrollment.email,
            firstName: enrollment.firstName,
            lastName: enrollment.lastName,
          },
          ctaUrl,
        ).sendLifecycleStep(item.step, ctaUrl);

        enrollment.sentStepIds.add(item.step.id);
        enrollment.lastSentAtMs = Date.now();
        this.fastify.log.info(
          {
            email: enrollment.email,
            sequence: item.sequence,
            stepId: item.step.id,
            dueAt: new Date(item.dueAtMs).toISOString(),
          },
          "lifecycle email sent",
        );
      } catch (err) {
        this.fastify.log.error(
          {
            email: enrollment.email,
            sequence: item.sequence,
            stepId: item.step.id,
            err,
          },
          "failed to send lifecycle email",
        );
      }
    }
  }
}

export function createLifecycleEmailAutomation(fastify: FastifyInstance) {
  return new LifecycleEmailAutomation(fastify);
}

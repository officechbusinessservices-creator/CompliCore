import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { formatZodError } from "../lib/validation";

const sequenceSchema = z.enum(["trial_welcome", "trial_win_back"]);

const previewSchema = z.object({
  sequence: sequenceSchema,
  stepId: z.string().min(1),
  firstName: z.string().min(1).max(120).optional(),
  ctaUrl: z.string().url().optional(),
});

const sendTestSchema = z.object({
  to: z.string().email(),
  firstName: z.string().min(1).max(120).optional(),
  lastName: z.string().min(1).max(120).optional(),
  sequence: sequenceSchema,
  stepId: z.string().min(1),
  ctaUrl: z.string().url().optional(),
});

const enrollSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).max(120).optional(),
  lastName: z.string().min(1).max(120).optional(),
  enrolledAt: z.union([z.string(), z.number()]).optional(),
});

async function requireAdmin(fastify: FastifyInstance, request: any, reply: any) {
  const guard = (fastify as any).requireRole;
  if (!guard) return true;
  const res = await guard(request, reply, ["admin"]);
  if (reply.sent || res) return false;
  return true;
}

function resolveService(fastify: FastifyInstance) {
  return (fastify as any).lifecycleEmails;
}

export default async function lifecycleEmailRoutes(fastify: FastifyInstance) {
  fastify.get("/lifecycle/emails/sequences", async (request, reply) => {
    if (!(await requireAdmin(fastify, request, reply))) return;
    const service = resolveService(fastify);
    if (!service) return reply.status(503).send({ error: "lifecycle email service unavailable" });

    return {
      trial_welcome: service.getSequenceSteps("trial_welcome"),
      trial_win_back: service.getSequenceSteps("trial_win_back"),
    };
  });

  fastify.get("/lifecycle/emails/enrollments", async (request, reply) => {
    if (!(await requireAdmin(fastify, request, reply))) return;
    const service = resolveService(fastify);
    if (!service) return reply.status(503).send({ error: "lifecycle email service unavailable" });

    return {
      enrollments: service.listEnrollments(),
    };
  });

  fastify.post("/lifecycle/emails/preview", async (request, reply) => {
    if (!(await requireAdmin(fastify, request, reply))) return;
    const service = resolveService(fastify);
    if (!service) return reply.status(503).send({ error: "lifecycle email service unavailable" });

    const parsed = previewSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid lifecycle preview payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const preview = service.previewStep(parsed.data);
    if (!preview) return reply.status(404).send({ error: "step not found" });
    return preview;
  });

  fastify.post("/lifecycle/emails/send-test", async (request, reply) => {
    if (!(await requireAdmin(fastify, request, reply))) return;
    const service = resolveService(fastify);
    if (!service) return reply.status(503).send({ error: "lifecycle email service unavailable" });

    const parsed = sendTestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid lifecycle send-test payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const sent = await service.sendTestStep(parsed.data);
    if (!sent.ok) return reply.status(404).send({ error: sent.error });

    return {
      ok: true,
      message: "Lifecycle test email sent",
      stepId: sent.stepId,
      ctaUrl: sent.ctaUrl,
    };
  });

  fastify.post("/lifecycle/emails/enroll", async (request, reply) => {
    if (!(await requireAdmin(fastify, request, reply))) return;
    const service = resolveService(fastify);
    if (!service) return reply.status(503).send({ error: "lifecycle email service unavailable" });

    const parsed = enrollSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        type: "urn:problem:validation",
        title: "Request validation failed",
        status: 400,
        detail: "Invalid lifecycle enroll payload",
        errors: formatZodError(parsed.error),
        instance: request.url,
        traceId: request.id,
      });
    }

    const enrollment = service.enrollTrial(parsed.data);
    return {
      ok: true,
      enrollment: {
        email: enrollment.email,
        enrolledAt: new Date(enrollment.enrolledAtMs).toISOString(),
        trialEndsAt: new Date(enrollment.trialEndsAtMs).toISOString(),
      },
    };
  });

  fastify.post("/lifecycle/emails/run", async (request, reply) => {
    if (!(await requireAdmin(fastify, request, reply))) return;
    const service = resolveService(fastify);
    if (!service) return reply.status(503).send({ error: "lifecycle email service unavailable" });

    await service.runTick();
    return { ok: true, message: "Lifecycle scheduler tick executed" };
  });
}

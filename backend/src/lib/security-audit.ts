import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { env } from "./env";

export type SecurityAuditEvent = {
  eventType: string;
  severity?: "info" | "warn" | "critical";
  actorUserId?: string;
  actorEmail?: string;
  ip?: string;
  traceId?: string;
  details?: Record<string, unknown>;
};

type SecurityAuditRecord = {
  ts: string;
  eventType: string;
  severity: "info" | "warn" | "critical";
  actorUserId: string | null;
  actorEmail: string | null;
  ip: string | null;
  traceId: string | null;
  details: Record<string, unknown>;
  prevHash: string;
  hash: string;
};

type SecurityAlertRecord = {
  ts: string;
  alertType: string;
  severity: "warn" | "critical";
  eventType: string;
  actorKey: string;
  threshold: number;
  observed: number;
  windowSeconds: number;
  traceId: string | null;
};

type RollingCounter = {
  windowStartMs: number;
  count: number;
};

const GENESIS_HASH = "0".repeat(64);
const counterByRuleActor = new Map<string, RollingCounter>();
const lastAlertAtByRuleActor = new Map<string, number>();

let lastHash = GENESIS_HASH;
let writeQueue: Promise<void> = Promise.resolve();

function resolveLogPath() {
  if (!env.SECURITY_AUDIT_LOG_PATH.trim()) return null;
  const target = env.SECURITY_AUDIT_LOG_PATH.trim();
  if (path.isAbsolute(target)) return target;
  return path.join(process.cwd(), target);
}

function hasSiemExportConfigured() {
  return Boolean(env.SECURITY_SIEM_EXPORT_URL.trim());
}

function hashEvent(payload: Record<string, unknown>, prevHash: string) {
  return crypto
    .createHash("sha256")
    .update(`${prevHash}|${JSON.stringify(payload)}`)
    .digest("hex");
}

function incrementRuleCounter(ruleKey: string, nowMs: number) {
  const windowMs = env.SECURITY_ALERT_WINDOW_SECONDS * 1000;
  const current = counterByRuleActor.get(ruleKey);
  if (!current || nowMs - current.windowStartMs > windowMs) {
    const next = { windowStartMs: nowMs, count: 1 };
    counterByRuleActor.set(ruleKey, next);
    return next;
  }

  const next = {
    windowStartMs: current.windowStartMs,
    count: current.count + 1,
  };
  counterByRuleActor.set(ruleKey, next);
  return next;
}

function shouldEmitThresholdAlert(ruleKey: string, threshold: number, nowMs: number) {
  const counter = incrementRuleCounter(ruleKey, nowMs);
  if (counter.count < threshold) return false;

  const lastAlertAt = lastAlertAtByRuleActor.get(ruleKey) || 0;
  if (nowMs - lastAlertAt <= env.SECURITY_ALERT_WINDOW_SECONDS * 1000) {
    return false;
  }

  lastAlertAtByRuleActor.set(ruleKey, nowMs);
  return true;
}

function normalizeActorKey(record: SecurityAuditRecord) {
  return record.actorUserId || record.actorEmail || record.ip || "unknown";
}

function evaluateAlertRules(record: SecurityAuditRecord) {
  const alerts: SecurityAlertRecord[] = [];
  const nowMs = Date.now();
  const actorKey = normalizeActorKey(record);

  if (record.severity === "critical") {
    alerts.push({
      ts: new Date().toISOString(),
      alertType: "critical_audit_event",
      severity: "critical",
      eventType: record.eventType,
      actorKey,
      threshold: 1,
      observed: 1,
      windowSeconds: env.SECURITY_ALERT_WINDOW_SECONDS,
      traceId: record.traceId,
    });
  }

  if (record.eventType === "auth_login_failed") {
    const ruleKey = `auth_login_failed:${actorKey}`;
    const threshold = env.SECURITY_ALERT_FAILED_LOGIN_THRESHOLD;
    if (shouldEmitThresholdAlert(ruleKey, threshold, nowMs)) {
      const current = counterByRuleActor.get(ruleKey);
      alerts.push({
        ts: new Date().toISOString(),
        alertType: "excessive_failed_logins",
        severity: "warn",
        eventType: record.eventType,
        actorKey,
        threshold,
        observed: current?.count || threshold,
        windowSeconds: env.SECURITY_ALERT_WINDOW_SECONDS,
        traceId: record.traceId,
      });
    }
  }

  if (record.eventType === "rbac_access_denied") {
    const ruleKey = `rbac_access_denied:${actorKey}`;
    const threshold = env.SECURITY_ALERT_RBAC_DENY_THRESHOLD;
    if (shouldEmitThresholdAlert(ruleKey, threshold, nowMs)) {
      const current = counterByRuleActor.get(ruleKey);
      alerts.push({
        ts: new Date().toISOString(),
        alertType: "excessive_rbac_denials",
        severity: "warn",
        eventType: record.eventType,
        actorKey,
        threshold,
        observed: current?.count || threshold,
        windowSeconds: env.SECURITY_ALERT_WINDOW_SECONDS,
        traceId: record.traceId,
      });
    }
  }

  return alerts;
}

async function postSiemRecord(recordType: "audit" | "alert", payload: Record<string, unknown>) {
  if (!hasSiemExportConfigured()) return;

  const abortController = new AbortController();
  const timeout = setTimeout(() => abortController.abort(), env.SECURITY_SIEM_TIMEOUT_MS);

  try {
    await fetch(env.SECURITY_SIEM_EXPORT_URL, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(env.SECURITY_SIEM_AUTH_TOKEN
          ? { authorization: `Bearer ${env.SECURITY_SIEM_AUTH_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        source: "complicore-security-audit",
        recordType,
        payload,
      }),
      signal: abortController.signal,
    });
  } catch {
    // SIEM delivery is best-effort and should not affect request handling.
  } finally {
    clearTimeout(timeout);
  }
}

export async function appendSecurityAuditEvent(event: SecurityAuditEvent) {
  const auditLogPath = resolveLogPath();

  writeQueue = writeQueue
    .then(async () => {
      const payload = {
        ts: new Date().toISOString(),
        eventType: event.eventType,
        severity: event.severity || "info",
        actorUserId: event.actorUserId || null,
        actorEmail: event.actorEmail || null,
        ip: event.ip || null,
        traceId: event.traceId || null,
        details: event.details || {},
      };
      const prevHash = lastHash || GENESIS_HASH;
      const hash = hashEvent(payload, prevHash);

      const record: SecurityAuditRecord = {
        ...payload,
        prevHash,
        hash,
      };

      if (auditLogPath) {
        await fs.mkdir(path.dirname(auditLogPath), { recursive: true });
        await fs.appendFile(auditLogPath, `${JSON.stringify(record)}\n`, "utf8");
      }

      lastHash = hash;
      await postSiemRecord("audit", record);

      const alerts = evaluateAlertRules(record);
      for (const alert of alerts) {
        await postSiemRecord("alert", alert);
      }
    })
    .catch(() => {
      // Keep security telemetry best-effort and avoid crashing request handlers.
    });

  await writeQueue;
}

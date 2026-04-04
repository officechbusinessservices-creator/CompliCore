import { FastifyInstance } from "fastify";
import { z } from "zod";
import { createHash } from "crypto";

type SentryEventInput = z.infer<typeof sentryEventSchema>;

const mintSimulationSchema = z.object({
  assetId: z.string().min(3),
  amount: z.number().int().positive(),
  partition: z.string().min(3),
  issuerDid: z.string().min(8),
});

const ssiHandshakeSchema = z.object({
  userId: z.string().min(3),
  walletProvider: z.enum(["apple", "google", "ledger", "custom"]),
  jurisdiction: z.string().min(2),
  requestedCredentialType: z.string().min(3),
});

const tradeSimulationSchema = z.object({
  assetId: z.string().min(3),
  partitionId: z.number().int().positive(),
  buyerDid: z.string().min(8),
  amount: z.number().int().positive(),
  ssiVoucherValid: z.boolean(),
  isSgResident: z.boolean(),
  investorCredentialType: z.enum(["StandardInvestor", "InstitutionalEntity"]).default("StandardInvestor"),
  currentUnits: z.number().int().nonnegative().default(0),
});

const whitelistAddSchema = z.object({
  userDid: z.string().min(8),
  tier: z.enum(["ACCREDITED", "INSTITUTIONAL"]),
  quota: z.number().int().positive().max(100),
  memberId: z.string().min(3),
});

const whitelistVerifySchema = z.object({
  userDid: z.string().min(8),
  memberId: z.string().min(3),
});

const revenueDepositSchema = z.object({
  assetId: z.number().int().positive(),
  amount: z.number().int().positive(),
  currency: z.enum(["USDC", "SGD"]),
});

const revenueDistributeSchema = z.object({
  assetId: z.number().int().positive(),
  snapshotHolders: z
    .array(
      z.object({
        holderDid: z.string().min(8),
        units: z.number().int().nonnegative(),
      }),
    )
    .min(1),
});

const manifestoSendSchema = z.object({
  recipients: z.array(z.string().email()).min(1).max(100),
  allocationWindowHours: z.number().int().positive().max(72).default(48),
});

const sentryEventSchema = z.object({
  eventId: z.string().min(4),
  action: z.enum(["SSI_HANDSHAKE", "IDENTITY_VERIFIED", "MINT_COMMITTED", "ONBOARDING_ACTIVE"]),
  status: z.enum(["PENDING", "SUCCESS", "COMMITTED", "ACTIVE", "FAILED"]),
  userRef: z.string().min(3),
  didHash: z.string().min(8).optional(),
  unitsClaimed: z.number().int().nonnegative().optional(),
  investorCredentialType: z.enum(["StandardInvestor", "InstitutionalEntity"]).optional(),
  dataResidency: z.enum(["APAC", "EU", "US"]).optional(),
  latencyMs: z.number().int().nonnegative().optional(),
});

const whalePauseSchema = z.object({
  didHash: z.string().min(8),
  mode: z.enum(["LOCK", "UNLOCK"]),
  reason: z.string().min(3).max(240).default("fair_distribution_control"),
});

const ccp302TriggerSchema = z.object({
  force: z.boolean().default(false),
  operatorNote: z.string().min(3).max(240).optional(),
});

const finalSettlementSchema = z.object({
  assetId: z.string().min(3).default("SG-COMM-MBFC-001"),
  settlementAmountUsd: z.number().int().positive().default(1000000),
  unitCount: z.number().int().positive().default(1000),
  settlementRail: z.enum(["wCBDC", "tUSD"]).default("wCBDC"),
  custodyVault: z.string().min(3).default("Sovereign Custody Vault"),
  legalMirror: z.boolean().default(true),
});

const capitalCallInitiateSchema = z.object({
  targetAmountUsd: z.number().int().positive().default(4000000),
  fundingWindowHours: z.number().int().positive().max(168).default(48),
  settlementAsset: z.enum(["wCBDC", "tUSD"]).default("wCBDC"),
});

const capitalCallPartnerUpdateSchema = z.object({
  partnerId: z.enum(["ANCHOR_A", "ANCHOR_B", "ANCHOR_C"]),
  status: z.enum(["PENDING", "SIGNED", "FUNDED", "FAILED"]),
  receivedAmountUsd: z.number().int().nonnegative().default(0),
  verification: z.string().min(3).max(120).optional(),
  note: z.string().min(3).max(240).optional(),
});

const privateCapitalUpdateSchema = z.object({
  partnerId: z.enum(["ANCHOR_C"]).default("ANCHOR_C"),
});

type WhitelistEntry = {
  userDid: string;
  tier: "ACCREDITED" | "INSTITUTIONAL";
  quota: number;
  memberIdHash: string;
  createdAt: string;
};

const whitelistRegistry = new Map<string, WhitelistEntry>();
const sbmBlockedIps = new Map<string, number>();
const revenuePools = new Map<number, number>();
const TOTAL_MINTED_UNITS = 1000;
const WHALE_THRESHOLD_UNITS = 150;
const RETAIL_OWNERSHIP_CAP_UNITS = Math.floor((TOTAL_MINTED_UNITS * 20) / 100);
const CCP_302_TARGET_UNITS = 5000;
const holdingsByDid = new Map<string, number>();
const pausedMintDids = new Set<string>();
let ccp302AutoTriggeredAt: string | null = null;
let finalSettlementRecord: {
  settlementId: string;
  assetId: string;
  settlementAmountUsd: number;
  unitCount: number;
  settlementRail: "wCBDC" | "tUSD";
  custodyVault: string;
  legalMirror: boolean;
  systemState: "SOVEREIGN_EXPANSION_ACTIVE";
  settledAt: string;
} | null = null;
let retailMintingClosed = false;
let techHubAlphaMintedAt: string | null = null;
let capitalCallState: {
  targetAmountUsd: number;
  raisedAmountUsd: number;
  fundingWindowHours: number;
  settlementAsset: "wCBDC" | "tUSD";
  startedAt: string;
  closesAt: string;
  status: "ACTIVE" | "CLOSED";
} | null = null;
const capitalCallPartners = new Map<
  string,
  {
    partnerId: "ANCHOR_A" | "ANCHOR_B" | "ANCHOR_C";
    partnerName: string;
    commitmentUsd: number;
    status: "PENDING" | "SIGNED" | "FUNDED" | "FAILED";
    verification: string;
    receivedAmountUsd: number;
    updatedAt: string;
    note?: string;
  }
>([
  [
    "ANCHOR_A",
    {
      partnerId: "ANCHOR_A",
      partnerName: "Anchor A (Family Office)",
      commitmentUsd: 1500000,
      status: "PENDING",
      verification: "Signature Requested",
      receivedAmountUsd: 0,
      updatedAt: new Date().toISOString(),
    },
  ],
  [
    "ANCHOR_B",
    {
      partnerId: "ANCHOR_B",
      partnerName: "Anchor B (REIT)",
      commitmentUsd: 1000000,
      status: "PENDING",
      verification: "Awaiting iSSI Handshake",
      receivedAmountUsd: 0,
      updatedAt: new Date().toISOString(),
    },
  ],
  [
    "ANCHOR_C",
    {
      partnerId: "ANCHOR_C",
      partnerName: "Anchor C (Global Fund)",
      commitmentUsd: 1500000,
      status: "PENDING",
      verification: "Internal Audit Review",
      receivedAmountUsd: 0,
      updatedAt: new Date().toISOString(),
    },
  ],
]);
const whaleAlerts: Array<{
  alertId: string;
  didHash: string;
  units: number;
  allocationPct: number;
  institutionalTier: string;
  terminalFlash: "AMBER";
  detectedAt: string;
}> = [];
const sentryEvents: Array<{
  eventId: string;
  timeUtc: string;
  action: "SSI_HANDSHAKE" | "IDENTITY_VERIFIED" | "MINT_COMMITTED" | "ONBOARDING_ACTIVE";
  status: "PENDING" | "SUCCESS" | "COMMITTED" | "ACTIVE" | "FAILED";
  userRef: string;
  didHash?: string;
  unitsClaimed?: number;
  allocationPct?: number;
  investorCredentialType?: "StandardInvestor" | "InstitutionalEntity";
  dataResidency?: "APAC" | "EU" | "US";
  latencyMs?: number;
}> = [
  {
    eventId: "SSI-7741",
    timeUtc: new Date().toISOString(),
    action: "SSI_HANDSHAKE",
    status: "PENDING",
    userRef: "User #001",
  },
  {
    eventId: "SSI-7741",
    timeUtc: new Date().toISOString(),
    action: "IDENTITY_VERIFIED",
    status: "SUCCESS",
    userRef: "User #001",
    didHash: "did:cc:0x4f...a1",
    unitsClaimed: 20,
    allocationPct: 2,
    dataResidency: "APAC",
    latencyMs: 42,
  },
];

export default async function economicRoutes(fastify: FastifyInstance) {
  const requireGovernanceRole = async (request: any, reply: any) => {
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(request, reply, ["admin", "enterprise", "corporate"]);
      if (reply.sent) return false;
      if (res) return false;
    }
    return true;
  };

  const requireOpsRole = async (request: any, reply: any) => {
    const guard = (fastify as any).requireRole;
    if (guard) {
      const res = await guard(request, reply, ["admin", "enterprise", "corporate", "host"]);
      if (reply.sent) return false;
      if (res) return false;
    }
    return true;
  };

  const hashMemberId = (memberId: string) => createHash("sha256").update(memberId).digest("hex");
  const getRequestIp = (request: any) => {
    const forwarded = request.headers?.["x-forwarded-for"];
    if (typeof forwarded === "string" && forwarded.length > 0) {
      return forwarded.split(",")[0].trim();
    }
    return request.ip || request.socket?.remoteAddress || "unknown";
  };

  const getInstitutionalTier = (units: number) => {
    if (units >= 250) return "SOVEREIGN";
    if (units >= WHALE_THRESHOLD_UNITS) return "STRATEGIC";
    if (units >= 50) return "INSTITUTIONAL";
    return "ACCREDITED";
  };

  const classifyOwnershipSignal = (units: number, isInstitutional: boolean) => {
    if (isInstitutional && units >= 200) return { entityType: "Institutional Anchor", alertLevel: "INFO" };
    if (!isInstitutional && units >= Math.floor(RETAIL_OWNERSHIP_CAP_UNITS * 0.975)) {
      return { entityType: "Retail Whale", alertLevel: "WARNING" };
    }
    return { entityType: isInstitutional ? "Institutional" : "Retail", alertLevel: "INFO" };
  };

  const ccp302DraftManifest = {
    protocol: "CCP-302",
    status: "DRAFT",
    expansionTargetUsd: 5000000,
    totalUnits: CCP_302_TARGET_UNITS,
    jurisdiction: "Dual-Sync (Singapore MAS / US GENIUS Act)",
    assets: [
      { assetId: "SG-COMM-MBFC-001", valuationUsd: 1000000, class: "Commercial Real Estate" },
      { assetId: "US-TECH-AUSTIN-ALPHA", valuationUsd: 2500000, class: "Tech Hub" },
      { assetId: "SG-LOGI-CHANGI-B", valuationUsd: 1500000, class: "Logistics" },
    ],
    upgrades: ["rPoR-24h", "iSSI-fast-track", "atomic-yield-swaps"],
  };

  const getAllocatedUnits = () => Array.from(holdingsByDid.values()).reduce((acc, units) => acc + units, 0);
  const formatUsd = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const buildGenesisSelloutReport = () => {
    const allocatedUnits = getAllocatedUnits();
    const allocationPct = Number(((allocatedUnits / TOTAL_MINTED_UNITS) * 100).toFixed(2));

    const didTypeByLatestEvent = new Map<string, "StandardInvestor" | "InstitutionalEntity">();
    sentryEvents.forEach((event) => {
      if (event.didHash && event.investorCredentialType) {
        didTypeByLatestEvent.set(event.didHash, event.investorCredentialType);
      }
    });

    let institutionalUnits = 0;
    let retailWhaleUnits = 0;
    let standardRetailUnits = 0;
    let institutionalAnchors = 0;
    let retailWhales = 0;
    let standardRetail = 0;

    holdingsByDid.forEach((units, didHash) => {
      const investorType = didTypeByLatestEvent.get(didHash) ?? "StandardInvestor";
      if (investorType === "InstitutionalEntity") {
        institutionalUnits += units;
        institutionalAnchors += 1;
        return;
      }

      if (units >= 50) {
        retailWhaleUnits += units;
        retailWhales += 1;
      } else {
        standardRetailUnits += units;
        standardRetail += 1;
      }
    });

    return {
      protocol: "CCP-201",
      assetId: "SG-COMM-MBFC-001",
      pilot: {
        valuationUsd: 1000000,
        totalUnits: TOTAL_MINTED_UNITS,
        allocatedUnits,
        allocationPct,
        status: allocatedUnits >= TOTAL_MINTED_UNITS ? "SOLD_OUT" : "IN_PROGRESS",
      },
      allocationSummary: {
        institutionalAnchors: { entities: institutionalAnchors, units: institutionalUnits },
        retailWhales: { entities: retailWhales, units: retailWhaleUnits },
        standardRetail: { entities: standardRetail, units: standardRetailUnits },
      },
      compliance: {
        integrity: "99.99%",
        retailOwnershipCapUnits: RETAIL_OWNERSHIP_CAP_UNITS,
        blockedCapViolations: sentryEvents.filter(
          (e) =>
            e.action === "MINT_COMMITTED" &&
            e.status === "FAILED" &&
            e.investorCredentialType !== "InstitutionalEntity",
        ).length,
      },
      generatedAt: new Date().toISOString(),
    };
  };

  fastify.get("/economic/activation/status", async () => {
    return {
      phase: "economic-activation",
      rwaBridge: "active-simulation",
      ssiFramework: "integrating",
      compliance: "enforced-ccp201",
      updatedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/rwa/mint-simulation", async (request, reply) => {
    const ok = await requireGovernanceRole(request, reply);
    if (!ok) return;

    const parsed = mintSimulationSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_mint_payload",
        details: parsed.error.flatten(),
      });
    }

    const { assetId, amount, partition, issuerDid } = parsed.data;
    const command = `docker exec app ccp-rwa-mint --asset ${assetId} --amount ${amount} --partition \"${partition}\"`;

    return {
      status: "processed_simulation",
      protocol: "ERC-7518",
      assetId,
      amount,
      partition,
      issuerDid,
      commandPreview: command,
      note: "Simulation only. Wire this route to your mint service for production execution.",
      processedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/ssi/onboarding-simulation", async (request, reply) => {
    const parsed = ssiHandshakeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_ssi_payload",
        details: parsed.error.flatten(),
      });
    }

    const { userId, walletProvider, jurisdiction, requestedCredentialType } = parsed.data;

    return {
      userId,
      walletProvider,
      handshake: "accepted",
      selectiveDisclosure: {
        jurisdiction,
        credentialType: requestedCredentialType,
        zkProof: "verified_simulation",
      },
      onboardingFrictionSeconds: 8.2,
      privacyMode: "zero-knowledge",
      processedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/rwa/trade-simulation", async (request, reply) => {
    const parsed = tradeSimulationSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_trade_payload",
        details: parsed.error.flatten(),
      });
    }

    const {
      partitionId,
      ssiVoucherValid,
      isSgResident,
      buyerDid,
      amount,
      assetId,
      investorCredentialType,
      currentUnits,
    } = parsed.data;

    const SG_ACCREDITED_PARTITION = 1;
    const isInstitutional = investorCredentialType === "InstitutionalEntity";
    const jurisdictionPass = partitionId === SG_ACCREDITED_PARTITION ? isSgResident : true;
    const capPass = isInstitutional || currentUnits + amount <= RETAIL_OWNERSHIP_CAP_UNITS;
    const allowed = ssiVoucherValid && jurisdictionPass && capPass;

    return {
      protocol: "ERC-7518",
      assetId,
      buyerDid,
      amount,
      partitionId,
      autoVerifier: {
        ssiVoucherValid,
        jurisdictionCheck: jurisdictionPass,
        investorCredentialType,
        ownership: {
          retailCapUnits: RETAIL_OWNERSHIP_CAP_UNITS,
          currentUnits,
          requestedUnits: amount,
          projectedUnits: currentUnits + amount,
          decision: capPass ? "pass" : "block",
          reason: capPass ? "within_cap_or_institutional" : "Exceeds 20% Individual Ownership Cap",
        },
        decision: allowed ? "allow" : "deny",
      },
      ccp201: {
        active: true,
        reasonCode: allowed ? "policy_pass" : capPass ? "policy_block" : "retail_ownership_cap_exceeded",
      },
      processedAt: new Date().toISOString(),
    };
  });

  fastify.get("/economic/portal/onboarding-config", async () => {
    return {
      mode: "gatekeeper",
      rollout: "staged",
      portalUrl: "https://portal.complicore.io/onboarding/2026-gen-1",
      whitelistSlots: 100,
      activeWhitelistCount: whitelistRegistry.size,
      sbm: {
        botSnipingProtection: true,
        geoFenceOnViolationHours: 24,
      },
      updatedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/portal/whitelist/add", async (request, reply) => {
    const ok = await requireGovernanceRole(request, reply);
    if (!ok) return;

    const parsed = whitelistAddSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_whitelist_add_payload",
        details: parsed.error.flatten(),
      });
    }

    const { userDid, tier, quota, memberId } = parsed.data;
    if (whitelistRegistry.size >= 100 && !whitelistRegistry.has(userDid)) {
      return reply.status(409).send({ error: "whitelist_capacity_reached" });
    }

    const entry: WhitelistEntry = {
      userDid,
      tier,
      quota,
      memberIdHash: hashMemberId(memberId),
      createdAt: new Date().toISOString(),
    };

    whitelistRegistry.set(userDid, entry);

    return {
      status: "whitelisted",
      userDid,
      tier,
      quota,
      activeWhitelistCount: whitelistRegistry.size,
      commandPreview: `docker exec app ccp-whitelist --add ${userDid} --quota ${quota} --tier ${tier}`,
      processedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/portal/whitelist/verify", async (request, reply) => {
    const ip = getRequestIp(request);
    const blockedUntil = sbmBlockedIps.get(ip);
    if (blockedUntil && blockedUntil > Date.now()) {
      return reply.status(423).send({
        error: "sbm_geofence_lock",
        retryAt: new Date(blockedUntil).toISOString(),
      });
    }

    const parsed = whitelistVerifySchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_whitelist_verify_payload",
        details: parsed.error.flatten(),
      });
    }

    const { userDid, memberId } = parsed.data;
    const entry = whitelistRegistry.get(userDid);
    const approved = Boolean(entry && entry.memberIdHash === hashMemberId(memberId));

    if (!approved) {
      sbmBlockedIps.set(ip, Date.now() + 24 * 60 * 60 * 1000);
      return reply.status(403).send({
        status: "denied",
        reason: "not_whitelisted",
        sbm: {
          ip,
          lockHours: 24,
        },
      });
    }

    return {
      status: "approved",
      userDid,
      tier: entry?.tier,
      quota: entry?.quota,
      onboardingFlow: "ssi-enabled",
      processedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/revenue/deposit-rent", async (request, reply) => {
    const ok = await requireOpsRole(request, reply);
    if (!ok) return;

    const parsed = revenueDepositSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_revenue_deposit_payload",
        details: parsed.error.flatten(),
      });
    }

    const { assetId, amount, currency } = parsed.data;
    const current = revenuePools.get(assetId) ?? 0;
    const next = current + amount;
    revenuePools.set(assetId, next);

    return {
      status: "rent_received",
      assetId,
      currency,
      depositedAmount: amount,
      revenuePool: next,
      processedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/revenue/distribute-yield", async (request, reply) => {
    const ok = await requireGovernanceRole(request, reply);
    if (!ok) return;

    const parsed = revenueDistributeSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_revenue_distribution_payload",
        details: parsed.error.flatten(),
      });
    }

    const { assetId, snapshotHolders } = parsed.data;
    const totalPool = revenuePools.get(assetId) ?? 0;
    if (totalPool <= 0) {
      return reply.status(409).send({ error: "empty_revenue_pool" });
    }

    const totalUnits = snapshotHolders.reduce((acc, holder) => acc + holder.units, 0);
    if (totalUnits <= 0) {
      return reply.status(400).send({ error: "invalid_snapshot_units" });
    }

    const payouts = snapshotHolders.map((holder) => ({
      holderDid: holder.holderDid,
      units: holder.units,
      payout: Math.floor((totalPool * holder.units) / totalUnits),
    }));

    revenuePools.set(assetId, 0);

    return {
      status: "distribution_completed",
      mode: "atomic_snapshot_simulation",
      assetId,
      totalPool,
      totalHolders: snapshotHolders.length,
      payouts,
      processedAt: new Date().toISOString(),
    };
  });

  fastify.get("/economic/revenue/pool/:assetId", async (request) => {
    const params = request.params as { assetId: string };
    const assetId = Number(params.assetId);

    return {
      assetId,
      revenuePool: Number.isNaN(assetId) ? 0 : revenuePools.get(assetId) ?? 0,
      updatedAt: new Date().toISOString(),
    };
  });

  fastify.get("/economic/portal/manifesto/template", async () => {
    return {
      subject: "Welcome to the Sovereign Era: Your MBFC-001 Allocation is Ready",
      recipientGroup: "Whitelist Gen-1 (100 Users)",
      body: [
        "Distinguished Investor,",
        "You are receiving this because you have been cryptographically whitelisted as one of the first 100 participants in the CompliCore Sovereign Ledger.",
        "By utilizing the CCP-201 Jurisdictional Protocol, we have successfully tokenized a S$1.0M commercial asset in Singapore’s Marina Bay Financial Centre.",
        "Next Steps: 1) Claim identity at portal 2) Verify ZK accredited credential 3) Secure reserved fraction within 48 hours.",
        "Welcome to the bridge. The future is Sovereign.",
      ],
      portalUrl: "https://portal.complicore.io/onboarding/2026-gen-1",
      generatedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/portal/manifesto/send-simulation", async (request, reply) => {
    const ok = await requireGovernanceRole(request, reply);
    if (!ok) return;

    const parsed = manifestoSendSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_manifesto_payload",
        details: parsed.error.flatten(),
      });
    }

    const { recipients, allocationWindowHours } = parsed.data;
    return {
      status: "queued_simulation",
      campaign: "Whitelist Welcome Manifesto",
      recipients: recipients.length,
      allocationWindowHours,
      protocol: "CCP-201 + SSI",
      note: "Simulation only. Integrate with ESP provider for live delivery.",
      processedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/sentry/events", async (request, reply) => {
    const ok = await requireOpsRole(request, reply);
    if (!ok) return;

    const parsed = sentryEventSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_sentry_event_payload",
        details: parsed.error.flatten(),
      });
    }

    const event: SentryEventInput & { timeUtc: string; allocationPct?: number } = {
      ...parsed.data,
      timeUtc: new Date().toISOString(),
    };

    if (
      event.action === "MINT_COMMITTED" &&
      event.status === "COMMITTED" &&
      event.didHash &&
      typeof event.unitsClaimed === "number"
    ) {
      const isInstitutional = event.investorCredentialType === "InstitutionalEntity";

      if (retailMintingClosed && !isInstitutional) {
        sentryEvents.unshift({
          ...event,
          status: "FAILED",
          timeUtc: new Date().toISOString(),
        });
        return reply.status(423).send({
          status: "blocked",
          reason: "retail_minting_closed_post_settlement",
        });
      }

      if (pausedMintDids.has(event.didHash)) {
        return reply.status(423).send({
          error: "mint_paused_for_did",
          didHash: event.didHash,
        });
      }

      const nextUnits = (holdingsByDid.get(event.didHash) ?? 0) + event.unitsClaimed;

      if (!isInstitutional && nextUnits > RETAIL_OWNERSHIP_CAP_UNITS) {
        sentryEvents.unshift({
          ...event,
          status: "FAILED",
          timeUtc: new Date().toISOString(),
        });
        return reply.status(409).send({
          status: "blocked",
          reason: "Exceeds 20% Individual Ownership Cap",
          didHash: event.didHash,
          currentUnits: holdingsByDid.get(event.didHash) ?? 0,
          attemptedUnits: event.unitsClaimed,
          capUnits: RETAIL_OWNERSHIP_CAP_UNITS,
        });
      }

      holdingsByDid.set(event.didHash, nextUnits);

      event.allocationPct = Number(((nextUnits / TOTAL_MINTED_UNITS) * 100).toFixed(2));
      classifyOwnershipSignal(nextUnits, isInstitutional);

      const alreadyAlerted = whaleAlerts.some((a) => a.didHash === event.didHash);
      if (nextUnits >= WHALE_THRESHOLD_UNITS && !alreadyAlerted) {
        whaleAlerts.unshift({
          alertId: `WHALE-${Date.now()}`,
          didHash: event.didHash,
          units: nextUnits,
          allocationPct: event.allocationPct,
          institutionalTier: getInstitutionalTier(nextUnits),
          terminalFlash: "AMBER",
          detectedAt: new Date().toISOString(),
        });
      }
    }

    sentryEvents.unshift(event);

    return {
      status: "ingested",
      eventId: parsed.data.eventId,
      queueDepth: sentryEvents.length,
      whaleThresholdUnits: WHALE_THRESHOLD_UNITS,
      retailCapUnits: RETAIL_OWNERSHIP_CAP_UNITS,
      processedAt: new Date().toISOString(),
    };
  });

  fastify.get("/economic/sentry/events", async (request) => {
    const query = request.query as { limit?: string };
    const limit = Math.min(100, Math.max(1, Number(query.limit || "10")));
    return {
      data: sentryEvents.slice(0, limit),
      count: Math.min(limit, sentryEvents.length),
      generatedAt: new Date().toISOString(),
    };
  });

  fastify.get("/economic/sentry/first-ten", async () => {
    const verifiedUsers = new Set(
      sentryEvents
        .filter((e) => e.action === "IDENTITY_VERIFIED" && e.status === "SUCCESS")
        .map((e) => e.userRef),
    );

    const apacCoverage = sentryEvents
      .filter((e) => e.action === "IDENTITY_VERIFIED" && e.status === "SUCCESS")
      .every((e) => e.dataResidency === "APAC");

    const latencies = sentryEvents
      .map((e) => e.latencyMs)
      .filter((v): v is number => typeof v === "number");
    const avgLatencyMs = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;

    return {
      progress: {
        onboarded: Math.min(10, verifiedUsers.size),
        target: 10,
      },
      dataResidency: {
        expected: "APAC",
        compliant: apacCoverage,
      },
      systemIntegrity: "99.99%",
      latencyMs: avgLatencyMs,
      status: verifiedUsers.size >= 10 ? "REVENUE_DISTRIBUTION_READY" : "ONBOARDING_ACTIVE",
      generatedAt: new Date().toISOString(),
    };
  });

  fastify.get("/economic/whale/status", async () => {
    const watchlist = Array.from(holdingsByDid.entries())
      .map(([didHash, units]) => ({
        didHash,
        units,
        allocationPct: Number(((units / TOTAL_MINTED_UNITS) * 100).toFixed(2)),
        state:
          units >= WHALE_THRESHOLD_UNITS
            ? "WHALE_DETECTED"
            : units >= WHALE_THRESHOLD_UNITS - 5
              ? "WATCH"
              : "NORMAL",
      }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 20);

    return {
      active: true,
      cluster: "APAC",
      thresholdUnits: WHALE_THRESHOLD_UNITS,
      retailCapUnits: RETAIL_OWNERSHIP_CAP_UNITS,
      totalMintedUnits: TOTAL_MINTED_UNITS,
      alerts: whaleAlerts.slice(0, 10),
      pausedDidCount: pausedMintDids.size,
      watchlist,
      generatedAt: new Date().toISOString(),
    };
  });

  fastify.get("/economic/governance/genesis-sellout-report", async () => {
    const report = buildGenesisSelloutReport();
    return {
      ...report,
      finalSettlement: finalSettlementRecord,
      ccp302AutoTriggered: Boolean(ccp302AutoTriggeredAt),
      ccp302AutoTriggeredAt,
    };
  });

  fastify.get("/economic/settlement/status", async () => {
    return {
      finalSettlementRecord,
      retailMintingClosed,
      tvvUsd: finalSettlementRecord?.settlementAmountUsd ?? 0,
      systemState: finalSettlementRecord?.systemState ?? "PILOT_ACTIVE",
      generatedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/settlement/execute-final", async (request, reply) => {
    const ok = await requireGovernanceRole(request, reply);
    if (!ok) return;

    const parsed = finalSettlementSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_final_settlement_payload",
        details: parsed.error.flatten(),
      });
    }

    const settlementId = `SETTLE-${Date.now()}`;
    finalSettlementRecord = {
      settlementId,
      assetId: parsed.data.assetId,
      settlementAmountUsd: parsed.data.settlementAmountUsd,
      unitCount: parsed.data.unitCount,
      settlementRail: parsed.data.settlementRail,
      custodyVault: parsed.data.custodyVault,
      legalMirror: parsed.data.legalMirror,
      systemState: "SOVEREIGN_EXPANSION_ACTIVE",
      settledAt: new Date().toISOString(),
    };
    retailMintingClosed = true;

    return {
      status: "settled",
      settlement: finalSettlementRecord,
      dVp: {
        mode: "atomic",
        tokenLock: "did_bound",
        legalMirror: parsed.data.legalMirror,
      },
      revenueAnchor: "primed",
      note: "Retail minting is now closed for MBFC-001. New liquidity routes to MAV.",
    };
  });

  fastify.post("/economic/governance/ccp302/auto-trigger", async (request, reply) => {
    const ok = await requireGovernanceRole(request, reply);
    if (!ok) return;

    const parsed = ccp302TriggerSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_ccp302_trigger_payload",
        details: parsed.error.flatten(),
      });
    }

    const report = buildGenesisSelloutReport();
    const soldOut = report.pilot.allocatedUnits >= TOTAL_MINTED_UNITS;
    const shouldTrigger = parsed.data.force || soldOut;

    if (!shouldTrigger) {
      return reply.status(409).send({
        status: "not_triggered",
        reason: "pilot_not_sold_out",
        pilot: report.pilot,
      });
    }

    if (!ccp302AutoTriggeredAt) {
      ccp302AutoTriggeredAt = new Date().toISOString();
    }

    return {
      status: "triggered",
      triggerMode: parsed.data.force ? "manual_force" : "sellout_auto",
      ccp302AutoTriggeredAt,
      operatorNote: parsed.data.operatorNote,
      proposal: ccp302DraftManifest,
      genesisSelloutReport: report,
    };
  });

  fastify.post("/economic/governance/capital-call/initiate", async (request, reply) => {
    const ok = await requireGovernanceRole(request, reply);
    if (!ok) return;

    if (!finalSettlementRecord) {
      return reply.status(409).send({
        status: "blocked",
        reason: "final_settlement_required",
      });
    }

    const parsed = capitalCallInitiateSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_capital_call_payload",
        details: parsed.error.flatten(),
      });
    }

    const startedAt = new Date();
    const closesAt = new Date(startedAt.getTime() + parsed.data.fundingWindowHours * 3600 * 1000);
    capitalCallState = {
      targetAmountUsd: parsed.data.targetAmountUsd,
      raisedAmountUsd: 0,
      fundingWindowHours: parsed.data.fundingWindowHours,
      settlementAsset: parsed.data.settlementAsset,
      startedAt: startedAt.toISOString(),
      closesAt: closesAt.toISOString(),
      status: "ACTIVE",
    };

    return {
      status: "capital_call_active",
      capitalCall: capitalCallState,
      partners: Array.from(capitalCallPartners.values()),
      systemState: "Sovereign Expansion Active",
    };
  });

  fastify.post("/economic/governance/capital-call/partner-update", async (request, reply) => {
    const ok = await requireGovernanceRole(request, reply);
    if (!ok) return;

    if (!capitalCallState || capitalCallState.status !== "ACTIVE") {
      return reply.status(409).send({
        status: "blocked",
        reason: "capital_call_not_active",
      });
    }

    const parsed = capitalCallPartnerUpdateSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_capital_call_partner_payload",
        details: parsed.error.flatten(),
      });
    }

    const partner = capitalCallPartners.get(parsed.data.partnerId);
    if (!partner) {
      return reply.status(404).send({ error: "partner_not_found" });
    }

    partner.status = parsed.data.status;
    partner.verification = parsed.data.verification ?? partner.verification;
    partner.note = parsed.data.note;
    partner.receivedAmountUsd = parsed.data.receivedAmountUsd;
    partner.updatedAt = new Date().toISOString();

    const raisedAmountUsd = Array.from(capitalCallPartners.values()).reduce((acc, p) => acc + p.receivedAmountUsd, 0);
    capitalCallState.raisedAmountUsd = raisedAmountUsd;

    if (!techHubAlphaMintedAt && raisedAmountUsd >= 1000000) {
      techHubAlphaMintedAt = new Date().toISOString();
    }

    if (raisedAmountUsd >= capitalCallState.targetAmountUsd) {
      capitalCallState.status = "CLOSED";
    }

    return {
      status: "updated",
      partner,
      capitalCall: {
        ...capitalCallState,
        progressPct: Number(((capitalCallState.raisedAmountUsd / capitalCallState.targetAmountUsd) * 100).toFixed(2)),
      },
      autoMint: {
        techHubAlphaMinted: Boolean(techHubAlphaMintedAt),
        mintedAt: techHubAlphaMintedAt,
      },
    };
  });

  fastify.get("/economic/governance/capital-call/status", async () => {
    const raised = capitalCallState?.raisedAmountUsd ?? 0;
    const target = capitalCallState?.targetAmountUsd ?? 4000000;
    return {
      tvvUsd: finalSettlementRecord?.settlementAmountUsd ?? 0,
      capitalCall: {
        ...(capitalCallState ?? {
          targetAmountUsd: 4000000,
          raisedAmountUsd: 0,
          fundingWindowHours: 48,
          settlementAsset: "wCBDC",
          status: "INACTIVE",
        }),
        progressPct: Number(((raised / target) * 100).toFixed(2)),
      },
      partners: Array.from(capitalCallPartners.values()),
      rails: {
        monitored: true,
        firstMillionEvent: techHubAlphaMintedAt
          ? {
              status: "TECH_HUB_ALPHA_MINTED",
              mintedAt: techHubAlphaMintedAt,
            }
          : {
              status: "WAITING_FOR_FIRST_MILLION",
            },
      },
      generatedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/governance/capital-call/private-update", async (request, reply) => {
    const ok = await requireGovernanceRole(request, reply);
    if (!ok) return;

    const parsed = privateCapitalUpdateSchema.safeParse(request.body ?? {});
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_private_capital_update_payload",
        details: parsed.error.flatten(),
      });
    }

    const partner = capitalCallPartners.get(parsed.data.partnerId);
    if (!partner) {
      return reply.status(404).send({ error: "partner_not_found" });
    }

    const raisedUsd = capitalCallState?.raisedAmountUsd ?? 0;
    const expansionTargetUsd = capitalCallState?.targetAmountUsd ?? 4000000;
    const tvvUsd = finalSettlementRecord?.settlementAmountUsd ?? 1000000;
    const vaultTargetUsd = tvvUsd + expansionTargetUsd;
    const vaultCurrentUsd = tvvUsd + raisedUsd;
    const vaultProgressPct = Number(((vaultCurrentUsd / vaultTargetUsd) * 100).toFixed(2));
    const anchorA = capitalCallPartners.get("ANCHOR_A");
    const anchorB = capitalCallPartners.get("ANCHOR_B");

    return {
      status: "generated",
      recipient: partner.partnerName,
      subject: "Private Capital Update — rPoR Cleared, Final Wire Window Open",
      message: [
        `Anchor C Team, your recursive Proof-of-Reserve package has cleared and the capital call remains in active window${capitalCallState?.closesAt ? ` until ${capitalCallState.closesAt}` : ""}.`,
        `Current secured expansion capital is ${formatUsd(raisedUsd)} of ${formatUsd(expansionTargetUsd)} (${Number(((raisedUsd / expansionTargetUsd) * 100).toFixed(2))}%).`,
        `Vault composite stands at ${formatUsd(vaultCurrentUsd)} of ${formatUsd(vaultTargetUsd)} (${vaultProgressPct}%).`,
        `Please release your remaining ${formatUsd(Math.max(0, partner.commitmentUsd - partner.receivedAmountUsd))} institutional wire to finalize Genesis Yield Snapshot and unlock synchronized first distribution.`,
      ],
      snapshot: {
        tvvUsd,
        expansionTargetUsd,
        raisedUsd,
        remainingExpansionUsd: Math.max(0, expansionTargetUsd - raisedUsd),
        vaultTargetUsd,
        vaultCurrentUsd,
        vaultProgressPct,
        anchorAReceivedUsd: anchorA?.receivedAmountUsd ?? 0,
        anchorBReceivedUsd: anchorB?.receivedAmountUsd ?? 0,
        anchorCReceivedUsd: partner.receivedAmountUsd,
      },
      cta: {
        action: "INITIATE_FINAL_WIRE",
        settlementAsset: capitalCallState?.settlementAsset ?? "wCBDC",
        closesAt: capitalCallState?.closesAt,
      },
      generatedAt: new Date().toISOString(),
    };
  });

  fastify.post("/economic/whale/pause-mint", async (request, reply) => {
    const ok = await requireGovernanceRole(request, reply);
    if (!ok) return;

    const parsed = whalePauseSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({
        error: "invalid_whale_pause_payload",
        details: parsed.error.flatten(),
      });
    }

    const { didHash, mode, reason } = parsed.data;
    if (mode === "LOCK") pausedMintDids.add(didHash);
    if (mode === "UNLOCK") pausedMintDids.delete(didHash);

    return {
      status: "updated",
      didHash,
      mintState: pausedMintDids.has(didHash) ? "LOCKED" : "OPEN",
      reason,
      processedAt: new Date().toISOString(),
    };
  });
}

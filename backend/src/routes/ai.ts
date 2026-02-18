import { FastifyInstance } from "fastify";
import { ComplicoreIntent, ComplicoreOrchestrator } from "../lib/complicore-orchestrator";

type OrchestratorPayload = {
  prompt?: string;
  metadata?: {
    fileType?: string;
    url?: string;
  };
};

const serviceUrls = {
  agentic: process.env.AGENTIC_RAG_SERVICE_URL,
  corrective: process.env.CORRECTIVE_RAG_SERVICE_URL,
  firecrawl: process.env.FIRECRAWL_SERVICE_URL,
  ocr: process.env.OCR_SERVICE_URL,
  audio: process.env.AUDIO_SERVICE_URL,
  youtube: process.env.YOUTUBE_SERVICE_URL,
  finance: process.env.FINANCE_SERVICE_URL,
  news: process.env.NEWS_SERVICE_URL,
  reasoning: process.env.REASONING_SERVICE_URL,
};

function normalizeBaseUrl(baseUrl?: string) {
  if (!baseUrl) return undefined;
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

async function postJson(baseUrl: string | undefined, path: string, payload: unknown) {
  const normalized = normalizeBaseUrl(baseUrl);
  if (!normalized) {
    return { ok: false, error: "service_url_not_configured" };
  }

  try {
    const response = await fetch(`${normalized}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await response.text();
    return {
      ok: response.ok,
      status: response.status,
      body: text ? JSON.parse(text) : null,
    };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

async function routeToService(intent: ComplicoreIntent, payload: OrchestratorPayload) {
  const prompt = payload.prompt ?? "";
  const url = payload.metadata?.url ?? prompt;

  switch (intent) {
    case "rag_reasoning":
      return postJson(serviceUrls.agentic, "/query", { prompt });
    case "verification":
      return postJson(serviceUrls.corrective, "/query", { prompt });
    case "web_search":
    case "web_mining":
      return postJson(serviceUrls.firecrawl, "/crawl", { url, prompt });
    case "vision":
    case "math_ocr":
      return postJson(serviceUrls.ocr, "/ocr", { prompt, metadata: payload.metadata });
    case "audio":
      return postJson(serviceUrls.audio, "/transcribe", { prompt, metadata: payload.metadata });
    case "youtube_trends":
      return postJson(serviceUrls.youtube, "/analyze", { prompt, metadata: payload.metadata });
    case "finance":
      return postJson(serviceUrls.finance, "/analyze", { prompt, metadata: payload.metadata });
    case "news":
      return postJson(serviceUrls.news, "/generate", { prompt, metadata: payload.metadata });
    case "reasoning":
      return postJson(serviceUrls.reasoning, "/reason", { prompt, metadata: payload.metadata });
    default:
      return { ok: false, error: "service_not_wired" };
  }
}

export default async function aiRoutes(fastify: FastifyInstance) {
  const orchestrator = new ComplicoreOrchestrator();

  fastify.get("/ai/pricing/suggestions", async (request) => {
    const q = request.query as any;
    return {
      propertyId: q.propertyId || "demo-property",
      suggestions: [
        { date: q.startDate || new Date().toISOString().slice(0, 10), currentPrice: 150, suggestedPrice: 175, confidence: 0.76, factors: [] },
      ],
      aiDisclosure: { model: "demo-model", generatedAt: new Date().toISOString() },
    };
  });

  fastify.post("/ai/listing/optimize", async (request) => {
    const body = request.body as any;
    return {
      propertyId: body.propertyId,
      suggestions: {
        titles: [
          { text: "Modern Downtown Loft with Skyline Views", score: 0.92 },
        ],
        descriptionImprovements: [
          { section: "intro", suggestion: "Highlight proximity to attractions and transport." },
        ],
        photoOrder: [],
      },
      aiDisclosure: { model: "demo-model", confidence: 0.74 },
    };
  });

  fastify.post("/ai/orchestrate", async (request) => {
    const body = request.body as OrchestratorPayload;
    const decision = orchestrator.routeRequest(body.prompt ?? "", {
      fileType: body.metadata?.fileType as any,
    });
    const execution = await routeToService(decision.intent, body);
    return {
      decision,
      execution,
      aiDisclosure: { model: "routing-scaffold", generatedAt: new Date().toISOString() },
    };
  });
}

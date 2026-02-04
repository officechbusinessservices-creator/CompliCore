import { FastifyInstance } from "fastify";

export default async function aiRoutes(fastify: FastifyInstance) {
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
}

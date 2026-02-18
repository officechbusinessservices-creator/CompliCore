"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplicoreOrchestrator = void 0;
class ComplicoreOrchestrator {
    constructor() {
        this.toolMap = {
            vision: "llama-ocr",
            math_ocr: "LaTeX-OCR-with-Llama",
            audio: "chat-with-audios",
            web_search: "Website-to-API-with-FireCrawl",
            web_mining: "Website-to-API-with-FireCrawl",
            finance: "financial-analyst-deepseek",
            rag_reasoning: "agentic_rag_deepseek",
            reasoning: "DeepSeek-finetuning",
            verification: "corrective-rag",
            news: "ai_news_generator",
            youtube_trends: "Youtube-trend-analysis",
        };
    }
    routeRequest(input, metadata) {
        const normalized = input.toLowerCase();
        if (metadata?.fileType === "image") {
            if (normalized.includes("formula") || normalized.includes("equation")) {
                return this.buildDecision("math_ocr", "Detected formula-related image request.");
            }
            return this.buildDecision("vision", "Detected image request.");
        }
        if (metadata?.fileType === "audio") {
            return this.buildDecision("audio", "Detected audio request.");
        }
        if (normalized.includes("market") || normalized.includes("stock") || normalized.includes("finance")) {
            return this.buildDecision("finance", "Detected finance intent.");
        }
        if (normalized.includes("summarize news") || normalized.includes("news")) {
            return this.buildDecision("news", "Detected news intent.");
        }
        if (normalized.includes("youtube") || normalized.includes("trend")) {
            return this.buildDecision("youtube_trends", "Detected YouTube trend analysis intent.");
        }
        if (normalized.includes("browse") || normalized.includes("web")) {
            return this.buildDecision("web_mining", "Detected web mining intent.");
        }
        if (normalized.includes("verify") || normalized.includes("verification")) {
            return this.buildDecision("verification", "Detected verification intent.");
        }
        if (normalized.includes("thinking") || normalized.includes("logic")) {
            return this.buildDecision("reasoning", "Detected deep reasoning intent.");
        }
        return this.buildDecision("rag_reasoning", "Default to high-trust RAG reasoning.");
    }
    buildDecision(intent, reason) {
        return {
            intent,
            module: this.toolMap[intent],
            reason,
        };
    }
}
exports.ComplicoreOrchestrator = ComplicoreOrchestrator;

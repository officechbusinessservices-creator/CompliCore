"use client";

import { useState } from "react";

interface ExportButtonProps {
  className?: string;
}

export function ExportButton({ className = "" }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleExport = async (format: "pdf" | "markdown" | "json") => {
    setIsExporting(true);
    setShowDropdown(false);

    try {
      if (format === "markdown") {
        // Export all docs as markdown
        const docsContent = await generateMarkdownExport();
        downloadFile(docsContent, "rental-platform-architecture.md", "text/markdown");
      } else if (format === "json") {
        // Export API spec as JSON
        const jsonContent = await generateJSONExport();
        downloadFile(jsonContent, "openapi-spec.json", "application/json");
      } else if (format === "pdf") {
        // Trigger print dialog for PDF
        window.print();
      }
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-zinc-800 dark:bg-zinc-800 hover:bg-zinc-700 dark:hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50"
      >
        {isExporting ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
        <span>Export</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
            onKeyDown={(e) => e.key === 'Escape' && setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-20 overflow-hidden">
            <div className="p-2">
              <button
                type="button"
                onClick={() => handleExport("pdf")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">Export as PDF</p>
                  <p className="text-xs text-zinc-500">Print-ready document</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleExport("markdown")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">Export as Markdown</p>
                  <p className="text-xs text-zinc-500">All documentation files</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleExport("json")}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100">Export OpenAPI Spec</p>
                  <p className="text-xs text-zinc-500">JSON format for tools</p>
                </div>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

async function generateMarkdownExport(): Promise<string> {
  const content = `# Short-Term Rental Platform Architecture

## Executive Summary

A comprehensive, vendor-neutral architecture for a global short-term rental platform.

---

## 1. High-Level Architecture

### System Components

- **Client Layer**: Web App, Mobile PWA, Host Portal, Admin Dashboard
- **API Gateway**: Rate limiting, authentication, WAF protection
- **Service Layer**: Identity, Listings, Bookings, Payments, Messaging, Analytics
- **AI/ML Services**: Dynamic Pricing, Listing Optimizer, Guest Screening
- **Data Layer**: PostgreSQL, Redis, Elasticsearch, Object Storage

### Key Principles

- Privacy by Design (GDPR/CCPA compliant)
- Vendor Neutral (multi-cloud ready)
- AI with Guardrails (transparent, explainable)
- Security First (zero-trust, encryption everywhere)

---

## 2. MVP Features

### Core Capabilities

1. **Listing Management** - Property CRUD, photos, amenities
2. **Availability Calendar** - Date management, iCal sync
3. **Booking Engine** - Search, quote, reserve
4. **Payment Processing** - Guest payments, host payouts
5. **Communications** - In-app messaging, notifications
6. **Reviews** - Post-stay reviews with moderation

### User Roles

- **Guest**: Search, book, pay, review
- **Host**: List properties, manage calendar, receive payouts
- **Property Manager**: Multi-property management, team access
- **Admin**: Platform operations, moderation

---

## 3. AI Features

### Capabilities

1. **Dynamic Pricing**: Market-based price suggestions
2. **Listing Optimizer**: Title, description, photo optimization
3. **Smart Messaging**: Auto-replies, PII detection
4. **Guest Screening**: Risk assessment with ethical guardrails

### Guardrails

- Hard limits on pricing (floor/ceiling)
- Prohibited factors for screening (no discrimination)
- Transparency requirements (always show confidence)
- Human oversight for adverse decisions

---

## 4. Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js, TypeScript, Tailwind |
| Backend | Fastify, Node.js, TypeScript |
| Database | PostgreSQL, Redis, Elasticsearch |
| AI/ML | OpenAI/Anthropic, XGBoost |
| Infrastructure | Kubernetes, Docker |

---

## 5. Roadmap

| Phase | Duration | Focus |
|-------|----------|-------|
| Foundation | 8 weeks | Infrastructure, Auth |
| MVP | 12 weeks | Core Platform |
| Growth | 16 weeks | OTA Integration |
| Enterprise | 20 weeks | API, PM Tools |
| Platform | 16 weeks | Marketplace |

---

## 6. Risks

1. **GDPR/CCPA Non-Compliance** - Critical, mitigated by privacy-by-design
2. **Data Breach** - Critical, mitigated by encryption and security audits
3. **OTA API Dependency** - High, mitigated by iCal fallback
4. **Payment Gateway Failure** - High, mitigated by multi-gateway

---

Generated on ${new Date().toISOString().split("T")[0]}
`;

  return content;
}

async function generateJSONExport(): Promise<string> {
  const spec = {
    openapi: "3.1.0",
    info: {
      title: "Short-Term Rental Platform API",
      version: "1.0.0",
      description: "Vendor-neutral API for property managers, hosts, and guests.",
    },
    servers: [
      { url: "https://api.example.com/v1", description: "Production" },
      { url: "https://api-staging.example.com/v1", description: "Staging" },
    ],
    paths: {
      "/auth/register": {
        post: {
          summary: "Register new user",
          tags: ["Authentication"],
        },
      },
      "/auth/login": {
        post: {
          summary: "Authenticate user",
          tags: ["Authentication"],
        },
      },
      "/properties": {
        get: {
          summary: "Search properties",
          tags: ["Properties"],
        },
        post: {
          summary: "Create property",
          tags: ["Properties"],
        },
      },
      "/bookings": {
        get: {
          summary: "List bookings",
          tags: ["Bookings"],
        },
        post: {
          summary: "Create booking",
          tags: ["Bookings"],
        },
      },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  };

  return JSON.stringify(spec, null, 2);
}

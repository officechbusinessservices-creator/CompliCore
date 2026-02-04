"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidDiagramProps {
  chart: string;
  id?: string;
  className?: string;
}

mermaid.initialize({
  startOnLoad: false,
  theme: "dark",
  themeVariables: {
    primaryColor: "#10b981",
    primaryTextColor: "#f4f4f5",
    primaryBorderColor: "#3f3f46",
    lineColor: "#71717a",
    secondaryColor: "#27272a",
    tertiaryColor: "#18181b",
    background: "#09090b",
    mainBkg: "#18181b",
    nodeBorder: "#3f3f46",
    clusterBkg: "#27272a",
    titleColor: "#f4f4f5",
    edgeLabelBackground: "#27272a",
  },
  flowchart: {
    htmlLabels: true,
    curve: "basis",
  },
  sequence: {
    actorMargin: 50,
    messageMargin: 40,
  },
});

export function MermaidDiagram({ chart, id, className }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return;

      try {
        const uniqueId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error("Mermaid rendering error:", err);
        setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    };

    renderDiagram();
  }, [chart, id]);

  if (error) {
    return (
      <div className={`p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 ${className}`}>
        <p className="text-sm font-medium mb-2">Diagram Error</p>
        <p className="text-xs font-mono">{error}</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`mermaid-container overflow-x-auto ${className || ""}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Mermaid SVG output is safe
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// Pre-defined diagrams for the architecture
export const architectureDiagrams = {
  systemOverview: `
flowchart TB
    subgraph Clients["Client Layer"]
        WebApp["Web App<br/>(Guest)"]
        MobileApp["Mobile PWA"]
        HostPortal["Host Portal"]
        AdminDash["Admin Dashboard"]
    end

    subgraph Gateway["API Gateway"]
        APIGateway["API Gateway<br/>Rate Limit, Auth, WAF"]
    end

    subgraph Services["Service Layer"]
        Identity["Identity<br/>Service"]
        Listing["Listing<br/>Service"]
        Booking["Booking<br/>Engine"]
        Pricing["Pricing<br/>Engine"]
        Payment["Payment<br/>Service"]
        Channel["Channel<br/>Manager"]
        Messaging["Messaging<br/>Service"]
        Analytics["Analytics<br/>Service"]
    end

    subgraph AI["AI/ML Services"]
        DynamicPricing["Dynamic<br/>Pricing"]
        ListingOpt["Listing<br/>Optimizer"]
        GuestScreen["Guest<br/>Screening"]
        Demand["Demand<br/>Forecast"]
    end

    subgraph Data["Data Layer"]
        Postgres[(PostgreSQL)]
        Redis[(Redis Cache)]
        Elastic[(Elasticsearch)]
        S3[(Object Storage)]
    end

    Clients --> Gateway
    Gateway --> Services
    Services --> AI
    Services --> Data
    AI --> Data
`,

  bookingFlow: `
sequenceDiagram
    participant G as Guest
    participant API as API Gateway
    participant B as Booking Engine
    participant P as Pricing Engine
    participant Pay as Payment Service
    participant M as Messaging

    G->>API: Search Properties
    API->>B: Check Availability
    B-->>API: Available Dates
    API-->>G: Search Results

    G->>API: Select Property
    API->>P: Get Quote
    P-->>API: Price Breakdown
    API-->>G: Quote Response

    G->>API: Confirm Booking
    API->>Pay: Process Payment
    Pay-->>API: Payment Success
    API->>B: Create Reservation
    B-->>API: Booking Confirmed
    API->>M: Send Confirmation
    M-->>G: Email/SMS Notification
`,

  dataFlow: `
flowchart LR
    subgraph Write["Write Path"]
        App["Application"] --> PG[(PostgreSQL Primary)]
        PG --> CDC["CDC/Debezium"]
        CDC --> Kafka["Event Stream"]
    end

    subgraph Sync["Sync Layer"]
        Kafka --> ES[(Elasticsearch)]
        Kafka --> Analytics[(Analytics DB)]
        Kafka --> Audit[(Audit Log)]
    end

    subgraph Read["Read Path"]
        Query["Search Query"] --> Cache[(Redis)]
        Cache --> ES
        EntityQ["Entity Query"] --> Cache
        Cache --> Replica[(PG Replica)]
    end
`,

  aiPipeline: `
flowchart LR
    subgraph Input["Data Inputs"]
        Property["Property Data"]
        History["Booking History"]
        Market["Market Data"]
        Events["Event Data"]
    end

    subgraph Process["Processing"]
        Feature["Feature<br/>Engineering"]
        Model["ML Model<br/>Inference"]
        Guard["Guardrails<br/>& Limits"]
    end

    subgraph Output["Outputs"]
        Price["Suggested<br/>Price"]
        Conf["Confidence<br/>Score"]
        Explain["Explanation"]
    end

    Input --> Feature
    Feature --> Model
    Model --> Guard
    Guard --> Output
`,

  rbacMatrix: `
flowchart TB
    subgraph Roles["User Roles"]
        SuperAdmin["Super Admin"]
        OrgAdmin["Org Admin"]
        PM["Property Manager"]
        Host["Host"]
        Guest["Guest"]
    end

    subgraph Resources["Resources"]
        Props["Properties"]
        Books["Bookings"]
        Pays["Payments"]
        Users["Users"]
        Analytics["Analytics"]
    end

    SuperAdmin -->|Full| Props
    SuperAdmin -->|Full| Books
    SuperAdmin -->|Full| Pays
    SuperAdmin -->|Full| Users
    SuperAdmin -->|Full| Analytics

    OrgAdmin -->|Org-Scoped| Props
    OrgAdmin -->|Org-Scoped| Books

    Host -->|Own| Props
    Host -->|Own| Books

    Guest -->|View| Props
    Guest -->|Own| Books
`,
};

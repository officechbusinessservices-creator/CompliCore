# 4. Tech Stack & Non-Functional Requirements

## 4.1 Technology Selection Principles

### Vendor-Neutral Approach

| Principle | Rationale | Implementation |
|-----------|-----------|----------------|
| **Open Standards** | Avoid lock-in, ensure portability | REST/GraphQL, OpenID Connect, OAuth 2.0 |
| **Multi-Cloud Ready** | Flexibility, resilience | Containerized, infrastructure-as-code |
| **Swappable Components** | Future-proofing | Interface-based design, adapter patterns |
| **OSS Preference** | Transparency, community | Prefer proven open-source where viable |

---

## 4.2 Frontend Stack

### Primary Options

| Component | Recommended | Alternatives | Rationale |
|-----------|-------------|--------------|-----------|
| **Framework** | Next.js 14+ | Remix, Nuxt 3 | SSR/SSG, React ecosystem, performance |
| **Language** | TypeScript 5+ | - | Type safety, developer experience |
| **Styling** | Tailwind CSS | Styled Components, CSS Modules | Utility-first, design system ready |
| **Component Library** | shadcn/ui + Radix | Headless UI, Chakra | Accessible, customizable, modern |
| **State Management** | TanStack Query + Zustand | Redux Toolkit, Jotai | Server state + client state separation |
| **Forms** | React Hook Form + Zod | Formik | Performance, validation |
| **Maps** | MapLibre GL | Google Maps, Leaflet | Open source, customizable |
| **Charts** | Recharts | Victory, Chart.js | React-native, responsive |

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND ARCHITECTURE                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth-required routes
│   │   ├── dashboard/
│   │   ├── listings/
│   │   ├── bookings/
│   │   └── messages/
│   ├── (public)/            # Public routes
│   │   ├── search/
│   │   ├── property/[id]/
│   │   └── about/
│   ├── api/                 # API routes (BFF pattern)
│   └── layout.tsx
├── components/
│   ├── ui/                  # Base components (shadcn)
│   ├── forms/               # Form components
│   ├── features/            # Feature-specific components
│   └── layouts/             # Layout components
├── lib/
│   ├── api/                 # API client
│   ├── hooks/               # Custom hooks
│   ├── utils/               # Utilities
│   └── validation/          # Zod schemas
├── stores/                  # Zustand stores
└── types/                   # TypeScript types
```

---

## 4.3 Backend Stack

### Primary Options

| Component | Recommended | Alternatives | Rationale |
|-----------|-------------|--------------|-----------|
| **Runtime** | Node.js 20+ | Bun, Deno | Mature ecosystem, performance |
| **Framework** | Fastify | Express, Hono | Performance, TypeScript, plugins |
| **Language** | TypeScript 5+ | - | Type safety, shared types |
| **API Style** | REST + GraphQL | gRPC | REST for simplicity, GraphQL for flexibility |
| **GraphQL** | GraphQL Yoga | Apollo Server | Lightweight, modern |
| **ORM** | Drizzle ORM | Prisma, TypeORM | Performance, type safety |
| **Validation** | Zod | Yup, Joi | TypeScript integration |
| **Queue** | BullMQ | Agenda | Redis-backed, reliable |
| **Scheduler** | node-cron + BullMQ | - | Distributed, reliable |

### Alternative: Go Backend

For high-performance services (pricing engine, real-time sync):

| Component | Option | Rationale |
|-----------|--------|-----------|
| **Framework** | Fiber / Echo | Performance, simplicity |
| **ORM** | GORM / sqlc | Type safety, raw SQL option |
| **Queue** | Asynq | Redis-backed, Go-native |

### Backend Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          BACKEND ARCHITECTURE                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────────┐
                              │   API Gateway   │
                              │   (Kong/Traefik)│
                              └────────┬────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         │                             │                             │
         ▼                             ▼                             ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Core API       │         │  Booking API    │         │  Messaging API  │
│  (Fastify)      │         │  (Fastify)      │         │  (Fastify + WS) │
│                 │         │                 │         │                 │
│ • Auth          │         │ • Reservations  │         │ • Real-time     │
│ • Users         │         │ • Availability  │         │ • Notifications │
│ • Properties    │         │ • Payments      │         │ • Templates     │
└────────┬────────┘         └────────┬────────┘         └────────┬────────┘
         │                           │                           │
         └───────────────────────────┼───────────────────────────┘
                                     │
                          ┌──────────┴──────────┐
                          │   Message Queue     │
                          │   (BullMQ/Redis)    │
                          └──────────┬──────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│  Pricing Worker │         │  Channel Worker │         │  Notif Worker   │
│                 │         │                 │         │                 │
│ • Dynamic price │         │ • OTA sync      │         │ • Email         │
│ • Forecasting   │         │ • iCal sync     │         │ • Push          │
│ • Suggestions   │         │ • Reconcile     │         │ • SMS           │
└─────────────────┘         └─────────────────┘         └─────────────────┘
```

---

## 4.4 Data Stores

### Primary Database

| Component | Recommended | Alternatives | Rationale |
|-----------|-------------|--------------|-----------|
| **Primary DB** | PostgreSQL 16+ | CockroachDB | ACID, JSON, extensions |
| **Connection Pool** | PgBouncer | Pgpool-II | Performance, scale |
| **Migrations** | Drizzle Kit | Flyway | TypeScript integration |

### Supporting Data Stores

| Store Type | Recommended | Alternatives | Use Case |
|------------|-------------|--------------|----------|
| **Cache** | Redis 7+ (Cluster) | KeyDB, Valkey | Sessions, cache, queues |
| **Search** | Elasticsearch 8+ | OpenSearch, Typesense | Full-text, geo, analytics |
| **Object Storage** | S3-compatible | GCS, Azure Blob | Media, backups |
| **Time Series** | TimescaleDB | InfluxDB | Analytics, metrics |
| **Audit Log** | PostgreSQL | Loki | Compliance, immutable |

### Data Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA ARCHITECTURE                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                              WRITE PATH                                         │
│                                                                                 │
│   Application ──► PostgreSQL (Primary) ──► CDC ──► Elasticsearch               │
│                         │                   │                                   │
│                         ▼                   ▼                                   │
│                   Read Replicas        Event Stream                            │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                              READ PATH                                          │
│                                                                                 │
│   Search Queries ──► Redis Cache ──► Elasticsearch                             │
│                           ↓                                                     │
│   Entity Queries ──► Redis Cache ──► PostgreSQL Read Replica                   │
│                           ↓                                                     │
│   Analytics ──► TimescaleDB / ClickHouse                                       │
└────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────┐
│                              SYNC ARCHITECTURE                                  │
│                                                                                 │
│   PostgreSQL ──[Debezium/CDC]──► Kafka ──► Elasticsearch                       │
│                                    │                                            │
│                                    ├──► Analytics DB                            │
│                                    └──► Audit Log                               │
└────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.5 Authentication & Security

### Identity Stack

| Component | Recommended | Alternatives | Rationale |
|-----------|-------------|--------------|-----------|
| **Auth Provider** | Auth.js (NextAuth) | Clerk, Auth0, Keycloak | Flexible, self-hostable |
| **MFA** | WebAuthn + TOTP | SMS (fallback only) | Security, phishing-resistant |
| **Session** | JWT + Redis | - | Stateless + revocation |
| **API Auth** | OAuth 2.0 + PKCE | - | Industry standard |

### Security Stack

| Component | Recommended | Alternatives | Rationale |
|-----------|-------------|--------------|-----------|
| **WAF** | Cloudflare | AWS WAF, ModSecurity | DDoS, bot protection |
| **Secrets** | Vault | AWS Secrets Manager | Multi-cloud, rotation |
| **Key Management** | Vault Transit | AWS KMS, GCP KMS | Encryption at rest |
| **Vulnerability Scan** | Snyk + Trivy | Dependabot | Dependency + container |
| **SAST** | Semgrep | SonarQube | Code analysis |

---

## 4.6 AI/ML Infrastructure

### Model Serving

| Component | Recommended | Alternatives | Rationale |
|-----------|-------------|--------------|-----------|
| **LLM Provider** | OpenAI API | Anthropic, Gemini | Capabilities, latency |
| **LLM Gateway** | LiteLLM | - | Multi-provider, fallback |
| **Custom Models** | Modal / Replicate | SageMaker | Easy deployment |
| **Vector DB** | Pinecone | Weaviate, Qdrant | Semantic search |
| **ML Framework** | scikit-learn + XGBoost | - | Pricing models |

### AI Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            AI/ML ARCHITECTURE                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LLM GATEWAY (LiteLLM)                               │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐                      │
│  │   OpenAI      │   │   Anthropic   │   │   Local LLM   │                      │
│  │   (Primary)   │   │   (Fallback)  │   │   (Fallback)  │                      │
│  └───────────────┘   └───────────────┘   └───────────────┘                      │
│                                                                                  │
│  Features: Rate limiting, caching, fallback, logging, cost tracking             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         │                           │                           │
         ▼                           ▼                           ▼
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│ Listing Optimize│         │ Smart Messaging │         │ Review Analysis │
│                 │         │                 │         │                 │
│ • GPT-4 Turbo   │         │ • GPT-3.5       │         │ • GPT-3.5       │
│ • Prompt engine │         │ • Intent detect │         │ • Sentiment     │
│ • A/B testing   │         │ • PII filter    │         │ • Summarize     │
└─────────────────┘         └─────────────────┘         └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CUSTOM ML MODELS                                       │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐                      │
│  │Dynamic Pricing│   │ Demand Forecast│   │Guest Screening│                      │
│  │               │   │               │   │               │                      │
│  │ XGBoost       │   │ Prophet/ARIMA │   │ Random Forest │                      │
│  │ Trained daily │   │ Updated hourly│   │ Trained weekly│                      │
│  └───────────────┘   └───────────────┘   └───────────────┘                      │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.7 Infrastructure & DevOps

### Container Orchestration

| Component | Recommended | Alternatives | Rationale |
|-----------|-------------|--------------|-----------|
| **Container** | Docker | Podman | Industry standard |
| **Orchestration** | Kubernetes | ECS, Cloud Run | Flexibility, scale |
| **Service Mesh** | Linkerd | Istio | Lightweight, mTLS |
| **Ingress** | Traefik | NGINX, Kong | Dynamic config |

### CI/CD

| Component | Recommended | Alternatives | Rationale |
|-----------|-------------|--------------|-----------|
| **CI/CD** | GitHub Actions | GitLab CI, CircleCI | Integration, ecosystem |
| **Registry** | GitHub Container | Docker Hub, ECR | Private, integrated |
| **IaC** | Pulumi | Terraform | TypeScript, state |
| **GitOps** | ArgoCD | Flux | Kubernetes-native |

### Observability

| Component | Recommended | Alternatives | Rationale |
|-----------|-------------|--------------|-----------|
| **APM** | Grafana + Tempo | Datadog, New Relic | Open source, unified |
| **Metrics** | Prometheus | - | Standard, integrations |
| **Logs** | Loki | ELK Stack | Lightweight, Grafana |
| **Alerting** | Grafana Alerting | PagerDuty | Integrated |
| **Error Tracking** | Sentry | Bugsnag | Real-time, actionable |

---

## 4.8 Non-Functional Requirements

### Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Page Load (LCP)** | < 2.5 seconds | Lighthouse, RUM |
| **Time to Interactive** | < 3.5 seconds | Lighthouse |
| **API Response (p50)** | < 100ms | APM |
| **API Response (p95)** | < 500ms | APM |
| **API Response (p99)** | < 1000ms | APM |
| **Search Latency** | < 200ms | APM |
| **Booking Transaction** | < 3 seconds | APM |
| **Throughput** | 1000 req/sec | Load testing |

### Reliability Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Uptime** | 99.9% | Synthetic monitoring |
| **RTO** | < 1 hour | DR testing |
| **RPO** | < 15 minutes | Backup verification |
| **Error Rate** | < 0.1% | APM |
| **Payment Success** | > 99% | Gateway metrics |

### Scalability Targets

| Metric | MVP | Year 1 | Year 3 |
|--------|-----|--------|--------|
| **Concurrent Users** | 1,000 | 10,000 | 100,000 |
| **Monthly Bookings** | 1,000 | 50,000 | 500,000 |
| **Active Listings** | 1,000 | 25,000 | 250,000 |
| **Data Storage** | 100 GB | 1 TB | 10 TB |

### Security Requirements

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| **Data Encryption** | AES-256 | At rest and in transit |
| **PCI Compliance** | PCI DSS Level 1 | Via payment gateway |
| **Authentication** | MFA Required | For hosts/PMs |
| **Session Timeout** | 30 minutes | Configurable |
| **Password Policy** | NIST 800-63B | Min 12 chars, no rotation |
| **Penetration Testing** | Annual | Third-party |
| **Vulnerability Scanning** | Continuous | Automated |

### Accessibility Requirements

| Requirement | Standard | Tools |
|-------------|----------|-------|
| **WCAG Level** | 2.1 AA | axe, Lighthouse |
| **Screen Reader** | Full support | NVDA, VoiceOver testing |
| **Keyboard Navigation** | Full support | Manual testing |
| **Color Contrast** | 4.5:1 minimum | Automated checks |
| **Focus Indicators** | Visible | Visual regression |

### Localization Requirements

| Capability | MVP | Post-MVP |
|------------|-----|----------|
| **Languages** | English | +10 languages |
| **Currencies** | USD, EUR, GBP | +20 currencies |
| **Date Formats** | ISO + locale | Full locale support |
| **Number Formats** | Locale-aware | Locale-aware |
| **RTL Support** | No | Arabic, Hebrew |
| **Translation** | Manual | + AI-assisted |

---

## 4.9 Development Standards

### Code Quality

```yaml
code_standards:
  linting:
    - tool: "Biome"
    - config: "strict"
    - ci_blocking: true

  formatting:
    - tool: "Biome"
    - on_save: true
    - ci_check: true

  type_checking:
    - tool: "TypeScript"
    - strict_mode: true
    - ci_blocking: true

  testing:
    - unit_coverage: ">= 80%"
    - integration_tests: "required"
    - e2e_tests: "critical_paths"
    - framework: "Vitest + Playwright"

  security:
    - dependency_scan: "Snyk"
    - secret_detection: "GitGuardian"
    - sast: "Semgrep"
```

### API Standards

```yaml
api_standards:
  versioning:
    - strategy: "URL prefix (/v1/, /v2/)"
    - deprecation_notice: "6 months"

  documentation:
    - format: "OpenAPI 3.1"
    - tool: "Swagger UI"
    - auto_generated: true

  error_handling:
    - format: "RFC 7807 Problem Details"
    - include_request_id: true
    - include_timestamp: true

  rate_limiting:
    - strategy: "Token bucket"
    - headers: "X-RateLimit-*"
    - per_user_limits: true

  pagination:
    - strategy: "Cursor-based"
    - default_limit: 20
    - max_limit: 100
```

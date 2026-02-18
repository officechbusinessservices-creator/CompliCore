# Short-Term Rental Platform Architecture

## Executive Summary

This document suite provides a comprehensive, vendor-neutral architecture for a global short-term rental platform. The platform enables property managers, hosts, and guests to manage listings, bookings, payments, and operations through an ethically compliant, privacy-first approach.

### Key Principles

- **Privacy by Design**: GDPR/CCPA compliant, data minimization, consent-first
- **Vendor Neutral**: Multi-cloud ready, swappable components, open standards
- **AI with Guardrails**: Transparent, explainable, human-oversight for all AI features
- **Security First**: Zero-trust, encryption everywhere, comprehensive audit logging

---

## Document Index

| # | Document | Description |
|---|----------|-------------|
| 1 | [Architecture](./01-ARCHITECTURE.md) | High-level system design, data model, security |
| 2 | [MVP Features](./02-MVP-FEATURES.md) | Core features, user stories, acceptance criteria |
| 3 | [AI Features](./03-AI-FEATURES.md) | AI capabilities, guardrails, consent requirements |
| 4 | [Tech Stack](./04-TECH-STACK.md) | Technology choices, non-functional requirements |
| 5 | [Roadmap](./05-ROADMAP.md) | Phased development plan, milestones |
| 6 | [Risks](./06-RISKS.md) | Risk assessment, mitigation strategies |
| 7 | [Data Models](./07-DATA-MODELS.md) | Entity definitions, MVP backlog |
| 8 | [Constraints](./08-CONSTRAINTS.md) | Scope boundaries, assumptions, dependencies |
| 9 | [Economic Expansion](./09-ECONOMIC-EXPANSION.md) | CCP-301 RWA bridge + SSI rollout plan |
| 10 | [Agentic OS Doctrine](./10-AGENTIC-OS-DOCTRINE.md) | Strategic doctrine for sovereign agentic operating model |
| 11 | [Agentic Mesh Architecture](./11-AGENTIC-MESH-ARCHITECTURE.md) | Runtime architecture, controls, rollout blueprint |

---

## Quick Reference

### Platform Capabilities

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         PLATFORM CAPABILITIES                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  CORE                          OPERATIONS              AI/ML                     │
│  ├── Listing Management        ├── Smart Access        ├── Dynamic Pricing       │
│  ├── Booking Engine            ├── Task Management     ├── Listing Optimizer     │
│  ├── Payment Processing        ├── Vendor Management   ├── Smart Messaging       │
│  ├── Guest Communications      ├── Cleaning Schedule   ├── Demand Forecasting    │
│  ├── Review System             └── Maintenance         ├── Guest Screening       │
│  └── Analytics Dashboard                               └── Review Analysis       │
│                                                                                  │
│  INTEGRATIONS                  COMPLIANCE                                        │
│  ├── OTA Channels              ├── GDPR/CCPA                                    │
│  ├── PMS Systems               ├── PCI DSS                                      │
│  ├── Smart Locks               ├── Audit Logging                                │
│  ├── Insurance                 ├── Consent Management                           │
│  └── Accounting                └── Data Rights                                  │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### User Roles

| Role | Description | Key Capabilities |
|------|-------------|------------------|
| **Guest** | Books accommodations | Search, book, pay, review |
| **Host** | Lists properties | List, manage availability, receive payouts |
| **Property Manager** | Manages multiple properties | Portfolio management, team access |
| **Admin** | Platform operations | User management, moderation, analytics |

### MVP Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| Foundation | 8 weeks | Infrastructure, auth, core API |
| MVP | 12 weeks | Listings, bookings, payments, messaging |
| Growth | 16 weeks | OTA integration, smart locks, AI pricing |
| Enterprise | 20 weeks | PM tools, API, accounting |

### Technology Stack Overview

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js, TypeScript, Tailwind | Web application |
| Backend | Fastify, Node.js, TypeScript | API services |
| Database | PostgreSQL, Redis, Elasticsearch | Data storage |
| AI/ML | OpenAI/Anthropic, XGBoost | Intelligence |
| Infrastructure | Kubernetes, Docker | Orchestration |

---

## Getting Started

### For Engineering Teams

1. Review [Architecture](./01-ARCHITECTURE.md) for system design
2. Study [Data Models](./07-DATA-MODELS.md) for entity relationships
3. Check [Tech Stack](./04-TECH-STACK.md) for technology decisions
4. Follow [MVP Features](./02-MVP-FEATURES.md) for implementation priorities

### For Product Teams

1. Review [MVP Features](./02-MVP-FEATURES.md) for user stories
2. Study [AI Features](./03-AI-FEATURES.md) for AI capabilities
3. Check [Roadmap](./05-ROADMAP.md) for timeline planning

### For Stakeholders

1. Review [Constraints](./08-CONSTRAINTS.md) for scope and assumptions
2. Study [Risks](./06-RISKS.md) for risk assessment
3. Check [Roadmap](./05-ROADMAP.md) for milestones
4. Review [Economic Expansion](./09-ECONOMIC-EXPANSION.md) for post-activation growth protocol
5. Review [Agentic OS Doctrine](./10-AGENTIC-OS-DOCTRINE.md) and [Agentic Mesh Architecture](./11-AGENTIC-MESH-ARCHITECTURE.md) for sovereign AI expansion

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-03 | Architecture Team | Initial release |

---

## Contact

For questions about this architecture:
- Technical: engineering-leads@example.com
- Product: product-team@example.com
- Compliance: legal@example.com

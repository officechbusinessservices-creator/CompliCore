# 8. Constraints & Assumptions

## 8.1 Scope Constraints

### In Scope

| Category | Inclusions | Notes |
|----------|------------|-------|
| **Property Types** | Vacation rentals, short-term rentals | Stays < 30 days |
| **User Types** | Guests, Hosts, Property Managers | Plus internal roles |
| **Platforms** | Web (responsive), PWA | Mobile-first design |
| **Geography** | Global with localization | English first |
| **Booking Types** | Direct bookings, OTA sync | No long-term leases |
| **Payments** | Credit/debit, bank transfer | Via payment gateway |

### Out of Scope (MVP)

| Category | Exclusions | Rationale |
|----------|------------|-----------|
| **Long-term Rentals** | Stays > 30 days | Different regulations |
| **Property Sales** | Real estate transactions | Different business model |
| **Native Mobile Apps** | iOS/Android native | PWA sufficient for MVP |
| **White-label** | Custom branding | Post-MVP feature |
| **Marketplace** | Third-party services | Post-MVP feature |
| **Hardware** | Smart lock sales/installation | Integration only |

---

## 8.2 Technical Constraints

### Infrastructure

| Constraint | Specification | Rationale |
|------------|---------------|-----------|
| **Cloud Provider** | Multi-cloud ready | Vendor neutrality |
| **Container Runtime** | Docker + Kubernetes | Industry standard |
| **Database** | PostgreSQL 16+ | ACID, JSON, extensions |
| **Cache** | Redis Cluster | Performance, reliability |
| **CDN** | Required for media | Global performance |
| **Region** | Primary in US, replicas in EU | GDPR compliance |

### Performance

| Constraint | Specification | Measurement |
|------------|---------------|-------------|
| **Page Load** | < 3 seconds | LCP metric |
| **API Response** | < 500ms p95 | APM tracking |
| **Search Latency** | < 200ms | Elasticsearch |
| **Real-time Messaging** | < 3 seconds delivery | WebSocket |
| **Calendar Sync** | < 5 minutes | Background jobs |
| **Concurrent Users** | 1,000 MVP, 100,000 Y3 | Load testing |

### Security

| Constraint | Specification | Compliance |
|------------|---------------|------------|
| **Encryption at Rest** | AES-256 | All databases |
| **Encryption in Transit** | TLS 1.3 | All connections |
| **PII Encryption** | Field-level | Sensitive data |
| **Authentication** | OAuth 2.0 + MFA | All users |
| **Session Duration** | 30 min idle timeout | Configurable |
| **Password Policy** | NIST 800-63B | Min 12 chars |

### Compliance

| Constraint | Specification | Implementation |
|------------|---------------|----------------|
| **GDPR** | Full compliance | EU users |
| **CCPA** | Full compliance | California users |
| **PCI DSS** | SAQ-A via gateway | Payment data |
| **WCAG** | 2.1 AA | Accessibility |
| **SOC 2 Type II** | Roadmap Year 2 | Trust certification |

---

## 8.3 Business Constraints

### Budget & Resources

| Constraint | Specification | Notes |
|------------|---------------|-------|
| **Team Size (MVP)** | 8-10 FTEs | Cross-functional |
| **Timeline (MVP)** | 5-6 months | From Phase 0 |
| **Infrastructure Cost** | $5K-15K/month MVP | Scales with growth |
| **Third-party Services** | $2K-5K/month | APIs, tools |
| **Payment Processing** | 2.9% + $0.30 | Standard rates |

### Revenue Model

| Constraint | Specification | Notes |
|------------|---------------|-------|
| **Commission** | 3-5% from host | Per booking |
| **Service Fee** | 5-12% from guest | Variable |
| **Premium Features** | Subscription model | Post-MVP |
| **API Access** | Usage-based | Post-MVP |

### Partnerships

| Constraint | Specification | Impact |
|------------|---------------|--------|
| **OTA Integration** | Subject to partner approval | Timeline risk |
| **Payment Gateway** | Account approval required | MVP blocker |
| **Insurance** | Partnership negotiation | Phase 2 |
| **Smart Locks** | Partner program enrollment | Phase 2 |

---

## 8.4 Operational Constraints

### Support

| Constraint | Specification | Notes |
|------------|---------------|-------|
| **Hours** | 9am-6pm PST initially | Expand with growth |
| **Channels** | Email, in-app chat | Phone post-MVP |
| **SLA** | 24h response MVP | 4h for enterprise |
| **Languages** | English only MVP | +10 post-MVP |

### Uptime

| Constraint | Specification | Notes |
|------------|---------------|-------|
| **Availability** | 99.9% target | 8.76 hours/year downtime |
| **Maintenance** | Scheduled windows | Off-peak hours |
| **RTO** | < 1 hour | Critical systems |
| **RPO** | < 15 minutes | Database backups |

---

## 8.5 Key Assumptions

### Market Assumptions

| Assumption | Confidence | Risk if Wrong |
|------------|------------|---------------|
| Short-term rental market continues growing | High | Reduced TAM |
| Hosts want alternatives to OTA-only presence | High | Lower adoption |
| Property managers need better tools | High | Smaller segment |
| Guests will book direct if pricing is fair | Medium | Conversion issues |
| AI-powered features add competitive value | Medium | Wasted investment |

### Technical Assumptions

| Assumption | Confidence | Risk if Wrong |
|------------|------------|---------------|
| Next.js + Node.js can meet performance needs | High | Re-architecture |
| PostgreSQL scales for our projected volume | High | Migration needed |
| LLM APIs remain available and affordable | Medium | Feature degradation |
| OTA APIs remain stable and accessible | Medium | Integration issues |
| WebSocket scales for real-time messaging | High | Alternative needed |

### User Assumptions

| Assumption | Confidence | Risk if Wrong |
|------------|------------|---------------|
| Hosts are comfortable with web-based tools | High | Mobile app priority |
| Hosts will trust AI pricing suggestions | Medium | Feature underused |
| Guests prefer booking direct for savings | Medium | Conversion issues |
| Users will adopt MFA for security | Medium | Account security risk |
| English-only is acceptable for MVP | Medium | Market limitation |

### Regulatory Assumptions

| Assumption | Confidence | Risk if Wrong |
|------------|------------|---------------|
| GDPR/CCPA requirements are stable | High | Compliance work |
| No major new STR regulations | Medium | Feature changes |
| PCI compliance via gateway is sufficient | High | Direct compliance |
| AI regulations remain manageable | Medium | Feature restrictions |

---

## 8.6 Dependencies

### External Service Dependencies

| Service | Criticality | Fallback |
|---------|-------------|----------|
| **Stripe/Adyen** | Critical | Multi-gateway |
| **OpenAI/Anthropic** | High | Multi-provider, graceful degradation |
| **Elasticsearch** | High | PostgreSQL full-text |
| **Redis** | High | PostgreSQL caching |
| **SendGrid/Twilio** | High | Multi-provider |
| **Cloudflare** | High | Alternative CDN |
| **AWS S3** | Medium | Multi-cloud storage |

### Third-Party API Dependencies

| API | Criticality | Fallback |
|-----|-------------|----------|
| **Airbnb API** | High | iCal sync |
| **VRBO API** | Medium | iCal sync |
| **Booking.com API** | Medium | iCal sync |
| **Smart Lock APIs** | Medium | Manual code provision |
| **ID Verification** | Medium | Manual review |
| **Maps/Geocoding** | Medium | Alternative provider |

---

## 8.7 Decision Log

### Key Architecture Decisions

| ID | Decision | Rationale | Date |
|----|----------|-----------|------|
| AD-001 | Next.js for frontend | SSR, React ecosystem, DX | - |
| AD-002 | Fastify for backend | Performance, TypeScript | - |
| AD-003 | PostgreSQL primary DB | ACID, JSON, maturity | - |
| AD-004 | Multi-gateway payments | Reliability, rates | - |
| AD-005 | LiteLLM for AI gateway | Multi-provider, fallback | - |
| AD-006 | Kubernetes for orchestration | Scale, vendor-neutral | - |
| AD-007 | Field-level encryption for PII | Privacy compliance | - |
| AD-008 | Cursor-based pagination | Performance at scale | - |

### Deferred Decisions

| ID | Decision | Defer Until | Reason |
|----|----------|-------------|--------|
| DD-001 | Native mobile apps | Phase 4 | PWA sufficient for MVP |
| DD-002 | Self-hosted LLM | Phase 3 | Cost/capability analysis |
| DD-003 | Multi-region active-active | Phase 3 | Complexity vs need |
| DD-004 | GraphQL subscriptions | Phase 2 | WebSocket sufficient |

---

## 8.8 Success Criteria

### MVP Launch Criteria

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| All P0 features complete | 100% | Feature checklist |
| All P1 features complete | 80% | Feature checklist |
| Security audit passed | Yes | Third-party audit |
| Performance targets met | Yes | Load testing |
| Zero critical bugs | Yes | Bug tracker |
| Documentation complete | Yes | Checklist |
| 50 beta users onboarded | Yes | User count |

### Business Success (6 months post-launch)

| Criterion | Target | Measurement |
|-----------|--------|-------------|
| Active listings | 2,000 | Platform data |
| Monthly bookings | 1,500 | Platform data |
| Host retention | 85% | Cohort analysis |
| Guest repeat rate | 20% | Cohort analysis |
| NPS score | 40+ | Survey |
| GMV | $750K/month | Financial data |

---

## 8.9 Glossary

| Term | Definition |
|------|------------|
| **ADR** | Average Daily Rate - average revenue per occupied night |
| **GBV** | Gross Booking Value - total booking value before fees |
| **GMV** | Gross Merchandise Value - total transaction value |
| **LOS** | Length of Stay - number of nights per booking |
| **OTA** | Online Travel Agency (Airbnb, VRBO, etc.) |
| **PMS** | Property Management System |
| **RevPAR** | Revenue Per Available Room - ADR × Occupancy Rate |
| **STR** | Short-Term Rental |
| **PM** | Property Manager |
| **Host** | Property owner who lists on the platform |
| **Guest** | Person who books a stay |
| **Instant Book** | Booking without host approval |
| **Request to Book** | Booking requiring host approval |
| **Payout** | Funds disbursed to host |
| **Service Fee** | Platform fee charged to guest |
| **Commission** | Platform fee charged to host |

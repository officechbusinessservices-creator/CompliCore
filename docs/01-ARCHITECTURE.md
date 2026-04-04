# 1. High-Level Architecture & Data Model

## 1.1 System Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                        │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────────┤
│   Web App       │   Mobile App    │   Host Portal   │   Admin Dashboard         │
│   (Guest)       │   (PWA/Native)  │   (Property Mgr)│   (Internal Ops)          │
└────────┬────────┴────────┬────────┴────────┬────────┴──────────┬────────────────┘
         │                 │                 │                   │
         └─────────────────┴─────────────────┴───────────────────┘
                                    │
                           ┌───────▼────────┐
                           │   API Gateway  │
                           │  (Rate Limit,  │
                           │   Auth, WAF)   │
                           └───────┬────────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────────────────────┐
│                          SERVICE LAYER                                           │
├──────────────────────────────────┼──────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐│┌─────────────┐  ┌─────────────┐              │
│  │  Identity   │  │  Listing    ││ │  Booking   │  │  Pricing    │              │
│  │  Service    │  │  Service    ││ │  Engine    │  │  Engine     │              │
│  └─────────────┘  └─────────────┘│└─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐│┌─────────────┐  ┌─────────────┐              │
│  │  Payment    │  │  Channel    ││ │ Messaging  │  │  Analytics  │              │
│  │  Service    │  │  Manager    ││ │  Service   │  │  Service    │              │
│  └─────────────┘  └─────────────┘│└─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐│┌─────────────┐  ┌─────────────┐              │
│  │  Access     │  │  Insurance  ││ │  Review    │  │  Accounting │              │
│  │  Control    │  │  Service    ││ │  Service   │  │  Service    │              │
│  └─────────────┘  └─────────────┘│└─────────────┘  └─────────────┘              │
│                                  │                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                        AI/ML SERVICES                                    │    │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐             │    │
│  │  │ Dynamic   │  │ Listing   │  │ Guest     │  │ Demand    │             │    │
│  │  │ Pricing   │  │ Optimizer │  │ Screening │  │ Forecast  │             │    │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘             │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────┼──────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────────────────────┐
│                           DATA LAYER                                             │
├──────────────────────────────────┼──────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐│┌─────────────┐  ┌─────────────┐              │
│  │ Primary DB  │  │ Read        ││ │  Search    │  │   Cache     │              │
│  │ (PostgreSQL)│  │ Replicas    ││ │  (Elastic) │  │   (Redis)   │              │
│  └─────────────┘  └─────────────┘│└─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐│┌─────────────┐  ┌─────────────┐              │
│  │ Object      │  │  Message    ││ │  Time      │  │   Audit     │              │
│  │ Storage     │  │  Queue      ││ │  Series DB │  │   Log Store │              │
│  └─────────────┘  └─────────────┘│└─────────────┘  └─────────────┘              │
└──────────────────────────────────┼──────────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┼──────────────────────────────────────────────┐
│                      EXTERNAL INTEGRATIONS                                       │
├──────────────────────────────────┼──────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐│┌─────────────┐  ┌─────────────┐              │
│  │ OTA/PMS     │  │  Payment    ││ │  Smart     │  │  Insurance  │              │
│  │ Connectors  │  │  Gateways   ││ │  Locks     │  │  Providers  │              │
│  │ (Airbnb,    │  │  (Stripe,   ││ │  (Yale,    │  │  (Proper,   │              │
│  │  VRBO,      │  │   Adyen,    ││ │   August,  │  │   Safely)   │              │
│  │  Booking)   │  │   PayPal)   ││ │   Schlage) │  │             │              │
│  └─────────────┘  └─────────────┘│└─────────────┘  └─────────────┘              │
│  ┌─────────────┐  ┌─────────────┐│┌─────────────┐  ┌─────────────┐              │
│  │ Identity    │  │  Email/SMS  ││ │  AI/ML     │  │  Accounting │              │
│  │ Verification│  │  Providers  ││ │  (OpenAI,  │  │  (Xero,     │              │
│  │ (Persona,   │  │  (Twilio,   ││ │   Claude,  │  │   QuickBooks│              │
│  │  Jumio)     │  │   SendGrid) ││ │   Custom)  │  │   )         │              │
│  └─────────────┘  └─────────────┘│└─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 1.2 Core Components

### Identity & Access Service
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| User Management | CRUD operations for all user types | Multi-tenant, role-based |
| Authentication | Secure login/registration | OAuth2, MFA, passwordless |
| Authorization | RBAC enforcement | Fine-grained permissions |
| Session Management | Token handling | JWT with refresh, revocation |
| Audit Logging | Compliance tracking | Immutable, queryable logs |

### Listing Service
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| Property Registry | Store property details | Multi-property support |
| Media Management | Photos, videos, virtual tours | CDN-backed, optimization |
| Amenities Catalog | Standardized amenity tracking | Filterable, translatable |
| Availability Engine | Calendar management | Real-time sync |
| Listing Optimizer | AI-enhanced descriptions | SEO, conversion optimization |

### Booking Engine
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| Reservation Manager | Handle bookings | ACID transactions |
| Availability Checker | Real-time availability | Distributed locking |
| Quote Generator | Price calculations | Tax, fees, discounts |
| Cancellation Handler | Policy enforcement | Automated refunds |
| Waitlist Manager | Manage interest | Priority queuing |

### Pricing Engine
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| Base Rate Manager | Manage standard pricing | Seasonal, day-of-week |
| Dynamic Adjuster | Market-based pricing | AI/ML driven |
| Competitor Monitor | Track market rates | Anonymized scraping |
| Revenue Optimizer | Maximize RevPAR | Occupancy balancing |
| Discount Engine | Promotional pricing | Length-of-stay, early booking |

### Channel Manager
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| OTA Connectors | Sync with platforms | Airbnb, VRBO, Booking.com |
| iCal Handler | Calendar syncing | Standard protocol |
| Rate Distributor | Push pricing | Real-time updates |
| Inventory Sync | Availability updates | Conflict resolution |
| Mapping Engine | Standardize data | Cross-platform |

### Payment Service
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| Gateway Router | Multi-provider support | Failover, optimization |
| Payout Manager | Host disbursements | Scheduled, multi-currency |
| Escrow Handler | Hold funds | Secure release |
| Invoice Generator | Billing documents | Tax compliant |
| Dispute Handler | Chargeback management | Evidence collection |

### Messaging Service
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| Inbox Manager | Unified messaging | Multi-channel |
| Template Engine | Automated messages | Personalization |
| AI Responder | Smart replies | Context-aware |
| Notification Dispatcher | Push/email/SMS | Preference-based |
| Translation Service | Multi-language | Real-time |

### Smart Access Service
| Component | Purpose | Key Features |
|-----------|---------|--------------|
| Lock Integration | Device management | Multi-vendor |
| Code Generator | Access codes | Time-limited, unique |
| Access Scheduler | Automated provisioning | Check-in/out times |
| Audit Trail | Entry logging | Security compliance |
| Emergency Override | Backup access | Host control |

---

## 1.3 Data Entities & Relationships

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              ENTITY RELATIONSHIP DIAGRAM                         │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│    ORGANIZATION  │◄────────│       USER       │────────►│   USER_ROLE      │
│                  │   1:N   │                  │   N:M   │                  │
│ • org_id (PK)    │         │ • user_id (PK)   │         │ • role_id (PK)   │
│ • name           │         │ • org_id (FK)    │         │ • name           │
│ • type           │         │ • email (unique) │         │ • permissions[]  │
│ • settings       │         │ • phone          │         │ • scope          │
│ • billing_info   │         │ • verified_at    │         └──────────────────┘
│ • created_at     │         │ • mfa_enabled    │
└──────────────────┘         │ • preferences    │
                             │ • created_at     │
                             └────────┬─────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
          ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
          │      HOST        │ │      GUEST       │ │  PROPERTY_MGR    │
          │                  │ │                  │ │                  │
          │ • host_id (PK)   │ │ • guest_id (PK)  │ │ • pm_id (PK)     │
          │ • user_id (FK)   │ │ • user_id (FK)   │ │ • user_id (FK)   │
          │ • payout_info    │ │ • id_verified    │ │ • commission_rate│
          │ • tax_id         │ │ • screening_score│ │ • portfolio_size │
          │ • response_rate  │ │ • reviews_given  │ │ • certifications │
          │ • superhost      │ │ • lifetime_value │ │ • service_areas  │
          └────────┬─────────┘ └────────┬─────────┘ └────────┬─────────┘
                   │                    │                    │
                   ▼                    │                    ▼
          ┌──────────────────┐          │           ┌──────────────────┐
          │     PROPERTY     │◄─────────┼──────────►│  PM_ASSIGNMENT   │
          │                  │          │           │                  │
          │ • property_id    │          │           │ • assignment_id  │
          │ • host_id (FK)   │          │           │ • pm_id (FK)     │
          │ • address_id (FK)│          │           │ • property_id(FK)│
          │ • property_type  │          │           │ • start_date     │
          │ • bedrooms       │          │           │ • end_date       │
          │ • bathrooms      │          │           │ • permissions    │
          │ • max_guests     │          │           └──────────────────┘
          │ • amenities[]    │          │
          │ • house_rules[]  │          │
          │ • status         │          │
          │ • listing_data   │          │
          └────────┬─────────┘          │
                   │                    │
          ┌────────┴────────┐           │
          ▼                 ▼           │
┌──────────────────┐ ┌──────────────────┐           │
│   AVAILABILITY   │ │   PRICING_RULE   │           │
│                  │ │                  │           │
│ • avail_id (PK)  │ │ • rule_id (PK)   │           │
│ • property_id(FK)│ │ • property_id(FK)│           │
│ • date           │ │ • rule_type      │           │
│ • status         │ │ • base_rate      │           │
│ • min_nights     │ │ • modifiers[]    │           │
│ • source         │ │ • effective_dates│           │
│ • sync_id        │ │ • ai_suggested   │           │
└──────────────────┘ └──────────────────┘           │
                                                    │
┌──────────────────────────────────────────────────────────────────────────┐
│                              BOOKING                                      │
│                                                                          │
│ • booking_id (PK)            • property_id (FK)        • guest_id (FK)   │
│ • booking_ref (unique)       • check_in_date           • check_out_date  │
│ • status                     • num_guests              • total_amount    │
│ • currency                   • breakdown_json          • source_channel  │
│ • cancellation_policy        • special_requests        • created_at      │
└──────────────────────────────────────┬───────────────────────────────────┘
                                       │
          ┌───────────────┬────────────┼────────────┬───────────────┐
          ▼               ▼            ▼            ▼               ▼
┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
│    PAYMENT     │ │    MESSAGE     │ │    REVIEW      │ │  ACCESS_CODE   │
│                │ │                │ │                │ │                │
│ • payment_id   │ │ • message_id   │ │ • review_id    │ │ • code_id      │
│ • booking_id   │ │ • booking_id   │ │ • booking_id   │ │ • booking_id   │
│ • type         │ │ • sender_id    │ │ • author_id    │ │ • code_value   │
│ • amount       │ │ • content      │ │ • target_id    │ │ • valid_from   │
│ • status       │ │ • sent_at      │ │ • rating       │ │ • valid_until  │
│ • gateway_ref  │ │ • read_at      │ │ • categories   │ │ • lock_id      │
│ • captured_at  │ │ • ai_flagged   │ │ • content      │ │ • used_at      │
│ • payout_id    │ │ • translated   │ │ • response     │ │ • status       │
└────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘

┌──────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  AUDIT_LOG       │         │   CONSENT        │         │  DATA_REQUEST    │
│                  │         │                  │         │                  │
│ • log_id (PK)    │         │ • consent_id     │         │ • request_id     │
│ • entity_type    │         │ • user_id (FK)   │         │ • user_id (FK)   │
│ • entity_id      │         │ • purpose        │         │ • request_type   │
│ • action         │         │ • granted_at     │         │ • status         │
│ • actor_id       │         │ • revoked_at     │         │ • completed_at   │
│ • actor_ip       │         │ • version        │         │ • file_url       │
│ • old_value      │         │ • lawful_basis   │         │ • expires_at     │
│ • new_value      │         └──────────────────┘         └──────────────────┘
│ • timestamp      │
│ • retention_days │
└──────────────────┘
```

---

## 1.4 Data Flows & Sequencing

### Booking Flow (Happy Path)

```
Guest                API Gateway           Services                 External
  │                      │                    │                        │
  │  1. Search Request   │                    │                        │
  │─────────────────────►│                    │                        │
  │                      │  2. Auth Check     │                        │
  │                      │───────────────────►│ Identity Service       │
  │                      │◄───────────────────│                        │
  │                      │                    │                        │
  │                      │  3. Search Query   │                        │
  │                      │───────────────────►│ Listing Service        │
  │                      │                    │────────────────────────►│ Elasticsearch
  │                      │◄───────────────────│◄───────────────────────│
  │  4. Search Results   │                    │                        │
  │◄─────────────────────│                    │                        │
  │                      │                    │                        │
  │  5. Select Property  │                    │                        │
  │─────────────────────►│                    │                        │
  │                      │  6. Check Avail    │                        │
  │                      │───────────────────►│ Booking Engine         │
  │                      │                    │────────────────────────►│ Redis (Lock)
  │                      │                    │                        │
  │                      │  7. Get Pricing    │                        │
  │                      │───────────────────►│ Pricing Engine         │
  │                      │◄───────────────────│                        │
  │  8. Quote Response   │                    │                        │
  │◄─────────────────────│                    │                        │
  │                      │                    │                        │
  │  9. Confirm Booking  │                    │                        │
  │─────────────────────►│                    │                        │
  │                      │ 10. Guest Screen   │                        │
  │                      │───────────────────►│ Screening Service      │
  │                      │                    │────────────────────────►│ ID Verify API
  │                      │◄───────────────────│◄───────────────────────│
  │                      │                    │                        │
  │                      │ 11. Process Payment│                        │
  │                      │───────────────────►│ Payment Service        │
  │                      │                    │────────────────────────►│ Stripe/Adyen
  │                      │◄───────────────────│◄───────────────────────│
  │                      │                    │                        │
  │                      │ 12. Create Booking │                        │
  │                      │───────────────────►│ Booking Engine         │
  │                      │                    │────────────────────────►│ PostgreSQL
  │                      │                    │                        │
  │                      │ 13. Update Channels│                        │
  │                      │───────────────────►│ Channel Manager        │
  │                      │                    │────────────────────────►│ OTA APIs
  │                      │                    │                        │
  │                      │ 14. Generate Code  │                        │
  │                      │───────────────────►│ Access Service         │
  │                      │                    │────────────────────────►│ Smart Lock API
  │                      │                    │                        │
  │                      │ 15. Send Confirm   │                        │
  │                      │───────────────────►│ Messaging Service      │
  │                      │                    │────────────────────────►│ Email/SMS
  │ 16. Confirmation     │                    │                        │
  │◄─────────────────────│                    │                        │
```

### Fail-Safe Mechanisms

| Failure Point | Detection | Mitigation | Recovery |
|--------------|-----------|------------|----------|
| Payment Failure | Gateway timeout/error | Retry with backoff, fallback gateway | Auto-refund partial, notify user |
| OTA Sync Failure | Health check, error response | Queue for retry, alert | Manual reconciliation dashboard |
| Lock Code Failure | Device API error | Generate backup code, SMS to host | Manual code provision |
| Database Failure | Connection timeout | Failover to replica | Automatic promotion |
| AI Service Failure | Timeout, error response | Use cached/default values | Graceful degradation |

---

## 1.5 Security & Privacy Architecture

### RBAC Matrix

| Role | Properties | Bookings | Payments | Users | Analytics | Settings |
|------|-----------|----------|----------|-------|-----------|----------|
| **Super Admin** | Full | Full | Full | Full | Full | Full |
| **Org Admin** | Org-scoped | Org-scoped | View/Process | Org-scoped | Org-scoped | Org-scoped |
| **Property Manager** | Assigned | Assigned | View | Self | Property-level | Limited |
| **Host** | Own | Own | Own payouts | Self | Own | Own |
| **Guest** | View (public) | Own | Own | Self | None | Self |
| **Support Agent** | Read | Read/Update | View | Read | None | None |
| **Auditor** | Read | Read | Read | Read | Read | None |

### Permission Scopes

```json
{
  "permissions": {
    "properties": {
      "create": ["org_admin", "host"],
      "read": ["*"],
      "update": ["org_admin", "property_manager", "host"],
      "delete": ["org_admin", "host"],
      "publish": ["org_admin", "host"]
    },
    "bookings": {
      "create": ["guest"],
      "read": ["owner", "assigned_pm", "org_admin"],
      "update": ["owner", "assigned_pm", "org_admin", "support"],
      "cancel": ["guest", "host", "org_admin"],
      "refund": ["org_admin", "support"]
    },
    "payments": {
      "process": ["system", "org_admin"],
      "view": ["owner", "assigned_pm", "org_admin"],
      "refund": ["org_admin"],
      "payout": ["system", "org_admin"]
    },
    "users": {
      "create": ["system", "org_admin"],
      "read_pii": ["owner", "org_admin", "support"],
      "update": ["owner", "org_admin"],
      "delete": ["owner", "org_admin"],
      "export": ["owner"]
    }
  }
}
```

### Encryption Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ENCRYPTION LAYERS                                      │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ TRANSPORT LAYER                                                          │    │
│  │ • TLS 1.3 for all connections                                           │    │
│  │ • Certificate pinning for mobile apps                                   │    │
│  │ • mTLS for service-to-service communication                             │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ APPLICATION LAYER                                                        │    │
│  │ • Field-level encryption for PII (email, phone, SSN, payment info)      │    │
│  │ • Envelope encryption with DEK/KEK hierarchy                            │    │
│  │ • Key rotation every 90 days                                            │    │
│  │ • HSM-backed key management                                             │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │ STORAGE LAYER                                                            │    │
│  │ • AES-256 encryption at rest for all databases                          │    │
│  │ • Encrypted backups with separate keys                                  │    │
│  │ • Object storage encryption (SSE-S3/GCS-CMEK)                           │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Audit Logging Requirements

| Event Category | Logged Fields | Retention | Access |
|---------------|---------------|-----------|--------|
| Authentication | user_id, ip, device, success/fail, method | 2 years | Security team |
| Authorization | user_id, resource, action, granted/denied | 2 years | Security team |
| Data Access | user_id, entity, fields_accessed | 1 year | Compliance |
| Data Modification | user_id, entity, old_value, new_value | 7 years | Compliance |
| Payment Events | user_id, amount, status, gateway_ref | 7 years | Finance |
| Admin Actions | admin_id, action, target, reason | 7 years | Compliance |
| Consent Changes | user_id, purpose, action, timestamp | 7 years | Legal |

### Privacy by Design

```yaml
data_minimization:
  - Collect only essential data for service delivery
  - Default to anonymized analytics
  - Auto-delete unnecessary data after purpose fulfilled

consent_management:
  - Granular consent per purpose
  - Easy withdrawal mechanism
  - Clear lawful basis documentation

data_subject_rights:
  - Automated data export (GDPR Art. 20)
  - Right to deletion with cascade handling
  - Access request within 30 days
  - Rectification self-service

cross_border_transfers:
  - Data residency options per region
  - SCCs for international transfers
  - Adequacy decision tracking
```

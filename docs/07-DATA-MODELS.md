# 7. Data Models & MVP Backlog

## 7.1 Core Entity Definitions

### User Entity

```typescript
interface User {
  // Primary Key
  id: UUID;

  // Organization (multi-tenant)
  organizationId: UUID | null;

  // Core Identity
  email: string;                    // Encrypted at rest, unique
  emailVerifiedAt: DateTime | null;
  phone: string | null;             // Encrypted at rest
  phoneVerifiedAt: DateTime | null;
  passwordHash: string;             // bcrypt with cost 12

  // Profile
  firstName: string;
  lastName: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;

  // Security
  mfaEnabled: boolean;
  mfaSecret: string | null;         // Encrypted
  lastLoginAt: DateTime | null;
  lastLoginIp: string | null;
  failedLoginAttempts: number;
  lockedUntil: DateTime | null;

  // Preferences
  preferences: {
    language: string;               // ISO 639-1
    currency: string;               // ISO 4217
    timezone: string;               // IANA timezone
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };

  // Status
  status: 'active' | 'suspended' | 'deleted';

  // Timestamps
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt: DateTime | null;       // Soft delete
}

// Indexes
// - email (unique)
// - organizationId
// - status
// - createdAt
```

### Host Profile

```typescript
interface Host {
  id: UUID;
  userId: UUID;                     // FK to User

  // Verification
  identityVerifiedAt: DateTime | null;
  identityVerificationProvider: string | null;
  governmentIdHash: string | null;  // For fraud prevention only

  // Payout Information
  payoutMethod: 'bank_transfer' | 'paypal' | 'wise';
  payoutDetails: {                  // Encrypted
    bankAccount?: string;
    routingNumber?: string;
    iban?: string;
    paypalEmail?: string;
  };
  payoutCurrency: string;

  // Tax Information
  taxIdNumber: string | null;       // Encrypted
  taxIdType: 'ssn' | 'ein' | 'vat' | 'other';
  taxFormSubmitted: boolean;
  taxFormType: 'W-9' | 'W-8BEN' | 'W-8BEN-E' | null;

  // Performance Metrics
  responseRate: number;             // 0-100
  responseTimeMinutes: number;
  acceptanceRate: number;           // 0-100
  cancellationRate: number;         // 0-100
  superhostStatus: boolean;
  superhostSince: DateTime | null;

  // Aggregated Stats
  totalListings: number;
  totalReviews: number;
  averageRating: number;            // 1-5
  totalEarnings: number;

  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Property Entity

```typescript
interface Property {
  id: UUID;
  hostId: UUID;                     // FK to Host

  // Basic Information
  title: string;
  description: string;
  propertyType: PropertyType;
  roomType: 'entire_place' | 'private_room' | 'shared_room';

  // Location
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;               // ISO 3166-1 alpha-2
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  timezone: string;

  // Capacity
  bedrooms: number;
  beds: number;
  bathrooms: number;
  maxGuests: number;

  // Amenities
  amenities: AmenityCode[];        // Standardized codes

  // House Rules
  houseRules: {
    checkInTime: string;           // HH:MM format
    checkOutTime: string;
    smokingAllowed: boolean;
    petsAllowed: boolean;
    partiesAllowed: boolean;
    quietHoursStart: string | null;
    quietHoursEnd: string | null;
    customRules: string[];
  };

  // Media
  photos: {
    id: UUID;
    url: string;
    caption: string | null;
    order: number;
    isCover: boolean;
  }[];

  // Booking Settings
  instantBookEnabled: boolean;
  minNights: number;
  maxNights: number;
  advanceNotice: number;           // Hours
  bookingWindow: number;           // Days

  // Cancellation
  cancellationPolicy: 'flexible' | 'moderate' | 'strict' | 'super_strict';

  // Status
  status: 'draft' | 'listed' | 'unlisted' | 'suspended';
  publishedAt: DateTime | null;

  // Compliance
  permitNumber: string | null;
  permitExpiresAt: DateTime | null;

  // AI Optimization
  aiOptimizedTitle: string | null;
  aiOptimizedDescription: string | null;
  seoScore: number | null;

  createdAt: DateTime;
  updatedAt: DateTime;
}

type PropertyType =
  | 'apartment' | 'house' | 'condo' | 'townhouse'
  | 'cabin' | 'cottage' | 'villa' | 'chalet'
  | 'loft' | 'studio' | 'guesthouse' | 'bnb'
  | 'hotel' | 'hostel' | 'resort' | 'other';
```

### Availability Entity

```typescript
interface Availability {
  id: UUID;
  propertyId: UUID;                // FK to Property

  date: Date;                      // YYYY-MM-DD

  status: 'available' | 'blocked' | 'booked';

  // Booking reference if booked
  bookingId: UUID | null;

  // Override pricing for this date
  priceOverride: number | null;

  // Override stay requirements
  minNightsOverride: number | null;
  maxNightsOverride: number | null;

  // Sync tracking
  syncSource: 'manual' | 'ical' | 'channel' | 'booking';
  externalSyncId: string | null;
  lastSyncedAt: DateTime | null;

  // Notes
  note: string | null;             // Internal note

  createdAt: DateTime;
  updatedAt: DateTime;
}

// Composite unique index: (propertyId, date)
```

### Booking Entity

```typescript
interface Booking {
  id: UUID;

  // Reference code for display
  confirmationCode: string;        // e.g., "HX4K9M2"

  // Relationships
  propertyId: UUID;
  guestId: UUID;                   // FK to Guest
  hostId: UUID;                    // Denormalized for performance

  // Dates
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;

  // Guests
  adults: number;
  children: number;
  infants: number;
  pets: number;

  // Pricing
  currency: string;                // ISO 4217
  pricing: {
    nightlyRate: number;
    nightlyRates: { date: Date; rate: number }[];
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: { name: string; rate: number; amount: number }[];
    discounts: { name: string; amount: number }[];
    total: number;
    hostPayout: number;
    platformFee: number;
  };

  // Status
  status: BookingStatus;
  statusHistory: {
    status: BookingStatus;
    timestamp: DateTime;
    reason: string | null;
    actor: UUID | null;
  }[];

  // Source
  source: 'direct' | 'airbnb' | 'vrbo' | 'booking_com' | 'api';
  externalId: string | null;

  // Cancellation
  cancellationPolicy: string;
  cancelledAt: DateTime | null;
  cancelledBy: 'guest' | 'host' | 'platform' | null;
  cancellationReason: string | null;

  // Guest Notes
  specialRequests: string | null;
  guestMessage: string | null;

  // Check-in Details
  estimatedArrivalTime: string | null;
  actualCheckInAt: DateTime | null;
  actualCheckOutAt: DateTime | null;

  // Access
  accessCode: string | null;       // Encrypted
  accessCodeExpiresAt: DateTime | null;

  createdAt: DateTime;
  updatedAt: DateTime;
}

type BookingStatus =
  | 'pending'        // Awaiting host approval
  | 'confirmed'      // Approved and paid
  | 'cancelled'      // Cancelled before check-in
  | 'checked_in'     // Guest has arrived
  | 'completed'      // Stay finished
  | 'no_show';       // Guest didn't arrive
```

### Payment Entity

```typescript
interface Payment {
  id: UUID;
  bookingId: UUID;

  // Payment Type
  type: 'charge' | 'refund' | 'payout' | 'adjustment';

  // Amount
  amount: number;
  currency: string;

  // Status
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';

  // Gateway Information
  gateway: 'stripe' | 'adyen' | 'paypal';
  gatewayPaymentId: string;
  gatewayCustomerId: string | null;

  // For guest payments
  paymentMethod: {
    type: 'card' | 'bank' | 'wallet';
    last4: string | null;
    brand: string | null;
    expiryMonth: number | null;
    expiryYear: number | null;
  } | null;

  // For host payouts
  payoutDestination: {
    type: 'bank' | 'paypal' | 'wise';
    last4: string | null;
  } | null;

  // Fees
  platformFee: number;
  gatewayFee: number;
  netAmount: number;

  // Refund tracking
  refundedAmount: number;
  refundReason: string | null;

  // Timing
  capturedAt: DateTime | null;
  refundedAt: DateTime | null;
  paidOutAt: DateTime | null;

  // Failure tracking
  failureCode: string | null;
  failureMessage: string | null;

  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Message Entity

```typescript
interface Message {
  id: UUID;

  // Thread context
  threadId: UUID;                  // Conversation thread
  bookingId: UUID | null;          // Optional booking context
  propertyId: UUID | null;         // Optional property context

  // Participants
  senderId: UUID;
  recipientId: UUID;

  // Content
  content: string;                 // Encrypted at rest
  contentType: 'text' | 'image' | 'system';

  // Attachments
  attachments: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size: number;
  }[];

  // Status
  sentAt: DateTime;
  deliveredAt: DateTime | null;
  readAt: DateTime | null;

  // AI Processing
  aiProcessed: boolean;
  piiDetected: boolean;
  piiMaskedContent: string | null;
  sentimentScore: number | null;   // -1 to 1
  intentClassification: string | null;

  // Auto-response
  isAutoResponse: boolean;
  autoResponseTemplateId: UUID | null;

  // Translation
  originalLanguage: string | null;
  translatedContent: Record<string, string>; // langCode -> translation

  // Moderation
  flagged: boolean;
  flagReason: string | null;
  moderatedAt: DateTime | null;
  moderatedBy: UUID | null;

  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Review Entity

```typescript
interface Review {
  id: UUID;
  bookingId: UUID;

  // Author and Target
  authorId: UUID;
  authorType: 'guest' | 'host';
  targetId: UUID;                  // User or Property ID
  targetType: 'host' | 'guest' | 'property';

  // Ratings
  overallRating: number;           // 1-5
  categoryRatings: {
    cleanliness?: number;
    accuracy?: number;
    communication?: number;
    location?: number;
    checkIn?: number;
    value?: number;
  };

  // Content
  publicComment: string;
  privateComment: string | null;   // Only visible to recipient

  // Response
  responseContent: string | null;
  responseAt: DateTime | null;

  // Status
  status: 'pending' | 'published' | 'hidden' | 'removed';

  // Visibility timing
  createdAt: DateTime;
  publishedAt: DateTime | null;    // After both parties review

  // Moderation
  flagged: boolean;
  flagReason: string | null;
  moderatedAt: DateTime | null;
  moderatedBy: UUID | null;

  updatedAt: DateTime;
}
```

---

## 7.2 Supporting Entities

### Pricing Rule Entity

```typescript
interface PricingRule {
  id: UUID;
  propertyId: UUID;

  name: string;
  ruleType: 'base' | 'seasonal' | 'weekend' | 'length_of_stay' | 'early_bird' | 'last_minute' | 'custom';

  // Conditions
  conditions: {
    dateRange?: { start: Date; end: Date };
    daysOfWeek?: number[];        // 0-6
    minNights?: number;
    maxNights?: number;
    daysBeforeCheckIn?: { min: number; max: number };
  };

  // Adjustment
  adjustmentType: 'fixed' | 'percentage';
  adjustmentValue: number;

  // Priority (higher = applied later)
  priority: number;

  // AI Suggestions
  aiSuggested: boolean;
  aiConfidence: number | null;
  aiRationale: string | null;

  // Status
  isActive: boolean;

  createdAt: DateTime;
  updatedAt: DateTime;
}
```

### Audit Log Entity

```typescript
interface AuditLog {
  id: UUID;

  // What was affected
  entityType: string;              // e.g., 'booking', 'user', 'property'
  entityId: UUID;

  // What happened
  action: 'create' | 'read' | 'update' | 'delete' | 'login' | 'logout' | 'export';

  // Who did it
  actorId: UUID | null;            // Null for system actions
  actorType: 'user' | 'admin' | 'system' | 'api';
  actorIp: string | null;
  actorUserAgent: string | null;

  // Change details
  oldValue: Record<string, unknown> | null;
  newValue: Record<string, unknown> | null;
  changedFields: string[];

  // Context
  requestId: UUID;
  sessionId: UUID | null;

  // Classification
  sensitivityLevel: 'low' | 'medium' | 'high' | 'critical';
  retentionDays: number;

  timestamp: DateTime;
}

// Indexes
// - entityType, entityId
// - actorId
// - timestamp
// - action
```

### Consent Record Entity

```typescript
interface ConsentRecord {
  id: UUID;
  userId: UUID;

  // Consent scope
  purpose: 'marketing' | 'analytics' | 'ai_processing' | 'third_party_sharing' | 'essential';

  // Status
  granted: boolean;

  // Legal basis
  lawfulBasis: 'consent' | 'contract' | 'legal_obligation' | 'legitimate_interest';

  // Consent details
  consentText: string;             // Version of text shown
  consentVersion: string;

  // Collection details
  collectedAt: DateTime;
  collectedVia: 'signup' | 'settings' | 'banner' | 'api';
  ipAddress: string;

  // Withdrawal
  withdrawnAt: DateTime | null;
  withdrawnVia: string | null;

  // Expiry
  expiresAt: DateTime | null;
}
```

---

## 7.3 MVP Product Backlog

### Sprint 1-2: Listings Foundation

| ID | Story | Points | Priority |
|----|-------|--------|----------|
| L-001 | As a host, I can create a new property listing | 8 | P0 |
| L-002 | As a host, I can upload photos to my listing | 5 | P0 |
| L-003 | As a host, I can select amenities from a list | 3 | P0 |
| L-004 | As a host, I can set house rules | 3 | P0 |
| L-005 | As a host, I can save a draft and return later | 2 | P0 |
| L-006 | As a host, I can publish my listing | 2 | P0 |
| L-007 | As a guest, I can view a property listing | 3 | P0 |
| L-008 | As a guest, I can view photos in a gallery | 3 | P0 |

**Definition of Done:**
- [ ] Feature implemented and tested
- [ ] Unit test coverage > 80%
- [ ] API documentation updated
- [ ] Accessibility verified
- [ ] Code reviewed and merged

---

### Sprint 3-4: Calendar & Pricing

| ID | Story | Points | Priority |
|----|-------|--------|----------|
| C-001 | As a host, I can view my availability calendar | 5 | P0 |
| C-002 | As a host, I can block dates on my calendar | 3 | P0 |
| C-003 | As a host, I can import availability from iCal | 5 | P0 |
| P-001 | As a host, I can set my base nightly rate | 3 | P0 |
| P-002 | As a host, I can set cleaning fee | 2 | P0 |
| P-003 | As a host, I can set weekend rates | 3 | P0 |
| P-004 | As a host, I can create seasonal pricing | 5 | P0 |
| P-005 | As a host, I can see AI pricing suggestions | 8 | P1 |

---

### Sprint 5-6: Booking Engine

| ID | Story | Points | Priority |
|----|-------|--------|----------|
| B-001 | As a guest, I can search for properties | 8 | P0 |
| B-002 | As a guest, I can filter search results | 5 | P0 |
| B-003 | As a guest, I can see a price breakdown | 3 | P0 |
| B-004 | As a guest, I can request a booking | 5 | P0 |
| B-005 | As a host, I can approve/decline requests | 3 | P0 |
| B-006 | As a guest, I can book instantly (if enabled) | 3 | P0 |
| B-007 | As a user, I can view my bookings | 3 | P0 |
| B-008 | As a guest, I can cancel a booking | 5 | P0 |

---

### Sprint 7-8: Payments

| ID | Story | Points | Priority |
|----|-------|--------|----------|
| PM-001 | As a guest, I can pay for my booking | 8 | P0 |
| PM-002 | As a guest, I receive a payment confirmation | 2 | P0 |
| PM-003 | As a host, I can set up payout method | 5 | P0 |
| PM-004 | As a host, I receive automatic payouts | 8 | P0 |
| PM-005 | As a guest, I receive refund if cancelled | 5 | P0 |
| PM-006 | As a host, I can view my earnings | 3 | P0 |
| PM-007 | As a user, I can view payment history | 3 | P0 |

---

### Sprint 9-10: Communications

| ID | Story | Points | Priority |
|----|-------|--------|----------|
| M-001 | As a user, I can send messages | 5 | P0 |
| M-002 | As a user, I receive message notifications | 3 | P0 |
| M-003 | As a user, my PII is masked in messages | 5 | P0 |
| M-004 | As a host, I can set automated messages | 5 | P1 |
| M-005 | As a guest, I receive check-in instructions | 3 | P0 |
| R-001 | As a guest, I can review my stay | 5 | P0 |
| R-002 | As a host, I can review my guest | 3 | P0 |
| R-003 | As a host, I can respond to reviews | 2 | P0 |

---

### Sprint 11-12: Analytics & Polish

| ID | Story | Points | Priority |
|----|-------|--------|----------|
| A-001 | As a host, I can view my dashboard | 8 | P1 |
| A-002 | As a host, I can see booking stats | 3 | P1 |
| A-003 | As a host, I can export my data | 3 | P1 |
| Q-001 | Performance optimization | 8 | P0 |
| Q-002 | Accessibility audit fixes | 5 | P0 |
| Q-003 | Security hardening | 5 | P0 |
| Q-004 | Documentation completion | 3 | P0 |

---

## 7.4 Backlog Prioritization Matrix

```
                    HIGH VALUE
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
    │   QUICK WINS      │   BIG BETS        │
    │                   │                   │
    │ • Listing CRUD    │ • Booking Engine  │
    │ • Calendar        │ • Payment System  │
    │ • Photo Upload    │ • AI Pricing      │
    │ • Messaging       │ • Channel Mgmt    │
    │                   │                   │
LOW ├───────────────────┼───────────────────┤ HIGH
EFFORT                  │                   EFFORT
    │                   │                   │
    │   FILL-INS        │   MONEY PITS      │
    │                   │                   │
    │ • Email Templates │ • Native Apps     │
    │ • Export CSV      │ • Full Accounting │
    │ • Dark Mode       │ • Multi-language  │
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                    LOW VALUE
```

-- =====================================================
-- SHORT-TERM RENTAL PLATFORM DATABASE SCHEMA
-- PostgreSQL 16+
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_status AS ENUM ('active', 'suspended', 'deleted');
CREATE TYPE property_type AS ENUM (
    'apartment', 'house', 'condo', 'townhouse', 'cabin',
    'cottage', 'villa', 'chalet', 'loft', 'studio', 'guesthouse', 'bnb', 'hotel', 'hostel', 'resort', 'other'
);
CREATE TYPE room_type AS ENUM ('entire_place', 'private_room', 'shared_room');
CREATE TYPE property_status AS ENUM ('draft', 'listed', 'unlisted', 'suspended');
CREATE TYPE availability_status AS ENUM ('available', 'blocked', 'booked');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'checked_in', 'completed', 'no_show');
CREATE TYPE booking_source AS ENUM ('direct', 'airbnb', 'vrbo', 'booking_com', 'api');
CREATE TYPE payment_type AS ENUM ('charge', 'refund', 'payout', 'adjustment');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'refunded');
CREATE TYPE payment_gateway AS ENUM ('stripe', 'adyen', 'paypal');
CREATE TYPE message_content_type AS ENUM ('text', 'image', 'system');
CREATE TYPE review_status AS ENUM ('pending', 'published', 'hidden', 'removed');
CREATE TYPE pricing_rule_type AS ENUM ('base', 'seasonal', 'weekend', 'length_of_stay', 'early_bird', 'last_minute', 'custom');
CREATE TYPE cancellation_policy AS ENUM ('flexible', 'moderate', 'strict', 'super_strict');
CREATE TYPE audit_action AS ENUM ('create', 'read', 'update', 'delete', 'login', 'logout', 'export');
CREATE TYPE consent_purpose AS ENUM ('marketing', 'analytics', 'ai_processing', 'third_party_sharing', 'essential');
CREATE TYPE lawful_basis AS ENUM ('consent', 'contract', 'legal_obligation', 'legitimate_interest');

-- =====================================================
-- ORGANIZATIONS (Multi-tenancy)
-- =====================================================

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'standard',
    settings JSONB DEFAULT '{}',
    billing_info JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- USERS
-- =====================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,

    -- Core Identity (encrypted at application level)
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMPTZ,
    phone VARCHAR(50),
    phone_verified_at TIMESTAMPTZ,
    password_hash VARCHAR(255) NOT NULL,

    -- Profile
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    bio TEXT,

    -- Security
    mfa_enabled BOOLEAN DEFAULT FALSE,
    mfa_secret VARCHAR(255),
    last_login_at TIMESTAMPTZ,
    last_login_ip INET,
    failed_login_attempts INT DEFAULT 0,
    locked_until TIMESTAMPTZ,

    -- Preferences
    preferences JSONB DEFAULT '{
        "language": "en",
        "currency": "USD",
        "timezone": "America/Los_Angeles",
        "notifications": {"email": true, "push": true, "sms": false}
    }',

    -- Status
    status user_status DEFAULT 'active',

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created ON users(created_at);

-- =====================================================
-- ROLES & PERMISSIONS
-- =====================================================

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    permissions JSONB NOT NULL DEFAULT '[]',
    scope VARCHAR(50) DEFAULT 'global',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    granted_by UUID REFERENCES users(id),
    PRIMARY KEY (user_id, role_id, organization_id)
);

-- =====================================================
-- HOSTS
-- =====================================================

CREATE TABLE hosts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Verification
    identity_verified_at TIMESTAMPTZ,
    identity_verification_provider VARCHAR(50),
    government_id_hash VARCHAR(255),

    -- Payout Information (encrypted at application level)
    payout_method VARCHAR(50) DEFAULT 'bank_transfer',
    payout_details JSONB,
    payout_currency CHAR(3) DEFAULT 'USD',

    -- Tax Information (encrypted at application level)
    tax_id_number VARCHAR(255),
    tax_id_type VARCHAR(20),
    tax_form_submitted BOOLEAN DEFAULT FALSE,
    tax_form_type VARCHAR(20),

    -- Performance Metrics
    response_rate DECIMAL(5,2) DEFAULT 0,
    response_time_minutes INT DEFAULT 0,
    acceptance_rate DECIMAL(5,2) DEFAULT 0,
    cancellation_rate DECIMAL(5,2) DEFAULT 0,
    superhost_status BOOLEAN DEFAULT FALSE,
    superhost_since DATE,

    -- Aggregated Stats
    total_listings INT DEFAULT 0,
    total_reviews INT DEFAULT 0,
    average_rating DECIMAL(3,2),
    total_earnings DECIMAL(15,2) DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id)
);

CREATE INDEX idx_hosts_user ON hosts(user_id);
CREATE INDEX idx_hosts_superhost ON hosts(superhost_status);

-- =====================================================
-- GUESTS
-- =====================================================

CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Verification
    id_verified BOOLEAN DEFAULT FALSE,
    id_verified_at TIMESTAMPTZ,

    -- Screening
    screening_score DECIMAL(5,2),
    screening_updated_at TIMESTAMPTZ,

    -- Stats
    reviews_given INT DEFAULT 0,
    bookings_completed INT DEFAULT 0,
    lifetime_value DECIMAL(15,2) DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id)
);

-- =====================================================
-- ADDRESSES
-- =====================================================

CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    line1 VARCHAR(255) NOT NULL,
    line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20),
    country CHAR(2) NOT NULL, -- ISO 3166-1 alpha-2
    location GEOGRAPHY(POINT, 4326),
    timezone VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_addresses_location ON addresses USING GIST(location);
CREATE INDEX idx_addresses_city ON addresses(city);
CREATE INDEX idx_addresses_country ON addresses(country);

-- =====================================================
-- PROPERTIES
-- =====================================================

CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES hosts(id) ON DELETE CASCADE,
    address_id UUID NOT NULL REFERENCES addresses(id),

    -- Basic Information
    title VARCHAR(100) NOT NULL,
    description TEXT,
    property_type property_type NOT NULL,
    room_type room_type NOT NULL DEFAULT 'entire_place',

    -- Capacity
    bedrooms INT NOT NULL DEFAULT 1,
    beds INT NOT NULL DEFAULT 1,
    bathrooms DECIMAL(3,1) NOT NULL DEFAULT 1,
    max_guests INT NOT NULL DEFAULT 2,

    -- Amenities (stored as array of codes)
    amenities TEXT[] DEFAULT '{}',

    -- House Rules
    house_rules JSONB DEFAULT '{
        "checkInTime": "15:00",
        "checkOutTime": "11:00",
        "smokingAllowed": false,
        "petsAllowed": false,
        "partiesAllowed": false,
        "quietHoursStart": null,
        "quietHoursEnd": null,
        "customRules": []
    }',

    -- Booking Settings
    instant_book_enabled BOOLEAN DEFAULT FALSE,
    min_nights INT DEFAULT 1,
    max_nights INT DEFAULT 365,
    advance_notice_hours INT DEFAULT 24,
    booking_window_days INT DEFAULT 365,

    -- Cancellation
    cancellation_policy cancellation_policy DEFAULT 'moderate',

    -- Status
    status property_status DEFAULT 'draft',
    published_at TIMESTAMPTZ,

    -- Compliance
    permit_number VARCHAR(100),
    permit_expires_at DATE,

    -- AI Optimization
    ai_optimized_title VARCHAR(150),
    ai_optimized_description TEXT,
    seo_score DECIMAL(5,2),

    -- Stats
    view_count INT DEFAULT 0,
    booking_count INT DEFAULT 0,
    average_rating DECIMAL(3,2),
    review_count INT DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_host ON properties(host_id);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_type ON properties(property_type);
CREATE INDEX idx_properties_guests ON properties(max_guests);
CREATE INDEX idx_properties_instant ON properties(instant_book_enabled);

-- =====================================================
-- PROPERTY PHOTOS
-- =====================================================

CREATE TABLE property_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption VARCHAR(255),
    sort_order INT NOT NULL DEFAULT 0,
    is_cover BOOLEAN DEFAULT FALSE,
    width INT,
    height INT,
    file_size INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photos_property ON property_photos(property_id);

-- =====================================================
-- AVAILABILITY
-- =====================================================

CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status availability_status DEFAULT 'available',
    booking_id UUID,

    -- Price override for this date
    price_override DECIMAL(10,2),

    -- Stay requirement overrides
    min_nights_override INT,
    max_nights_override INT,

    -- Sync tracking
    sync_source VARCHAR(20) DEFAULT 'manual',
    external_sync_id VARCHAR(255),
    last_synced_at TIMESTAMPTZ,

    -- Notes
    note TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(property_id, date)
);

CREATE INDEX idx_availability_property_date ON availability(property_id, date);
CREATE INDEX idx_availability_status ON availability(status);
CREATE INDEX idx_availability_booking ON availability(booking_id);

-- =====================================================
-- PRICING RULES
-- =====================================================

CREATE TABLE pricing_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,
    rule_type pricing_rule_type NOT NULL,

    -- Base pricing
    base_rate DECIMAL(10,2),
    currency CHAR(3) DEFAULT 'USD',

    -- Conditions
    conditions JSONB DEFAULT '{}',

    -- Adjustment
    adjustment_type VARCHAR(20) DEFAULT 'percentage', -- 'fixed' or 'percentage'
    adjustment_value DECIMAL(10,2),

    -- Priority (higher = applied later)
    priority INT DEFAULT 0,

    -- AI Suggestions
    ai_suggested BOOLEAN DEFAULT FALSE,
    ai_confidence DECIMAL(3,2),
    ai_rationale TEXT,

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Effective dates
    effective_start DATE,
    effective_end DATE,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pricing_property ON pricing_rules(property_id);
CREATE INDEX idx_pricing_active ON pricing_rules(is_active);

-- =====================================================
-- BOOKINGS
-- =====================================================

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    confirmation_code VARCHAR(10) NOT NULL UNIQUE,

    -- Relationships
    property_id UUID NOT NULL REFERENCES properties(id),
    guest_id UUID NOT NULL REFERENCES guests(id),
    host_id UUID NOT NULL REFERENCES hosts(id),

    -- Dates
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights INT NOT NULL,

    -- Guests
    adults INT NOT NULL DEFAULT 1,
    children INT DEFAULT 0,
    infants INT DEFAULT 0,
    pets INT DEFAULT 0,

    -- Pricing
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    pricing JSONB NOT NULL,

    -- Status
    status booking_status DEFAULT 'pending',
    status_history JSONB DEFAULT '[]',

    -- Source
    source booking_source DEFAULT 'direct',
    external_id VARCHAR(255),

    -- Cancellation
    cancellation_policy cancellation_policy,
    cancelled_at TIMESTAMPTZ,
    cancelled_by VARCHAR(20),
    cancellation_reason TEXT,

    -- Guest Notes
    special_requests TEXT,
    guest_message TEXT,

    -- Check-in Details
    estimated_arrival_time TIME,
    actual_check_in_at TIMESTAMPTZ,
    actual_check_out_at TIMESTAMPTZ,

    -- Access (encrypted at application level)
    access_code VARCHAR(255),
    access_code_expires_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bookings_confirmation ON bookings(confirmation_code);
CREATE INDEX idx_bookings_property ON bookings(property_id);
CREATE INDEX idx_bookings_guest ON bookings(guest_id);
CREATE INDEX idx_bookings_host ON bookings(host_id);
CREATE INDEX idx_bookings_dates ON bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created ON bookings(created_at);

-- =====================================================
-- PAYMENTS
-- =====================================================

CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),

    -- Payment Type
    type payment_type NOT NULL,

    -- Amount
    amount DECIMAL(15,2) NOT NULL,
    currency CHAR(3) NOT NULL,

    -- Status
    status payment_status DEFAULT 'pending',

    -- Gateway Information
    gateway payment_gateway NOT NULL,
    gateway_payment_id VARCHAR(255),
    gateway_customer_id VARCHAR(255),

    -- Payment Method
    payment_method JSONB,

    -- Payout Destination
    payout_destination JSONB,

    -- Fees
    platform_fee DECIMAL(10,2) DEFAULT 0,
    gateway_fee DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(15,2),

    -- Refund tracking
    refunded_amount DECIMAL(15,2) DEFAULT 0,
    refund_reason TEXT,

    -- Timing
    captured_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    paid_out_at TIMESTAMPTZ,

    -- Failure tracking
    failure_code VARCHAR(50),
    failure_message TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_gateway ON payments(gateway, gateway_payment_id);
CREATE INDEX idx_payments_type ON payments(type);

-- =====================================================
-- MESSAGE THREADS
-- =====================================================

CREATE TABLE message_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id),
    property_id UUID REFERENCES properties(id),

    -- Participants
    participant_ids UUID[] NOT NULL,

    -- Status
    last_message_at TIMESTAMPTZ,
    unread_count JSONB DEFAULT '{}', -- {user_id: count}

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_threads_booking ON message_threads(booking_id);
CREATE INDEX idx_threads_participants ON message_threads USING GIN(participant_ids);

-- =====================================================
-- MESSAGES
-- =====================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,

    -- Sender
    sender_id UUID NOT NULL REFERENCES users(id),

    -- Content (encrypted at application level)
    content TEXT NOT NULL,
    content_type message_content_type DEFAULT 'text',

    -- Attachments
    attachments JSONB DEFAULT '[]',

    -- Status
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    read_at TIMESTAMPTZ,

    -- AI Processing
    ai_processed BOOLEAN DEFAULT FALSE,
    pii_detected BOOLEAN DEFAULT FALSE,
    pii_masked_content TEXT,
    sentiment_score DECIMAL(4,3),
    intent_classification VARCHAR(50),

    -- Auto-response
    is_auto_response BOOLEAN DEFAULT FALSE,
    auto_response_template_id UUID,

    -- Translation
    original_language CHAR(2),
    translated_content JSONB DEFAULT '{}',

    -- Moderation
    flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    moderated_at TIMESTAMPTZ,
    moderated_by UUID REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_thread ON messages(thread_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_sent ON messages(sent_at);
CREATE INDEX idx_messages_flagged ON messages(flagged) WHERE flagged = TRUE;

-- =====================================================
-- REVIEWS
-- =====================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),

    -- Author and Target
    author_id UUID NOT NULL REFERENCES users(id),
    author_type VARCHAR(10) NOT NULL, -- 'guest' or 'host'
    target_id UUID NOT NULL,
    target_type VARCHAR(20) NOT NULL, -- 'host', 'guest', or 'property'

    -- Ratings
    overall_rating INT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
    category_ratings JSONB DEFAULT '{}',

    -- Content
    public_comment TEXT NOT NULL,
    private_comment TEXT,

    -- Response
    response_content TEXT,
    response_at TIMESTAMPTZ,

    -- Status
    status review_status DEFAULT 'pending',

    -- Visibility timing
    published_at TIMESTAMPTZ,

    -- Moderation
    flagged BOOLEAN DEFAULT FALSE,
    flag_reason TEXT,
    moderated_at TIMESTAMPTZ,
    moderated_by UUID REFERENCES users(id),

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_booking ON reviews(booking_id);
CREATE INDEX idx_reviews_author ON reviews(author_id);
CREATE INDEX idx_reviews_target ON reviews(target_id, target_type);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(overall_rating);

-- =====================================================
-- AUDIT LOGS
-- =====================================================

CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    -- What was affected
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,

    -- What happened
    action audit_action NOT NULL,

    -- Who did it
    actor_id UUID,
    actor_type VARCHAR(20) NOT NULL, -- 'user', 'admin', 'system', 'api'
    actor_ip INET,
    actor_user_agent TEXT,

    -- Change details
    old_value JSONB,
    new_value JSONB,
    changed_fields TEXT[],

    -- Context
    request_id UUID,
    session_id UUID,

    -- Classification
    sensitivity_level VARCHAR(20) DEFAULT 'low',
    retention_days INT DEFAULT 365,

    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partition by month for performance
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_timestamp ON audit_logs(timestamp);
CREATE INDEX idx_audit_action ON audit_logs(action);

-- =====================================================
-- CONSENT RECORDS
-- =====================================================

CREATE TABLE consent_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Consent scope
    purpose consent_purpose NOT NULL,

    -- Status
    granted BOOLEAN NOT NULL,

    -- Legal basis
    lawful_basis lawful_basis NOT NULL,

    -- Consent details
    consent_text TEXT,
    consent_version VARCHAR(20),

    -- Collection details
    collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    collected_via VARCHAR(50),
    ip_address INET,

    -- Withdrawal
    withdrawn_at TIMESTAMPTZ,
    withdrawn_via VARCHAR(50),

    -- Expiry
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_consent_user ON consent_records(user_id);
CREATE INDEX idx_consent_purpose ON consent_records(purpose);
CREATE INDEX idx_consent_granted ON consent_records(granted);

-- =====================================================
-- DATA REQUESTS (GDPR/CCPA)
-- =====================================================

CREATE TABLE data_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),

    request_type VARCHAR(20) NOT NULL, -- 'export', 'delete', 'rectify', 'access'
    status VARCHAR(20) DEFAULT 'pending',

    -- Request details
    requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,

    -- Result
    file_url TEXT,
    expires_at TIMESTAMPTZ,

    -- Processing
    processed_by UUID REFERENCES users(id),
    notes TEXT
);

CREATE INDEX idx_data_requests_user ON data_requests(user_id);
CREATE INDEX idx_data_requests_status ON data_requests(status);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_hosts_updated_at BEFORE UPDATE ON hosts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate confirmation code
CREATE OR REPLACE FUNCTION generate_confirmation_code()
RETURNS VARCHAR(10) AS $$
DECLARE
    chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    result VARCHAR(10) := '';
    i INT;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::INT, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- SEED DATA: Default Roles
-- =====================================================

INSERT INTO roles (name, description, permissions, scope) VALUES
('super_admin', 'Full platform access', '["*"]', 'global'),
('org_admin', 'Organization administrator', '["org:*"]', 'organization'),
('property_manager', 'Manages assigned properties', '["property:read", "property:update", "booking:*", "message:*"]', 'assignment'),
('host', 'Property owner', '["property:own", "booking:own", "payout:own"]', 'own'),
('guest', 'Books accommodations', '["property:read", "booking:create", "booking:own", "message:send"]', 'own'),
('support_agent', 'Customer support', '["booking:read", "booking:update", "message:read", "user:read"]', 'global'),
('auditor', 'Compliance auditor', '["*:read"]', 'global');

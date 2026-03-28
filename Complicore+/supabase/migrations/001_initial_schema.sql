-- ============================================================
-- Migration 001: Initial schema
-- CompliCore+ — Supabase / PostgreSQL
-- ============================================================

-- ── Extensions ────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Enum types ────────────────────────────────────────────────────────────────
CREATE TYPE subscription_status AS ENUM (
  'inactive',
  'pending_activation',
  'active',
  'past_due',
  'cancelled'
);

CREATE TYPE workspace_member_role AS ENUM ('owner', 'admin', 'member');

CREATE TYPE flow_type AS ENUM (
  'leasing_lead_response',
  'leasing_follow_up',
  'admin_routing'
);

CREATE TYPE flow_status AS ENUM ('inactive', 'active', 'paused', 'error');

CREATE TYPE flow_run_status AS ENUM ('pending', 'running', 'complete', 'failed');

CREATE TYPE lead_event_type AS ENUM (
  'inquiry_received',
  'response_sent',
  'follow_up_scheduled',
  'follow_up_sent',
  'routing_completed',
  'closed'
);

-- ── users ─────────────────────────────────────────────────────────────────────
-- Mirrors Supabase auth.users; populated via trigger on sign-up.
CREATE TABLE public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  full_name   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── workspaces ────────────────────────────────────────────────────────────────
CREATE TABLE public.workspaces (
  id                          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                        TEXT NOT NULL,
  subscription_status         subscription_status NOT NULL DEFAULT 'inactive',
  primary_kpi_response_time   INTERVAL,  -- computed; updated by flow_runs
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── workspace_members ────────────────────────────────────────────────────────
CREATE TABLE public.workspace_members (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role          workspace_member_role NOT NULL DEFAULT 'member',
  UNIQUE (workspace_id, user_id)
);

-- ── flows ─────────────────────────────────────────────────────────────────────
CREATE TABLE public.flows (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id  UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  type          flow_type NOT NULL,
  name          TEXT NOT NULL,
  status        flow_status NOT NULL DEFAULT 'inactive',
  activated_at  TIMESTAMPTZ,
  monthly_price INTEGER NOT NULL DEFAULT 34900,  -- cents; 349.00 USD for first flow
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── flow_runs ─────────────────────────────────────────────────────────────────
CREATE TABLE public.flow_runs (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flow_id       UUID NOT NULL REFERENCES public.flows(id) ON DELETE CASCADE,
  lead_id       UUID,  -- FK added in migration 002 after leads table is confirmed
  status        flow_run_status NOT NULL DEFAULT 'pending',
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  outcome       TEXT,
  error_code    TEXT
);

-- ── leads ─────────────────────────────────────────────────────────────────────
CREATE TABLE public.leads (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id        UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  source              TEXT NOT NULL,
  contact_name        TEXT,
  contact_email       TEXT,
  inquiry_text        TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  first_response_at   TIMESTAMPTZ
);

-- ── lead_events ───────────────────────────────────────────────────────────────
CREATE TABLE public.lead_events (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id        UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  event_type     lead_event_type NOT NULL,
  event_payload  JSONB NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── subscriptions ─────────────────────────────────────────────────────────────
-- Source of truth for billing state.
-- All fields are written exclusively by the Stripe webhook handler.
-- No UI component may set subscription_status directly.
CREATE TABLE public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id            UUID NOT NULL UNIQUE REFERENCES public.workspaces(id) ON DELETE CASCADE,
  stripe_customer_id      TEXT NOT NULL UNIQUE,
  stripe_subscription_id  TEXT UNIQUE,
  plan_name               TEXT,
  status                  subscription_status NOT NULL DEFAULT 'inactive',
  activation_fee_paid     BOOLEAN NOT NULL DEFAULT false,
  current_period_end      TIMESTAMPTZ,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── invoices ──────────────────────────────────────────────────────────────────
CREATE TABLE public.invoices (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id      UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  stripe_invoice_id TEXT NOT NULL UNIQUE,
  amount            INTEGER NOT NULL,   -- cents
  currency          TEXT NOT NULL DEFAULT 'usd',
  status            TEXT NOT NULL,      -- matches Stripe invoice status
  invoice_url       TEXT,
  issued_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── demo_bookings ─────────────────────────────────────────────────────────────
CREATE TABLE public.demo_bookings (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name    TEXT NOT NULL,
  email        TEXT NOT NULL,
  company      TEXT,
  unit_count   INTEGER,
  booked_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  source_page  TEXT NOT NULL DEFAULT '/'
);

-- ── demo_events ───────────────────────────────────────────────────────────────
CREATE TABLE public.demo_events (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id     TEXT NOT NULL,
  event_type     TEXT NOT NULL,
  event_payload  JSONB NOT NULL DEFAULT '{}',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

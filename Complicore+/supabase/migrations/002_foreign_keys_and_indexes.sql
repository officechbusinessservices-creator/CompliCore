-- ============================================================
-- Migration 002: Foreign key constraints and indexes
-- ============================================================

-- ── Add deferred FK from flow_runs.lead_id to leads ──────────────────────────
ALTER TABLE public.flow_runs
  ADD CONSTRAINT flow_runs_lead_id_fkey
  FOREIGN KEY (lead_id) REFERENCES public.leads(id) ON DELETE SET NULL;

-- ── Indexes ───────────────────────────────────────────────────────────────────

-- workspace_members lookup
CREATE INDEX idx_workspace_members_workspace_id ON public.workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user_id ON public.workspace_members(user_id);

-- flows lookup by workspace
CREATE INDEX idx_flows_workspace_id ON public.flows(workspace_id);
CREATE INDEX idx_flows_status ON public.flows(status);

-- flow_runs lookup
CREATE INDEX idx_flow_runs_flow_id ON public.flow_runs(flow_id);
CREATE INDEX idx_flow_runs_lead_id ON public.flow_runs(lead_id);
CREATE INDEX idx_flow_runs_started_at ON public.flow_runs(started_at DESC);

-- leads lookup by workspace + date
CREATE INDEX idx_leads_workspace_id ON public.leads(workspace_id);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_first_response_at ON public.leads(first_response_at)
  WHERE first_response_at IS NOT NULL;

-- lead_events lookup
CREATE INDEX idx_lead_events_lead_id ON public.lead_events(lead_id);
CREATE INDEX idx_lead_events_created_at ON public.lead_events(created_at DESC);

-- subscriptions lookup by stripe IDs (used by webhook handler)
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_stripe_subscription_id ON public.subscriptions(stripe_subscription_id);

-- invoices lookup
CREATE INDEX idx_invoices_workspace_id ON public.invoices(workspace_id);
CREATE INDEX idx_invoices_issued_at ON public.invoices(issued_at DESC);

-- demo_bookings lookup by email
CREATE INDEX idx_demo_bookings_email ON public.demo_bookings(email);
CREATE INDEX idx_demo_bookings_booked_at ON public.demo_bookings(booked_at DESC);

-- demo_events lookup by session
CREATE INDEX idx_demo_events_session_id ON public.demo_events(session_id);
CREATE INDEX idx_demo_events_created_at ON public.demo_events(created_at DESC);

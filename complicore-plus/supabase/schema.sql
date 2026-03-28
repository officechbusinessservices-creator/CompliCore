-- CompliCore+ — Production Schema
-- Run in Supabase SQL editor

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- =====================
-- PROFILES
-- =====================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- =====================
-- WORKSPACES
-- =====================
create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  industry text not null default 'property_management',
  unit_count_range text,
  status text not null default 'inactive' check (
    status in ('inactive','pending_payment','active','past_due','canceled','demo_mode')
  ),
  primary_kpi_name text not null default 'median_first_response_time',
  primary_kpi_value numeric,
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.workspaces enable row level security;

-- =====================
-- WORKSPACE MEMBERS
-- =====================
create table public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner','admin','member','viewer')),
  created_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

alter table public.workspace_members enable row level security;

create policy "workspace members can view workspace"
  on public.workspaces for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = workspaces.id
        and wm.user_id = auth.uid()
    )
  );

-- =====================
-- FLOWS
-- =====================
create table public.flows (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  type text not null check (
    type in ('lead_response','follow_up','admin_routing','review_request','content_request','custom')
  ),
  status text not null default 'locked' check (
    status in ('locked','inactive','active','paused','error')
  ),
  billing_state text not null default 'not_billing' check (
    billing_state in ('not_billing','billing','past_due')
  ),
  trigger_type text,
  is_system_default boolean not null default false,
  last_run_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, slug)
);

create index idx_flows_workspace_id on public.flows(workspace_id);

alter table public.flows enable row level security;

create policy "workspace members can view flows"
  on public.flows for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = flows.workspace_id
        and wm.user_id = auth.uid()
    )
  );

create policy "workspace admins can update flows"
  on public.flows for update
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = flows.workspace_id
        and wm.user_id = auth.uid()
        and wm.role in ('owner','admin')
    )
  );

-- =====================
-- FLOW RUNS (immutable)
-- =====================
create table public.flow_runs (
  id uuid primary key default gen_random_uuid(),
  flow_id uuid not null references public.flows(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  status text not null check (status in ('running','completed','failed')),
  input_payload jsonb,
  output_payload jsonb,
  error_message text,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create index idx_flow_runs_workspace_id on public.flow_runs(workspace_id);
create index idx_flow_runs_flow_id on public.flow_runs(flow_id);
create index idx_flow_runs_started_at on public.flow_runs(started_at desc);

alter table public.flow_runs enable row level security;

create policy "workspace members can view flow runs"
  on public.flow_runs for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = flow_runs.workspace_id
        and wm.user_id = auth.uid()
    )
  );

-- =====================
-- LEADS
-- =====================
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text,
  email text,
  phone text,
  source text,
  message text,
  status text not null default 'new' check (
    status in ('new','responded','follow_up_scheduled','routed','closed','failed')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_leads_workspace_id on public.leads(workspace_id);
create index idx_leads_status on public.leads(status);
create index idx_leads_created_at on public.leads(created_at desc);

alter table public.leads enable row level security;

create policy "workspace members can view leads"
  on public.leads for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = leads.workspace_id
        and wm.user_id = auth.uid()
    )
  );

-- =====================
-- LEAD EVENTS
-- =====================
create table public.lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  event_type text not null check (
    event_type in ('lead_received','response_sent','follow_up_scheduled','routed','closed','failed')
  ),
  payload jsonb,
  created_at timestamptz not null default now()
);

create index idx_lead_events_lead_id on public.lead_events(lead_id);
create index idx_lead_events_workspace_id on public.lead_events(workspace_id);
create index idx_lead_events_created_at on public.lead_events(created_at desc);

alter table public.lead_events enable row level security;

create policy "workspace members can view lead events"
  on public.lead_events for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = lead_events.workspace_id
        and wm.user_id = auth.uid()
    )
  );

-- =====================
-- SUBSCRIPTIONS (Stripe mirror)
-- =====================
create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null unique references public.workspaces(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  status text not null check (
    status in ('none','trial','active','past_due','canceled')
  ),
  base_flow_count integer not null default 0,
  additional_flow_count integer not null default 0,
  total_entitled_flows integer generated always as (base_flow_count + additional_flow_count) stored,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

create policy "workspace members can view subscription"
  on public.subscriptions for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = subscriptions.workspace_id
        and wm.user_id = auth.uid()
    )
  );

-- =====================
-- INVOICES (Stripe mirror)
-- =====================
create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  stripe_invoice_id text unique not null,
  stripe_customer_id text not null,
  stripe_subscription_id text,
  amount integer not null,
  currency text not null default 'usd',
  status text not null check (
    status in ('draft','open','paid','void','uncollectible')
  ),
  hosted_invoice_url text,
  invoice_pdf text,
  period_start timestamptz,
  period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_invoices_workspace_id on public.invoices(workspace_id);
create index idx_invoices_created_at on public.invoices(created_at desc);

alter table public.invoices enable row level security;

create policy "workspace members can view invoices"
  on public.invoices for select
  using (
    exists (
      select 1 from public.workspace_members wm
      where wm.workspace_id = invoices.workspace_id
        and wm.user_id = auth.uid()
    )
  );

-- =====================
-- DEMO BOOKINGS (public)
-- =====================
create table public.demo_bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  portfolio_size text,
  message text,
  source_page text,
  created_at timestamptz not null default now()
);

-- Public insert only — no auth needed
alter table public.demo_bookings enable row level security;
create policy "anyone can create demo booking"
  on public.demo_bookings for insert
  with check (true);

-- =====================
-- DEMO EVENTS
-- =====================
create table public.demo_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references public.workspaces(id) on delete cascade,
  scenario text not null,
  event_type text not null,
  payload jsonb,
  created_at timestamptz not null default now()
);

-- =====================
-- STRIPE EVENTS (idempotency)
-- =====================
create table public.stripe_events (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text unique not null,
  event_type text not null,
  processed boolean not null default false,
  payload jsonb not null,
  created_at timestamptz not null default now(),
  processed_at timestamptz
);

-- =====================
-- RESPONSE TIME KPI VIEW
-- =====================
create view public.workspace_response_time_metrics as
with pairs as (
  select
    l.workspace_id,
    l.id as lead_id,
    min(case when le.event_type = 'lead_received' then le.created_at end) as received_at,
    min(case when le.event_type = 'response_sent' then le.created_at end) as responded_at
  from public.leads l
  join public.lead_events le on le.lead_id = l.id
  where l.created_at > now() - interval '30 days'
  group by l.workspace_id, l.id
)
select
  workspace_id,
  percentile_cont(0.5) within group (
    order by extract(epoch from (responded_at - received_at))
  ) as median_first_response_time_seconds,
  count(*) filter (where responded_at is not null) as leads_responded,
  count(*) as total_leads
from pairs
where received_at is not null
group by workspace_id;

-- =====================
-- DEFAULT FLOW SEED FUNCTION
-- =====================
create or replace function public.seed_default_flows(p_workspace_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.flows
    (workspace_id, name, slug, type, status, billing_state, is_system_default)
  values
    (p_workspace_id, 'Lead Response', 'lead-response', 'lead_response', 'locked', 'not_billing', true),
    (p_workspace_id, 'Follow-Up', 'follow-up', 'follow_up', 'locked', 'not_billing', true),
    (p_workspace_id, 'Admin Routing', 'admin-routing', 'admin_routing', 'locked', 'not_billing', true)
  on conflict (workspace_id, slug) do nothing;
end;
$$;

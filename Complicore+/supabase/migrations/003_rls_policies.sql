-- ============================================================
-- Migration 003: Row-level security policies
-- ============================================================

-- ── Enable RLS on all tables ──────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.demo_events ENABLE ROW LEVEL SECURITY;

-- ── Helper: check workspace membership ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_workspace_member(wsid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.workspace_id = wsid
      AND wm.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_owner_or_admin(wsid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members wm
    WHERE wm.workspace_id = wsid
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
  );
$$;

-- ── users ─────────────────────────────────────────────────────────────────────
CREATE POLICY "users: read own row"
  ON public.users FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "users: update own row"
  ON public.users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- ── workspaces ────────────────────────────────────────────────────────────────
CREATE POLICY "workspaces: member can read"
  ON public.workspaces FOR SELECT
  USING (public.is_workspace_member(id));

CREATE POLICY "workspaces: owner/admin can update"
  ON public.workspaces FOR UPDATE
  USING (public.is_workspace_owner_or_admin(id));

-- ── workspace_members ────────────────────────────────────────────────────────
CREATE POLICY "workspace_members: member can read own workspace"
  ON public.workspace_members FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "workspace_members: owner/admin can insert"
  ON public.workspace_members FOR INSERT
  WITH CHECK (public.is_workspace_owner_or_admin(workspace_id));

CREATE POLICY "workspace_members: owner/admin can delete"
  ON public.workspace_members FOR DELETE
  USING (public.is_workspace_owner_or_admin(workspace_id));

-- ── flows ─────────────────────────────────────────────────────────────────────
CREATE POLICY "flows: member can read"
  ON public.flows FOR SELECT
  USING (public.is_workspace_member(workspace_id));

CREATE POLICY "flows: owner/admin can insert"
  ON public.flows FOR INSERT
  WITH CHECK (public.is_workspace_owner_or_admin(workspace_id));

CREATE POLICY "flows: owner/admin can update"
  ON public.flows FOR UPDATE
  USING (public.is_workspace_owner_or_admin(workspace_id));

-- ── flow_runs ─────────────────────────────────────────────────────────────────
CREATE POLICY "flow_runs: member can read"
  ON public.flow_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.flows f
      WHERE f.id = flow_runs.flow_id
        AND public.is_workspace_member(f.workspace_id)
    )
  );

-- flow_runs are only written by server-side workflow execution, not directly by users.

-- ── leads ─────────────────────────────────────────────────────────────────────
CREATE POLICY "leads: member can read"
  ON public.leads FOR SELECT
  USING (public.is_workspace_member(workspace_id));

-- ── lead_events ───────────────────────────────────────────────────────────────
CREATE POLICY "lead_events: member can read"
  ON public.lead_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.leads l
      WHERE l.id = lead_events.lead_id
        AND public.is_workspace_member(l.workspace_id)
    )
  );

-- ── subscriptions ─────────────────────────────────────────────────────────────
-- Read-only for members. All writes via service_role (webhook handler).
CREATE POLICY "subscriptions: member can read"
  ON public.subscriptions FOR SELECT
  USING (public.is_workspace_member(workspace_id));

-- ── invoices ──────────────────────────────────────────────────────────────────
CREATE POLICY "invoices: member can read"
  ON public.invoices FOR SELECT
  USING (public.is_workspace_member(workspace_id));

-- ── demo_bookings ─────────────────────────────────────────────────────────────
-- Public insert (unauthenticated form); no reads for anon.
CREATE POLICY "demo_bookings: public insert"
  ON public.demo_bookings FOR INSERT
  WITH CHECK (true);

-- ── demo_events ───────────────────────────────────────────────────────────────
CREATE POLICY "demo_events: public insert"
  ON public.demo_events FOR INSERT
  WITH CHECK (true);

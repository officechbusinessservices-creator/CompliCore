-- ============================================================
-- Migration 005: KPI — median first-response time computation
-- ============================================================

-- Computes the median interval between lead.created_at and
-- lead.first_response_at for a given workspace.
-- Called by GET /api/metrics/response-time.
CREATE OR REPLACE FUNCTION public.get_median_response_time(wsid UUID)
RETURNS INTERVAL
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT
    percentile_cont(0.5) WITHIN GROUP (
      ORDER BY (first_response_at - created_at)
    )
  FROM public.leads
  WHERE workspace_id = wsid
    AND first_response_at IS NOT NULL;
$$;

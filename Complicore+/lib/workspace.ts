import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser } from './auth';

export async function getWorkspaceFlows() {
  const user = await getCurrentUser();

  if (!user?.workspace_id) {
    return [];
  }

  const supabase = createServerComponentClient({ cookies });

  const { data: flows, error } = await supabase
    .from('flows')
    .select('*')
    .eq('workspace_id', user.workspace_id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching flows:', error);
    return [];
  }

  return flows || [];
}

export async function getWorkspaceLeads(filters?: {
  source?: string;
  status?: string;
  search?: string;
}) {
  const user = await getCurrentUser();

  if (!user?.workspace_id) {
    return [];
  }

  const supabase = createServerComponentClient({ cookies });

  let query = supabase
    .from('leads')
    .select('*')
    .eq('workspace_id', user.workspace_id);

  if (filters?.source) {
    query = query.eq('source', filters.source);
  }

  if (filters?.status) {
    query = query.eq('routing_status', filters.status);
  }

  if (filters?.search) {
    query = query.or(
      `contact_name.ilike.%${filters.search}%,contact_email.ilike.%${filters.search}%,inquiry_text.ilike.%${filters.search}%`
    );
  }

  const { data: leads, error } = await query.order('created_at', {
    ascending: false,
  });

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }

  return leads || [];
}

export async function getWorkspaceSubscription() {
  const user = await getCurrentUser();

  if (!user?.workspace_id) {
    return null;
  }

  const supabase = createServerComponentClient({ cookies });

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('workspace_id', user.workspace_id)
    .single();

  if (error) {
    console.error('Error fetching subscription:', error);
    return null;
  }

  return subscription || null;
}

export async function getWorkspaceInvoices() {
  const user = await getCurrentUser();

  if (!user?.workspace_id) {
    return [];
  }

  const supabase = createServerComponentClient({ cookies });

  const { data: invoices, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('workspace_id', user.workspace_id)
    .order('issued_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    return [];
  }

  return invoices || [];
}

export async function getCanActivateFlow(
  currentActiveFlows: number
): Promise<boolean> {
  const subscription = await getWorkspaceSubscription();

  if (!subscription) {
    return false;
  }

  // Map plan names to allowed flow counts
  const flowLimits: Record<string, number> = {
    launch: 1,
    growth: 3,
    ops_stack: 10,
  };

  const limit = flowLimits[subscription.plan_name] || 0;
  return currentActiveFlows < limit;
}

export async function getFlowActivationFee(): Promise<number> {
  // One-time activation fee in cents
  return 150000; // $1,500
}

export async function getAdditionalFlowCost(): Promise<number> {
  // Per-additional flow monthly cost in cents
  return 24900; // $249
}

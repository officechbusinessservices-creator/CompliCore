import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getServerSession() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

export async function getCurrentUser() {
  const session = await getServerSession();

  if (!session?.user) {
    return null;
  }

  const supabase = createServerComponentClient({ cookies });

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error || !user) {
    return null;
  }

  return {
    ...session.user,
    workspace_id: user.workspace_id,
  };
}

export async function getWorkspaceContext() {
  const user = await getCurrentUser();

  if (!user?.workspace_id) {
    return null;
  }

  const supabase = createServerComponentClient({ cookies });

  const { data: workspace, error } = await supabase
    .from('workspaces')
    .select('*')
    .eq('id', user.workspace_id)
    .single();

  if (error || !workspace) {
    return null;
  }

  return {
    workspace,
    user,
  };
}

export async function getSubscriptionStatus() {
  const context = await getWorkspaceContext();

  if (!context) {
    return null;
  }

  const supabase = createServerComponentClient({ cookies });

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('workspace_id', context.workspace.id)
    .single();

  if (error || !subscription) {
    return null;
  }

  return subscription;
}

export async function isFlowActive(flowId: string): Promise<boolean> {
  const context = await getWorkspaceContext();

  if (!context) {
    return false;
  }

  const supabase = createServerComponentClient({ cookies });

  const { data: flow, error } = await supabase
    .from('flows')
    .select('is_active')
    .eq('id', flowId)
    .eq('workspace_id', context.workspace.id)
    .single();

  if (error || !flow) {
    return false;
  }

  return flow.is_active;
}

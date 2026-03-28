'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { StatusPill } from '@/components/ui/StatusPill'
import { ArrowRight, ExternalLink } from 'lucide-react'

type BillingData = {
  subscription: {
    status: string
    base_flow_count: number
    additional_flow_count: number
    total_entitled_flows: number
    current_period_end: string | null
  } | null
  invoices: Array<{
    id: string
    amount: number
    currency: string
    status: string
    hosted_invoice_url: string | null
    created_at: string
  }>
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function BillingPage() {
  const [data, setData] = useState<BillingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [addingFlow, setAddingFlow] = useState(false)

  useEffect(() => {
    const workspaceId = localStorage.getItem('workspace_id')
    if (!workspaceId) return

    Promise.all([
      fetch(`/api/billing/subscription?workspace_id=${workspaceId}`).then((r) => r.json()),
      fetch(`/api/billing/invoices?workspace_id=${workspaceId}`).then((r) => r.json()),
    ])
      .then(([subRes, invRes]) => {
        setData({ subscription: subRes.subscription, invoices: invRes.invoices || [] })
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleAddFlow() {
    const workspaceId = localStorage.getItem('workspace_id')
    if (!workspaceId) return
    setAddingFlow(true)
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workspace_id: workspaceId, package: 'add_flow', additional_flow_count: 1 }),
      })
      const json = await res.json()
      if (json.checkout_url) window.location.href = json.checkout_url
    } finally {
      setAddingFlow(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-28 bg-[#11182D] rounded-2xl border border-[#25314F] animate-pulse" />
        ))}
      </div>
    )
  }

  const sub = data?.subscription

  return (
    <div className="p-8 max-w-[1200px] mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-[#F5F7FB]">Billing</h1>

      {/* Subscription summary */}
      <div className="bg-[#11182D] border border-[#25314F] rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-base font-semibold text-[#F5F7FB] mb-1">Current plan</h2>
            {sub?.current_period_end && (
              <p className="text-sm text-[#8A95B2]">
                Renews {formatDate(sub.current_period_end)}
              </p>
            )}
          </div>
          {sub?.status && (
            <StatusPill status={sub.status as 'active' | 'past_due' | 'canceled'} />
          )}
        </div>

        {!sub || sub.status === 'none' ? (
          <div className="text-center py-8">
            <p className="text-[#8A95B2] mb-6">No active subscription. Activate your system to get started.</p>
            <Link href="/pricing">
              <Button>Activate System <ArrowRight className="h-4 w-4" /></Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-[#0B1020] rounded-xl p-4">
              <p className="text-sm text-[#8A95B2] mb-1">Base flows</p>
              <p className="text-2xl font-bold text-[#F5F7FB]">{sub.base_flow_count}</p>
            </div>
            <div className="bg-[#0B1020] rounded-xl p-4">
              <p className="text-sm text-[#8A95B2] mb-1">Additional flows</p>
              <p className="text-2xl font-bold text-[#F5F7FB]">{sub.additional_flow_count}</p>
            </div>
            <div className="bg-[#0B1020] rounded-xl p-4">
              <p className="text-sm text-[#8A95B2] mb-1">Total entitled</p>
              <p className="text-2xl font-bold text-[#F5F7FB]">{sub.total_entitled_flows}</p>
            </div>
          </div>
        )}
      </div>

      {/* Add flow */}
      {sub?.status === 'active' && (
        <div className="bg-[#11182D] border border-[#25314F] rounded-2xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-base font-semibold text-[#F5F7FB] mb-1">Add a flow</h2>
            <p className="text-sm text-[#8A95B2]">Expand automation coverage with an additional active flow for $249/month.</p>
          </div>
          <Button variant="secondary" loading={addingFlow} onClick={handleAddFlow}>
            Add Flow
          </Button>
        </div>
      )}

      {/* Invoices */}
      <div>
        <h2 className="text-base font-semibold text-[#F5F7FB] mb-4">Invoices</h2>
        {!data?.invoices.length ? (
          <div className="bg-[#11182D] border border-[#25314F] rounded-2xl p-8 text-center">
            <p className="text-sm text-[#8A95B2]">No invoices yet.</p>
          </div>
        ) : (
          <div className="bg-[#11182D] border border-[#25314F] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#25314F]">
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#8A95B2] uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#8A95B2] uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#8A95B2] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#25314F]">
                {data.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#16203A] transition-colors">
                    <td className="px-6 py-4 text-[#F5F7FB]">{formatDate(inv.created_at)}</td>
                    <td className="px-6 py-4 text-[#F5F7FB] font-medium">{formatAmount(inv.amount, inv.currency)}</td>
                    <td className="px-6 py-4">
                      <StatusPill status={inv.status as 'active'} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      {inv.hosted_invoice_url && (
                        <a
                          href={inv.hosted_invoice_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand hover:text-brand-hover transition-colors"
                        >
                          View <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

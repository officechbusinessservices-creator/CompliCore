import { Invoice } from '@/app/dashboard/billing/page';
import { Download, Check, Clock, AlertCircle } from 'lucide-react';

interface InvoiceTableProps {
  invoices: Invoice[];
}

function StatusIcon({ status }: { status: Invoice['status'] }) {
  switch (status) {
    case 'paid':
      return <Check className="w-16 h-16 text-[#22C55E]" />;
    case 'pending':
      return <Clock className="w-16 h-16 text-[#F59E0B]" />;
    case 'failed':
      return <AlertCircle className="w-16 h-16 text-[#EF4444]" />;
  }
}

function StatusLabel({ status }: { status: Invoice['status'] }) {
  const labels: Record<Invoice['status'], { label: string; color: string }> = {
    paid: { label: 'Paid', color: 'text-[#22C55E]' },
    pending: { label: 'Pending', color: 'text-[#F59E0B]' },
    failed: { label: 'Failed', color: 'text-[#EF4444]' },
  };
  return labels[status];
}

export default function InvoiceTable({ invoices }: InvoiceTableProps) {
  return (
    <div className="bg-surface rounded-16 border border-border overflow-hidden">
      {/* Header */}
      <div className="p-24 lg:p-32 border-b border-border">
        <h2 className="text-label-large font-semibold text-text-primary">Invoices</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-elevated-surface/50">
              <th className="px-24 py-16 text-left text-small font-semibold text-text-secondary uppercase tracking-wide">
                Date
              </th>
              <th className="px-24 py-16 text-left text-small font-semibold text-text-secondary uppercase tracking-wide">
                Invoice
              </th>
              <th className="px-24 py-16 text-left text-small font-semibold text-text-secondary uppercase tracking-wide">
                Amount
              </th>
              <th className="px-24 py-16 text-left text-small font-semibold text-text-secondary uppercase tracking-wide">
                Status
              </th>
              <th className="px-24 py-16 text-right text-small font-semibold text-text-secondary uppercase tracking-wide">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {invoices.map((invoice) => {
              const statusConfig = StatusLabel({ status: invoice.status });
              return (
                <tr
                  key={invoice.id}
                  className="hover:bg-elevated-surface/40 transition-colors"
                >
                  <td className="px-24 py-16 text-small text-text-primary">
                    {new Date(invoice.issued_at).toLocaleDateString()}
                  </td>
                  <td className="px-24 py-16 text-small text-text-primary font-medium">
                    {invoice.stripe_invoice_id}
                  </td>
                  <td className="px-24 py-16 text-small text-text-primary">
                    ${(invoice.amount / 100).toFixed(2)} {invoice.currency.toUpperCase()}
                  </td>
                  <td className="px-24 py-16">
                    <div className={`flex items-center gap-6 w-fit text-small font-medium ${statusConfig.color}`}>
                      <StatusIcon status={invoice.status} />
                      {statusConfig.label}
                    </div>
                  </td>
                  <td className="px-24 py-16 text-right">
                    <a
                      href={invoice.invoice_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-8 px-12 py-8 rounded-8 text-primary hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      aria-label={`Download invoice ${invoice.stripe_invoice_id}`}
                    >
                      <Download className="w-16 h-16" />
                      <span className="text-small font-medium hidden sm:inline">Download</span>
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer note */}
      <div className="p-24 lg:p-32 border-t border-border bg-elevated-surface/30">
        <p className="text-small text-text-secondary">
          All invoices are automatically sent to your email. Need help? Contact{' '}
          <a href="mailto:support@complicore.plus" className="text-primary hover:text-primary/90">
            support@complicore.plus
          </a>
        </p>
      </div>
    </div>
  );
}

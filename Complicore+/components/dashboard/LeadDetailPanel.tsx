import { Lead } from '@/app/dashboard/leads/page';
import { X, Mail, Phone, FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { relativeTime } from '@/lib/formatting';

interface LeadDetailPanelProps {
  lead: Lead | null;
  onClose: () => void;
}

function SourceLabel({ source }: { source: Lead['source'] }) {
  const labels: Record<Lead['source'], string> = {
    inquiry_form: 'Inquiry Form',
    email: 'Email',
    phone: 'Phone',
  };
  return labels[source];
}

function StatusLabel({ status }: { status: Lead['routing_status'] }) {
  const labels: Record<Lead['routing_status'], string> = {
    new: 'New',
    responded: 'Responded',
    routed: 'Routed',
    error: 'Error',
  };
  return labels[status];
}

export default function LeadDetailPanel({ lead, onClose }: LeadDetailPanelProps) {
  if (!lead) {
    return (
      <div className="hidden lg:flex flex-col h-full p-24 bg-surface rounded-16 border border-border items-center justify-center text-center">
        <FileText className="w-48 h-48 text-text-secondary/30 mb-16" />
        <p className="text-body text-text-secondary">Select a lead to view details</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-surface rounded-16 border border-border overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-24 border-b border-border">
        <h2 className="text-label-large font-semibold text-text-primary truncate">{lead.contact_name}</h2>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-8 rounded-8 hover:bg-elevated-surface transition-colors text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="Close lead details"
        >
          <X className="w-18 h-18" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-24 flex flex-col gap-32">
        {/* Status section */}
        <div>
          <h3 className="text-small font-semibold text-text-secondary uppercase tracking-wide mb-12">
            Status
          </h3>
          <div className="flex items-center gap-12">
            {lead.routing_status === 'error' && (
              <div className="flex items-center gap-8 px-12 py-8 bg-[#EF4444]/10 rounded-8 text-[#EF4444] text-small font-medium">
                <AlertCircle className="w-16 h-16" />
                Error
              </div>
            )}
            {lead.routing_status === 'responded' && (
              <div className="flex items-center gap-8 px-12 py-8 bg-[#22C55E]/10 rounded-8 text-[#22C55E] text-small font-medium">
                <CheckCircle className="w-16 h-16" />
                Responded
              </div>
            )}
            {lead.routing_status === 'routed' && (
              <div className="flex items-center gap-8 px-12 py-8 bg-[#6EA8FE]/10 rounded-8 text-[#6EA8FE] text-small font-medium">
                <ArrowRight className="w-16 h-16" />
                Routed
              </div>
            )}
            {lead.routing_status === 'new' && (
              <div className="flex items-center gap-8 px-12 py-8 bg-elevated-surface rounded-8 text-text-secondary text-small font-medium">
                <Clock className="w-16 h-16" />
                New
              </div>
            )}
          </div>
        </div>

        {/* Contact info */}
        <div>
          <h3 className="text-small font-semibold text-text-secondary uppercase tracking-wide mb-12">
            Contact Info
          </h3>
          <div className="space-y-12">
            <div className="flex items-center gap-12">
              <Mail className="w-16 h-16 text-text-secondary flex-shrink-0" />
              <a
                href={`mailto:${lead.contact_email}`}
                className="text-body text-primary hover:text-primary/90 transition-colors break-all"
              >
                {lead.contact_email}
              </a>
            </div>
            <div className="flex items-center gap-12">
              <FileText className="w-16 h-16 text-text-secondary flex-shrink-0" />
              <span className="text-body text-text-primary">{SourceLabel({ source: lead.source })}</span>
            </div>
          </div>
        </div>

        {/* Inquiry */}
        <div>
          <h3 className="text-small font-semibold text-text-secondary uppercase tracking-wide mb-12">
            Inquiry
          </h3>
          <p className="text-body text-text-primary bg-elevated-surface p-12 rounded-8 leading-relaxed">
            {lead.inquiry_text}
          </p>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-small font-semibold text-text-secondary uppercase tracking-wide mb-12">
            Timeline
          </h3>
          <div className="space-y-12 text-small">
            <div className="flex items-start gap-12">
              <div className="w-6 h-6 rounded-full bg-primary flex-shrink-0 mt-6" />
              <div>
                <p className="text-text-primary font-medium">Inquiry received</p>
                <p className="text-text-secondary">{relativeTime(lead.created_at)}</p>
              </div>
            </div>

            {lead.first_response_at && (
              <div className="flex items-start gap-12">
                <div className="w-6 h-6 rounded-full bg-[#22C55E] flex-shrink-0 mt-6" />
                <div>
                  <p className="text-text-primary font-medium">
                    {lead.routing_status === 'responded' ? 'Response sent' : 'Routed'}
                  </p>
                  <p className="text-text-secondary">{relativeTime(lead.first_response_at)}</p>
                </div>
              </div>
            )}

            {lead.flow_triggered && (
              <div className="flex items-start gap-12">
                <div className="w-6 h-6 rounded-full bg-[#6EA8FE] flex-shrink-0 mt-6" />
                <div>
                  <p className="text-text-primary font-medium">Flow triggered</p>
                  <p className="text-text-secondary">{lead.flow_triggered}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error detail if applicable */}
        {lead.routing_status === 'error' && (
          <div className="p-12 bg-[#EF4444]/10 rounded-8 border border-[#EF4444]/20">
            <p className="text-small text-[#EF4444]">
              This lead could not be routed. Check your workflow configuration or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ArrowRight({ className }: { className: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

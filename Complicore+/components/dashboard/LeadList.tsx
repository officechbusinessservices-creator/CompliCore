import { Lead } from '@/app/dashboard/leads/page';
import { Mail, Phone, FileText, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { relativeTime } from '@/lib/formatting';

interface LeadListProps {
  leads: Lead[];
  selectedId?: string;
  onSelectLead: (lead: Lead) => void;
}

function SourceIcon({ source }: { source: Lead['source'] }) {
  switch (source) {
    case 'email':
      return <Mail className="w-16 h-16" />;
    case 'phone':
      return <Phone className="w-16 h-16" />;
    case 'inquiry_form':
      return <FileText className="w-16 h-16" />;
  }
}

function StatusBadge({ status }: { status: Lead['routing_status'] }) {
  const styles: Record<Lead['routing_status'], { bg: string; text: string; label: string }> = {
    new: { bg: 'bg-elevated-surface', text: 'text-text-secondary', label: 'New' },
    responded: { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]', label: 'Responded' },
    routed: { bg: 'bg-[#6EA8FE]/10', text: 'text-[#6EA8FE]', label: 'Routed' },
    error: { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', label: 'Error' },
  };

  const style = styles[status];

  return (
    <div className={`${style.bg} px-8 py-4 rounded-6 text-caption font-medium ${style.text}`}>
      {style.label}
    </div>
  );
}

export default function LeadList({ leads, selectedId, onSelectLead }: LeadListProps) {
  if (leads.length === 0) {
    return (
      <div className="col-span-12 flex flex-col items-center justify-center py-80 px-32 text-center">
        <FileText className="w-48 h-48 text-text-secondary/30 mb-24" />
        <h3 className="text-body-large font-medium text-text-primary mb-8">No leads found</h3>
        <p className="text-body text-text-secondary max-w-sm">
          Adjust your filters or search to find leads matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      {leads.map((lead) => (
        <button
          key={lead.id}
          onClick={() => onSelectLead(lead)}
          className={`flex items-start gap-16 p-16 rounded-12 border transition-all duration-180 text-left hover:bg-elevated-surface/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
            selectedId === lead.id
              ? 'bg-elevated-surface border-primary'
              : 'bg-surface border-border hover:border-primary/40'
          }`}
        >
          {/* Source icon */}
          <div className="mt-2 flex-shrink-0 text-text-secondary">
            <SourceIcon source={lead.source} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-12 mb-8">
              <h3 className="font-medium text-text-primary truncate">{lead.contact_name}</h3>
              <StatusBadge status={lead.routing_status} />
            </div>

            <p className="text-small text-text-secondary mb-8 line-clamp-2">{lead.inquiry_text}</p>

            <div className="flex items-center gap-16 text-caption text-text-secondary">
              <span>{lead.contact_email}</span>
              <span>•</span>
              <span>{relativeTime(lead.created_at)}</span>
              {lead.first_response_at && (
                <>
                  <span>•</span>
                  <span>Responded {relativeTime(lead.first_response_at)}</span>
                </>
              )}
            </div>

            {/* Routing info */}
            {lead.routing_status === 'error' && (
              <div className="mt-12 flex items-center gap-8 text-caption text-[#EF4444]">
                <AlertCircle className="w-14 h-14" />
                <span>Routing failed</span>
              </div>
            )}

            {lead.flow_triggered && (
              <div className="mt-12 flex items-center gap-8 text-caption text-[#6EA8FE]">
                <ArrowRight className="w-14 h-14" />
                <span>Triggered: {lead.flow_triggered}</span>
              </div>
            )}
          </div>

          {/* Chevron indicator */}
          <div className="mt-2 flex-shrink-0 text-text-secondary/40">
            <ArrowRight className="w-16 h-16" />
          </div>
        </button>
      ))}
    </div>
  );
}

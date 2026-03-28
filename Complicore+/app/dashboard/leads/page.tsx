'use client';

import { useState } from 'react';
import LeadList from '@/components/dashboard/LeadList';
import LeadDetailPanel from '@/components/dashboard/LeadDetailPanel';
import LeadSearch from '@/components/dashboard/LeadSearch';

export interface Lead {
  id: string;
  source: 'inquiry_form' | 'phone' | 'email';
  contact_name: string;
  contact_email: string;
  inquiry_text: string;
  created_at: string;
  first_response_at?: string;
  routing_status: 'new' | 'responded' | 'routed' | 'error';
  flow_triggered?: string;
}

// Mock leads data
const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-001',
    source: 'inquiry_form',
    contact_name: 'Sarah Chen',
    contact_email: 'sarah.chen@example.com',
    inquiry_text: 'Interested in leasing the 2BR at Oak Terrace. Can I schedule a tour?',
    created_at: '2026-03-25T09:15:00Z',
    first_response_at: '2026-03-25T09:16:32Z',
    routing_status: 'responded',
    flow_triggered: 'Leasing Lead Response',
  },
  {
    id: 'lead-002',
    source: 'email',
    contact_name: 'Michael Rodriguez',
    contact_email: 'mrodriguez@corporatehousing.com',
    inquiry_text: 'We have 12 relocating employees. What are your rates for furnished 1BR units?',
    created_at: '2026-03-25T08:42:00Z',
    first_response_at: '2026-03-25T08:43:15Z',
    routing_status: 'routed',
    flow_triggered: 'Admin Routing',
  },
  {
    id: 'lead-003',
    source: 'phone',
    contact_name: 'Jennifer Park',
    contact_email: 'jpark@example.com',
    inquiry_text: 'Question about pet policy for large dogs. Calling about Riverside Apartments.',
    created_at: '2026-03-24T14:28:00Z',
    first_response_at: undefined,
    routing_status: 'new',
    flow_triggered: undefined,
  },
  {
    id: 'lead-004',
    source: 'inquiry_form',
    contact_name: 'David Thompson',
    contact_email: 'dthompson@example.com',
    inquiry_text: 'Follow-up on my application from last week. Status update?',
    created_at: '2026-03-22T11:05:00Z',
    first_response_at: '2026-03-23T10:20:00Z',
    routing_status: 'responded',
    flow_triggered: 'Leasing Follow-Up Automation',
  },
  {
    id: 'lead-005',
    source: 'email',
    contact_name: 'Amanda Foster',
    contact_email: 'afoster@example.com',
    inquiry_text: 'Tenant complaint: broken HVAC unit in unit 405. Urgent.',
    created_at: '2026-03-25T07:33:00Z',
    first_response_at: undefined,
    routing_status: 'error',
    flow_triggered: undefined,
  },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSource, setFilterSource] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchQuery === '' ||
      lead.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.contact_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.inquiry_text.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSource = filterSource === null || lead.source === filterSource;
    const matchesStatus = filterStatus === null || lead.routing_status === filterStatus;

    return matchesSearch && matchesSource && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-24">
      {/* Page header */}
      <div>
        <h1 className="text-h2 font-semibold text-text-primary">Leads</h1>
        <p className="text-body text-text-secondary mt-8">
          Manage inquiries and monitor workflow routing status
        </p>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-12 gap-24 relative">
        {/* Left column: search + list */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-24">
          {/* Search and filters */}
          <LeadSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterSource={filterSource}
            onFilterSourceChange={setFilterSource}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
            leadCount={filteredLeads.length}
          />

          {/* Lead list */}
          <LeadList leads={filteredLeads} selectedId={selectedLead?.id} onSelectLead={setSelectedLead} />
        </div>

        {/* Right column: detail panel (mobile: below list) */}
        <div className="col-span-12 lg:col-span-4">
          <LeadDetailPanel lead={selectedLead} onClose={() => setSelectedLead(null)} />
        </div>
      </div>
    </div>
  );
}

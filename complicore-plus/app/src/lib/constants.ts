export const PRICING = {
  ACTIVATION_FEE: 1500,
  FLOW_BASE_MONTHLY: 349,
  FLOW_ADDITIONAL_MONTHLY: 249,
  PACKAGES: [
    {
      id: 'launch',
      name: 'Launch',
      flows: 1,
      activation: 1500,
      monthly: 349,
      description: 'One active workflow. The fastest path to automated lead response.',
      features: [
        'Lead Response flow',
        'Instant inquiry replies',
        'Dashboard + KPI tracking',
        '$1,500 activation',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      flows: 3,
      activation: 1500,
      monthly: 1047,
      description: 'Three active workflows. Response, follow-up, and routing running continuously.',
      popular: true,
      features: [
        'Lead Response flow',
        'Follow-Up flow',
        'Admin Routing flow',
        'Dashboard + KPI tracking',
        '$1,500 activation',
      ],
    },
    {
      id: 'ops',
      name: 'Ops Stack',
      flows: 5,
      activation: 1500,
      monthly: 1745,
      description: 'Full operational coverage. Five active workflows running your property management layer.',
      features: [
        'All 3 Growth flows',
        '2 additional flows',
        'Priority setup support',
        'Dashboard + KPI tracking',
        '$1,500 activation',
      ],
    },
  ],
} as const

export const FLOWS = [
  {
    id: 'lead-response',
    name: 'Lead Response',
    slug: 'lead_response',
    trigger: 'New inquiry received',
    outcome: 'Instant reply sent',
    description: 'Respond to every leasing inquiry in seconds with accurate, contextual replies.',
    icon: 'MessageSquare',
  },
  {
    id: 'follow-up',
    name: 'Follow-Up',
    slug: 'follow_up',
    trigger: 'No reply from prospect',
    outcome: 'Re-engagement sequence starts',
    description: 'Automatically re-engage leads who did not respond the first time.',
    icon: 'RefreshCw',
  },
  {
    id: 'admin-routing',
    name: 'Admin Routing',
    slug: 'admin_routing',
    trigger: 'Inbound message received',
    outcome: 'Classified and routed correctly',
    description: 'Classify and route every message to the right person without manual sorting.',
    icon: 'GitBranch',
  },
] as const

export const NAV_LINKS = [
  { href: '/property-management-ai', label: 'Product' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/demo', label: 'Demo' },
  { href: '/faq', label: 'FAQ' },
] as const

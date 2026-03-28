import { Search, X } from 'lucide-react';

interface LeadSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterSource: string | null;
  onFilterSourceChange: (source: string | null) => void;
  filterStatus: string | null;
  onFilterStatusChange: (status: string | null) => void;
  leadCount: number;
}

const SOURCE_OPTIONS = [
  { value: 'inquiry_form', label: 'Inquiry Form' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
];

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'responded', label: 'Responded' },
  { value: 'routed', label: 'Routed' },
  { value: 'error', label: 'Error' },
];

export default function LeadSearch({
  searchQuery,
  onSearchChange,
  filterSource,
  onFilterSourceChange,
  filterStatus,
  onFilterStatusChange,
  leadCount,
}: LeadSearchProps) {
  return (
    <div className="flex flex-col gap-16">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-12 top-1/2 -translate-y-1/2 w-16 h-16 text-text-secondary" />
        <input
          type="text"
          placeholder="Search by name, email, or inquiry..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-40 pr-12 py-12 bg-elevated-surface border border-border rounded-8 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-12 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Clear search"
          >
            <X className="w-16 h-16" />
          </button>
        )}
      </div>

      {/* Filter controls */}
      <div className="flex flex-col sm:flex-row gap-12 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-12 w-full sm:w-auto">
          {/* Source filter */}
          <select
            value={filterSource || ''}
            onChange={(e) => onFilterSourceChange(e.target.value || null)}
            className="px-12 py-8 bg-elevated-surface border border-border rounded-8 text-text-secondary text-small focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Sources</option>
            {SOURCE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus || ''}
            onChange={(e) => onFilterStatusChange(e.target.value || null)}
            className="px-12 py-8 bg-elevated-surface border border-border rounded-8 text-text-secondary text-small focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Result count */}
        <div className="text-small text-text-secondary whitespace-nowrap">
          {leadCount} lead{leadCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}

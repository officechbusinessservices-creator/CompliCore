'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

interface Run {
  id: number;
  startLocation: string;
  endLocation: string;
  startTime: string;
  endTime?: string;
  status: 'in-progress' | 'completed' | 'cancelled';
  distance: number;
  earnings: number;
}

interface RunMetrics {
  totalRuns: number;
  completedRuns: number;
  totalDistance: number;
  totalEarnings: number;
}

export default function OperatorRunsPage() {
  const { data: session } = useSession();
  const [runs, setRuns] = useState<Run[]>([]);
  const [metrics, setMetrics] = useState<RunMetrics>({
    totalRuns: 0,
    completedRuns: 0,
    totalDistance: 0,
    totalEarnings: 0,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>(
    'all'
  );

  useEffect(() => {
    if (!session) return;

    const fetchRuns = async () => {
      try {
        setLoading(true);
        // TODO: Implement API call to fetch runs
        setRuns([]);
        setMetrics({
          totalRuns: 0,
          completedRuns: 0,
          totalDistance: 0,
          totalEarnings: 0,
        });
      } catch (error) {
        console.error('Failed to fetch runs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
  }, [session, filter]);

  if (!session) {
    return <div className="p-4">Please sign in to view your runs.</div>;
  }

  if (loading) {
    return <div className="p-4">Loading run data...</div>;
  }

  const filteredRuns = runs.filter((run) => {
    if (filter === 'active') return run.status === 'in-progress';
    if (filter === 'completed') return run.status === 'completed';
    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Runs</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Runs" value={metrics.totalRuns} />
        <MetricCard label="Completed Runs" value={metrics.completedRuns} />
        <MetricCard
          label="Total Distance"
          value={`${metrics.totalDistance} km`}
        />
        <MetricCard
          label="Total Earnings"
          value={`$${metrics.totalEarnings.toFixed(2)}`}
        />
      </div>

      <div className="mb-6 flex gap-2">
        {(['all', 'active', 'completed'] as const).map((filterOption) => (
          <button
            key={filterOption}
            onClick={() => setFilter(filterOption)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === filterOption
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          {filteredRuns.length === 0 ? (
            <p className="text-gray-600">No runs found.</p>
          ) : (
            <div className="space-y-4">
              {filteredRuns.map((run) => (
                <div
                  key={run.id}
                  className="border rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-gray-600" />
                          <div>
                            <p className="font-medium">{run.startLocation}</p>
                            <p className="text-sm text-gray-600">
                              {run.endLocation}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(run.startTime).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-lg">
                      ${run.earnings.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      {run.distance} km
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                        run.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : run.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {run.status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      {run.status === 'cancelled' && (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {run.status === 'in-progress' && (
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                      )}
                      {run.status.charAt(0).toUpperCase() +
                        run.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

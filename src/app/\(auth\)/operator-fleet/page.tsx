'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';

interface Fleet {
  id: number;
  name: string;
  operatorId: number;
  vehicleCount: number;
  status: 'active' | 'inactive';
}

interface FleetMetrics {
  totalFleets: number;
  activeFleets: number;
  totalVehicles: number;
  avgUtilization: number;
}

export default function OperatorFleetPage() {
  const { data: session } = useSession();
  const [fleets, setFleets] = useState<Fleet[]>([]);
  const [metrics, setMetrics] = useState<FleetMetrics>({
    totalFleets: 0,
    activeFleets: 0,
    totalVehicles: 0,
    avgUtilization: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    const fetchFleets = async () => {
      try {
        setLoading(true);
        // TODO: Implement API call to fetch fleets
        setFleets([]);
        setMetrics({
          totalFleets: 0,
          activeFleets: 0,
          totalVehicles: 0,
          avgUtilization: 0,
        });
      } catch (error) {
        console.error('Failed to fetch fleets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFleets();
  }, [session]);

  if (!session) {
    return <div className="p-4">Please sign in to view your fleet.</div>;
  }

  if (loading) {
    return <div className="p-4">Loading fleet data...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Fleet Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Fleets" value={metrics.totalFleets} />
        <MetricCard label="Active Fleets" value={metrics.activeFleets} />
        <MetricCard label="Total Vehicles" value={metrics.totalVehicles} />
        <MetricCard
          label="Avg Utilization"
          value={`${metrics.avgUtilization}%`}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Your Fleets</h2>
          {fleets.length === 0 ? (
            <p className="text-gray-600">No fleets found.</p>
          ) : (
            <div className="space-y-4">
              {fleets.map((fleet) => (
                <div
                  key={fleet.id}
                  className="border rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-medium">{fleet.name}</h3>
                    <p className="text-sm text-gray-600">
                      {fleet.vehicleCount} vehicles
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      fleet.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {fleet.status}
                  </span>
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

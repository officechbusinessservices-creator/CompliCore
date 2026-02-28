"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";
import { apiGet, apiPost } from "@/lib/api";

interface Channel {
  id: string;
  name: string;
  logo: string;
  status: "connected" | "disconnected" | "syncing" | "error";
  lastSync: string;
  listings: number;
  bookings: number;
  revenue: number;
  commissionRate: number;
  color: string;
}

interface ChannelListing {
  id: string;
  propertyName: string;
  propertyImage: string;
  channels: {
    channelId: string;
    externalId: string;
    status: "active" | "paused" | "pending";
    syncStatus: "synced" | "pending" | "error";
  }[];
}

interface ChannelConnection {
  id: string;
  provider: string;
  environment: string;
  status: string;
  createdAt: string;
}

interface AriRecord {
  id: string;
  propertyId: string;
  type: "availability" | "rates" | "restrictions";
  dateFrom: string;
  dateTo: string;
  status: "queued" | "sent" | "acked" | "failed";
  sentAt?: string;
  ackedAt?: string;
}

interface BookingRevision {
  id: string;
  channelCode: string;
  externalReservationId: string;
  revisionType: "new" | "modified" | "cancelled";
  propertyId?: string;
  guestName?: string;
  checkIn?: string;
  checkOut?: string;
  amount?: number;
  currency?: string;
  status: "received" | "applied" | "acked" | "failed";
  receivedAt: string;
}

interface SyncStatus {
  propertyId: string;
  lastAriPush?: string;
  lastAriAck?: string;
  lastReservationReceived?: string;
  lastReservationAcked?: string;
  outstandingErrors: string[];
  ariPushLagP95Ms?: number;
  reservationIngestLagP95Ms?: number;
}

const staticChannels: Channel[] = [
  {
    id: "airbnb",
    name: "Airbnb",
    logo: "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg",
    status: "connected",
    lastSync: "2 minutes ago",
    listings: 3,
    bookings: 24,
    revenue: 12450,
    commissionRate: 3,
    color: "#FF5A5F",
  },
  {
    id: "vrbo",
    name: "VRBO",
    logo: "https://csvcus.homeaway.com/rsrcs/cdn-logos/2.10.6/bce/brand/vrbo/logo/vrbo-logo-blue.svg",
    status: "connected",
    lastSync: "15 minutes ago",
    listings: 2,
    bookings: 12,
    revenue: 6890,
    commissionRate: 5,
    color: "#1F4B99",
  },
  {
    id: "booking",
    name: "Booking.com",
    logo: "https://cf.bstatic.com/static/img/favicon/f5a96d93e8f6c1ea8f6e8f5c8ad9d50c67e0caef.svg",
    status: "disconnected",
    lastSync: "Never",
    listings: 0,
    bookings: 0,
    revenue: 0,
    commissionRate: 15,
    color: "#003580",
  },
  {
    id: "direct",
    name: "Direct Bookings",
    logo: "",
    status: "connected",
    lastSync: "Real-time",
    listings: 3,
    bookings: 11,
    revenue: 8200,
    commissionRate: 0,
    color: "#10B981",
  },
];

const staticListings: ChannelListing[] = [
  {
    id: "l1",
    propertyName: "Modern Downtown Loft",
    propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    channels: [
      { channelId: "airbnb", externalId: "airbnb-123456", status: "active", syncStatus: "synced" },
      { channelId: "vrbo", externalId: "vrbo-789012", status: "active", syncStatus: "synced" },
      { channelId: "direct", externalId: "direct-001", status: "active", syncStatus: "synced" },
    ],
  },
  {
    id: "l2",
    propertyName: "Cozy Beachfront Cottage",
    propertyImage: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=400",
    channels: [
      { channelId: "airbnb", externalId: "airbnb-234567", status: "active", syncStatus: "synced" },
      { channelId: "vrbo", externalId: "vrbo-890123", status: "paused", syncStatus: "synced" },
      { channelId: "direct", externalId: "direct-002", status: "active", syncStatus: "synced" },
    ],
  },
  {
    id: "l3",
    propertyName: "Luxury Mountain Cabin",
    propertyImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400",
    channels: [
      { channelId: "airbnb", externalId: "airbnb-345678", status: "active", syncStatus: "pending" },
      { channelId: "direct", externalId: "direct-003", status: "active", syncStatus: "synced" },
    ],
  },
];

const staticSyncActivity = [
  { id: "s1", channel: "Airbnb", action: "Calendar synced", property: "Modern Downtown Loft", time: "2 min ago", status: "success" },
  { id: "s2", channel: "VRBO", action: "Booking imported", property: "Cozy Beachfront Cottage", time: "15 min ago", status: "success" },
  { id: "s3", channel: "Airbnb", action: "Rates updated", property: "All properties", time: "1 hour ago", status: "success" },
  { id: "s4", channel: "Airbnb", action: "New review synced", property: "Luxury Mountain Cabin", time: "3 hours ago", status: "success" },
  { id: "s5", channel: "VRBO", action: "Listing updated", property: "Modern Downtown Loft", time: "Yesterday", status: "success" },
];

type ActiveTab = "overview" | "listings" | "sync" | "ari" | "reservations";

function getStatusColor(status: string): string {
  switch (status) {
    case "connected":
    case "active":
    case "synced":
    case "success":
    case "acked":
    case "applied":
      return "bg-emerald-500";
    case "syncing":
    case "pending":
    case "sent":
    case "queued":
      return "bg-amber-500";
    case "error":
    case "disconnected":
    case "failed":
      return "bg-rose-500";
    case "paused":
    case "received":
      return "bg-zinc-400";
    default:
      return "bg-zinc-400";
  }
}

function formatLagMs(ms?: number): string {
  if (ms === undefined) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function formatRelative(iso?: string): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} min ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} hr ago`;
  return new Date(iso).toLocaleDateString();
}

const CHANNEL_CODE_LABELS: Record<string, string> = {
  ABB: "Airbnb",
  BDC: "Booking.com",
  EXP: "Expedia",
  VBO: "VRBO",
  UNK: "Unknown",
};

export default function ChannelsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingChannel, setConnectingChannel] = useState<Channel | null>(null);
  const [channelsData, setChannelsData] = useState<Channel[]>(staticChannels);
  const [listingsData, setListingsData] = useState<ChannelListing[]>(staticListings);
  const [syncActivity, setSyncActivity] = useState(staticSyncActivity);
  const [integrations, setIntegrations] = useState<any[]>([]);

  // Distribution state
  const [connections, setConnections] = useState<ChannelConnection[]>([]);
  const [ariRecords, setAriRecords] = useState<AriRecord[]>([]);
  const [revisions, setRevisions] = useState<BookingRevision[]>([]);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [loadingDistribution, setLoadingDistribution] = useState(false);
  const [pushingAri, setPushingAri] = useState(false);
  const [reconJobId, setReconJobId] = useState<string | null>(null);

  useEffect(() => {
    fetchModuleData<Channel[]>("/channels", staticChannels).then(setChannelsData);
    fetchModuleData<ChannelListing[]>("/channels/listings", staticListings).then(setListingsData);
    fetchModuleData<typeof staticSyncActivity>("/channels/sync", staticSyncActivity).then(setSyncActivity);
    fetchModuleData<any[]>("/integrations", []).then(setIntegrations);
  }, []);

  const fetchDistributionData = useCallback(async () => {
    setLoadingDistribution(true);
    try {
      const [connsRes, ariRes, revsRes, statusRes] = await Promise.allSettled([
        apiGet<{ data: ChannelConnection[] }>("/distribution/connections"),
        apiGet<{ data: AriRecord[] }>("/distribution/ari/records"),
        apiGet<{ data: BookingRevision[] }>("/distribution/reservations"),
        apiGet<SyncStatus>("/distribution/properties/demo-property/sync-status"),
      ]);
      if (connsRes.status === "fulfilled") setConnections(connsRes.value.data ?? []);
      if (ariRes.status === "fulfilled") setAriRecords(ariRes.value.data ?? []);
      if (revsRes.status === "fulfilled") setRevisions(revsRes.value.data ?? []);
      if (statusRes.status === "fulfilled") setSyncStatus(statusRes.value);
    } finally {
      setLoadingDistribution(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "ari" || activeTab === "reservations") {
      fetchDistributionData();
    }
  }, [activeTab, fetchDistributionData]);

  const handlePushAri = useCallback(async () => {
    const connId = connections[0]?.id ?? "conn_demo_channex";
    setPushingAri(true);
    try {
      await apiPost("/distribution/ari/push", {
        connectionId: connId,
        propertyId: "demo-property",
        type: "availability",
        dateFrom: new Date().toISOString().slice(0, 10),
        dateTo: new Date(Date.now() + 30 * 86_400_000).toISOString().slice(0, 10),
        values: [{ roomTypeId: "rt_main", availability: 1 }],
      });
      await fetchDistributionData();
    } finally {
      setPushingAri(false);
    }
  }, [connections, fetchDistributionData]);

  const handleReconcile = useCallback(async () => {
    try {
      const res = await apiPost<{ jobId: string }>("/distribution/reconcile", { propertyId: "demo-property" });
      setReconJobId(res.jobId);
    } catch {
      // ignore
    }
  }, []);

  const totalRevenue = channelsData.reduce((sum, c) => sum + c.revenue, 0);
  const totalBookings = channelsData.reduce((sum, c) => sum + c.bookings, 0);
  const connectedChannels = channelsData.filter((c) => c.status === "connected").length;

  const ariSuccessRate = ariRecords.length
    ? ((ariRecords.filter((r) => r.status === "acked").length / ariRecords.length) * 100).toFixed(1)
    : "—";
  const revAckedCount = revisions.filter((r) => r.status === "acked").length;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prototype/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Channel Distribution</h1>
              <p className="text-xs text-zinc-500">ARI sync · Reservation ingest · OTA mapping</p>
            </div>
          </div>
          <button
            onClick={() => setShowConnectModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Connect Channel
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Connected Channels</p>
            <p className="text-2xl font-bold">{connectedChannels}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Total Bookings (30d)</p>
            <p className="text-2xl font-bold">{totalBookings}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Total Revenue (30d)</p>
            <p className="text-2xl font-bold text-emerald-600">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">ARI Push Success</p>
            <p className="text-2xl font-bold">{ariSuccessRate}%</p>
          </div>
        </div>

        {integrations.length > 0 && (
          <div className="mb-6 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Supported Integrations</h3>
              <span className="text-xs text-zinc-500">{integrations.length} providers</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {integrations.slice(0, 10).map((integration) => (
                <span key={integration.id} className="px-2 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  {integration.name}
                </span>
              ))}
              {integrations.length > 10 && (
                <span className="px-2 py-1 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                  +{integrations.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["overview", "listings", "sync", "ari", "reservations"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab === "sync" ? "Sync Activity" : tab === "ari" ? "ARI & Distribution" : tab === "reservations" ? "Reservations" : tab}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ─────────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {channelsData.map((channel) => (
                <div key={channel.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {channel.logo ? (
                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5 border border-zinc-200">
                          <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${channel.color}20` }}>
                          <svg className="w-5 h-5" style={{ color: channel.color }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{channel.name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`w-2 h-2 rounded-full ${getStatusColor(channel.status)}`} />
                          <span className="text-xs text-zinc-500 capitalize">{channel.status}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
                      <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>

                  {channel.status === "connected" ? (
                    <>
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-zinc-500">Listings</p>
                          <p className="font-semibold">{channel.listings}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Bookings</p>
                          <p className="font-semibold">{channel.bookings}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500">Revenue</p>
                          <p className="font-semibold">{formatCurrency(channel.revenue)}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>Last sync: {channel.lastSync}</span>
                        <span>{channel.commissionRate}% commission</span>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => { setConnectingChannel(channel); setShowConnectModal(true); }}
                      className="w-full py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm"
                    >
                      Connect {channel.name}
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Revenue by Channel</h3>
              <div className="space-y-4">
                {channelsData.filter((c) => c.revenue > 0).map((channel) => {
                  const percentage = (channel.revenue / totalRevenue) * 100;
                  return (
                    <div key={channel.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{channel.name}</span>
                        <span className="font-medium">{formatCurrency(channel.revenue)} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${percentage}%`, backgroundColor: channel.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ── Listings Tab ─────────────────────────────────────────────────── */}
        {activeTab === "listings" && (
          <div className="space-y-4">
            {listingsData.map((listing) => (
              <div key={listing.id} className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
                <div className="flex gap-4">
                  <img src={listing.propertyImage} alt="" className="w-24 h-24 rounded-lg object-cover shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-semibold mb-3">{listing.propertyName}</h3>
                    <div className="flex flex-wrap gap-2">
                      {channelsData.filter((c) => c.status === "connected").map((channel) => {
                        const channelListing = listing.channels.find((cl) => cl.channelId === channel.id);
                        return (
                          <div
                            key={channel.id}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                              channelListing?.status === "active"
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                : channelListing?.status === "paused"
                                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${channelListing ? getStatusColor(channelListing.status) : "bg-zinc-400"}`} />
                            {channel.name}
                            {channelListing && (
                              <span className="text-xs opacity-70">({channelListing.syncStatus})</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg h-fit">
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Sync Activity Tab ─────────────────────────────────────────────── */}
        {activeTab === "sync" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold">Sync Activity Log</h3>
              <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
                Sync All Now
              </button>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {syncActivity.map((activity) => (
                <div key={activity.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-zinc-500">{activity.channel} · {activity.property}</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ARI & Distribution Tab ────────────────────────────────────────── */}
        {activeTab === "ari" && (
          <div className="space-y-6">
            {/* Sync status metrics */}
            {syncStatus && (
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Property Sync Status — demo-property</h3>
                  <button
                    onClick={handleReconcile}
                    className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {reconJobId ? `Job ${reconJobId.slice(-8)} queued` : "Run Reconciliation"}
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Last ARI Push</p>
                    <p className="font-medium text-sm">{formatRelative(syncStatus.lastAriPush)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Last ARI Ack</p>
                    <p className="font-medium text-sm">{formatRelative(syncStatus.lastAriAck)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">ARI Push Lag (p95)</p>
                    <p className={`font-medium text-sm ${(syncStatus.ariPushLagP95Ms ?? 0) > 60_000 ? "text-rose-500" : "text-emerald-600"}`}>
                      {formatLagMs(syncStatus.ariPushLagP95Ms)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Last Reservation</p>
                    <p className="font-medium text-sm">{formatRelative(syncStatus.lastReservationReceived)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Reservation Ingest Lag (p95)</p>
                    <p className={`font-medium text-sm ${(syncStatus.reservationIngestLagP95Ms ?? 0) > 15_000 ? "text-rose-500" : "text-emerald-600"}`}>
                      {formatLagMs(syncStatus.reservationIngestLagP95Ms)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Outstanding Errors</p>
                    <p className={`font-medium text-sm ${syncStatus.outstandingErrors.length > 0 ? "text-rose-500" : "text-emerald-600"}`}>
                      {syncStatus.outstandingErrors.length === 0 ? "None" : `${syncStatus.outstandingErrors.length} error(s)`}
                    </p>
                  </div>
                </div>
                {syncStatus.outstandingErrors.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {syncStatus.outstandingErrors.map((err, i) => (
                      <div key={i} className="text-xs px-3 py-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg">{err}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Channel manager connections */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Channel Manager Connections</h3>
              {loadingDistribution && <p className="text-sm text-zinc-500">Loading...</p>}
              {!loadingDistribution && connections.length === 0 && (
                <p className="text-sm text-zinc-500">No connections configured. Connect a channel manager to start distributing ARI.</p>
              )}
              <div className="space-y-3">
                {connections.map((conn) => (
                  <div key={conn.id} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                    <div>
                      <p className="font-medium text-sm capitalize">{conn.provider}</p>
                      <p className="text-xs text-zinc-500">{conn.environment} · {conn.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${getStatusColor(conn.status)}`} />
                      <span className="text-xs text-zinc-500 capitalize">{conn.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ARI push action */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">ARI Push Records</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">Availability, rates, and restrictions sent to channel manager</p>
                </div>
                <button
                  onClick={handlePushAri}
                  disabled={pushingAri}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {pushingAri ? "Pushing..." : "Push ARI Now"}
                </button>
              </div>

              {/* SLO targets callout */}
              <div className="mb-4 px-4 py-3 rounded-lg bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-500 flex flex-wrap gap-4">
                <span>Target: ARI push success ≥ 99.5%</span>
                <span>Target: reservation-to-ARI push p95 &lt; 60s</span>
                <span>Target: reservation ingest p95 &lt; 15s</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                      <th className="text-left pb-2 font-medium">ID</th>
                      <th className="text-left pb-2 font-medium">Type</th>
                      <th className="text-left pb-2 font-medium">Date Range</th>
                      <th className="text-left pb-2 font-medium">Status</th>
                      <th className="text-left pb-2 font-medium">Sent</th>
                      <th className="text-left pb-2 font-medium">Acked</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {ariRecords.length === 0 && !loadingDistribution && (
                      <tr><td colSpan={6} className="py-4 text-xs text-zinc-400 text-center">No ARI push records yet.</td></tr>
                    )}
                    {ariRecords.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2 font-mono text-xs text-zinc-400">{r.id.slice(-8)}</td>
                        <td className="py-2 capitalize">{r.type}</td>
                        <td className="py-2 text-xs">{r.dateFrom} → {r.dateTo}</td>
                        <td className="py-2">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${
                            r.status === "acked" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                            r.status === "failed" ? "bg-rose-500/10 text-rose-600" :
                            "bg-amber-500/10 text-amber-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(r.status)}`} />
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2 text-xs text-zinc-500">{r.sentAt ? formatRelative(r.sentAt) : "—"}</td>
                        <td className="py-2 text-xs text-zinc-500">{r.ackedAt ? formatRelative(r.ackedAt) : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* iCal exclusion notice */}
            <div className="px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-400">
              <strong>Note:</strong> iCal-based sync is explicitly excluded from Zero Operational Friction claims. iCal only syncs availability (no rates), has 30–180 min import delays, and Vrbo restricts iCal import for properties managed via third-party PMS. Use ARI push (above) for reliable distribution.
            </div>
          </div>
        )}

        {/* ── Reservations Tab ──────────────────────────────────────────────── */}
        {activeTab === "reservations" && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Total Revisions</p>
                <p className="text-2xl font-bold">{revisions.length}</p>
              </div>
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Acked</p>
                <p className="text-2xl font-bold text-emerald-600">{revAckedCount}</p>
              </div>
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Ingest Lag (p95)</p>
                <p className="text-2xl font-bold">{formatLagMs(syncStatus?.reservationIngestLagP95Ms)}</p>
              </div>
              <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-zinc-500">Duplicate Rate</p>
                <p className="text-2xl font-bold text-emerald-600">0%</p>
              </div>
            </div>

            {/* Revisions table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
                <h3 className="font-semibold">Booking Revisions</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Normalized reservation events from channel manager. Ack occurs only after durable ledger apply.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                      <th className="text-left px-4 py-3 font-medium">Revision ID</th>
                      <th className="text-left px-4 py-3 font-medium">Channel</th>
                      <th className="text-left px-4 py-3 font-medium">Type</th>
                      <th className="text-left px-4 py-3 font-medium">Guest</th>
                      <th className="text-left px-4 py-3 font-medium">Stay</th>
                      <th className="text-left px-4 py-3 font-medium">Status</th>
                      <th className="text-left px-4 py-3 font-medium">Received</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {revisions.length === 0 && !loadingDistribution && (
                      <tr><td colSpan={7} className="px-4 py-6 text-xs text-zinc-400 text-center">No booking revisions ingested yet.</td></tr>
                    )}
                    {revisions.map((rev) => (
                      <tr key={rev.id}>
                        <td className="px-4 py-3 font-mono text-xs text-zinc-400">{rev.id.slice(-8)}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
                            {CHANNEL_CODE_LABELS[rev.channelCode] ?? rev.channelCode}
                          </span>
                        </td>
                        <td className="px-4 py-3 capitalize text-xs">{rev.revisionType}</td>
                        <td className="px-4 py-3 text-sm">{rev.guestName ?? "—"}</td>
                        <td className="px-4 py-3 text-xs text-zinc-500">
                          {rev.checkIn && rev.checkOut ? `${rev.checkIn} → ${rev.checkOut}` : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs ${
                            rev.status === "acked" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" :
                            rev.status === "failed" ? "bg-rose-500/10 text-rose-600" :
                            rev.status === "applied" ? "bg-blue-500/10 text-blue-600 dark:text-blue-400" :
                            "bg-amber-500/10 text-amber-600"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${getStatusColor(rev.status)}`} />
                            {rev.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-500">{formatRelative(rev.receivedAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Compliance note */}
            <div className="px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-700 dark:text-blue-400">
              <strong>PCI/PII:</strong> Payment collection metadata on booking revisions is PCI-adjacent. Access is governed by RBAC and audit logging. Reservation data is encrypted at rest and in transit.
            </div>
          </div>
        )}
      </div>

      {/* Connect Channel Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">
                {connectingChannel ? `Connect ${connectingChannel.name}` : "Connect Channel"}
              </h3>
              <button
                onClick={() => { setShowConnectModal(false); setConnectingChannel(null); }}
                className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {!connectingChannel ? (
              <div className="space-y-3">
                {channelsData.filter((c) => c.status === "disconnected").map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setConnectingChannel(channel)}
                    className="w-full flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5 border border-zinc-200">
                      <img src={channel.logo} alt={channel.name} className="w-full h-full object-contain" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{channel.name}</p>
                      <p className="text-xs text-zinc-500">{channel.commissionRate}% commission</p>
                    </div>
                  </button>
                ))}
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-500 mb-2 font-medium">Via Channel Manager (recommended)</p>
                  <button
                    onClick={() => setConnectingChannel({ id: "channex", name: "Channex", logo: "", status: "disconnected", lastSync: "Never", listings: 0, bookings: 0, revenue: 0, commissionRate: 0, color: "#10B981" })}
                    className="w-full flex items-center gap-4 p-4 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Channex (Channel Manager API)</p>
                      <p className="text-xs text-zinc-500">Connect once · Push ARI to Airbnb, VRBO, Expedia, Booking.com</p>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl mb-4">
                  {connectingChannel.logo ? (
                    <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5 border border-zinc-200">
                      <img src={connectingChannel.logo} alt={connectingChannel.name} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{connectingChannel.name}</p>
                    {connectingChannel.commissionRate > 0 && (
                      <p className="text-xs text-zinc-500">{connectingChannel.commissionRate}% commission per booking</p>
                    )}
                  </div>
                </div>
                {connectingChannel.id === "channex" ? (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-500">
                      Channex is the recommended channel manager integration. It distributes your ARI to Airbnb (ABB), Booking.com (BDC), Expedia (EXP), VRBO (VBO), and 400+ more channels via a single API connection.
                    </p>
                    <div className="text-xs text-zinc-400 space-y-1">
                      <p>· Direct OTA integrations require partner certification programs (gated)</p>
                      <p>· Channel manager handles protocol mapping, retries, and normalization</p>
                      <p>· Mapping UI embedded via iframe after connection</p>
                    </div>
                    <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                      Authorize Channex Connection
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-zinc-500 mb-4">
                      Click the button below to authorize our platform to sync with your {connectingChannel.name} account.
                    </p>
                    <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                      Authorize Connection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

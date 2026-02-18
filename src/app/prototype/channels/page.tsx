"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/mockData";
import { fetchModuleData } from "@/lib/modulesApi";

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

const channels: Channel[] = [
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

const listings: ChannelListing[] = [
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

const recentSyncActivity = [
  { id: "s1", channel: "Airbnb", action: "Calendar synced", property: "Modern Downtown Loft", time: "2 min ago", status: "success" },
  { id: "s2", channel: "VRBO", action: "Booking imported", property: "Cozy Beachfront Cottage", time: "15 min ago", status: "success" },
  { id: "s3", channel: "Airbnb", action: "Rates updated", property: "All properties", time: "1 hour ago", status: "success" },
  { id: "s4", channel: "Airbnb", action: "New review synced", property: "Luxury Mountain Cabin", time: "3 hours ago", status: "success" },
  { id: "s5", channel: "VRBO", action: "Listing updated", property: "Modern Downtown Loft", time: "Yesterday", status: "success" },
];

export default function ChannelsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "listings" | "sync">("overview");
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectingChannel, setConnectingChannel] = useState<Channel | null>(null);
  const [channelsData, setChannelsData] = useState<Channel[]>(channels);
  const [listingsData, setListingsData] = useState<ChannelListing[]>(listings);
  const [syncActivity, setSyncActivity] = useState(recentSyncActivity);

  const [integrations, setIntegrations] = useState<any[]>([]);

  useEffect(() => {
    fetchModuleData<Channel[]>("/channels", channels).then(setChannelsData);
    fetchModuleData<ChannelListing[]>("/channels/listings", listings).then(setListingsData);
    fetchModuleData<typeof recentSyncActivity>("/channels/sync", recentSyncActivity).then(setSyncActivity);
    fetchModuleData<any[]>("/integrations", []).then(setIntegrations);
  }, []);

  const totalRevenue = channelsData.reduce((sum, c) => sum + c.revenue, 0);
  const totalBookings = channelsData.reduce((sum, c) => sum + c.bookings, 0);
  const connectedChannels = channelsData.filter((c) => c.status === "connected").length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
      case "synced":
      case "success":
        return "bg-emerald-500";
      case "syncing":
      case "pending":
        return "bg-amber-500";
      case "error":
      case "disconnected":
        return "bg-rose-500";
      case "paused":
        return "bg-zinc-400";
      default:
        return "bg-zinc-400";
    }
  };

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
              <h1 className="font-semibold text-lg">Channel Manager</h1>
              <p className="text-xs text-zinc-500">Manage OTA integrations</p>
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
            <p className="text-sm text-zinc-500">Avg Commission</p>
            <p className="text-2xl font-bold">4.2%</p>
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
        <div className="flex gap-2 mb-6">
          {(["overview", "listings", "sync"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab === "sync" ? "Sync Activity" : tab}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <>
            {/* Channels Grid */}
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
                      onClick={() => {
                        setConnectingChannel(channel);
                        setShowConnectModal(true);
                      }}
                      className="w-full py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm"
                    >
                      Connect {channel.name}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Revenue by Channel Chart */}
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
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${percentage}%`, backgroundColor: channel.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

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
                            <span className={`w-2 h-2 rounded-full ${
                              channelListing ? getStatusColor(channelListing.status) : "bg-zinc-400"
                            }`} />
                            {channel.name}
                            {channelListing && (
                              <span className="text-xs opacity-70">
                                ({channelListing.syncStatus})
                              </span>
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
      </div>

      {/* Connect Modal */}
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
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-xl mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1.5 border border-zinc-200">
                    <img src={connectingChannel.logo} alt={connectingChannel.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <p className="font-medium">{connectingChannel.name}</p>
                    <p className="text-xs text-zinc-500">{connectingChannel.commissionRate}% commission per booking</p>
                  </div>
                </div>
                <p className="text-sm text-zinc-500 mb-4">
                  Click the button below to authorize our platform to sync with your {connectingChannel.name} account.
                </p>
                <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
                  Authorize Connection
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

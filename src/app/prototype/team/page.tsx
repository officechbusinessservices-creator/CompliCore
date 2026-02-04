"use client";

import { useState } from "react";
import Link from "next/link";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: "owner" | "co-host" | "cleaner" | "maintenance" | "viewer";
  status: "active" | "pending" | "inactive";
  joinedAt: string;
  properties: string[];
  lastActive: string;
  permissions: {
    manageBookings: boolean;
    manageCalendar: boolean;
    messagingGuests: boolean;
    managePricing: boolean;
    viewFinancials: boolean;
    manageListings: boolean;
  };
}

const roleColors = {
  owner: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  "co-host": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  cleaner: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  maintenance: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  viewer: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-500/20",
};

const roleDescriptions = {
  owner: "Full access to all properties and settings",
  "co-host": "Manage bookings, calendar, and guest communication",
  cleaner: "View turnover schedule and mark cleanings complete",
  maintenance: "View maintenance requests and mark issues resolved",
  viewer: "View-only access to bookings and calendar",
};

const defaultPermissions = {
  owner: { manageBookings: true, manageCalendar: true, messagingGuests: true, managePricing: true, viewFinancials: true, manageListings: true },
  "co-host": { manageBookings: true, manageCalendar: true, messagingGuests: true, managePricing: false, viewFinancials: false, manageListings: false },
  cleaner: { manageBookings: false, manageCalendar: true, messagingGuests: false, managePricing: false, viewFinancials: false, manageListings: false },
  maintenance: { manageBookings: false, manageCalendar: true, messagingGuests: true, managePricing: false, viewFinancials: false, manageListings: false },
  viewer: { manageBookings: false, manageCalendar: false, messagingGuests: false, managePricing: false, viewFinancials: false, manageListings: false },
};

const teamMembers: TeamMember[] = [
  {
    id: "member-1",
    name: "You",
    email: "host@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    role: "owner",
    status: "active",
    joinedAt: "2024-01-01",
    properties: ["Modern Downtown Loft", "Cozy Beachfront Cottage", "Luxury Mountain Cabin"],
    lastActive: "Just now",
    permissions: defaultPermissions.owner,
  },
  {
    id: "member-2",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    role: "co-host",
    status: "active",
    joinedAt: "2025-06-15",
    properties: ["Modern Downtown Loft", "Cozy Beachfront Cottage"],
    lastActive: "2 hours ago",
    permissions: defaultPermissions["co-host"],
  },
  {
    id: "member-3",
    name: "Mike Chen",
    email: "mike@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    role: "cleaner",
    status: "active",
    joinedAt: "2025-08-20",
    properties: ["Modern Downtown Loft", "Cozy Beachfront Cottage", "Luxury Mountain Cabin"],
    lastActive: "Yesterday",
    permissions: defaultPermissions.cleaner,
  },
  {
    id: "member-4",
    name: "Emily Davis",
    email: "emily@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100",
    role: "maintenance",
    status: "active",
    joinedAt: "2025-10-01",
    properties: ["Luxury Mountain Cabin"],
    lastActive: "3 days ago",
    permissions: defaultPermissions.maintenance,
  },
  {
    id: "member-5",
    name: "James Wilson",
    email: "james@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    role: "viewer",
    status: "pending",
    joinedAt: "2026-02-01",
    properties: ["Modern Downtown Loft"],
    lastActive: "Pending",
    permissions: defaultPermissions.viewer,
  },
];

export default function TeamPage() {
  const [members, setMembers] = useState(teamMembers);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("co-host");

  const handleInvite = () => {
    if (!inviteEmail) return;

    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      role: inviteRole,
      status: "pending",
      joinedAt: new Date().toISOString().split("T")[0],
      properties: [],
      lastActive: "Pending",
      permissions: defaultPermissions[inviteRole],
    };

    setMembers([...members, newMember]);
    setInviteEmail("");
    setShowInviteModal(false);
  };

  const removeMember = (id: string) => {
    setMembers(members.filter((m) => m.id !== id));
    setSelectedMember(null);
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
              <h1 className="font-semibold text-lg">Team Management</h1>
              <p className="text-xs text-zinc-500">Manage co-hosts and team members</p>
            </div>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Invite Member
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Total Members</p>
            <p className="text-2xl font-bold">{members.length}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Co-hosts</p>
            <p className="text-2xl font-bold text-emerald-600">{members.filter((m) => m.role === "co-host").length}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Active Now</p>
            <p className="text-2xl font-bold text-blue-600">{members.filter((m) => m.status === "active").length}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Pending Invites</p>
            <p className="text-2xl font-bold text-amber-600">{members.filter((m) => m.status === "pending").length}</p>
          </div>
        </div>

        {/* Role Legend */}
        <div className="mb-6 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="font-semibold mb-3">Team Roles</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {(Object.keys(roleDescriptions) as Array<keyof typeof roleDescriptions>).map((role) => (
              <div key={role} className="flex items-start gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${roleColors[role]}`}>
                  {role}
                </span>
                <p className="text-xs text-zinc-500">{roleDescriptions[role]}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
            <h3 className="font-semibold">Team Members</h3>
          </div>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {members.map((member) => (
              <div key={member.id} className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full" />
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                        member.status === "active" ? "bg-emerald-500" : member.status === "pending" ? "bg-amber-500" : "bg-zinc-400"
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize border ${roleColors[member.role]}`}>
                          {member.role}
                        </span>
                        {member.status === "pending" && (
                          <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/10 text-amber-600 border border-amber-500/20">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-zinc-500">{member.email}</p>
                      <p className="text-xs text-zinc-400 mt-1">
                        {member.properties.length} properties · Last active: {member.lastActive}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMember(member)}
                      className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity Log */}
        <div className="mt-8 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { user: "Sarah Johnson", action: "accepted booking for Modern Downtown Loft", time: "2 hours ago" },
              { user: "Mike Chen", action: "marked cleaning complete for Cozy Beachfront Cottage", time: "Yesterday" },
              { user: "Sarah Johnson", action: "updated calendar for Modern Downtown Loft", time: "2 days ago" },
              { user: "Emily Davis", action: "resolved maintenance issue at Luxury Mountain Cabin", time: "3 days ago" },
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-zinc-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Invite Team Member</h3>
              <button onClick={() => setShowInviteModal(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as TeamMember["role"])}
                  className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="co-host">Co-host</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="viewer">Viewer</option>
                </select>
                <p className="text-xs text-zinc-500 mt-1">{roleDescriptions[inviteRole]}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member Settings Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src={selectedMember.avatar} alt={selectedMember.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="font-semibold">{selectedMember.name}</h3>
                  <p className="text-sm text-zinc-500">{selectedMember.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Permissions */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Permissions</h4>
              <div className="space-y-3">
                {Object.entries(selectedMember.permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <div className={`w-10 h-6 rounded-full ${value ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"} relative`}>
                      <span className={`absolute top-0.5 ${value ? "right-0.5" : "left-0.5"} w-5 h-5 bg-white rounded-full shadow transition-all`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assigned Properties */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Assigned Properties</h4>
              <div className="space-y-2">
                {selectedMember.properties.map((property) => (
                  <div key={property} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <span className="text-sm">{property}</span>
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {selectedMember.role !== "owner" && (
              <button
                onClick={() => removeMember(selectedMember.id)}
                className="w-full py-2.5 border border-rose-500 text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              >
                Remove Team Member
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

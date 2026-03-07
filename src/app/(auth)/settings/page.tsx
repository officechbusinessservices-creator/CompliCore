"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { CheckCircle2, User, Bell, Shield, CreditCard, Globe, Loader2, AlertCircle } from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api-client";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Globe },
];

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  roles: string[];
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const token = (session as { accessToken?: string } | null)?.accessToken;

  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    timezone: "America/New_York",
    language: "English",
  });

  const [notifPrefs, setNotifPrefs] = useState({
    newBooking: true,
    bookingReminder: true,
    guestMessage: true,
    payoutProcessed: true,
    reviewReceived: false,
    aiPricingUpdate: false,
  });

  useEffect(() => {
    if (!token) return;
    apiFetch<UserProfile>("/users/me", { token })
      .then((user) => {
        setProfile((p) => ({
          ...p,
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
        }));
      })
      .catch((err) => setProfileError(err instanceof ApiError ? err.message : "Failed to load profile"))
      .finally(() => setProfileLoading(false));
  }, [token]);

  async function saveProfile() {
    if (!token) return;
    setSaving(true);
    setProfileError(null);
    try {
      await apiFetch<UserProfile>("/users/me", {
        method: "PATCH",
        token,
        body: JSON.stringify({
          firstName: profile.firstName,
          lastName: profile.lastName,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setProfileError(err instanceof ApiError ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  function saveLocal() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {saved && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 shadow-lg">
          <CheckCircle2 className="w-4 h-4" /><span className="text-sm">Settings saved</span>
        </div>
      )}

      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account, notifications, and integrations.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 overflow-x-auto border-b border-border pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <div className="space-y-4">
          {profileError && (
            <div className="px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5" />{profileError}
            </div>
          )}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Personal information</h2>
            {profileLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading...
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">First name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Last name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-muted text-sm text-muted-foreground cursor-not-allowed"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Phone number</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Timezone</label>
                  <select
                    value={profile.timezone}
                    onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={saveProfile}
              disabled={saving || profileLoading}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save changes
            </button>
          </div>
        </div>
      )}

      {/* Notifications tab */}
      {activeTab === "notifications" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Email notifications</h2>
            <div className="space-y-4">
              {Object.entries(notifPrefs).map(([key, val]) => {
                const labels: Record<string, string> = {
                  newBooking: "New booking received",
                  bookingReminder: "Booking reminder (24h before check-in)",
                  guestMessage: "New guest message",
                  payoutProcessed: "Payout processed",
                  reviewReceived: "New review received",
                  aiPricingUpdate: "AI pricing rate updates",
                };
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm">{labels[key]}</span>
                    <button
                      onClick={() => setNotifPrefs((p) => ({ ...p, [key]: !val }))}
                      className={`relative w-10 rounded-full transition-colors ${val ? "bg-primary" : "bg-muted"}`}
                      style={{ height: "22px" }}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${val ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={saveLocal} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Save preferences
            </button>
          </div>
        </div>
      )}

      {/* Security tab */}
      {activeTab === "security" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Change password</h2>
            <div className="space-y-3 max-w-sm">
              {["Current password", "New password", "Confirm new password"].map((label) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-1">Two-factor authentication</h2>
            <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account.</p>
            <button onClick={saveLocal} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors">
              Enable 2FA
            </button>
          </div>
          <div className="flex justify-end">
            <button onClick={saveLocal} className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
              Update password
            </button>
          </div>
        </div>
      )}

      {/* Billing tab */}
      {activeTab === "billing" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Current plan</h2>
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div>
                <div className="font-semibold">Host Club + AI</div>
                <div className="text-sm text-muted-foreground">$46/property/month · 3 properties</div>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">Active</span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-semibold mb-4">Payment method</h2>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <CreditCard className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="text-sm font-medium">Visa ending in 4242</div>
                <div className="text-xs text-muted-foreground">Expires 12/2027</div>
              </div>
              <button onClick={saveLocal} className="ml-auto text-xs text-primary hover:underline">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* Integrations tab */}
      {activeTab === "integrations" && (
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold mb-4">Connected integrations</h2>
          <div className="space-y-3">
            {[
              { name: "Airbnb", status: "connected", desc: "3 listings synced" },
              { name: "VRBO", status: "connected", desc: "2 listings synced" },
              { name: "Booking.com", status: "error", desc: "Auth token expired" },
              { name: "Stripe", status: "connected", desc: "Payouts enabled" },
              { name: "August Smart Lock", status: "connected", desc: "3 locks paired" },
            ].map((i) => (
              <div key={i.name} className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div>
                  <div className="text-sm font-medium">{i.name}</div>
                  <div className="text-xs text-muted-foreground">{i.desc}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${i.status === "connected" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                    {i.status}
                  </span>
                  <button onClick={saveLocal} className="text-xs text-primary hover:underline">
                    {i.status === "error" ? "Reconnect" : "Manage"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

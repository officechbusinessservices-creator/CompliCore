"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Home, MapPin, Star, MoreHorizontal, Eye, Edit, Trash2,
  Plus, CheckCircle2, AlertCircle, Clock, Camera, Loader2,
} from "lucide-react";
import { apiFetch, ApiError } from "@/lib/api-client";

const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000";

interface Listing {
  id: number;
  title: string;
  address: string | null;
  photo_url?: string | null;
  price_per_night: number | null;
  status: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: Clock },
  paused: { label: "Paused", color: "bg-amber-500/10 text-amber-600", icon: AlertCircle },
};

export default function ListingsPage() {
  const { data: session } = useSession();
  const token = (session as { accessToken?: string } | null)?.accessToken;

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiFetch<Listing[]>("/listings", { token })
      .then(setListings)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Failed to load listings"))
      .finally(() => setLoading(false));
  }, [token]);

  const [uploadingId, setUploadingId] = useState<number | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function uploadPhoto(id: number, file: File) {
    setUploadingId(id);
    try {
      const form = new FormData();
      form.append("photo", file);
      const res = await fetch(`${BASE}/v1/listings/${id}/photo`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
        body: form,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setListings((prev) => prev.map((l) => l.id === id ? { ...l, photo_url: data.photo_url } : l));
      showToast("Photo uploaded ✓");
    } catch {
      showToast("Failed to upload photo");
    } finally {
      setUploadingId(null);
    }
  }

  async function toggleStatus(id: number, currentStatus: string) {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    try {
      const updated = await apiFetch<Listing>(`/listings/${id}`, {
        method: "PATCH",
        token,
        body: JSON.stringify({ status: newStatus }),
      });
      setListings((prev) => prev.map((l) => l.id === updated.id ? updated : l));
      setMenuOpen(null);
      showToast("Listing status updated");
    } catch {
      showToast("Failed to update listing status");
    }
  }

  async function deleteListing(id: number) {
    try {
      await apiFetch(`/listings/${id}`, { method: "DELETE", token });
      setListings((prev) => prev.filter((l) => l.id !== id));
      setDeleteConfirm(null);
      showToast("Listing deleted");
    } catch {
      showToast("Failed to delete listing");
    }
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 shadow-lg">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm">{toast}</span>
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-semibold mb-2">Delete listing?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently remove the listing and all associated data. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteListing(deleteConfirm)}
                className="flex-1 py-2.5 rounded-lg bg-rose-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Listings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {listings.length} properties · {listings.filter((l) => l.status === "active").length} active
          </p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
        >
          <Plus className="w-4 h-4" /> Add listing
        </Link>
      </div>

      {loading && (
        <div className="text-center py-12 text-sm text-muted-foreground">Loading listings…</div>
      )}
      {error && !loading && (
        <div className="text-center py-12 text-sm text-rose-500">{error}</div>
      )}

      {!loading && !error && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {listings.map((l) => {
            const sc = statusConfig[l.status] ?? statusConfig.draft;
            const StatusIcon = sc.icon;
            return (
              <div key={l.id} className="rounded-xl border border-border bg-card overflow-hidden">
                {/* Photo */}
                <div className="h-36 bg-muted flex items-center justify-center relative overflow-hidden">
                  {l.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.photo_url} alt={l.title} className="w-full h-full object-cover" />
                  ) : (
                    <Home className="w-8 h-8 text-muted-foreground/30" />
                  )}
                  {/* Upload photo button */}
                  <label
                    className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
                    title="Upload photo"
                  >
                    {uploadingId === l.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Camera className="w-3.5 h-3.5" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={uploadingId === l.id}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) uploadPhoto(l.id, file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {sc.label}
                    </span>
                  </div>
                  {/* Menu button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => setMenuOpen(menuOpen === l.id ? null : l.id)}
                      className="w-7 h-7 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {menuOpen === l.id && (
                      <div className="absolute right-0 top-8 w-44 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                        <Link
                          href={`/property/${l.id}`}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                          onClick={() => setMenuOpen(null)}
                        >
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" /> View listing
                        </Link>
                        <Link
                          href={`/listings/${l.id}/edit`}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                          onClick={() => setMenuOpen(null)}
                        >
                          <Edit className="w-3.5 h-3.5 text-muted-foreground" /> Edit details
                        </Link>
                        <button
                          onClick={() => toggleStatus(l.id, l.status)}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent transition-colors text-left"
                        >
                          <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                          {l.status === "active" ? "Pause listing" : "Activate listing"}
                        </button>
                        <button
                          onClick={() => { setDeleteConfirm(l.id); setMenuOpen(null); }}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent transition-colors text-left text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="font-semibold text-sm mb-0.5">{l.title}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" /> {l.address ?? "No address"}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center mb-4">
                    <div>
                      <div className="font-semibold text-sm">
                        {l.price_per_night ? `$${l.price_per_night}` : "—"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">/ night</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 text-muted-foreground/40" />
                        <span className="text-muted-foreground text-xs">New</span>
                      </div>
                      <div className="text-[10px] text-muted-foreground">No reviews yet</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/property/${l.id}`}
                      className="flex-1 text-center text-xs py-2 rounded-lg border border-border hover:bg-accent transition-colors font-medium"
                    >
                      View
                    </Link>
                    <Link
                      href={`/listings/${l.id}/edit`}
                      className="flex-1 text-center text-xs py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add new card */}
          <Link
            href="/onboarding"
            className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 p-8 text-muted-foreground hover:text-primary min-h-[280px]"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-current flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Add new listing</span>
          </Link>
        </div>
      )}

      {/* Click outside to close menu */}
      {menuOpen !== null && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
      )}
    </div>
  );
}

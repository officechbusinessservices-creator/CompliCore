"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home, MapPin, Star, MoreHorizontal, Eye, Edit, Trash2,
  Plus, CheckCircle2, AlertCircle, Clock, X,
} from "lucide-react";

const initialListings = [
  {
    id: "1", name: "Ocean View Suite", location: "Miami Beach, FL",
    type: "Apartment", bedrooms: 2, bathrooms: 1, price: 187,
    status: "active", occupancy: 82, rating: 4.92, reviews: 48,
  },
  {
    id: "2", name: "Downtown Loft", location: "Austin, TX",
    type: "Loft", bedrooms: 1, bathrooms: 1, price: 143,
    status: "active", occupancy: 79, rating: 4.85, reviews: 31,
  },
  {
    id: "3", name: "Mountain Cabin", location: "Asheville, NC",
    type: "Cabin", bedrooms: 3, bathrooms: 2, price: 223,
    status: "active", occupancy: 71, rating: 4.97, reviews: 22,
  },
  {
    id: "4", name: "City Studio", location: "New York, NY",
    type: "Studio", bedrooms: 1, bathrooms: 1, price: 98,
    status: "draft", occupancy: 0, rating: 0, reviews: 0,
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-600", icon: CheckCircle2 },
  draft: { label: "Draft", color: "bg-muted text-muted-foreground", icon: Clock },
  paused: { label: "Paused", color: "bg-amber-500/10 text-amber-600", icon: AlertCircle },
};

export default function ListingsPage() {
  const [listings, setListings] = useState(initialListings);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function toggleStatus(id: string) {
    setListings((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, status: l.status === "active" ? "paused" : "active" }
          : l
      )
    );
    setMenuOpen(null);
    showToast("Listing status updated");
  }

  function deleteListing(id: string) {
    setListings((prev) => prev.filter((l) => l.id !== id));
    setDeleteConfirm(null);
    showToast("Listing deleted");
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
      {deleteConfirm && (
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
          <p className="text-sm text-muted-foreground mt-0.5">{listings.length} properties · {listings.filter((l) => l.status === "active").length} active</p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
        >
          <Plus className="w-4 h-4" /> Add listing
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {listings.map((l) => {
          const sc = statusConfig[l.status];
          const StatusIcon = sc.icon;
          return (
            <div key={l.id} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Image placeholder */}
              <div className="h-36 bg-muted flex items-center justify-center relative">
                <Home className="w-8 h-8 text-muted-foreground/30" />
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
                        onClick={() => toggleStatus(l.id)}
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
                <div className="font-semibold text-sm mb-0.5">{l.name}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <MapPin className="w-3 h-3" /> {l.location}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div>
                    <div className="font-semibold text-sm">${l.price}</div>
                    <div className="text-[10px] text-muted-foreground">/ night</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{l.occupancy}%</div>
                    <div className="text-[10px] text-muted-foreground">Occupancy</div>
                  </div>
                  <div>
                    <div className="font-semibold text-sm flex items-center justify-center gap-0.5">
                      {l.rating > 0 ? (
                        <><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{l.rating}</>
                      ) : "—"}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{l.reviews} reviews</div>
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

      {/* Click outside to close menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
      )}
    </div>
  );
}

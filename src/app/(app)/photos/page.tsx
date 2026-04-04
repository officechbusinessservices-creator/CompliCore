"use client";

import { useState } from "react";
import Link from "next/link";

interface Photo {
  id: string;
  url: string;
  caption: string;
  uploadedBy: { name: string; avatar: string };
  uploadedAt: Date;
  likes: number;
  liked: boolean;
}

interface Trip {
  id: string;
  name: string;
  propertyName: string;
  propertyImage: string;
  dates: string;
  guests: { name: string; avatar: string }[];
  photos: Photo[];
}

const trips: Trip[] = [
  {
    id: "trip-1",
    name: "Lake Tahoe Weekend",
    propertyName: "Luxury Mountain Cabin",
    propertyImage: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    dates: "Mar 15-18, 2026",
    guests: [
      { name: "You", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" },
      { name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" },
      { name: "James W.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" },
      { name: "Emily C.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" },
    ],
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", caption: "Amazing sunset from the cabin deck!", uploadedBy: { name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" }, uploadedAt: new Date("2026-03-16T18:30:00"), likes: 4, liked: true },
      { id: "p2", url: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800", caption: "Hiking to the summit", uploadedBy: { name: "James W.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" }, uploadedAt: new Date("2026-03-17T14:20:00"), likes: 3, liked: false },
      { id: "p3", url: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?w=800", caption: "Cozy fireplace evening", uploadedBy: { name: "Emily C.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100" }, uploadedAt: new Date("2026-03-16T21:00:00"), likes: 5, liked: true },
      { id: "p4", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800", caption: "Mountain views from our room", uploadedBy: { name: "You", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" }, uploadedAt: new Date("2026-03-15T10:00:00"), likes: 6, liked: false },
      { id: "p5", url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800", caption: "Group dinner at the lodge", uploadedBy: { name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" }, uploadedAt: new Date("2026-03-15T19:30:00"), likes: 4, liked: true },
      { id: "p6", url: "https://images.unsplash.com/photo-1520208422220-d12a3c588e6c?w=800", caption: "Morning coffee with this view", uploadedBy: { name: "James W.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" }, uploadedAt: new Date("2026-03-17T08:00:00"), likes: 2, liked: false },
    ],
  },
];

export default function PhotosPage() {
  const [selectedTrip] = useState(trips[0]);
  const [photos, setPhotos] = useState(selectedTrip.photos);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("grid");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const toggleLike = (photoId: string) => {
    setPhotos(photos.map((p) =>
      p.id === photoId
        ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
        : p
    ));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/browse" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Trip Photos</h1>
              <p className="text-xs text-zinc-500">{selectedTrip.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === "grid" ? "bg-white dark:bg-zinc-700 shadow-sm" : ""}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("timeline")}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${viewMode === "timeline" ? "bg-white dark:bg-zinc-700 shadow-sm" : ""}`}
              >
                Timeline
              </button>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Trip Info */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <img src={selectedTrip.propertyImage} alt="" className="w-full sm:w-32 h-32 rounded-lg object-cover" />
          <div className="flex-1">
            <h2 className="font-semibold text-lg">{selectedTrip.name}</h2>
            <p className="text-sm text-zinc-500">{selectedTrip.propertyName}</p>
            <p className="text-sm text-zinc-500">{selectedTrip.dates}</p>
            <div className="flex items-center gap-2 mt-3">
              <div className="flex -space-x-2">
                {selectedTrip.guests.slice(0, 4).map((guest, idx) => (
                  <img key={idx} src={guest.avatar} alt={guest.name} className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900" />
                ))}
              </div>
              <span className="text-sm text-zinc-500">{selectedTrip.guests.length} guests</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">{photos.length}</p>
            <p className="text-sm text-zinc-500">photos shared</p>
          </div>
        </div>

        {/* Photo Grid/Timeline */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="group relative aspect-square rounded-xl overflow-hidden"
              >
                <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white text-sm line-clamp-2">{photo.caption}</p>
                  </div>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-xs">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                  </svg>
                  {photo.likes}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {photos.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()).map((photo) => (
              <div key={photo.id} className="flex gap-4">
                <img src={photo.uploadedBy.avatar} alt="" className="w-10 h-10 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm">{photo.uploadedBy.name}</span>
                    <span className="text-xs text-zinc-500">{formatDate(photo.uploadedAt)}</span>
                  </div>
                  <button onClick={() => setSelectedPhoto(photo)} className="block w-full max-w-lg">
                    <img src={photo.url} alt={photo.caption} className="w-full rounded-xl" />
                  </button>
                  <p className="mt-2 text-sm">{photo.caption}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      onClick={() => toggleLike(photo.id)}
                      className={`flex items-center gap-1 text-sm ${photo.liked ? "text-rose-500" : "text-zinc-500 hover:text-rose-500"}`}
                    >
                      <svg className={`w-5 h-5 ${photo.liked ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {photo.likes}
                    </button>
                    <button className="flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Lightbox */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
          <button className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={selectedPhoto.url} alt={selectedPhoto.caption} className="w-full rounded-xl" />
            <div className="mt-4 flex items-start justify-between text-white">
              <div className="flex items-center gap-3">
                <img src={selectedPhoto.uploadedBy.avatar} alt="" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="font-medium">{selectedPhoto.uploadedBy.name}</p>
                  <p className="text-sm text-zinc-400">{selectedPhoto.caption}</p>
                </div>
              </div>
              <button
                onClick={() => toggleLike(selectedPhoto.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${selectedPhoto.liked ? "bg-rose-500 text-white" : "bg-white/10 hover:bg-white/20"}`}
              >
                <svg className={`w-5 h-5 ${selectedPhoto.liked ? "fill-current" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {selectedPhoto.likes}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Upload Photos</h3>
              <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-8 text-center">
              <svg className="w-12 h-12 mx-auto mb-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm text-zinc-500 mb-2">Drag and drop your photos here</p>
              <p className="text-xs text-zinc-400 mb-4">or</p>
              <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
                Browse Files
              </button>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-zinc-500 mb-1">Caption</label>
              <input
                type="text"
                placeholder="Add a caption..."
                className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <button className="w-full mt-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors">
              Upload Photos
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

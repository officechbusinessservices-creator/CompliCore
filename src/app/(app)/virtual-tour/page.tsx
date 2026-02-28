"use client";

import { useState } from "react";
import Link from "next/link";

interface TourHotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  description: string;
  type: "info" | "navigation" | "feature";
}

interface TourRoom {
  id: string;
  name: string;
  image: string;
  thumbnail: string;
  hotspots: TourHotspot[];
}

const tourRooms: TourRoom[] = [
  {
    id: "living",
    name: "Living Room",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1600",
    thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200",
    hotspots: [
      { id: "h1", x: 30, y: 60, label: "Smart TV", description: "65-inch 4K Smart TV with Netflix, Hulu, and Disney+", type: "feature" },
      { id: "h2", x: 70, y: 40, label: "City View", description: "Floor-to-ceiling windows with stunning city views", type: "info" },
      { id: "h3", x: 85, y: 70, label: "To Kitchen", description: "Navigate to kitchen", type: "navigation" },
    ],
  },
  {
    id: "kitchen",
    name: "Kitchen",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600",
    thumbnail: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200",
    hotspots: [
      { id: "h4", x: 40, y: 50, label: "Full Kitchen", description: "Fully equipped kitchen with modern appliances", type: "feature" },
      { id: "h5", x: 60, y: 30, label: "Coffee Station", description: "Nespresso machine with complimentary pods", type: "info" },
      { id: "h6", x: 15, y: 70, label: "To Living Room", description: "Navigate to living room", type: "navigation" },
    ],
  },
  {
    id: "bedroom",
    name: "Master Bedroom",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1600",
    thumbnail: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=200",
    hotspots: [
      { id: "h7", x: 50, y: 55, label: "King Bed", description: "Premium king-size bed with luxury linens", type: "feature" },
      { id: "h8", x: 80, y: 40, label: "Workspace", description: "Dedicated workspace with ergonomic chair", type: "info" },
      { id: "h9", x: 20, y: 75, label: "To Bathroom", description: "Navigate to bathroom", type: "navigation" },
    ],
  },
  {
    id: "bathroom",
    name: "Bathroom",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1600",
    thumbnail: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200",
    hotspots: [
      { id: "h10", x: 50, y: 50, label: "Rain Shower", description: "Rainfall showerhead with adjustable pressure", type: "feature" },
      { id: "h11", x: 30, y: 60, label: "Toiletries", description: "Premium toiletries provided", type: "info" },
    ],
  },
];

const hotspotColors = {
  info: "bg-blue-500",
  navigation: "bg-emerald-500",
  feature: "bg-violet-500",
};

export default function VirtualTourPage() {
  const [currentRoom, setCurrentRoom] = useState(tourRooms[0]);
  const [activeHotspot, setActiveHotspot] = useState<TourHotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFloorplan, setShowFloorplan] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const navigateToRoom = (roomId: string) => {
    const room = tourRooms.find((r) => r.id === roomId);
    if (room) {
      setCurrentRoom(room);
      setActiveHotspot(null);
    }
  };

  return (
    <div className={`min-h-screen bg-zinc-950 text-white ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Header */}
      {!isFullscreen && (
        <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/prototype" className="p-2 -ml-2 rounded-lg hover:bg-zinc-800 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div>
                <h1 className="font-semibold text-lg">Virtual Tour</h1>
                <p className="text-xs text-zinc-400">Modern Downtown Loft</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFloorplan(!showFloorplan)}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${showFloorplan ? "bg-emerald-600" : "bg-zinc-800 hover:bg-zinc-700"}`}
              >
                Floor Plan
              </button>
              <button
                onClick={() => setIsFullscreen(true)}
                className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors"
              >
                Fullscreen
              </button>
            </div>
          </div>
        </header>
      )}

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Viewer */}
        <div className="flex-1 relative overflow-hidden">
          {/* 360 Image Viewer */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500"
            style={{
              backgroundImage: `url(${currentRoom.image})`,
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          >
            {/* Hotspots */}
            {currentRoom.hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                onClick={() => {
                  if (hotspot.type === "navigation") {
                    const targetRoom = hotspot.label.toLowerCase().includes("kitchen") ? "kitchen" :
                      hotspot.label.toLowerCase().includes("living") ? "living" :
                      hotspot.label.toLowerCase().includes("bedroom") ? "bedroom" :
                      hotspot.label.toLowerCase().includes("bathroom") ? "bathroom" : currentRoom.id;
                    navigateToRoom(targetRoom);
                  } else {
                    setActiveHotspot(activeHotspot?.id === hotspot.id ? null : hotspot);
                  }
                }}
                className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full ${hotspotColors[hotspot.type]} animate-pulse hover:animate-none hover:scale-110 transition-transform flex items-center justify-center shadow-lg`}
                style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              >
                {hotspot.type === "navigation" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                ) : hotspot.type === "feature" ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </button>
            ))}

            {/* Active Hotspot Info */}
            {activeHotspot && (
              <div
                className="absolute bg-zinc-900/95 backdrop-blur-sm rounded-xl p-4 max-w-xs shadow-xl border border-zinc-700"
                style={{
                  left: `${Math.min(activeHotspot.x + 5, 70)}%`,
                  top: `${activeHotspot.y}%`,
                }}
              >
                <h4 className="font-semibold mb-1">{activeHotspot.label}</h4>
                <p className="text-sm text-zinc-400">{activeHotspot.description}</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-sm rounded-full px-4 py-2">
            <button
              onClick={() => setRotation(rotation - 45)}
              className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <button
              onClick={() => setZoom(Math.max(1, zoom - 0.25))}
              className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
              </svg>
            </button>
            <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(2, zoom + 0.25))}
              className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
              </svg>
            </button>
            <button
              onClick={() => setRotation(rotation + 45)}
              className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>

          {/* Room Name Badge */}
          <div className="absolute top-6 left-6 bg-zinc-900/90 backdrop-blur-sm rounded-lg px-4 py-2">
            <p className="font-semibold">{currentRoom.name}</p>
          </div>

          {/* Fullscreen Exit */}
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 p-2 bg-zinc-900/90 hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sidebar */}
        {!isFullscreen && (
          <div className="w-64 bg-zinc-900 border-l border-zinc-800 p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Rooms</h3>
            <div className="space-y-2">
              {tourRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => navigateToRoom(room.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${
                    currentRoom.id === room.id ? "bg-emerald-600" : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  <img src={room.thumbnail} alt={room.name} className="w-12 h-12 rounded-lg object-cover" />
                  <span className="text-sm font-medium">{room.name}</span>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold mb-3">Legend</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-zinc-400">Information</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-violet-500" />
                  <span className="text-zinc-400">Feature</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-500" />
                  <span className="text-zinc-400">Navigation</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-zinc-800 rounded-xl">
              <p className="text-sm text-zinc-400 mb-3">Interested in this property?</p>
              <Link href="/property/prop-1" className="block w-full py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-center text-sm font-medium transition-colors">
                View Listing
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Floor Plan Modal */}
      {showFloorplan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">Floor Plan</h3>
              <button onClick={() => setShowFloorplan(false)} className="p-1 hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="aspect-video bg-zinc-800 rounded-lg flex items-center justify-center relative">
              {/* Simple floor plan visualization */}
              <div className="grid grid-cols-2 gap-4 p-8 w-full max-w-md">
                {tourRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => { navigateToRoom(room.id); setShowFloorplan(false); }}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      currentRoom.id === room.id
                        ? "border-emerald-500 bg-emerald-500/20"
                        : "border-zinc-600 hover:border-zinc-500"
                    }`}
                  >
                    <p className="font-medium text-sm">{room.name}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Image,
  Upload,
  Download,
  Trash2,
  Edit,
  Eye,
  Star,
  Sparkles,
  Wand2,
  Tag,
  Grid,
  List,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  MoreVertical,
  GripVertical,
  ZoomIn,
  Settings,
  Palette,
  Crop,
  Sun,
  Contrast,
  Move,
  Copy,
  ExternalLink,
  FolderOpen,
  Home,
  Bed,
  Bath,
  Utensils,
  Sofa,
  TreePine,
  Waves,
  Car,
} from "lucide-react";

// Mock photos with AI tags
const photos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
    filename: "exterior-front.jpg",
    room: "Exterior",
    aiTags: ["house", "modern architecture", "landscaping", "front yard", "sunny"],
    featured: true,
    optimized: true,
    quality: 95,
    dimensions: "4032x3024",
    size: "2.4 MB",
    uploadedAt: "2026-01-15",
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    thumbnail: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400",
    filename: "living-room-1.jpg",
    room: "Living Room",
    aiTags: ["living room", "sofa", "modern", "natural light", "open floor plan"],
    featured: true,
    optimized: true,
    quality: 92,
    dimensions: "4032x3024",
    size: "1.8 MB",
    uploadedAt: "2026-01-15",
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    filename: "kitchen-main.jpg",
    room: "Kitchen",
    aiTags: ["kitchen", "modern appliances", "island", "marble countertop", "pendant lights"],
    featured: false,
    optimized: true,
    quality: 88,
    dimensions: "3840x2560",
    size: "1.5 MB",
    uploadedAt: "2026-01-15",
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800",
    thumbnail: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400",
    filename: "bedroom-master.jpg",
    room: "Master Bedroom",
    aiTags: ["bedroom", "king bed", "natural light", "modern decor", "ocean view"],
    featured: true,
    optimized: false,
    quality: 78,
    dimensions: "3024x4032",
    size: "2.1 MB",
    uploadedAt: "2026-01-16",
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
    thumbnail: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400",
    filename: "bathroom-master.jpg",
    room: "Master Bathroom",
    aiTags: ["bathroom", "double vanity", "modern", "marble", "large mirror"],
    featured: false,
    optimized: true,
    quality: 91,
    dimensions: "3024x4032",
    size: "1.2 MB",
    uploadedAt: "2026-01-16",
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    thumbnail: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
    filename: "pool-area.jpg",
    room: "Pool",
    aiTags: ["pool", "outdoor", "patio", "lounge chairs", "ocean view"],
    featured: true,
    optimized: true,
    quality: 94,
    dimensions: "4032x3024",
    size: "2.6 MB",
    uploadedAt: "2026-01-17",
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    thumbnail: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
    filename: "dining-area.jpg",
    room: "Dining Room",
    aiTags: ["dining room", "table", "chairs", "chandelier", "modern"],
    featured: false,
    optimized: false,
    quality: 72,
    dimensions: "3024x4032",
    size: "1.9 MB",
    uploadedAt: "2026-01-17",
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    thumbnail: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
    filename: "backyard-view.jpg",
    room: "Exterior",
    aiTags: ["backyard", "garden", "patio", "sunset", "landscaping"],
    featured: false,
    optimized: true,
    quality: 89,
    dimensions: "4032x3024",
    size: "2.2 MB",
    uploadedAt: "2026-01-18",
  },
];

// Room categories
const roomCategories = [
  { id: "all", name: "All Photos", icon: Grid, count: photos.length },
  { id: "exterior", name: "Exterior", icon: Home, count: 2 },
  { id: "living", name: "Living Room", icon: Sofa, count: 1 },
  { id: "kitchen", name: "Kitchen", icon: Utensils, count: 1 },
  { id: "bedroom", name: "Bedrooms", icon: Bed, count: 1 },
  { id: "bathroom", name: "Bathrooms", icon: Bath, count: 1 },
  { id: "pool", name: "Pool & Outdoor", icon: Waves, count: 1 },
  { id: "dining", name: "Dining", icon: Utensils, count: 1 },
];

export default function PhotoManagementPage() {
  const [selectedPhotos, setSelectedPhotos] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<typeof photos[0] | null>(null);

  const togglePhotoSelection = (photoId: number) => {
    setSelectedPhotos((prev) =>
      prev.includes(photoId) ? prev.filter((id) => id !== photoId) : [...prev, photoId]
    );
  };

  const handleOptimizeAll = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 3000);
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 90) return "text-emerald-400";
    if (quality >= 80) return "text-amber-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-pink-500/20">
                  <Image className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Photo Management</h1>
                  <p className="text-xs text-zinc-400">AI-powered photo organization</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-zinc-700 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-zinc-800" : "bg-zinc-900 hover:bg-zinc-800"}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-zinc-800" : "bg-zinc-900 hover:bg-zinc-800"}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={handleOptimizeAll} disabled={isOptimizing}>
                <Wand2 className={`h-4 w-4 mr-2 ${isOptimizing ? "animate-spin" : ""}`} />
                {isOptimizing ? "Optimizing..." : "Optimize All"}
              </Button>
              <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photos
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Image className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{photos.length}</p>
                  <p className="text-xs text-zinc-400">Total Photos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Star className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{photos.filter((p) => p.featured).length}</p>
                  <p className="text-xs text-zinc-400">Featured</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{photos.filter((p) => p.optimized).length}</p>
                  <p className="text-xs text-zinc-400">Optimized</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Tag className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{photos.reduce((sum, p) => sum + p.aiTags.length, 0)}</p>
                  <p className="text-xs text-zinc-400">AI Tags</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/20">
                  <Sparkles className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">89%</p>
                  <p className="text-xs text-zinc-400">Avg Quality</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Room Categories */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {roomCategories.map((room) => {
                  const IconComponent = room.icon;
                  return (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => setSelectedRoom(room.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                        selectedRoom === room.id
                          ? "bg-pink-500/20 border border-pink-500/50"
                          : "bg-zinc-800/50 hover:bg-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="h-4 w-4 text-zinc-400" />
                        <span className="text-sm text-white">{room.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{room.count}</Badge>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-zinc-900/50 border-zinc-800 mt-4">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Wand2 className="h-4 w-4 mr-2" />
                  Auto-Tag All
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Crop className="h-4 w-4 mr-2" />
                  Batch Crop
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Sun className="h-4 w-4 mr-2" />
                  Enhance Lighting
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Export All
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Photo Grid */}
          <div className="lg:col-span-3">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Property Photos</CardTitle>
                    <CardDescription>Drag to reorder, click to edit</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                      <Input
                        placeholder="Search by tag..."
                        className="bg-zinc-800 border-zinc-700 pl-9 w-48"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className={`group relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedPhotos.includes(photo.id)
                            ? "border-pink-500"
                            : "border-transparent hover:border-zinc-600"
                        }`}
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <img
                          src={photo.thumbnail}
                          alt={photo.filename}
                          className="w-full aspect-[4/3] object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1">
                          {photo.featured && (
                            <div className="p-1 rounded bg-amber-500">
                              <Star className="h-3 w-3 text-white fill-white" />
                            </div>
                          )}
                          {!photo.optimized && (
                            <div className="p-1 rounded bg-amber-500/80">
                              <AlertTriangle className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Quality Score */}
                        <div className="absolute top-2 right-2">
                          <Badge className={`${getQualityColor(photo.quality)} bg-black/50 border-0`}>
                            {photo.quality}%
                          </Badge>
                        </div>

                        {/* Hover Actions */}
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-white truncate">{photo.room}</span>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 hover:bg-black/70">
                                <ZoomIn className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 hover:bg-black/70">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="icon" variant="ghost" className="h-7 w-7 bg-black/50 hover:bg-black/70">
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Selection Checkbox */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePhotoSelection(photo.id);
                          }}
                          className={`absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                            selectedPhotos.includes(photo.id)
                              ? "bg-pink-500 border-pink-500"
                              : "border-white/50 bg-black/30 opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          {selectedPhotos.includes(photo.id) && (
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {photos.map((photo) => (
                      <div
                        key={photo.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600 cursor-pointer"
                        onClick={() => setSelectedPhoto(photo)}
                      >
                        <GripVertical className="h-5 w-5 text-zinc-500 cursor-grab" />
                        <img
                          src={photo.thumbnail}
                          alt={photo.filename}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-white">{photo.filename}</p>
                            {photo.featured && <Star className="h-4 w-4 text-amber-400 fill-amber-400" />}
                          </div>
                          <p className="text-xs text-zinc-400">{photo.room} • {photo.dimensions} • {photo.size}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 max-w-48">
                          {photo.aiTags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                          ))}
                          {photo.aiTags.length > 3 && (
                            <Badge variant="outline" className="text-xs">+{photo.aiTags.length - 3}</Badge>
                          )}
                        </div>
                        <Badge className={`${getQualityColor(photo.quality)} bg-transparent border-0`}>
                          {photo.quality}% quality
                        </Badge>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Photo Detail Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <Card className="bg-zinc-900 border-zinc-800 max-w-4xl w-full max-h-[90vh] overflow-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">{selectedPhoto.filename}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPhoto(null)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.filename}
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="space-y-6">
                  <div>
                    <Label className="text-zinc-400">Room/Category</Label>
                    <Select defaultValue={selectedPhoto.room.toLowerCase().replace(" ", "-")}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="exterior">Exterior</SelectItem>
                        <SelectItem value="living-room">Living Room</SelectItem>
                        <SelectItem value="kitchen">Kitchen</SelectItem>
                        <SelectItem value="master-bedroom">Master Bedroom</SelectItem>
                        <SelectItem value="master-bathroom">Master Bathroom</SelectItem>
                        <SelectItem value="pool">Pool</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-zinc-400">AI-Generated Tags</Label>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Regenerate
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedPhoto.aiTags.map((tag) => (
                        <Badge key={tag} className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                          {tag}
                        </Badge>
                      ))}
                      <Button variant="outline" size="sm">
                        <Plus className="h-3 w-3 mr-1" />
                        Add Tag
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-zinc-400">Dimensions</Label>
                      <p className="text-white">{selectedPhoto.dimensions}</p>
                    </div>
                    <div>
                      <Label className="text-zinc-400">File Size</Label>
                      <p className="text-white">{selectedPhoto.size}</p>
                    </div>
                    <div>
                      <Label className="text-zinc-400">Quality Score</Label>
                      <p className={getQualityColor(selectedPhoto.quality)}>{selectedPhoto.quality}%</p>
                    </div>
                    <div>
                      <Label className="text-zinc-400">Uploaded</Label>
                      <p className="text-white">{selectedPhoto.uploadedAt}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
                    <div className="flex items-center gap-2">
                      <Switch checked={selectedPhoto.featured} />
                      <Label className="text-white">Featured Photo</Label>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-pink-600 hover:bg-pink-700">
                      <Wand2 className="h-4 w-4 mr-2" />
                      Optimize
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}

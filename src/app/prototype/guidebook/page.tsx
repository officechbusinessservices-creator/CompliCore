"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Book,
  Plus,
  Edit,
  Trash2,
  Eye,
  Save,
  Send,
  GripVertical,
  Home,
  Wifi,
  Car,
  Utensils,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  Coffee,
  ShoppingBag,
  Waves,
  TreePine,
  Camera,
  Heart,
  Clock,
  Key,
  Thermometer,
  Tv,
  WashingMachine,
  ChefHat,
  Sparkles,
  ExternalLink,
  Copy,
  QrCode,
  Smartphone,
  Globe,
  Image,
  FileText,
  Settings,
  Palette,
} from "lucide-react";

// Mock guidebook sections
const defaultSections = [
  {
    id: "welcome",
    title: "Welcome",
    icon: "Home",
    enabled: true,
    content: {
      greeting: "Welcome to our beautiful Malibu Beach Villa!",
      message: "We're thrilled to have you as our guest. This guidebook contains everything you need for a wonderful stay. Please don't hesitate to reach out if you have any questions!",
      hostName: "Sarah & Michael",
      hostPhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
  },
  {
    id: "checkin",
    title: "Check-in & Check-out",
    icon: "Key",
    enabled: true,
    content: {
      checkInTime: "3:00 PM",
      checkOutTime: "11:00 AM",
      earlyCheckIn: "Available upon request ($50)",
      lateCheckOut: "Available upon request ($50)",
      lockCode: "Will be sent 24 hours before arrival",
      parkingInfo: "2 covered spots in garage + street parking",
    },
  },
  {
    id: "wifi",
    title: "WiFi & Entertainment",
    icon: "Wifi",
    enabled: true,
    content: {
      networkName: "BeachVilla_Guest",
      password: "Welcome2024!",
      speed: "500 Mbps fiber",
      streaming: ["Netflix", "Disney+", "HBO Max", "Amazon Prime"],
      smartTV: "Samsung 75\" in living room, 55\" in each bedroom",
      sonos: "Whole-home audio system - connect via Sonos app",
    },
  },
  {
    id: "kitchen",
    title: "Kitchen & Dining",
    icon: "ChefHat",
    enabled: true,
    content: {
      appliances: ["Full-size refrigerator", "Gas range", "Dishwasher", "Microwave", "Coffee maker", "Blender", "Toaster"],
      cookware: "Full set of pots, pans, and baking sheets",
      dishes: "Service for 12",
      coffee: "Nespresso machine with pods, drip coffee maker",
      basics: "Salt, pepper, olive oil, and basic spices provided",
    },
  },
  {
    id: "amenities",
    title: "Amenities",
    icon: "Sparkles",
    enabled: true,
    content: {
      pool: { available: true, heated: true, hours: "7 AM - 10 PM" },
      hotTub: { available: true, temp: "102°F", capacity: 6 },
      bbq: { type: "Gas grill", location: "Back patio" },
      washer: { available: true, detergent: "Provided" },
      beach: { access: "Private stairs", towels: "In pool house" },
    },
  },
  {
    id: "rules",
    title: "House Rules",
    icon: "AlertCircle",
    enabled: true,
    content: {
      rules: [
        "No smoking inside the property",
        "No parties or events without prior approval",
        "Quiet hours: 10 PM - 8 AM",
        "Maximum occupancy: 8 guests",
        "Pets allowed with prior approval ($100 fee)",
        "No shoes on hardwood floors please",
      ],
    },
  },
  {
    id: "local",
    title: "Local Recommendations",
    icon: "MapPin",
    enabled: true,
    content: {
      restaurants: [
        { name: "Nobu Malibu", type: "Japanese", distance: "15 min", rating: 4.5 },
        { name: "Malibu Farm", type: "Farm-to-table", distance: "10 min", rating: 4.7 },
        { name: "Paradise Cove", type: "Beach Cafe", distance: "8 min", rating: 4.3 },
      ],
      activities: [
        { name: "Malibu Pier", type: "Attraction", distance: "5 min" },
        { name: "Zuma Beach", type: "Beach", distance: "10 min" },
        { name: "Getty Villa", type: "Museum", distance: "20 min" },
      ],
      grocery: [
        { name: "Whole Foods", distance: "12 min" },
        { name: "Ralphs", distance: "15 min" },
      ],
    },
  },
  {
    id: "emergency",
    title: "Emergency Info",
    icon: "Phone",
    enabled: true,
    content: {
      emergency: "911",
      host: "+1 (310) 555-0123",
      propertyManager: "+1 (310) 555-0456",
      nearestHospital: "UCLA Medical Center - 25 min",
      pharmacy: "CVS Pharmacy - 10 min",
      fireExtinguisher: "Kitchen cabinet (left of stove)",
      firstAid: "Bathroom under sink",
    },
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Home,
  Key,
  Wifi,
  ChefHat,
  Sparkles,
  AlertCircle,
  MapPin,
  Phone,
  Coffee,
  Car,
  Tv,
  WashingMachine,
  Thermometer,
  Camera,
  Heart,
  Clock,
};

export default function GuidebookPage() {
  const [sections, setSections] = useState(defaultSections);
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const [previewMode, setPreviewMode] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setSections(sections.map((s) => (s.id === sectionId ? { ...s, enabled: !s.enabled } : s)));
  };

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || FileText;
    return IconComponent;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/prototype/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-teal-500/20">
                  <Book className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Digital Guidebook</h1>
                  <p className="text-xs text-zinc-400">Create guest guides for your properties</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Edit Mode" : "Preview"}
              </Button>
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                QR Code
              </Button>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                <Send className="h-4 w-4 mr-2" />
                Send to Guest
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {previewMode ? (
          /* Preview Mode */
          <div className="max-w-2xl mx-auto">
            <Card className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
              {/* Cover Image */}
              <div className="relative h-48 bg-gradient-to-br from-teal-500 to-cyan-600">
                <img
                  src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800"
                  alt="Property"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <h2 className="text-2xl font-bold text-white">Malibu Beach Villa</h2>
                  <p className="text-white/80">Guest Guidebook</p>
                </div>
              </div>

              {/* Sections */}
              <CardContent className="p-0">
                {sections
                  .filter((s) => s.enabled)
                  .map((section) => {
                    const IconComponent = getIcon(section.icon);
                    return (
                      <div key={section.id} className="p-6 border-b border-zinc-800 last:border-0">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 rounded-lg bg-teal-500/20">
                            <IconComponent className="h-5 w-5 text-teal-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                        </div>

                        {section.id === "welcome" && (
                          <div className="space-y-3">
                            <p className="text-xl font-medium text-white">{section.content.greeting}</p>
                            <p className="text-zinc-300">{section.content.message}</p>
                            <div className="flex items-center gap-3 pt-2">
                              <img
                                src={section.content.hostPhoto}
                                alt="Host"
                                className="w-10 h-10 rounded-full"
                              />
                              <span className="text-zinc-400">Your hosts: {section.content.hostName}</span>
                            </div>
                          </div>
                        )}

                        {section.id === "checkin" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 rounded-lg bg-zinc-800/50">
                              <p className="text-xs text-zinc-400">Check-in</p>
                              <p className="text-lg font-medium text-white">{section.content.checkInTime}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-zinc-800/50">
                              <p className="text-xs text-zinc-400">Check-out</p>
                              <p className="text-lg font-medium text-white">{section.content.checkOutTime}</p>
                            </div>
                            <div className="col-span-2 p-3 rounded-lg bg-zinc-800/50">
                              <p className="text-xs text-zinc-400">Parking</p>
                              <p className="text-sm text-white">{section.content.parkingInfo}</p>
                            </div>
                          </div>
                        )}

                        {section.id === "wifi" && (
                          <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-zinc-400">Network</span>
                                <Button variant="ghost" size="sm">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-lg font-mono text-white">{section.content.networkName}</p>
                              <p className="text-zinc-400 mt-2">Password</p>
                              <p className="text-lg font-mono text-white">{section.content.password}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {section.content.streaming?.map((service: string) => (
                                <Badge key={service} variant="outline" className="bg-zinc-800">
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.id === "rules" && (
                          <ul className="space-y-2">
                            {section.content.rules?.map((rule: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-zinc-300">
                                <CheckCircle2 className="h-5 w-5 text-teal-400 mt-0.5 flex-shrink-0" />
                                {rule}
                              </li>
                            ))}
                          </ul>
                        )}

                        {section.id === "local" && (
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-zinc-400 mb-2">Restaurants</h4>
                              {section.content.restaurants?.map((place: { name: string; type: string; distance: string; rating: number }) => (
                                <div key={place.name} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                                  <div>
                                    <p className="text-white font-medium">{place.name}</p>
                                    <p className="text-xs text-zinc-400">{place.type} • {place.distance}</p>
                                  </div>
                                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                                    {place.rating}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {section.id === "emergency" && (
                          <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                              <p className="text-sm text-red-400">Emergency</p>
                              <p className="text-2xl font-bold text-white">{section.content.emergency}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 rounded-lg bg-zinc-800/50">
                                <p className="text-xs text-zinc-400">Host</p>
                                <p className="text-sm text-white">{section.content.host}</p>
                              </div>
                              <div className="p-3 rounded-lg bg-zinc-800/50">
                                <p className="text-xs text-zinc-400">Property Manager</p>
                                <p className="text-sm text-white">{section.content.propertyManager}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Edit Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sections List */}
            <div className="lg:col-span-1">
              <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Sections</CardTitle>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" />
                      Add
                    </Button>
                  </div>
                  <CardDescription>Drag to reorder, toggle to show/hide</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sections.map((section) => {
                    const IconComponent = getIcon(section.icon);
                    return (
                      <div
                        key={section.id}
                        onClick={() => setSelectedSection(section)}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          selectedSection?.id === section.id
                            ? "bg-teal-500/20 border border-teal-500/50"
                            : "bg-zinc-800/50 border border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        <GripVertical className="h-4 w-4 text-zinc-500 cursor-grab" />
                        <div className="p-1.5 rounded bg-zinc-700/50">
                          <IconComponent className="h-4 w-4 text-zinc-400" />
                        </div>
                        <span className="flex-1 text-sm text-white">{section.title}</span>
                        <Switch
                          checked={section.enabled}
                          onCheckedChange={() => toggleSection(section.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-zinc-900/50 border-zinc-800 mt-4">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Share Guidebook</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <Label className="text-xs text-zinc-400">Public Link</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value="https://guide.rental.com/malibu-villa"
                        readOnly
                        className="bg-zinc-900 border-zinc-700 text-sm"
                      />
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Smartphone className="h-4 w-4 mr-1" />
                      SMS
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Globe className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Section Editor */}
            <div className="lg:col-span-2">
              {selectedSection && (
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const IconComponent = getIcon(selectedSection.icon);
                          return (
                            <div className="p-2 rounded-lg bg-teal-500/20">
                              <IconComponent className="h-5 w-5 text-teal-400" />
                            </div>
                          );
                        })()}
                        <div>
                          <CardTitle className="text-white">{selectedSection.title}</CardTitle>
                          <CardDescription>Edit section content</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Palette className="h-4 w-4 mr-1" />
                          Style
                        </Button>
                        <Button variant="outline" size="sm">
                          <Image className="h-4 w-4 mr-1" />
                          Media
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {selectedSection.id === "welcome" && (
                      <>
                        <div>
                          <Label className="text-zinc-400">Welcome Greeting</Label>
                          <Input
                            defaultValue={selectedSection.content.greeting}
                            className="bg-zinc-800 border-zinc-700 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-zinc-400">Welcome Message</Label>
                          <Textarea
                            defaultValue={selectedSection.content.message}
                            className="bg-zinc-800 border-zinc-700 mt-1 min-h-[100px]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-zinc-400">Host Name(s)</Label>
                            <Input
                              defaultValue={selectedSection.content.hostName}
                              className="bg-zinc-800 border-zinc-700 mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-zinc-400">Host Photo URL</Label>
                            <Input
                              defaultValue={selectedSection.content.hostPhoto}
                              className="bg-zinc-800 border-zinc-700 mt-1"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {selectedSection.id === "checkin" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-zinc-400">Check-in Time</Label>
                            <Input
                              defaultValue={selectedSection.content.checkInTime}
                              className="bg-zinc-800 border-zinc-700 mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-zinc-400">Check-out Time</Label>
                            <Input
                              defaultValue={selectedSection.content.checkOutTime}
                              className="bg-zinc-800 border-zinc-700 mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-zinc-400">Lock Code Instructions</Label>
                          <Textarea
                            defaultValue={selectedSection.content.lockCode}
                            className="bg-zinc-800 border-zinc-700 mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-zinc-400">Parking Information</Label>
                          <Textarea
                            defaultValue={selectedSection.content.parkingInfo}
                            className="bg-zinc-800 border-zinc-700 mt-1"
                          />
                        </div>
                      </>
                    )}

                    {selectedSection.id === "wifi" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-zinc-400">Network Name</Label>
                            <Input
                              defaultValue={selectedSection.content.networkName}
                              className="bg-zinc-800 border-zinc-700 mt-1"
                            />
                          </div>
                          <div>
                            <Label className="text-zinc-400">Password</Label>
                            <Input
                              defaultValue={selectedSection.content.password}
                              className="bg-zinc-800 border-zinc-700 mt-1"
                            />
                          </div>
                        </div>
                        <div>
                          <Label className="text-zinc-400">Streaming Services (comma-separated)</Label>
                          <Input
                            defaultValue={selectedSection.content.streaming?.join(", ")}
                            className="bg-zinc-800 border-zinc-700 mt-1"
                          />
                        </div>
                      </>
                    )}

                    {selectedSection.id === "rules" && (
                      <div>
                        <Label className="text-zinc-400">House Rules (one per line)</Label>
                        <Textarea
                          defaultValue={selectedSection.content.rules?.join("\n")}
                          className="bg-zinc-800 border-zinc-700 mt-1 min-h-[200px]"
                        />
                      </div>
                    )}

                    {(selectedSection.id === "kitchen" || selectedSection.id === "amenities" || selectedSection.id === "local" || selectedSection.id === "emergency") && (
                      <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                        <p className="text-sm text-zinc-400 mb-4">
                          This section uses structured data. Edit individual fields below:
                        </p>
                        <pre className="text-xs text-zinc-300 bg-zinc-900 p-4 rounded-lg overflow-auto max-h-[300px]">
                          {JSON.stringify(selectedSection.content, null, 2)}
                        </pre>
                        <Button variant="outline" size="sm" className="mt-3">
                          <Edit className="h-4 w-4 mr-1" />
                          Open Editor
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                      <Button className="bg-teal-600 hover:bg-teal-700">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Section
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

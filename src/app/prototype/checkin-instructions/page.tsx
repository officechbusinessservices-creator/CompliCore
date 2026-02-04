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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Key,
  Clock,
  Send,
  Eye,
  Copy,
  Edit,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Car,
  Home,
  Wifi,
  Lock,
  Phone,
  MessageSquare,
  Mail,
  Smartphone,
  Calendar,
  RefreshCw,
  Sparkles,
  Settings,
  FileText,
  Image,
  Navigation,
  DoorOpen,
} from "lucide-react";

// Mock upcoming check-ins
const upcomingCheckins = [
  {
    id: 1,
    guest: "Sarah Johnson",
    property: "Malibu Beach Villa",
    checkIn: "2026-02-05",
    checkInTime: "3:00 PM",
    status: "scheduled",
    accessCode: "4829",
    instructionsSent: false,
    sendAt: "24 hours before",
  },
  {
    id: 2,
    guest: "Michael Chen",
    property: "Downtown Loft",
    checkIn: "2026-02-06",
    checkInTime: "4:00 PM",
    status: "scheduled",
    accessCode: "7156",
    instructionsSent: false,
    sendAt: "24 hours before",
  },
  {
    id: 3,
    guest: "Emma Davis",
    property: "Mountain Retreat",
    checkIn: "2026-02-03",
    checkInTime: "3:00 PM",
    status: "sent",
    accessCode: "3892",
    instructionsSent: true,
    sentAt: "2026-02-02 3:00 PM",
  },
];

// Template variables
const templateVariables = [
  { key: "{{guest_name}}", description: "Guest's first name" },
  { key: "{{property_name}}", description: "Property name" },
  { key: "{{check_in_date}}", description: "Check-in date" },
  { key: "{{check_in_time}}", description: "Check-in time" },
  { key: "{{access_code}}", description: "Door lock code" },
  { key: "{{wifi_name}}", description: "WiFi network name" },
  { key: "{{wifi_password}}", description: "WiFi password" },
  { key: "{{address}}", description: "Property address" },
  { key: "{{parking_info}}", description: "Parking instructions" },
  { key: "{{host_phone}}", description: "Host phone number" },
];

// Default check-in template
const defaultTemplate = `Hi {{guest_name}}!

Welcome to {{property_name}}! We're excited to host you.

CHECK-IN DETAILS
Date: {{check_in_date}}
Time: {{check_in_time}} or later

ADDRESS
{{address}}

ACCESS CODE
Your door code is: {{access_code}}
Simply enter this on the keypad and turn the handle.

PARKING
{{parking_info}}

WIFI
Network: {{wifi_name}}
Password: {{wifi_password}}

If you have any questions or need assistance, please don't hesitate to reach out!

Phone: {{host_phone}}

See you soon!`;

// Property-specific data
const propertyData = {
  "Malibu Beach Villa": {
    address: "123 Pacific Coast Hwy, Malibu, CA 90265",
    parking: "2 covered spots in the garage. Use the same access code for the garage door.",
    wifi_name: "BeachVilla_Guest",
    wifi_password: "Welcome2024!",
    host_phone: "+1 (310) 555-0123",
    special_instructions: "The beach access stairs are located on the left side of the property. Beach towels are in the pool house.",
  },
  "Downtown Loft": {
    address: "456 Main Street, Unit 12B, Los Angeles, CA 90012",
    parking: "Street parking only. Garage parking available at 450 Main St ($25/day).",
    wifi_name: "Loft12B_Guest",
    wifi_password: "CityViews2024",
    host_phone: "+1 (310) 555-0456",
    special_instructions: "Building entrance is on Main St. Use code 1234# to enter the lobby, then take elevator to 12th floor.",
  },
  "Mountain Retreat": {
    address: "789 Pine Ridge Road, Big Bear Lake, CA 92315",
    parking: "Driveway parking for 2 vehicles. 4WD recommended in winter.",
    wifi_name: "MountainCabin_Guest",
    wifi_password: "SnowDay2024",
    host_phone: "+1 (310) 555-0789",
    special_instructions: "Firewood is stocked by the back door. Hot tub is pre-heated and ready for you!",
  },
};

export default function CheckinInstructionsPage() {
  const [selectedProperty, setSelectedProperty] = useState("Malibu Beach Villa");
  const [template, setTemplate] = useState(defaultTemplate);
  const [previewMode, setPreviewMode] = useState(false);
  const [sendTiming, setSendTiming] = useState("24");
  const [autoSend, setAutoSend] = useState(true);
  const [includeMap, setIncludeMap] = useState(true);
  const [includePhotos, setIncludePhotos] = useState(true);

  const currentPropertyData = propertyData[selectedProperty as keyof typeof propertyData];

  // Generate preview by replacing variables
  const generatePreview = () => {
    let preview = template;
    preview = preview.replace(/{{guest_name}}/g, "Sarah");
    preview = preview.replace(/{{property_name}}/g, selectedProperty);
    preview = preview.replace(/{{check_in_date}}/g, "February 5, 2026");
    preview = preview.replace(/{{check_in_time}}/g, "3:00 PM");
    preview = preview.replace(/{{access_code}}/g, "4829");
    preview = preview.replace(/{{wifi_name}}/g, currentPropertyData.wifi_name);
    preview = preview.replace(/{{wifi_password}}/g, currentPropertyData.wifi_password);
    preview = preview.replace(/{{address}}/g, currentPropertyData.address);
    preview = preview.replace(/{{parking_info}}/g, currentPropertyData.parking);
    preview = preview.replace(/{{host_phone}}/g, currentPropertyData.host_phone);
    return preview;
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
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <Key className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Check-in Instructions</h1>
                  <p className="text-xs text-zinc-400">Automated guest arrival messages</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="Malibu Beach Villa">Malibu Beach Villa</SelectItem>
                  <SelectItem value="Downtown Loft">Downtown Loft</SelectItem>
                  <SelectItem value="Mountain Retreat">Mountain Retreat</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Edit" : "Preview"}
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Template Editor / Preview */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">
                      {previewMode ? "Message Preview" : "Message Template"}
                    </CardTitle>
                    <CardDescription>
                      {previewMode ? "How your guest will see the message" : "Customize the check-in instructions"}
                    </CardDescription>
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Smart Variables
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {previewMode ? (
                  <div className="p-6 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-zinc-700">
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Check-in Instructions</p>
                        <p className="text-xs text-zinc-400">Sent via SMS • Feb 4, 2026 at 3:00 PM</p>
                      </div>
                    </div>
                    <pre className="text-sm text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed">
                      {generatePreview()}
                    </pre>

                    {includeMap && (
                      <div className="mt-4 p-4 rounded-lg bg-zinc-700/50 border border-zinc-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Navigation className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-white">Directions</span>
                        </div>
                        <div className="h-32 bg-zinc-600 rounded-lg flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-zinc-400" />
                          <span className="text-zinc-400 ml-2">Map Preview</span>
                        </div>
                      </div>
                    )}

                    {includePhotos && (
                      <div className="mt-4 p-4 rounded-lg bg-zinc-700/50 border border-zinc-600">
                        <div className="flex items-center gap-2 mb-2">
                          <Image className="h-4 w-4 text-blue-400" />
                          <span className="text-sm text-white">Entry Photos</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="h-20 bg-zinc-600 rounded-lg flex items-center justify-center">
                            <DoorOpen className="h-6 w-6 text-zinc-400" />
                          </div>
                          <div className="h-20 bg-zinc-600 rounded-lg flex items-center justify-center">
                            <Lock className="h-6 w-6 text-zinc-400" />
                          </div>
                          <div className="h-20 bg-zinc-600 rounded-lg flex items-center justify-center">
                            <Car className="h-6 w-6 text-zinc-400" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Textarea
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 min-h-[400px] font-mono text-sm"
                  />
                )}
              </CardContent>
            </Card>

            {/* Property-Specific Settings */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Property Details: {selectedProperty}</CardTitle>
                <CardDescription>These values are used in the template</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-zinc-400">Address</Label>
                  <Input
                    defaultValue={currentPropertyData.address}
                    className="bg-zinc-800 border-zinc-700 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400">Host Phone</Label>
                  <Input
                    defaultValue={currentPropertyData.host_phone}
                    className="bg-zinc-800 border-zinc-700 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400">WiFi Network</Label>
                  <Input
                    defaultValue={currentPropertyData.wifi_name}
                    className="bg-zinc-800 border-zinc-700 mt-1"
                  />
                </div>
                <div>
                  <Label className="text-zinc-400">WiFi Password</Label>
                  <Input
                    defaultValue={currentPropertyData.wifi_password}
                    className="bg-zinc-800 border-zinc-700 mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-zinc-400">Parking Instructions</Label>
                  <Textarea
                    defaultValue={currentPropertyData.parking}
                    className="bg-zinc-800 border-zinc-700 mt-1"
                  />
                </div>
                <div className="col-span-2">
                  <Label className="text-zinc-400">Special Instructions</Label>
                  <Textarea
                    defaultValue={currentPropertyData.special_instructions}
                    className="bg-zinc-800 border-zinc-700 mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Delivery Settings */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Delivery Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Auto-Send</p>
                      <p className="text-xs text-zinc-400">Send automatically before check-in</p>
                    </div>
                  </div>
                  <Switch checked={autoSend} onCheckedChange={setAutoSend} />
                </div>

                {autoSend && (
                  <div className="pl-8">
                    <Label className="text-zinc-400 text-sm">Send timing</Label>
                    <Select value={sendTiming} onValueChange={setSendTiming}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="6">6 hours before</SelectItem>
                        <SelectItem value="12">12 hours before</SelectItem>
                        <SelectItem value="24">24 hours before</SelectItem>
                        <SelectItem value="48">48 hours before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Include Map</p>
                      <p className="text-xs text-zinc-400">Add directions link</p>
                    </div>
                  </div>
                  <Switch checked={includeMap} onCheckedChange={setIncludeMap} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Entry Photos</p>
                      <p className="text-xs text-zinc-400">Show door/parking images</p>
                    </div>
                  </div>
                  <Switch checked={includePhotos} onCheckedChange={setIncludePhotos} />
                </div>

                <div className="pt-2 border-t border-zinc-800">
                  <Label className="text-zinc-400 text-sm">Send via</Label>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      SMS
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Mail className="h-4 w-4 mr-1" />
                      Email
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Smartphone className="h-4 w-4 mr-1" />
                      App
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Template Variables */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Template Variables</CardTitle>
                <CardDescription>Click to copy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {templateVariables.map((variable) => (
                  <button
                    key={variable.key}
                    type="button"
                    onClick={() => navigator.clipboard.writeText(variable.key)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors text-left"
                  >
                    <code className="text-xs text-blue-400">{variable.key}</code>
                    <span className="text-xs text-zinc-500">{variable.description}</span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Upcoming Check-ins */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm">Upcoming Check-ins</CardTitle>
                  <Badge variant="outline">{upcomingCheckins.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingCheckins.map((checkin) => (
                  <div key={checkin.id} className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-white">{checkin.guest}</span>
                      <Badge className={checkin.instructionsSent ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}>
                        {checkin.instructionsSent ? "Sent" : "Scheduled"}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-400">{checkin.property}</p>
                    <p className="text-xs text-zinc-500">{checkin.checkIn} at {checkin.checkInTime}</p>
                    {!checkin.instructionsSent && (
                      <Button variant="ghost" size="sm" className="w-full mt-2">
                        <Send className="h-3 w-3 mr-1" />
                        Send Now
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

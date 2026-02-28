"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Thermometer,
  Camera,
  Lock,
  Lightbulb,
  Wifi,
  Battery,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Settings,
  Plus,
  RefreshCw,
  Home,
  Droplets,
  Wind,
  Sun,
  Moon,
  Activity,
  Bell,
  Shield,
  Zap,
  Power,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Smartphone,
  Radio,
  Gauge,
  Flame,
  Snowflake,
  CloudRain,
  MoreVertical,
  Play,
  Pause,
  History,
} from "lucide-react";

// Mock smart devices data
const devices = {
  thermostats: [
    {
      id: "thermo-1",
      name: "Living Room Thermostat",
      location: "Main Floor",
      status: "online",
      currentTemp: 72,
      targetTemp: 70,
      humidity: 45,
      mode: "cooling",
      schedule: "Home",
      battery: 85,
      brand: "Nest",
    },
    {
      id: "thermo-2",
      name: "Master Bedroom",
      location: "2nd Floor",
      status: "online",
      currentTemp: 68,
      targetTemp: 68,
      humidity: 42,
      mode: "auto",
      schedule: "Sleep",
      battery: 92,
      brand: "Ecobee",
    },
    {
      id: "thermo-3",
      name: "Guest Suite",
      location: "1st Floor",
      status: "offline",
      currentTemp: 71,
      targetTemp: 72,
      humidity: 48,
      mode: "heating",
      schedule: "Away",
      battery: 23,
      brand: "Honeywell",
    },
  ],
  cameras: [
    {
      id: "cam-1",
      name: "Front Door Camera",
      location: "Exterior",
      status: "online",
      recording: true,
      motionDetection: true,
      nightVision: true,
      lastMotion: "5 min ago",
      thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
      brand: "Ring",
    },
    {
      id: "cam-2",
      name: "Backyard Camera",
      location: "Exterior",
      status: "online",
      recording: true,
      motionDetection: true,
      nightVision: true,
      lastMotion: "2 hours ago",
      thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300",
      brand: "Arlo",
    },
    {
      id: "cam-3",
      name: "Garage Camera",
      location: "Garage",
      status: "online",
      recording: false,
      motionDetection: true,
      nightVision: false,
      lastMotion: "1 day ago",
      thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300",
      brand: "Wyze",
    },
    {
      id: "cam-4",
      name: "Pool Area",
      location: "Exterior",
      status: "offline",
      recording: false,
      motionDetection: false,
      nightVision: true,
      lastMotion: "3 days ago",
      thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300",
      brand: "Blink",
    },
  ],
  sensors: [
    { id: "sensor-1", name: "Front Door", type: "door", status: "closed", battery: 78, lastTriggered: "2 hours ago" },
    { id: "sensor-2", name: "Back Door", type: "door", status: "closed", battery: 92, lastTriggered: "5 hours ago" },
    { id: "sensor-3", name: "Garage Door", type: "door", status: "open", battery: 65, lastTriggered: "10 min ago" },
    { id: "sensor-4", name: "Living Room Window", type: "window", status: "closed", battery: 88, lastTriggered: "1 day ago" },
    { id: "sensor-5", name: "Kitchen Smoke", type: "smoke", status: "normal", battery: 95, lastTriggered: "Never" },
    { id: "sensor-6", name: "Basement Water", type: "water", status: "normal", battery: 81, lastTriggered: "Never" },
    { id: "sensor-7", name: "Hallway Motion", type: "motion", status: "inactive", battery: 72, lastTriggered: "30 min ago" },
    { id: "sensor-8", name: "CO Detector", type: "co", status: "normal", battery: 99, lastTriggered: "Never" },
  ],
  locks: [
    { id: "lock-1", name: "Front Door Lock", status: "locked", battery: 87, autoLock: true, lastActivity: "Guest checked in - 2 hours ago" },
    { id: "lock-2", name: "Back Door Lock", status: "locked", battery: 94, autoLock: true, lastActivity: "Manually locked - 5 hours ago" },
    { id: "lock-3", name: "Garage Entry Lock", status: "unlocked", battery: 45, autoLock: false, lastActivity: "Unlocked by host - 1 hour ago" },
    { id: "lock-4", name: "Pool Gate Lock", status: "locked", battery: 76, autoLock: true, lastActivity: "Auto-locked - 30 min ago" },
  ],
  lights: [
    { id: "light-1", name: "Living Room", status: "on", brightness: 80, color: "#FFF4E0", scene: "Relaxing" },
    { id: "light-2", name: "Kitchen", status: "on", brightness: 100, color: "#FFFFFF", scene: "Bright" },
    { id: "light-3", name: "Master Bedroom", status: "off", brightness: 0, color: "#FFE4C4", scene: "Sleep" },
    { id: "light-4", name: "Porch Lights", status: "on", brightness: 60, color: "#FFD700", scene: "Welcome" },
    { id: "light-5", name: "Pool Lights", status: "off", brightness: 0, color: "#00CED1", scene: "Party" },
    { id: "light-6", name: "Pathway Lights", status: "on", brightness: 40, color: "#FFF8DC", scene: "Ambient" },
  ],
};

// Device activity log
const activityLog = [
  { id: 1, device: "Front Door Lock", action: "Guest checked in with code 4829", time: "2 hours ago", type: "lock" },
  { id: 2, device: "Living Room Thermostat", action: "Temperature adjusted to 70°F", time: "3 hours ago", type: "thermostat" },
  { id: 3, device: "Front Door Camera", action: "Motion detected", time: "5 hours ago", type: "camera" },
  { id: 4, device: "Garage Door Sensor", action: "Door opened", time: "6 hours ago", type: "sensor" },
  { id: 5, device: "Kitchen Lights", action: "Turned on automatically", time: "7 hours ago", type: "light" },
  { id: 6, device: "Pool Gate Lock", action: "Auto-locked after 30 minutes", time: "8 hours ago", type: "lock" },
];

export default function SmartHomePage() {
  const [selectedProperty, setSelectedProperty] = useState("beach-villa");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "locked":
      case "closed":
      case "normal":
      case "on":
        return "text-emerald-400";
      case "offline":
      case "unlocked":
      case "open":
        return "text-red-400";
      case "inactive":
      case "off":
        return "text-zinc-400";
      default:
        return "text-amber-400";
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 60) return "text-emerald-400";
    if (level > 30) return "text-amber-400";
    return "text-red-400";
  };

  const getSensorIcon = (type: string) => {
    switch (type) {
      case "door":
        return Lock;
      case "window":
        return Home;
      case "smoke":
        return Flame;
      case "water":
        return Droplets;
      case "motion":
        return Activity;
      case "co":
        return Wind;
      default:
        return Radio;
    }
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
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Home className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Smart Home Hub</h1>
                  <p className="text-xs text-zinc-400">Control all connected devices</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-48 bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="beach-villa">Malibu Beach Villa</SelectItem>
                  <SelectItem value="mountain-cabin">Mountain Retreat</SelectItem>
                  <SelectItem value="city-loft">Downtown Loft</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                Sync
              </Button>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Device
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">18</p>
                  <p className="text-xs text-zinc-400">Online</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/20">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-xs text-zinc-400">Offline</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Battery className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-zinc-400">Low Battery</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-cyan-500/20">
                  <Thermometer className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">70°F</p>
                  <p className="text-xs text-zinc-400">Avg Temp</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Lock className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3/4</p>
                  <p className="text-xs text-zinc-400">Locked</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/20">
                  <Camera className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-xs text-zinc-400">Recording</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="thermostats" className="w-full">
          <TabsList className="bg-zinc-800 border-zinc-700 mb-6">
            <TabsTrigger value="thermostats" className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Thermostats
            </TabsTrigger>
            <TabsTrigger value="cameras" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Cameras
            </TabsTrigger>
            <TabsTrigger value="locks" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Locks
            </TabsTrigger>
            <TabsTrigger value="sensors" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              Sensors
            </TabsTrigger>
            <TabsTrigger value="lights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Lights
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          {/* Thermostats Tab */}
          <TabsContent value="thermostats">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.thermostats.map((thermostat) => (
                <Card key={thermostat.id} className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${thermostat.status === "online" ? "bg-emerald-400" : "bg-red-400"}`} />
                        <CardTitle className="text-white text-base">{thermostat.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs">{thermostat.brand}</Badge>
                    </div>
                    <CardDescription>{thermostat.location}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-white">{thermostat.currentTemp}°</p>
                        <p className="text-xs text-zinc-400">Current</p>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        {thermostat.mode === "cooling" ? (
                          <Snowflake className="h-8 w-8 text-cyan-400" />
                        ) : thermostat.mode === "heating" ? (
                          <Flame className="h-8 w-8 text-orange-400" />
                        ) : (
                          <Wind className="h-8 w-8 text-zinc-400" />
                        )}
                        <p className="text-xs text-zinc-400 capitalize">{thermostat.mode}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-4xl font-bold text-cyan-400">{thermostat.targetTemp}°</p>
                        <p className="text-xs text-zinc-400">Target</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-400">Temperature</span>
                        <span className="text-white">{thermostat.targetTemp}°F</span>
                      </div>
                      <Slider
                        defaultValue={[thermostat.targetTemp]}
                        min={60}
                        max={85}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <Droplets className="h-4 w-4" />
                        <span>{thermostat.humidity}% Humidity</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Battery className={`h-4 w-4 ${getBatteryColor(thermostat.battery)}`} />
                        <span className={getBatteryColor(thermostat.battery)}>{thermostat.battery}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800">
                      <Badge className="bg-zinc-800 text-zinc-300">{thermostat.schedule}</Badge>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cameras Tab */}
          <TabsContent value="cameras">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devices.cameras.map((camera) => (
                <Card key={camera.id} className="bg-zinc-900/50 border-zinc-800 overflow-hidden">
                  <div className="relative aspect-video bg-zinc-800">
                    <img
                      src={camera.thumbnail}
                      alt={camera.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {camera.recording && (
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-white font-medium">LIVE</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <Badge variant="outline" className={`${camera.status === "online" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}`}>
                        {camera.status}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white font-medium">{camera.name}</p>
                      <p className="text-xs text-zinc-300">{camera.location}</p>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Activity className={`h-4 w-4 ${camera.motionDetection ? "text-emerald-400" : "text-zinc-500"}`} />
                          <span className="text-xs text-zinc-400">Motion</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Moon className={`h-4 w-4 ${camera.nightVision ? "text-violet-400" : "text-zinc-500"}`} />
                          <span className="text-xs text-zinc-400">Night</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Volume2 className="h-4 w-4 text-zinc-500" />
                          <span className="text-xs text-zinc-400">Audio</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400">Last motion: {camera.lastMotion}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Locks Tab */}
          <TabsContent value="locks">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {devices.locks.map((lock) => (
                <Card key={lock.id} className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${lock.status === "locked" ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                          <Lock className={`h-6 w-6 ${lock.status === "locked" ? "text-emerald-400" : "text-red-400"}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{lock.name}</h3>
                          <p className="text-xs text-zinc-400">{lock.lastActivity}</p>
                        </div>
                      </div>
                      <Switch checked={lock.status === "locked"} />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Battery className={`h-4 w-4 ${getBatteryColor(lock.battery)}`} />
                          <span className={`text-sm ${getBatteryColor(lock.battery)}`}>{lock.battery}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Zap className={`h-4 w-4 ${lock.autoLock ? "text-amber-400" : "text-zinc-500"}`} />
                          <span className="text-xs text-zinc-400">Auto-lock {lock.autoLock ? "on" : "off"}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage Codes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Sensors Tab */}
          <TabsContent value="sensors">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {devices.sensors.map((sensor) => {
                const SensorIcon = getSensorIcon(sensor.type);
                const isAlert = sensor.status === "open" || (sensor.type === "smoke" && sensor.status !== "normal");
                return (
                  <Card key={sensor.id} className={`bg-zinc-900/50 border-zinc-800 ${isAlert ? "border-red-500/50" : ""}`}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${isAlert ? "bg-red-500/20" : "bg-zinc-800"}`}>
                          <SensorIcon className={`h-5 w-5 ${isAlert ? "text-red-400" : "text-zinc-400"}`} />
                        </div>
                        <Badge className={isAlert ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}>
                          {sensor.status}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-white text-sm">{sensor.name}</h3>
                      <p className="text-xs text-zinc-400 capitalize">{sensor.type} sensor</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
                        <div className="flex items-center gap-1">
                          <Battery className={`h-3 w-3 ${getBatteryColor(sensor.battery)}`} />
                          <span className={`text-xs ${getBatteryColor(sensor.battery)}`}>{sensor.battery}%</span>
                        </div>
                        <span className="text-xs text-zinc-500">{sensor.lastTriggered}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Lights Tab */}
          <TabsContent value="lights">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.lights.map((light) => (
                <Card key={light.id} className="bg-zinc-900/50 border-zinc-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: light.status === "on" ? `${light.color}20` : "#27272a" }}
                        >
                          <Lightbulb
                            className="h-6 w-6"
                            style={{ color: light.status === "on" ? light.color : "#71717a" }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{light.name}</h3>
                          <p className="text-xs text-zinc-400">{light.scene} scene</p>
                        </div>
                      </div>
                      <Switch checked={light.status === "on"} />
                    </div>

                    {light.status === "on" && (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-zinc-400">Brightness</span>
                            <span className="text-white">{light.brightness}%</span>
                          </div>
                          <Slider defaultValue={[light.brightness]} max={100} step={1} />
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-zinc-600"
                            style={{ backgroundColor: light.color }}
                          />
                          <span className="text-xs text-zinc-400">{light.color}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Device Activity Log</CardTitle>
                <CardDescription>Recent activity across all connected devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-800/50">
                      <div className={`p-2 rounded-lg ${
                        activity.type === "lock" ? "bg-violet-500/20" :
                        activity.type === "thermostat" ? "bg-cyan-500/20" :
                        activity.type === "camera" ? "bg-pink-500/20" :
                        activity.type === "sensor" ? "bg-amber-500/20" :
                        "bg-emerald-500/20"
                      }`}>
                        {activity.type === "lock" && <Lock className="h-4 w-4 text-violet-400" />}
                        {activity.type === "thermostat" && <Thermometer className="h-4 w-4 text-cyan-400" />}
                        {activity.type === "camera" && <Camera className="h-4 w-4 text-pink-400" />}
                        {activity.type === "sensor" && <Radio className="h-4 w-4 text-amber-400" />}
                        {activity.type === "light" && <Lightbulb className="h-4 w-4 text-emerald-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{activity.device}</p>
                        <p className="text-xs text-zinc-400">{activity.action}</p>
                      </div>
                      <span className="text-xs text-zinc-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

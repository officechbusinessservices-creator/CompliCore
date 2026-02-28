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
  Bot,
  MessageSquare,
  Send,
  Plus,
  Edit,
  Trash2,
  Settings,
  Zap,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Copy,
  RefreshCw,
  HelpCircle,
  Key,
  Wifi,
  Car,
  Home,
  Calendar,
  Phone,
  DollarSign,
  MapPin,
  Coffee,
  Tv,
  Thermometer,
  Shield,
  MoreVertical,
  Play,
  Pause,
  BarChart3,
} from "lucide-react";

// Mock FAQ categories and responses
const faqCategories = [
  {
    id: "checkin",
    name: "Check-in/out",
    icon: Key,
    color: "bg-blue-500",
    questions: [
      { q: "What time is check-in?", a: "Check-in is at 3:00 PM. Early check-in may be available upon request for an additional fee of $50.", confidence: 98 },
      { q: "What time is check-out?", a: "Check-out is at 11:00 AM. Late check-out until 2:00 PM is available for $50 if there's no same-day arrival.", confidence: 98 },
      { q: "How do I access the property?", a: "You'll receive a unique door code 24 hours before your arrival. Simply enter the code on the keypad and turn the handle.", confidence: 95 },
    ],
  },
  {
    id: "wifi",
    name: "WiFi & Tech",
    icon: Wifi,
    color: "bg-violet-500",
    questions: [
      { q: "What's the WiFi password?", a: "The WiFi network is 'BeachVilla_Guest' and the password is 'Welcome2024!'. You'll also find this in your welcome guide.", confidence: 99 },
      { q: "How do I use the smart TV?", a: "The TV is pre-logged into Netflix, Disney+, and HBO Max. Just press the service button on the remote to access them.", confidence: 92 },
      { q: "Is there a Bluetooth speaker?", a: "Yes! There's a Sonos system throughout the house. Download the Sonos app and connect to 'Villa Sonos' to play your music.", confidence: 90 },
    ],
  },
  {
    id: "parking",
    name: "Parking",
    icon: Car,
    color: "bg-emerald-500",
    questions: [
      { q: "Where do I park?", a: "You have 2 covered spots in the garage. Use your door code for the garage door. Additional street parking is also available.", confidence: 97 },
      { q: "Is parking free?", a: "Yes, parking is completely free! You have access to the garage and unlimited street parking.", confidence: 95 },
    ],
  },
  {
    id: "amenities",
    name: "Amenities",
    icon: Home,
    color: "bg-amber-500",
    questions: [
      { q: "Is the pool heated?", a: "Yes, the pool is heated to a comfortable 82°F. Pool hours are 7 AM to 10 PM.", confidence: 96 },
      { q: "How do I use the hot tub?", a: "The hot tub is ready to use at 102°F. The controls are on the side - green button to activate jets. Please shower before use.", confidence: 94 },
      { q: "Where are the beach towels?", a: "Beach towels are located in the pool house, on the shelves to your right as you enter.", confidence: 93 },
    ],
  },
  {
    id: "location",
    name: "Location",
    icon: MapPin,
    color: "bg-pink-500",
    questions: [
      { q: "Where's the nearest grocery store?", a: "Whole Foods is 12 minutes away at 123 Pacific Ave. Ralphs is 15 minutes in the other direction.", confidence: 91 },
      { q: "Any restaurant recommendations?", a: "Our favorites are Nobu Malibu (15 min, upscale Japanese), Malibu Farm (10 min, farm-to-table), and Paradise Cove (8 min, beach cafe).", confidence: 89 },
    ],
  },
];

// Mock conversation history
const conversationHistory = [
  {
    id: 1,
    guest: "Sarah Johnson",
    property: "Malibu Beach Villa",
    messages: [
      { role: "guest", content: "Hi! What's the WiFi password?", time: "2:30 PM" },
      { role: "bot", content: "Hi Sarah! The WiFi network is 'BeachVilla_Guest' and the password is 'Welcome2024!'. You'll also find this in your welcome guide. Is there anything else I can help with?", time: "2:30 PM", confidence: 99 },
      { role: "guest", content: "Perfect, thanks! Also, is the pool heated?", time: "2:32 PM" },
      { role: "bot", content: "Yes, the pool is heated to a comfortable 82°F! Pool hours are 7 AM to 10 PM. Enjoy your swim!", time: "2:32 PM", confidence: 96 },
    ],
    status: "resolved",
    date: "Today",
  },
  {
    id: 2,
    guest: "Michael Chen",
    property: "Downtown Loft",
    messages: [
      { role: "guest", content: "The AC seems to not be working properly", time: "4:15 PM" },
      { role: "bot", content: "I'm sorry to hear the AC isn't working well! I've notified our host about this issue. In the meantime, try these steps:\n\n1. Check if the thermostat is set to 'Cool'\n2. Make sure the temperature is set below the current room temp\n3. Check if the vents are open\n\nOur host will reach out within 30 minutes.", time: "4:15 PM", confidence: 78 },
    ],
    status: "escalated",
    date: "Today",
  },
  {
    id: 3,
    guest: "Emma Davis",
    property: "Mountain Retreat",
    messages: [
      { role: "guest", content: "What time should we check out tomorrow?", time: "Yesterday" },
      { role: "bot", content: "Check-out is at 11:00 AM tomorrow. Before you leave, please:\n\n- Start the dishwasher if used\n- Take out any trash to the bins outside\n- Leave used towels in the bathroom\n- Lock all doors (they auto-lock)\n\nWe hope you had a wonderful stay!", time: "Yesterday", confidence: 98 },
    ],
    status: "resolved",
    date: "Yesterday",
  },
];

// Chatbot stats
const chatbotStats = {
  totalConversations: 156,
  autoResolved: 134,
  escalated: 22,
  avgResponseTime: "< 5 sec",
  satisfactionRate: 94,
};

export default function ChatbotPage() {
  const [selectedCategory, setSelectedCategory] = useState(faqCategories[0]);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [testMessage, setTestMessage] = useState("");
  const [testResponse, setTestResponse] = useState<string | null>(null);

  const handleTestMessage = () => {
    if (!testMessage.trim()) return;
    // Simulate AI response
    setTimeout(() => {
      setTestResponse("Based on your question, here's what I found: The check-in time is 3:00 PM. You'll receive your access code 24 hours before arrival. Would you like more details about the check-in process?");
    }, 1000);
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
                <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-pink-500/20">
                  <Bot className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">AI Guest Chatbot</h1>
                  <p className="text-xs text-zinc-400">Automated guest support</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
                <div className={`w-2 h-2 rounded-full ${chatEnabled ? "bg-emerald-400 animate-pulse" : "bg-zinc-500"}`} />
                <span className="text-sm">{chatEnabled ? "Active" : "Paused"}</span>
                <Switch checked={chatEnabled} onCheckedChange={setChatEnabled} />
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/20">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{chatbotStats.totalConversations}</p>
                  <p className="text-xs text-zinc-400">Conversations</p>
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
                  <p className="text-2xl font-bold">{chatbotStats.autoResolved}</p>
                  <p className="text-xs text-zinc-400">Auto-Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{chatbotStats.escalated}</p>
                  <p className="text-xs text-zinc-400">Escalated</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-500/20">
                  <Zap className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{chatbotStats.avgResponseTime}</p>
                  <p className="text-xs text-zinc-400">Response Time</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/20">
                  <ThumbsUp className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{chatbotStats.satisfactionRate}%</p>
                  <p className="text-xs text-zinc-400">Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Knowledge Base */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-violet-400" />
                      Knowledge Base
                    </CardTitle>
                    <CardDescription>Questions the chatbot can answer</CardDescription>
                  </div>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {faqCategories.map((cat) => {
                    const IconComponent = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                          selectedCategory.id === cat.id
                            ? "bg-violet-500/20 border border-violet-500/50"
                            : "bg-zinc-800 border border-zinc-700 hover:border-zinc-600"
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm">{cat.name}</span>
                        <Badge variant="outline" className="text-xs">{cat.questions.length}</Badge>
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-4">
                  {selectedCategory.questions.map((qa, index) => (
                    <div key={index} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-zinc-400" />
                          <span className="text-sm font-medium text-white">{qa.q}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={qa.confidence >= 95 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : qa.confidence >= 85 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-red-500/20 text-red-400 border-red-500/30"}>
                            {qa.confidence}% match
                          </Badge>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 pl-6">
                        <Bot className="h-4 w-4 text-violet-400 mt-0.5" />
                        <p className="text-sm text-zinc-300">{qa.a}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Conversations */}
            <Card className="bg-zinc-900/50 border-zinc-800 mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Recent Conversations</CardTitle>
                    <CardDescription>Chat history with guests</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {conversationHistory.map((conv) => (
                  <div key={conv.id} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center">
                          <span className="text-xs font-medium">{conv.guest.split(" ").map((n) => n[0]).join("")}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{conv.guest}</p>
                          <p className="text-xs text-zinc-400">{conv.property} • {conv.date}</p>
                        </div>
                      </div>
                      <Badge className={conv.status === "resolved" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}>
                        {conv.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 pl-11">
                      {conv.messages.slice(-2).map((msg, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          {msg.role === "guest" ? (
                            <User className="h-4 w-4 text-zinc-400 mt-0.5" />
                          ) : (
                            <Bot className="h-4 w-4 text-violet-400 mt-0.5" />
                          )}
                          <p className="text-sm text-zinc-300 line-clamp-2">{msg.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Test Chat & Settings */}
          <div className="space-y-6">
            {/* Test Chat */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-400" />
                  Test Chat
                </CardTitle>
                <CardDescription>Try the chatbot</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-48 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 overflow-y-auto">
                  {testResponse ? (
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-zinc-400 mt-0.5" />
                        <p className="text-sm text-zinc-300">{testMessage}</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <Bot className="h-4 w-4 text-violet-400 mt-0.5" />
                        <p className="text-sm text-zinc-300">{testResponse}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center text-zinc-500">
                      <p className="text-sm">Type a message to test...</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={testMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestMessage(e.target.value)}
                    placeholder="Ask a question..."
                    className="bg-zinc-800 border-zinc-700"
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && handleTestMessage()}
                  />
                  <Button onClick={handleTestMessage} className="bg-violet-600 hover:bg-violet-700">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                {testResponse && (
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { setTestMessage(""); setTestResponse(null); }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Chatbot Settings */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Chatbot Behavior</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">24/7 Auto-Response</p>
                    <p className="text-xs text-zinc-400">Respond to guests anytime</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">Escalate Low Confidence</p>
                    <p className="text-xs text-zinc-400">Alert host if confidence {"<"} 80%</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white">Learn from Corrections</p>
                    <p className="text-xs text-zinc-400">Improve from host feedback</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="pt-2 border-t border-zinc-800">
                  <Label className="text-zinc-400 text-sm">Response Tone</Label>
                  <Select defaultValue="friendly">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="pt-2 border-t border-zinc-800">
                  <Label className="text-zinc-400 text-sm">Confidence Threshold</Label>
                  <Select defaultValue="80">
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="70">70% - More answers, less accurate</SelectItem>
                      <SelectItem value="80">80% - Balanced</SelectItem>
                      <SelectItem value="90">90% - Fewer answers, more accurate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

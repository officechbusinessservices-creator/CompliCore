"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  ClipboardList,
  Send,
  BarChart3,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Copy,
  Eye,
  Mail,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Smile,
  Meh,
  Frown,
  Zap,
  Settings,
  Target,
  Award,
} from "lucide-react";

// Mock survey templates
const surveyTemplates = [
  {
    id: "post-stay",
    name: "Post-Stay Survey",
    description: "Comprehensive feedback after checkout",
    questions: 12,
    avgCompletion: "78%",
    status: "active",
    triggers: "24 hours after checkout",
  },
  {
    id: "mid-stay",
    name: "Mid-Stay Check-in",
    description: "Quick pulse check during longer stays",
    questions: 5,
    avgCompletion: "85%",
    status: "active",
    triggers: "Day 3 of stays 5+ nights",
  },
  {
    id: "instant-feedback",
    name: "Quick Rating",
    description: "One-click satisfaction rating",
    questions: 3,
    avgCompletion: "92%",
    status: "active",
    triggers: "2 hours after checkout",
  },
  {
    id: "detailed-review",
    name: "Detailed Review Request",
    description: "For guests with positive quick ratings",
    questions: 8,
    avgCompletion: "45%",
    status: "paused",
    triggers: "After 4+ star quick rating",
  },
];

// Mock survey responses
const recentResponses = [
  {
    id: 1,
    guest: "Sarah Johnson",
    property: "Malibu Beach Villa",
    date: "2026-02-02",
    nps: 10,
    overallRating: 5,
    completed: true,
    feedback: "Absolutely stunning property! The views were incredible and everything was exactly as described. Would definitely come back!",
    categories: { cleanliness: 5, communication: 5, location: 5, value: 4, amenities: 5 },
  },
  {
    id: 2,
    guest: "Michael Chen",
    property: "Downtown Loft",
    date: "2026-02-01",
    nps: 8,
    overallRating: 4,
    completed: true,
    feedback: "Great location and modern space. Minor issue with hot water but host resolved quickly.",
    categories: { cleanliness: 4, communication: 5, location: 5, value: 4, amenities: 4 },
  },
  {
    id: 3,
    guest: "Emma Davis",
    property: "Mountain Retreat",
    date: "2026-01-30",
    nps: 9,
    overallRating: 5,
    completed: true,
    feedback: "Perfect getaway! The cabin was cozy and the hot tub was amazing. Highly recommend!",
    categories: { cleanliness: 5, communication: 4, location: 5, value: 5, amenities: 5 },
  },
  {
    id: 4,
    guest: "James Wilson",
    property: "Beachfront Cottage",
    date: "2026-01-28",
    nps: 6,
    overallRating: 3,
    completed: true,
    feedback: "Property was nice but could use some updates. WiFi was unreliable and AC struggled.",
    categories: { cleanliness: 4, communication: 3, location: 5, value: 3, amenities: 2 },
  },
  {
    id: 5,
    guest: "Lisa Thompson",
    property: "City Apartment",
    date: "2026-01-25",
    nps: 10,
    overallRating: 5,
    completed: false,
    feedback: null,
    categories: null,
  },
];

// NPS distribution data
const npsDistribution = [
  { score: 0, count: 2 },
  { score: 1, count: 1 },
  { score: 2, count: 0 },
  { score: 3, count: 1 },
  { score: 4, count: 2 },
  { score: 5, count: 3 },
  { score: 6, count: 8 },
  { score: 7, count: 12 },
  { score: 8, count: 28 },
  { score: 9, count: 35 },
  { score: 10, count: 48 },
];

export default function SurveysPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [automationEnabled, setAutomationEnabled] = useState(true);

  // Calculate NPS
  const totalResponses = npsDistribution.reduce((sum, d) => sum + d.count, 0);
  const promoters = npsDistribution.filter((d) => d.score >= 9).reduce((sum, d) => sum + d.count, 0);
  const detractors = npsDistribution.filter((d) => d.score <= 6).reduce((sum, d) => sum + d.count, 0);
  const npsScore = Math.round(((promoters - detractors) / totalResponses) * 100);

  const getNPSColor = (score: number) => {
    if (score >= 9) return "text-emerald-400";
    if (score >= 7) return "text-amber-400";
    return "text-red-400";
  };

  const getNPSCategory = (score: number) => {
    if (score >= 9) return { label: "Promoter", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" };
    if (score >= 7) return { label: "Passive", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" };
    return { label: "Detractor", color: "bg-red-500/20 text-red-400 border-red-500/30" };
  };

  const maxDistribution = Math.max(...npsDistribution.map((d) => d.count));

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
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <ClipboardList className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Guest Surveys</h1>
                  <p className="text-xs text-zinc-400">Automated feedback collection & NPS tracking</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700">
                <Zap className={`h-4 w-4 ${automationEnabled ? "text-amber-400" : "text-zinc-500"}`} />
                <span className="text-sm">Automation</span>
                <Switch checked={automationEnabled} onCheckedChange={setAutomationEnabled} />
              </div>
              <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                <Plus className="h-4 w-4 mr-2" />
                New Survey
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* NPS Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* NPS Score Card */}
          <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 border-emerald-800/50 md:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-emerald-400 mb-1">Net Promoter Score</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-5xl font-bold text-white">{npsScore}</p>
                    <div className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">+5 vs last month</span>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 mt-2">Based on {totalResponses} responses</p>
                </div>
                <div className="text-right space-y-2">
                  <div className="flex items-center gap-2">
                    <Smile className="h-5 w-5 text-emerald-400" />
                    <span className="text-sm text-zinc-300">{promoters} Promoters ({Math.round((promoters / totalResponses) * 100)}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Meh className="h-5 w-5 text-amber-400" />
                    <span className="text-sm text-zinc-300">{totalResponses - promoters - detractors} Passives</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Frown className="h-5 w-5 text-red-400" />
                    <span className="text-sm text-zinc-300">{detractors} Detractors ({Math.round((detractors / totalResponses) * 100)}%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Response Rate</p>
                  <p className="text-3xl font-bold text-white">76%</p>
                  <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" /> +3% vs avg
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20">
                  <BarChart3 className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-400">Avg Rating</p>
                  <p className="text-3xl font-bold text-white flex items-center gap-1">
                    4.6 <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  </p>
                  <p className="text-xs text-zinc-400 mt-1">across all categories</p>
                </div>
                <div className="p-3 rounded-lg bg-amber-500/20">
                  <Award className="h-6 w-6 text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NPS Distribution Chart */}
        <Card className="bg-zinc-900/50 border-zinc-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white">NPS Score Distribution</CardTitle>
            <CardDescription>How likely guests are to recommend (0-10 scale)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-32">
              {npsDistribution.map((item) => {
                const height = (item.count / maxDistribution) * 100;
                const color = item.score >= 9 ? "bg-emerald-500" : item.score >= 7 ? "bg-amber-500" : "bg-red-500";
                return (
                  <div key={item.score} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-zinc-400">{item.count}</span>
                    <div
                      className={`w-full ${color} rounded-t transition-all`}
                      style={{ height: `${height}%`, minHeight: item.count > 0 ? "4px" : "0" }}
                    />
                    <span className="text-xs text-zinc-500">{item.score}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-500" />
                  <span className="text-xs text-zinc-400">Detractors (0-6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-500" />
                  <span className="text-xs text-zinc-400">Passives (7-8)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span className="text-xs text-zinc-400">Promoters (9-10)</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Survey Templates */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">Survey Templates</CardTitle>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {surveyTemplates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`w-full p-4 rounded-lg border text-left transition-all ${
                      selectedTemplate === template.id
                        ? "bg-amber-500/20 border-amber-500/50"
                        : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white text-sm">{template.name}</h3>
                      <Badge className={template.status === "active" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"}>
                        {template.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-zinc-400 mb-2">{template.description}</p>
                    <div className="flex items-center gap-3 text-xs text-zinc-500">
                      <span>{template.questions} questions</span>
                      <span>{template.avgCompletion} completion</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-zinc-700">
                      <Clock className="h-3 w-3 text-zinc-500" />
                      <span className="text-xs text-zinc-500">{template.triggers}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Responses */}
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Recent Responses</CardTitle>
                    <CardDescription>Latest guest feedback and ratings</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentResponses.map((response) => {
                  const npsCategory = getNPSCategory(response.nps);
                  return (
                    <div key={response.id} className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                            <span className="text-sm font-medium">{response.guest.split(" ").map((n) => n[0]).join("")}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-white">{response.guest}</h4>
                            <p className="text-xs text-zinc-400">{response.property} • {response.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={npsCategory.color}>{npsCategory.label}</Badge>
                          <div className="flex items-center gap-1 px-2 py-1 rounded bg-zinc-800">
                            <span className={`text-lg font-bold ${getNPSColor(response.nps)}`}>{response.nps}</span>
                            <span className="text-xs text-zinc-500">/10</span>
                          </div>
                        </div>
                      </div>

                      {response.completed && response.categories && (
                        <>
                          <div className="flex items-center gap-4 mb-3">
                            {Object.entries(response.categories).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-1">
                                <span className="text-xs text-zinc-400 capitalize">{key}:</span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${i < value ? "text-amber-400 fill-amber-400" : "text-zinc-600"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          {response.feedback && (
                            <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-700">
                              <p className="text-sm text-zinc-300 italic">"{response.feedback}"</p>
                            </div>
                          )}
                        </>
                      )}

                      {!response.completed && (
                        <div className="flex items-center gap-2 text-amber-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">Survey incomplete - reminder scheduled</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-zinc-700">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Reply
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View Full
                        </Button>
                        {response.nps <= 6 && (
                          <Badge className="ml-auto bg-red-500/20 text-red-400 border-red-500/30">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Needs Attention
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Automation Settings */}
        <Card className="bg-zinc-900/50 border-zinc-800 mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-400" />
                  Survey Automation Settings
                </CardTitle>
                <CardDescription>Configure when and how surveys are sent</CardDescription>
              </div>
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Advanced Settings
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-400" />
                    <span className="font-medium text-white">Post-Checkout</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <p className="text-xs text-zinc-400 mb-2">Automatically send survey 24 hours after checkout</p>
                <Select defaultValue="24">
                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Delay" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="2">2 hours after</SelectItem>
                    <SelectItem value="24">24 hours after</SelectItem>
                    <SelectItem value="48">48 hours after</SelectItem>
                    <SelectItem value="72">72 hours after</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-emerald-400" />
                    <span className="font-medium text-white">Follow-up Reminder</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <p className="text-xs text-zinc-400 mb-2">Send reminder if survey not completed</p>
                <Select defaultValue="3">
                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Days" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="2">After 2 days</SelectItem>
                    <SelectItem value="3">After 3 days</SelectItem>
                    <SelectItem value="5">After 5 days</SelectItem>
                    <SelectItem value="7">After 7 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-violet-400" />
                    <span className="font-medium text-white">Detractor Alert</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <p className="text-xs text-zinc-400 mb-2">Notify host when NPS is 6 or below</p>
                <Select defaultValue="email-push">
                  <SelectTrigger className="bg-zinc-900 border-zinc-700">
                    <SelectValue placeholder="Alert method" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-700">
                    <SelectItem value="email">Email only</SelectItem>
                    <SelectItem value="push">Push only</SelectItem>
                    <SelectItem value="email-push">Email + Push</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

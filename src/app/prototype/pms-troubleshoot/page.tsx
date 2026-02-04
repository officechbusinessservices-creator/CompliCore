"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Wrench,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
  Wifi,
  Key,
  Clock,
  Database,
  Shield,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Play,
  Terminal,
  FileText,
  MessageSquare,
} from "lucide-react";
import { apiPost } from "@/lib/api";

// Diagnostic checks
const diagnosticChecks = [
  { id: "connection", name: "API Connection", status: "pass", message: "Connected to Guesty API", time: "45ms" },
  { id: "auth", name: "Authentication", status: "pass", message: "API key valid", time: "12ms" },
  { id: "permissions", name: "Permissions", status: "pass", message: "All required scopes granted", time: "8ms" },
  { id: "rate-limit", name: "Rate Limit", status: "warning", message: "80% of rate limit used", time: "5ms" },
  { id: "webhook", name: "Webhook Status", status: "pass", message: "Receiving events", time: "120ms" },
  { id: "sync", name: "Last Sync", status: "pass", message: "2 minutes ago", time: "N/A" },
];

// Common issues and solutions
const commonIssues = [
  {
    id: 1,
    title: "Connection Timeout",
    description: "API requests are timing out before completion",
    severity: "high",
    category: "connection",
    symptoms: ["Sync operations fail after 30 seconds", "Partial data imports", "Webhook delivery failures"],
    solutions: [
      "Check your internet connection stability",
      "Verify the PMS service status page for outages",
      "Increase timeout settings in integration configuration",
      "Contact PMS support if issue persists",
    ],
    resolved: false,
  },
  {
    id: 2,
    title: "Authentication Failed",
    description: "API key or credentials are invalid or expired",
    severity: "critical",
    category: "auth",
    symptoms: ["401 Unauthorized errors", "Unable to fetch any data", "All sync operations fail"],
    solutions: [
      "Verify API key is correct and not expired",
      "Regenerate API credentials in PMS dashboard",
      "Check if account subscription is active",
      "Ensure IP whitelist includes our servers",
    ],
    resolved: false,
  },
  {
    id: 3,
    title: "Rate Limit Exceeded",
    description: "Too many API requests in a short time period",
    severity: "medium",
    category: "performance",
    symptoms: ["429 Too Many Requests errors", "Intermittent sync failures", "Delayed data updates"],
    solutions: [
      "Reduce sync frequency in settings",
      "Enable request batching",
      "Contact PMS to increase rate limits",
      "Optimize queries to reduce API calls",
    ],
    resolved: true,
  },
  {
    id: 4,
    title: "Data Sync Mismatch",
    description: "Local data doesn't match PMS data",
    severity: "medium",
    category: "sync",
    symptoms: ["Reservation counts don't match", "Missing guest information", "Outdated pricing data"],
    solutions: [
      "Run a full data reconciliation",
      "Check field mapping configuration",
      "Clear local cache and resync",
      "Verify data transformation rules",
    ],
    resolved: false,
  },
  {
    id: 5,
    title: "Webhook Delivery Failures",
    description: "Real-time updates are not being received",
    severity: "high",
    category: "webhook",
    symptoms: ["New bookings not appearing", "Status changes delayed", "Manual refresh required"],
    solutions: [
      "Verify webhook URL is accessible",
      "Check SSL certificate validity",
      "Review webhook logs for errors",
      "Re-register webhook endpoints",
    ],
    resolved: false,
  },
];

// Troubleshooting logs
const recentLogs = [
  { time: "10:32:45", level: "info", message: "Starting diagnostic check..." },
  { time: "10:32:46", level: "success", message: "API connection established" },
  { time: "10:32:46", level: "success", message: "Authentication verified" },
  { time: "10:32:47", level: "warning", message: "Rate limit at 80% (800/1000 requests)" },
  { time: "10:32:47", level: "success", message: "Webhook endpoint responding" },
  { time: "10:32:48", level: "info", message: "Diagnostic check completed" },
];

export default function PMSTroubleshootPage() {
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIssue, setExpandedIssue] = useState<number | null>(1);
  const [diagnosticResults, setDiagnosticResults] = useState(diagnosticChecks);

  const runDiagnostic = () => {
    setIsRunningDiagnostic(true);
    apiPost<any>("/pms/connectors/guesty/sync", { type: "diagnostic" }).catch(() => null);
    setTimeout(() => {
      setIsRunningDiagnostic(false);
    }, 3000);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-zinc-500/20 text-zinc-400 border-zinc-500/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle2 className="h-5 w-5 text-emerald-400" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-red-400" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      default:
        return <Clock className="h-5 w-5 text-zinc-400" />;
    }
  };

  const filteredIssues = commonIssues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/prototype/pms">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  PMS Integration
                </Button>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/20">
                  <Wrench className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Troubleshooting Guide</h1>
                  <p className="text-xs text-zinc-400">Diagnose and fix connection issues</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
              <Button
                onClick={runDiagnostic}
                disabled={isRunningDiagnostic}
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Play className={`h-4 w-4 mr-2 ${isRunningDiagnostic ? "animate-spin" : ""}`} />
                {isRunningDiagnostic ? "Running..." : "Run Diagnostic"}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Diagnostic Results */}
          <div className="lg:col-span-2 space-y-6">
            {/* Diagnostic Checks */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">System Diagnostic</CardTitle>
                    <CardDescription>Automated health checks for your PMS connection</CardDescription>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    5/6 Passing
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {diagnosticResults.map((check) => (
                  <div
                    key={check.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      check.status === "pass"
                        ? "bg-zinc-800/50 border-zinc-700"
                        : check.status === "warning"
                        ? "bg-amber-500/10 border-amber-500/30"
                        : "bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(check.status)}
                      <div>
                        <p className="font-medium text-white">{check.name}</p>
                        <p className="text-sm text-zinc-400">{check.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={
                          check.status === "pass"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : check.status === "warning"
                            ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                        }
                      >
                        {check.status}
                      </Badge>
                      <p className="text-xs text-zinc-500 mt-1">{check.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Common Issues */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Common Issues & Solutions</CardTitle>
                    <CardDescription>Known problems and how to fix them</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      placeholder="Search issues..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-zinc-800 border-zinc-700 pl-9 w-48"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`rounded-lg border overflow-hidden ${
                      issue.resolved
                        ? "bg-zinc-800/30 border-zinc-700 opacity-60"
                        : "bg-zinc-800/50 border-zinc-700"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedIssue(expandedIssue === issue.id ? null : issue.id)}
                      className="w-full flex items-center justify-between p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        {expandedIssue === issue.id ? (
                          <ChevronDown className="h-5 w-5 text-zinc-400" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-zinc-400" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{issue.title}</p>
                            {issue.resolved && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                Resolved
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-zinc-400">{issue.description}</p>
                        </div>
                      </div>
                      <Badge className={getSeverityColor(issue.severity)}>{issue.severity}</Badge>
                    </button>

                    {expandedIssue === issue.id && (
                      <div className="px-4 pb-4 pt-0 border-t border-zinc-700 mt-2">
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-white mb-2">Symptoms</h4>
                          <ul className="space-y-1">
                            {issue.symptoms.map((symptom, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm text-zinc-400">
                                <AlertTriangle className="h-3 w-3 text-amber-400" />
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-white mb-2">Solutions</h4>
                          <ol className="space-y-2">
                            {issue.solutions.map((solution, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs">
                                  {idx + 1}
                                </span>
                                {solution}
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-700">
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View Docs
                          </Button>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            PMS Support
                          </Button>
                          {!issue.resolved && (
                            <Button size="sm" className="ml-auto bg-emerald-600 hover:bg-emerald-700">
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Mark Resolved
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Force Reconnect
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Key className="h-4 w-4 mr-2" />
                  Refresh API Keys
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Clear Cache
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Wifi className="h-4 w-4 mr-2" />
                  Test Connection
                </Button>
              </CardContent>
            </Card>

            {/* Diagnostic Logs */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-zinc-400" />
                    Diagnostic Log
                  </CardTitle>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-zinc-900 rounded-lg p-3 font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
                  {recentLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-zinc-500">{log.time}</span>
                      <span
                        className={
                          log.level === "success"
                            ? "text-emerald-400"
                            : log.level === "warning"
                            ? "text-amber-400"
                            : log.level === "error"
                            ? "text-red-400"
                            : "text-zinc-400"
                        }
                      >
                        [{log.level}]
                      </span>
                      <span className="text-zinc-300">{log.message}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Help Resources */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Help Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Documentation</p>
                    <p className="text-xs text-zinc-400">Integration guides</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-zinc-500 ml-auto" />
                </a>
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                  <HelpCircle className="h-5 w-5 text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-white">FAQ</p>
                    <p className="text-xs text-zinc-400">Common questions</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-zinc-500 ml-auto" />
                </a>
                <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                  <MessageSquare className="h-5 w-5 text-violet-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Community</p>
                    <p className="text-xs text-zinc-400">Ask the community</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-zinc-500 ml-auto" />
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

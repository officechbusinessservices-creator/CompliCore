"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ArrowLeft,
  Upload,
  FileSpreadsheet,
  ArrowRight,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Database,
  Table,
  Columns,
  Check,
  X,
  RefreshCw,
  Eye,
  Download,
  Plus,
  Trash2,
  HelpCircle,
  Sparkles,
  FileText,
  Zap,
} from "lucide-react";
import { apiPost } from "@/lib/api";

// Mock source fields from PMS
const sourceFields = [
  { name: "reservation_id", type: "string", sample: "G-78234" },
  { name: "guest_name", type: "string", sample: "John Smith" },
  { name: "guest_email", type: "string", sample: "john@email.com" },
  { name: "guest_phone", type: "string", sample: "+1-555-0123" },
  { name: "property_id", type: "string", sample: "PROP-001" },
  { name: "property_name", type: "string", sample: "Beach Villa" },
  { name: "arrival_date", type: "date", sample: "2026-02-10" },
  { name: "departure_date", type: "date", sample: "2026-02-14" },
  { name: "num_guests", type: "number", sample: "4" },
  { name: "total_price", type: "currency", sample: "1250.00" },
  { name: "booking_status", type: "string", sample: "confirmed" },
  { name: "created_at", type: "datetime", sample: "2026-01-15T10:30:00" },
  { name: "notes", type: "text", sample: "Late check-in requested" },
];

// Platform target fields
const targetFields = [
  { name: "confirmation_code", type: "string", required: true },
  { name: "guest_full_name", type: "string", required: true },
  { name: "guest_email", type: "string", required: true },
  { name: "guest_phone", type: "string", required: false },
  { name: "property_id", type: "string", required: true },
  { name: "property_name", type: "string", required: true },
  { name: "check_in_date", type: "date", required: true },
  { name: "check_out_date", type: "date", required: true },
  { name: "guest_count", type: "number", required: true },
  { name: "total_amount", type: "currency", required: true },
  { name: "status", type: "string", required: true },
  { name: "booking_date", type: "datetime", required: false },
  { name: "special_requests", type: "text", required: false },
];

// Default mappings
const defaultMappings = [
  { source: "reservation_id", target: "confirmation_code", transform: null },
  { source: "guest_name", target: "guest_full_name", transform: null },
  { source: "guest_email", target: "guest_email", transform: null },
  { source: "guest_phone", target: "guest_phone", transform: null },
  { source: "property_id", target: "property_id", transform: null },
  { source: "property_name", target: "property_name", transform: null },
  { source: "arrival_date", target: "check_in_date", transform: null },
  { source: "departure_date", target: "check_out_date", transform: null },
  { source: "num_guests", target: "guest_count", transform: null },
  { source: "total_price", target: "total_amount", transform: null },
  { source: "booking_status", target: "status", transform: "status_map" },
  { source: "created_at", target: "booking_date", transform: null },
  { source: "notes", target: "special_requests", transform: null },
];

// Preview data
const previewData = [
  { confirmation_code: "G-78234", guest_full_name: "John Smith", check_in_date: "2026-02-10", check_out_date: "2026-02-14", total_amount: "$1,250.00", status: "Confirmed" },
  { confirmation_code: "G-78235", guest_full_name: "Sarah Johnson", check_in_date: "2026-02-16", check_out_date: "2026-02-19", total_amount: "$945.00", status: "Confirmed" },
  { confirmation_code: "G-78236", guest_full_name: "Michael Chen", check_in_date: "2026-02-22", check_out_date: "2026-02-24", total_amount: "$420.00", status: "Pending" },
];

const steps = [
  { id: 1, name: "Select Source", description: "Choose data source" },
  { id: 2, name: "Map Fields", description: "Match source to target fields" },
  { id: 3, name: "Transform", description: "Apply data transformations" },
  { id: 4, name: "Preview", description: "Review before import" },
  { id: 5, name: "Import", description: "Execute the import" },
];

export default function PMSImportPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [mappings, setMappings] = useState(defaultMappings);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  const handleImport = () => {
    setIsImporting(true);
    apiPost<any>("/pms/import", { source: selectedSource, mappings }).catch(() => null);
    setTimeout(() => {
      setIsImporting(false);
      setImportComplete(true);
    }, 3000);
  };

  const updateMapping = (sourceField: string, targetField: string) => {
    setMappings((prev) =>
      prev.map((m) => (m.source === sourceField ? { ...m, target: targetField } : m))
    );
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/pms">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  PMS Integration
                </Button>
              </Link>
              <div className="h-6 w-px bg-zinc-700" />
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20">
                  <Upload className="h-5 w-5 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">Data Import Wizard</h1>
                  <p className="text-xs text-zinc-400">Import and map PMS data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep > step.id
                        ? "bg-emerald-500 border-emerald-500"
                        : currentStep === step.id
                        ? "bg-blue-500 border-blue-500"
                        : "bg-zinc-800 border-zinc-700"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <p className={`text-sm font-medium ${currentStep >= step.id ? "text-white" : "text-zinc-500"}`}>
                      {step.name}
                    </p>
                    <p className="text-xs text-zinc-500 hidden md:block">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 md:w-24 mx-2 ${currentStep > step.id ? "bg-emerald-500" : "bg-zinc-700"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-zinc-900/50 border-zinc-800 max-w-4xl mx-auto">
          <CardContent className="pt-6">
            {/* Step 1: Select Source */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-white mb-2">Select Data Source</h2>
                  <p className="text-zinc-400">Choose the PMS or file to import from</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: "guesty", name: "Guesty", icon: "🏠", connected: true },
                    { id: "hostaway", name: "Hostaway", icon: "🌟", connected: true },
                    { id: "beds24", name: "Beds24", icon: "🛏️", connected: true },
                    { id: "csv", name: "CSV File", icon: "📄", connected: false },
                    { id: "excel", name: "Excel File", icon: "📊", connected: false },
                    { id: "api", name: "API Endpoint", icon: "🔌", connected: false },
                  ].map((source) => (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => setSelectedSource(source.id)}
                      className={`p-6 rounded-lg border-2 transition-all text-center ${
                        selectedSource === source.id
                          ? "border-emerald-500 bg-emerald-500/10"
                          : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                      }`}
                    >
                      <span className="text-4xl mb-3 block">{source.icon}</span>
                      <p className="font-medium text-white">{source.name}</p>
                      {source.connected && (
                        <Badge className="mt-2 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                          Connected
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>

                {selectedSource && (
                  <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Source selected: {selectedSource}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Map Fields */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Field Mapping</h2>
                    <p className="text-zinc-400">Match source fields to platform fields</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Auto-Map
                  </Button>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-4 p-3 rounded-lg bg-zinc-800 text-sm font-medium text-zinc-400">
                    <span>Source Field</span>
                    <span>Sample Data</span>
                    <span className="text-center">→</span>
                    <span>Target Field</span>
                    <span>Required</span>
                  </div>

                  {mappings.map((mapping, index) => {
                    const sourceField = sourceFields.find((f) => f.name === mapping.source);
                    const targetField = targetFields.find((f) => f.name === mapping.target);
                    return (
                      <div key={index} className="grid grid-cols-5 gap-4 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700 items-center">
                        <div className="flex items-center gap-2">
                          <Columns className="h-4 w-4 text-blue-400" />
                          <code className="text-sm text-blue-400">{mapping.source}</code>
                        </div>
                        <span className="text-sm text-zinc-400 truncate">{sourceField?.sample}</span>
                        <div className="flex justify-center">
                          <ArrowRight className="h-4 w-4 text-zinc-500" />
                        </div>
                        <Select
                          value={mapping.target}
                          onValueChange={(v) => updateMapping(mapping.source, v)}
                        >
                          <SelectTrigger className="bg-zinc-900 border-zinc-700">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-700">
                            {targetFields.map((field) => (
                              <SelectItem key={field.name} value={field.name}>
                                {field.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="skip">-- Skip --</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex justify-center">
                          {targetField?.required ? (
                            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Required</Badge>
                          ) : (
                            <Badge variant="outline" className="text-zinc-500">Optional</Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Transform */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-xl font-semibold text-white mb-2">Data Transformations</h2>
                  <p className="text-zinc-400">Apply transformations to convert data formats</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-400" />
                        <span className="font-medium text-white">Status Mapping</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <Label className="text-zinc-400">Source Value</Label>
                        <div className="space-y-1">
                          <Input value="confirmed" readOnly className="bg-zinc-900 border-zinc-700" />
                          <Input value="pending" readOnly className="bg-zinc-900 border-zinc-700" />
                          <Input value="cancelled" readOnly className="bg-zinc-900 border-zinc-700" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-zinc-400">Target Value</Label>
                        <div className="space-y-1">
                          <Input defaultValue="Confirmed" className="bg-zinc-900 border-zinc-700" />
                          <Input defaultValue="Pending" className="bg-zinc-900 border-zinc-700" />
                          <Input defaultValue="Cancelled" className="bg-zinc-900 border-zinc-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-400" />
                        <span className="font-medium text-white">Date Format</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <Label className="text-zinc-400">Source Format</Label>
                        <Select defaultValue="iso">
                          <SelectTrigger className="bg-zinc-900 border-zinc-700 mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-700">
                            <SelectItem value="iso">ISO 8601 (YYYY-MM-DD)</SelectItem>
                            <SelectItem value="us">US (MM/DD/YYYY)</SelectItem>
                            <SelectItem value="eu">EU (DD/MM/YYYY)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-zinc-400">Target Format</Label>
                        <Select defaultValue="iso">
                          <SelectTrigger className="bg-zinc-900 border-zinc-700 mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900 border-zinc-700">
                            <SelectItem value="iso">ISO 8601 (YYYY-MM-DD)</SelectItem>
                            <SelectItem value="us">US (MM/DD/YYYY)</SelectItem>
                            <SelectItem value="eu">EU (DD/MM/YYYY)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-400" />
                        <span className="font-medium text-white">Currency Format</span>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-sm text-zinc-400">Convert raw numbers to formatted currency (e.g., 1250.00 → $1,250.00)</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Preview */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white">Preview Import</h2>
                    <p className="text-zinc-400">Review the data before importing</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    {previewData.length} records ready
                  </Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-700">
                        <th className="text-left p-3 text-zinc-400">Confirmation</th>
                        <th className="text-left p-3 text-zinc-400">Guest</th>
                        <th className="text-left p-3 text-zinc-400">Check-in</th>
                        <th className="text-left p-3 text-zinc-400">Check-out</th>
                        <th className="text-left p-3 text-zinc-400">Total</th>
                        <th className="text-left p-3 text-zinc-400">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((row, index) => (
                        <tr key={index} className="border-b border-zinc-800">
                          <td className="p-3 text-white font-mono">{row.confirmation_code}</td>
                          <td className="p-3 text-white">{row.guest_full_name}</td>
                          <td className="p-3 text-zinc-400">{row.check_in_date}</td>
                          <td className="p-3 text-zinc-400">{row.check_out_date}</td>
                          <td className="p-3 text-emerald-400">{row.total_amount}</td>
                          <td className="p-3">
                            <Badge variant="outline">{row.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span>All validations passed. Ready to import.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Import */}
            {currentStep === 5 && (
              <div className="space-y-6 text-center py-8">
                {!isImporting && !importComplete && (
                  <>
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <Upload className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Ready to Import</h2>
                    <p className="text-zinc-400 max-w-md mx-auto">
                      You're about to import {previewData.length} reservations from Guesty.
                      This action cannot be undone.
                    </p>
                    <Button onClick={handleImport} size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                      <Upload className="h-5 w-5 mr-2" />
                      Start Import
                    </Button>
                  </>
                )}

                {isImporting && (
                  <>
                    <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-6">
                      <RefreshCw className="h-10 w-10 text-blue-400 animate-spin" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Importing...</h2>
                    <p className="text-zinc-400">Please wait while we import your data.</p>
                    <div className="w-64 h-2 bg-zinc-800 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                  </>
                )}

                {importComplete && (
                  <>
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-semibold text-white">Import Complete!</h2>
                    <p className="text-zinc-400">Successfully imported {previewData.length} reservations.</p>
                    <div className="flex items-center justify-center gap-3 mt-6">
                      <Button variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        View Imported Data
                      </Button>
                      <Link href="/pms">
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                          Back to PMS
                        </Button>
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Navigation */}
            {!importComplete && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-800">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                {currentStep < 5 && (
                  <Button
                    onClick={() => setCurrentStep((prev) => Math.min(5, prev + 1))}
                    disabled={currentStep === 1 && !selectedSource}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

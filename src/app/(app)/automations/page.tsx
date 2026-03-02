"use client";

import { useState } from "react";
import Link from "next/link";

interface MessageTemplate {
  id: string;
  name: string;
  trigger: "booking_confirmed" | "pre_arrival" | "check_in_day" | "during_stay" | "checkout_day" | "post_checkout";
  timing: string;
  subject: string;
  body: string;
  enabled: boolean;
  properties: string[];
}

const triggerLabels = {
  booking_confirmed: "Booking Confirmed",
  pre_arrival: "Pre-Arrival",
  check_in_day: "Check-in Day",
  during_stay: "During Stay",
  checkout_day: "Check-out Day",
  post_checkout: "Post Check-out",
};

const triggerColors = {
  booking_confirmed: "bg-violet-500/10 text-violet-600 border-violet-500/20",
  pre_arrival: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  check_in_day: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  during_stay: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  checkout_day: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  post_checkout: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
};

const templates: MessageTemplate[] = [
  {
    id: "t1",
    name: "Booking Confirmation",
    trigger: "booking_confirmed",
    timing: "Immediately",
    subject: "Your booking is confirmed!",
    body: "Hi {{guest_name}},\n\nThank you for booking {{property_name}}! We're excited to host you.\n\n📅 Check-in: {{check_in_date}} at {{check_in_time}}\n📅 Check-out: {{check_out_date}} at {{check_out_time}}\n\nWe'll send you more details closer to your stay.\n\nBest regards,\n{{host_name}}",
    enabled: true,
    properties: ["All Properties"],
  },
  {
    id: "t2",
    name: "Pre-Arrival Information",
    trigger: "pre_arrival",
    timing: "3 days before check-in",
    subject: "Getting ready for your stay at {{property_name}}",
    body: "Hi {{guest_name}},\n\nYour stay is coming up in 3 days! Here's some important information:\n\n🔑 Access Code: {{access_code}}\n📍 Address: {{property_address}}\n🅿️ Parking: {{parking_instructions}}\n📶 WiFi: {{wifi_name}} / {{wifi_password}}\n\nLet me know if you have any questions!\n\n{{host_name}}",
    enabled: true,
    properties: ["All Properties"],
  },
  {
    id: "t3",
    name: "Check-in Day Welcome",
    trigger: "check_in_day",
    timing: "8:00 AM on check-in day",
    subject: "Welcome! Check-in details for today",
    body: "Good morning {{guest_name}}! 🌟\n\nToday's the day! Your check-in time is {{check_in_time}}.\n\nQuick reminders:\n• Access code: {{access_code}}\n• Property address: {{property_address}}\n\nI'm here if you need anything. Have a wonderful stay!\n\n{{host_name}}",
    enabled: true,
    properties: ["All Properties"],
  },
  {
    id: "t4",
    name: "Mid-Stay Check-in",
    trigger: "during_stay",
    timing: "Day 2 at 10:00 AM",
    subject: "How's everything going?",
    body: "Hi {{guest_name}},\n\nJust checking in to make sure everything is going well with your stay at {{property_name}}.\n\nIs there anything you need or any questions I can help with?\n\nEnjoy the rest of your trip!\n\n{{host_name}}",
    enabled: false,
    properties: ["Luxury Mountain Cabin"],
  },
  {
    id: "t5",
    name: "Check-out Reminder",
    trigger: "checkout_day",
    timing: "8:00 AM on check-out day",
    subject: "Check-out reminder for today",
    body: "Good morning {{guest_name}},\n\nJust a friendly reminder that check-out is at {{check_out_time}} today.\n\nBefore you leave, please:\n✅ Lock all doors and windows\n✅ Return keys/fobs to the lockbox\n✅ Start the dishwasher if there are dishes\n✅ Take out any trash\n\nThank you for staying with us! Safe travels! 🙏\n\n{{host_name}}",
    enabled: true,
    properties: ["All Properties"],
  },
  {
    id: "t6",
    name: "Review Request",
    trigger: "post_checkout",
    timing: "1 day after check-out",
    subject: "How was your stay at {{property_name}}?",
    body: "Hi {{guest_name}},\n\nThank you for staying at {{property_name}}! We hope you had a wonderful experience.\n\nWould you mind leaving a review? Your feedback helps us improve and helps other travelers.\n\n⭐ Leave a review: {{review_link}}\n\nWe'd love to host you again!\n\nWarm regards,\n{{host_name}}",
    enabled: true,
    properties: ["All Properties"],
  },
];

const variables = [
  { name: "{{guest_name}}", desc: "Guest's first name" },
  { name: "{{property_name}}", desc: "Property title" },
  { name: "{{property_address}}", desc: "Full address" },
  { name: "{{check_in_date}}", desc: "Check-in date" },
  { name: "{{check_in_time}}", desc: "Check-in time" },
  { name: "{{check_out_date}}", desc: "Check-out date" },
  { name: "{{check_out_time}}", desc: "Check-out time" },
  { name: "{{access_code}}", desc: "Door/lock code" },
  { name: "{{wifi_name}}", desc: "WiFi network name" },
  { name: "{{wifi_password}}", desc: "WiFi password" },
  { name: "{{host_name}}", desc: "Your name" },
];

export default function AutomationsPage() {
  const [messageTemplates, setMessageTemplates] = useState(templates);
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [showVariables, setShowVariables] = useState(false);

  const toggleTemplate = (id: string) => {
    setMessageTemplates(messageTemplates.map((t) =>
      t.id === id ? { ...t, enabled: !t.enabled } : t
    ));
  };

  const enabledCount = messageTemplates.filter((t) => t.enabled).length;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Message Automations</h1>
              <p className="text-xs text-zinc-500">Automated guest communication</p>
            </div>
          </div>
          <button
            onClick={() => setEditingTemplate({
              id: `t${Date.now()}`,
              name: "New Template",
              trigger: "booking_confirmed",
              timing: "Immediately",
              subject: "",
              body: "",
              enabled: false,
              properties: ["All Properties"],
            })}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Template
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Active Automations</p>
            <p className="text-2xl font-bold text-emerald-600">{enabledCount}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Messages Sent (30d)</p>
            <p className="text-2xl font-bold">156</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Open Rate</p>
            <p className="text-2xl font-bold">94%</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Response Rate</p>
            <p className="text-2xl font-bold">23%</p>
          </div>
        </div>

        {/* Automation Flow Visual */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-8">
          <h2 className="font-semibold mb-4">Guest Journey Automations</h2>
          <div className="flex items-center overflow-x-auto pb-2">
            {Object.entries(triggerLabels).map(([key, label], idx) => {
              const count = messageTemplates.filter((t) => t.trigger === key && t.enabled).length;
              return (
                <div key={key} className="flex items-center shrink-0">
                  <div className={`px-4 py-3 rounded-xl border ${triggerColors[key as keyof typeof triggerColors]} text-center min-w-[120px]`}>
                    <p className="text-xs font-medium">{label}</p>
                    <p className="text-lg font-bold mt-1">{count}</p>
                    <p className="text-xs opacity-70">active</p>
                  </div>
                  {idx < Object.keys(triggerLabels).length - 1 && (
                    <svg className="w-8 h-8 text-zinc-300 dark:text-zinc-700 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Templates List */}
        <div className="space-y-4">
          {messageTemplates.map((template) => (
            <div
              key={template.id}
              className={`bg-white dark:bg-zinc-900 rounded-xl border transition-colors ${
                template.enabled ? "border-emerald-500/50" : "border-zinc-200 dark:border-zinc-800"
              }`}
            >
              <div className="p-4 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => toggleTemplate(template.id)}
                    className={`relative w-12 h-7 rounded-full transition-colors shrink-0 mt-1 ${
                      template.enabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                    }`}
                  >
                    <span className={`absolute top-0.5 ${template.enabled ? "right-0.5" : "left-0.5"} w-6 h-6 bg-white rounded-full shadow transition-all`} />
                  </button>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{template.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs border ${triggerColors[template.trigger]}`}>
                        {triggerLabels[template.trigger]}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-500 mb-1">{template.timing}</p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">Subject: {template.subject}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedTemplate(template)}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Variables Reference */}
        <div className="mt-8 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Template Variables</h3>
            <button
              onClick={() => setShowVariables(!showVariables)}
              className="text-sm text-emerald-600 dark:text-emerald-400"
            >
              {showVariables ? "Hide" : "Show"} All
            </button>
          </div>
          {showVariables && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {variables.map((v) => (
                <div key={v.name} className="flex items-center justify-between p-2 bg-white dark:bg-zinc-900 rounded-lg">
                  <code className="text-xs text-emerald-600 dark:text-emerald-400">{v.name}</code>
                  <span className="text-xs text-zinc-500">{v.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold">Preview: {selectedTemplate.name}</h3>
              <button onClick={() => setSelectedTemplate(null)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <p className="text-xs text-zinc-500 mb-1">Subject</p>
                <p className="font-medium">{selectedTemplate.subject}</p>
              </div>
              <div className="mb-4">
                <p className="text-xs text-zinc-500 mb-1">Message</p>
                <pre className="whitespace-pre-wrap text-sm bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4 font-sans">
                  {selectedTemplate.body}
                </pre>
              </div>
              <div className="flex items-center justify-between text-sm text-zinc-500">
                <span>Trigger: {triggerLabels[selectedTemplate.trigger]}</span>
                <span>{selectedTemplate.timing}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h3 className="font-semibold">Edit Template</h3>
              <button onClick={() => setEditingTemplate(null)} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Template Name</label>
                <input
                  type="text"
                  value={editingTemplate.name}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Trigger</label>
                  <select
                    value={editingTemplate.trigger}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, trigger: e.target.value as MessageTemplate["trigger"] })}
                    className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                  >
                    {Object.entries(triggerLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-500 mb-1">Timing</label>
                  <input
                    type="text"
                    value={editingTemplate.timing}
                    onChange={(e) => setEditingTemplate({ ...editingTemplate, timing: e.target.value })}
                    className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={editingTemplate.subject}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, subject: e.target.value })}
                  className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-500 mb-1">Message Body</label>
                <textarea
                  value={editingTemplate.body}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                  className="w-full h-48 px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg resize-none font-mono text-sm"
                />
              </div>
            </div>
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
              <button
                onClick={() => setEditingTemplate(null)}
                className="flex-1 py-2.5 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setMessageTemplates(messageTemplates.some((t) => t.id === editingTemplate.id)
                    ? messageTemplates.map((t) => t.id === editingTemplate.id ? editingTemplate : t)
                    : [...messageTemplates, editingTemplate]
                  );
                  setEditingTemplate(null);
                }}
                className="flex-1 py-2.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 font-medium"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

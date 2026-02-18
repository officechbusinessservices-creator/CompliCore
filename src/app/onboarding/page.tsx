"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Wifi,
  Car,
  Waves,
  UtensilsCrossed,
  Dumbbell,
  Wind,
  Lock,
  Tv,
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Property type" },
  { id: 2, label: "Location" },
  { id: 3, label: "Details" },
  { id: 4, label: "Amenities" },
  { id: 5, label: "Pricing" },
  { id: 6, label: "Done" },
];

const propertyTypes = [
  { id: "apartment", label: "Apartment", icon: Building2 },
  { id: "house", label: "House", icon: Home },
  { id: "cabin", label: "Cabin", icon: Home },
  { id: "villa", label: "Villa", icon: Building2 },
  { id: "studio", label: "Studio", icon: Building2 },
  { id: "loft", label: "Loft", icon: Building2 },
];

const amenityOptions = [
  { id: "wifi", label: "Wifi", icon: Wifi },
  { id: "pool", label: "Pool", icon: Waves },
  { id: "kitchen", label: "Kitchen", icon: UtensilsCrossed },
  { id: "parking", label: "Parking", icon: Car },
  { id: "gym", label: "Gym", icon: Dumbbell },
  { id: "ac", label: "Air conditioning", icon: Wind },
  { id: "smartlock", label: "Smart lock", icon: Lock },
  { id: "tv", label: "TV", icon: Tv },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    propertyType: "",
    address: "",
    city: "",
    country: "United States",
    bedrooms: "1",
    bathrooms: "1",
    maxGuests: "2",
    amenities: [] as string[],
    basePrice: "100",
    currency: "USD",
  });

  function next() { setStep((s) => Math.min(s + 1, STEPS.length)); }
  function back() { setStep((s) => Math.max(s - 1, 1)); }

  function toggleAmenity(id: string) {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id],
    }));
  }

  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-base">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <Home className="w-4 h-4 text-primary-foreground" />
          </div>
          CompliCore
        </Link>
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          Skip for now
        </Link>
      </header>

      {/* Progress bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicators */}
      <div className="max-w-2xl mx-auto w-full px-6 pt-8 pb-4">
        <div className="flex items-center justify-between">
          {STEPS.map((s) => (
            <div key={s.id} className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  s.id < step
                    ? "bg-primary text-primary-foreground"
                    : s.id === step
                    ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s.id < step ? <CheckCircle2 className="w-4 h-4" /> : s.id}
              </div>
              <span className={`text-[10px] hidden sm:block ${s.id === step ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-2xl">

          {/* Step 1 — Property type */}
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">What type of property are you listing?</h1>
              <p className="text-muted-foreground mb-8">Choose the option that best describes your space.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {propertyTypes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setForm((p) => ({ ...p, propertyType: t.id }))}
                    className={`p-5 rounded-xl border-2 text-left transition-all ${
                      form.propertyType === t.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <t.icon className="w-6 h-6 mb-3 text-muted-foreground" />
                    <div className="font-medium text-sm">{t.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Location */}
          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Where is your property located?</h1>
              <p className="text-muted-foreground mb-8">Your exact address is only shared with confirmed guests.</p>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Street address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                      placeholder="123 Ocean Drive"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                      placeholder="Miami Beach"
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Country</label>
                    <select
                      value={form.country}
                      onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option>United States</option>
                      <option>United Kingdom</option>
                      <option>France</option>
                      <option>Spain</option>
                      <option>Australia</option>
                      <option>Canada</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 — Details */}
          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Tell us about your space</h1>
              <p className="text-muted-foreground mb-8">Help guests know what to expect.</p>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: "bedrooms", label: "Bedrooms", icon: "🛏" },
                  { key: "bathrooms", label: "Bathrooms", icon: "🚿" },
                  { key: "maxGuests", label: "Max guests", icon: "👥" },
                ].map((field) => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-sm font-medium">{field.label}</label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            [field.key]: String(Math.max(1, Number(p[field.key as keyof typeof p]) - 1)),
                          }))
                        }
                        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-lg hover:bg-accent transition-colors"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center font-semibold">
                        {form[field.key as keyof typeof form]}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            [field.key]: String(Number(p[field.key as keyof typeof p]) + 1),
                          }))
                        }
                        className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-lg hover:bg-accent transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Amenities */}
          {step === 4 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">What amenities do you offer?</h1>
              <p className="text-muted-foreground mb-8">Select all that apply. You can always add more later.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {amenityOptions.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => toggleAmenity(a.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      form.amenities.includes(a.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <a.icon className="w-5 h-5 mb-2 text-muted-foreground" />
                    <div className="text-xs font-medium">{a.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — Pricing */}
          {step === 5 && (
            <div>
              <h1 className="text-2xl font-bold mb-2">Set your base price</h1>
              <p className="text-muted-foreground mb-8">
                Our AI will optimize this automatically. You can always override it.
              </p>
              <div className="max-w-xs">
                <div className="space-y-1.5 mb-6">
                  <label className="text-sm font-medium">Nightly rate</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      min="10"
                      value={form.basePrice}
                      onChange={(e) => setForm((p) => ({ ...p, basePrice: e.target.value }))}
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Currency</label>
                  <select
                    value={form.currency}
                    onChange={(e) => setForm((p) => ({ ...p, currency: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="GBP">GBP — British Pound</option>
                    <option value="AUD">AUD — Australian Dollar</option>
                    <option value="CAD">CAD — Canadian Dollar</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                <div className="text-sm font-medium text-emerald-700 mb-1">💡 AI Pricing tip</div>
                <p className="text-xs text-muted-foreground">
                  Based on similar properties in your area, we recommend a base rate of{" "}
                  <strong className="text-foreground">${Math.round(Number(form.basePrice) * 1.12)}/night</strong>.
                  Enable AI Pricing to let us optimize automatically.
                </p>
              </div>
            </div>
          )}

          {/* Step 6 — Done */}
          {step === 6 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Your listing is ready! 🎉</h1>
              <p className="text-muted-foreground mb-2 max-w-md mx-auto">
                <strong className="text-foreground capitalize">{form.propertyType || "Your property"}</strong> in{" "}
                <strong className="text-foreground">{form.city || "your city"}</strong> has been created.
                Head to your dashboard to publish it and start accepting bookings.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Go to dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => { setStep(1); setForm({ propertyType: "", address: "", city: "", country: "United States", bedrooms: "1", bathrooms: "1", maxGuests: "2", amenities: [], basePrice: "100", currency: "USD" }); }}
                  className="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border border-border hover:bg-accent transition-colors font-medium"
                >
                  Add another property
                </button>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          {step < 6 && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
              <button
                onClick={back}
                disabled={step === 1}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={next}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                {step === 5 ? "Finish" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

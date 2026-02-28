"use client";

import { useState } from "react";
import Link from "next/link";

// Types
interface ListingData {
  propertyType: string;
  spaceType: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  details: {
    title: string;
    description: string;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    maxGuests: number;
  };
  amenities: string[];
  photos: { id: string; url: string; caption: string }[];
  pricing: {
    basePrice: number;
    weekendPrice: number;
    cleaningFee: number;
    currency: string;
  };
  rules: {
    checkIn: string;
    checkOut: string;
    minNights: number;
    maxNights: number;
    instantBook: boolean;
    petsAllowed: boolean;
    smokingAllowed: boolean;
    partiesAllowed: boolean;
  };
}

const propertyTypes = [
  { id: "house", label: "House", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "apartment", label: "Apartment", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { id: "condo", label: "Condo", icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" },
  { id: "cabin", label: "Cabin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { id: "villa", label: "Villa", icon: "M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M12 3v7" },
  { id: "cottage", label: "Cottage", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
];

const spaceTypes = [
  { id: "entire", label: "Entire place", description: "Guests have the whole place to themselves" },
  { id: "private", label: "Private room", description: "Guests have their own room but share some spaces" },
  { id: "shared", label: "Shared room", description: "Guests sleep in a shared space" },
];

const amenityCategories = [
  {
    name: "Essentials",
    items: ["WiFi", "Kitchen", "Washer", "Dryer", "Air conditioning", "Heating", "TV", "Iron"],
  },
  {
    name: "Features",
    items: ["Pool", "Hot tub", "Gym", "Free parking", "EV charger", "Beach access", "Ski-in/out"],
  },
  {
    name: "Safety",
    items: ["Smoke alarm", "Carbon monoxide alarm", "Fire extinguisher", "First aid kit", "Security cameras"],
  },
];

const samplePhotos = [
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=300&fit=crop",
  "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=400&h=300&fit=crop",
];

const steps = [
  { id: 1, title: "Property Type", description: "What kind of place?" },
  { id: 2, title: "Location", description: "Where is it located?" },
  { id: 3, title: "Details", description: "Describe your space" },
  { id: 4, title: "Amenities", description: "What do you offer?" },
  { id: 5, title: "Photos", description: "Show your space" },
  { id: 6, title: "Pricing", description: "Set your rates" },
  { id: 7, title: "Rules", description: "House rules" },
  { id: 8, title: "Review", description: "Final check" },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [listing, setListing] = useState<ListingData>({
    propertyType: "",
    spaceType: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "United States" },
    details: { title: "", description: "", bedrooms: 1, beds: 1, bathrooms: 1, maxGuests: 2 },
    amenities: [],
    photos: [],
    pricing: { basePrice: 100, weekendPrice: 120, cleaningFee: 50, currency: "USD" },
    rules: {
      checkIn: "15:00",
      checkOut: "11:00",
      minNights: 1,
      maxNights: 30,
      instantBook: true,
      petsAllowed: false,
      smokingAllowed: false,
      partiesAllowed: false,
    },
  });

  const updateListing = (updates: Partial<ListingData>) => {
    setListing((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const toggleAmenity = (amenity: string) => {
    setListing((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const addSamplePhotos = () => {
    const newPhotos = samplePhotos.map((url, i) => ({
      id: `photo-${i}`,
      url,
      caption: "",
    }));
    setListing((prev) => ({ ...prev, photos: newPhotos }));
  };

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">List Your Property</h1>
              <p className="text-xs text-zinc-500">Step {currentStep} of {steps.length}</p>
            </div>
          </div>
          <button className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300">
            Save & Exit
          </button>
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Step Indicators */}
        <div className="hidden md:flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-2 ${
                  currentStep === step.id
                    ? "text-emerald-600 dark:text-emerald-400"
                    : currentStep > step.id
                    ? "text-zinc-600 dark:text-zinc-400"
                    : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step.id
                      ? "bg-emerald-500 text-white"
                      : currentStep > step.id
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </span>
              </button>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${currentStep > step.id ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-800"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8">
          {/* Step 1: Property Type */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">What type of property do you have?</h2>
              <p className="text-zinc-500 mb-8">Select the option that best describes your place</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {propertyTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => updateListing({ propertyType: type.id })}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      listing.propertyType === type.id
                        ? "border-emerald-500 bg-emerald-500/5"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <svg className="w-8 h-8 mb-2 text-zinc-600 dark:text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={type.icon} />
                    </svg>
                    <p className="font-medium">{type.label}</p>
                  </button>
                ))}
              </div>

              <h3 className="text-lg font-semibold mb-4">What will guests have access to?</h3>
              <div className="space-y-3">
                {spaceTypes.map((space) => (
                  <button
                    key={space.id}
                    onClick={() => updateListing({ spaceType: space.id })}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      listing.spaceType === space.id
                        ? "border-emerald-500 bg-emerald-500/5"
                        : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <p className="font-medium">{space.label}</p>
                    <p className="text-sm text-zinc-500">{space.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Where is your property located?</h2>
              <p className="text-zinc-500 mb-8">Enter the address of your property</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <select
                    value={listing.address.country}
                    onChange={(e) => updateListing({ address: { ...listing.address, country: e.target.value } })}
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>Spain</option>
                    <option>Italy</option>
                    <option>Japan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input
                    type="text"
                    value={listing.address.street}
                    onChange={(e) => updateListing({ address: { ...listing.address, street: e.target.value } })}
                    placeholder="123 Main Street, Apt 4B"
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      type="text"
                      value={listing.address.city}
                      onChange={(e) => updateListing({ address: { ...listing.address, city: e.target.value } })}
                      placeholder="San Francisco"
                      className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State/Province</label>
                    <input
                      type="text"
                      value={listing.address.state}
                      onChange={(e) => updateListing({ address: { ...listing.address, state: e.target.value } })}
                      placeholder="California"
                      className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>
                <div className="w-1/3">
                  <label className="block text-sm font-medium mb-1">ZIP/Postal Code</label>
                  <input
                    type="text"
                    value={listing.address.zipCode}
                    onChange={(e) => updateListing({ address: { ...listing.address, zipCode: e.target.value } })}
                    placeholder="94102"
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Your exact address will only be shared with guests after they book.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Details */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Tell us about your place</h2>
              <p className="text-zinc-500 mb-8">Add details that help guests know what to expect</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-1">Listing Title</label>
                  <input
                    type="text"
                    value={listing.details.title}
                    onChange={(e) => updateListing({ details: { ...listing.details, title: e.target.value } })}
                    placeholder="Cozy Downtown Loft with City Views"
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={listing.details.description}
                    onChange={(e) => updateListing({ details: { ...listing.details, description: e.target.value } })}
                    placeholder="Describe what makes your place special..."
                    rows={4}
                    className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Bedrooms", key: "bedrooms" as const },
                    { label: "Beds", key: "beds" as const },
                    { label: "Bathrooms", key: "bathrooms" as const },
                    { label: "Max Guests", key: "maxGuests" as const },
                  ].map((item) => (
                    <div key={item.key}>
                      <label className="block text-sm font-medium mb-1">{item.label}</label>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateListing({
                            details: { ...listing.details, [item.key]: Math.max(1, listing.details[item.key] - 1) }
                          })}
                          className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          -
                        </button>
                        <span className="text-xl font-semibold w-8 text-center">{listing.details[item.key]}</span>
                        <button
                          onClick={() => updateListing({
                            details: { ...listing.details, [item.key]: listing.details[item.key] + 1 }
                          })}
                          className="w-10 h-10 rounded-full border border-zinc-300 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Amenities */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">What amenities do you offer?</h2>
              <p className="text-zinc-500 mb-8">Select all that apply to your property</p>

              <div className="space-y-8">
                {amenityCategories.map((category) => (
                  <div key={category.name}>
                    <h3 className="font-semibold mb-3">{category.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {category.items.map((amenity) => (
                        <button
                          key={amenity}
                          onClick={() => toggleAmenity(amenity)}
                          className={`p-3 rounded-lg border text-left text-sm transition-all ${
                            listing.amenities.includes(amenity)
                              ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                          }`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm text-zinc-500">
                Selected: {listing.amenities.length} amenities
              </p>
            </div>
          )}

          {/* Step 5: Photos */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Add photos of your place</h2>
              <p className="text-zinc-500 mb-8">Great photos help guests picture themselves there</p>

              {listing.photos.length === 0 ? (
                <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-12 text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">Drag and drop photos here</p>
                  <p className="text-sm text-zinc-500 mb-4">or click to browse</p>
                  <button
                    onClick={addSamplePhotos}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Add Sample Photos (Demo)
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {listing.photos.map((photo, index) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        {index === 0 && (
                          <span className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                            Cover Photo
                          </span>
                        )}
                        <button className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button className="h-32 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg flex items-center justify-center hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors">
                      <svg className="w-8 h-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-sm text-zinc-500">Tip: Add at least 5 photos for the best results</p>
                </div>
              )}
            </div>
          )}

          {/* Step 6: Pricing */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Set your pricing</h2>
              <p className="text-zinc-500 mb-8">You can change this anytime</p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nightly Rate</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                      <input
                        type="number"
                        value={listing.pricing.basePrice}
                        onChange={(e) => updateListing({ pricing: { ...listing.pricing, basePrice: Number(e.target.value) } })}
                        className="w-full pl-8 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Weekend Rate</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                      <input
                        type="number"
                        value={listing.pricing.weekendPrice}
                        onChange={(e) => updateListing({ pricing: { ...listing.pricing, weekendPrice: Number(e.target.value) } })}
                        className="w-full pl-8 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="w-1/2">
                  <label className="block text-sm font-medium mb-1">Cleaning Fee</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input
                      type="number"
                      value={listing.pricing.cleaningFee}
                      onChange={(e) => updateListing({ pricing: { ...listing.pricing, cleaningFee: Number(e.target.value) } })}
                      className="w-full pl-8 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <h4 className="font-medium mb-2">Estimated Earnings</h4>
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    ${Math.round((listing.pricing.basePrice * 5 + listing.pricing.weekendPrice * 2 + listing.pricing.cleaningFee) * 0.97)} <span className="text-sm font-normal text-zinc-500">/ week</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">After 3% platform fee</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 7: Rules */}
          {currentStep === 7 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Set your house rules</h2>
              <p className="text-zinc-500 mb-8">Help guests know what to expect</p>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Check-in Time</label>
                    <input
                      type="time"
                      value={listing.rules.checkIn}
                      onChange={(e) => updateListing({ rules: { ...listing.rules, checkIn: e.target.value } })}
                      className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Check-out Time</label>
                    <input
                      type="time"
                      value={listing.rules.checkOut}
                      onChange={(e) => updateListing({ rules: { ...listing.rules, checkOut: e.target.value } })}
                      className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Minimum Nights</label>
                    <input
                      type="number"
                      value={listing.rules.minNights}
                      onChange={(e) => updateListing({ rules: { ...listing.rules, minNights: Number(e.target.value) } })}
                      className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Maximum Nights</label>
                    <input
                      type="number"
                      value={listing.rules.maxNights}
                      onChange={(e) => updateListing({ rules: { ...listing.rules, maxNights: Number(e.target.value) } })}
                      className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { key: "instantBook" as const, label: "Instant Book", desc: "Guests can book without waiting for your approval" },
                    { key: "petsAllowed" as const, label: "Pets Allowed", desc: "Guests can bring pets" },
                    { key: "smokingAllowed" as const, label: "Smoking Allowed", desc: "Guests can smoke on the property" },
                    { key: "partiesAllowed" as const, label: "Parties/Events Allowed", desc: "Guests can host parties or events" },
                  ].map((rule) => (
                    <div key={rule.key} className="flex items-center justify-between p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                      <div>
                        <p className="font-medium">{rule.label}</p>
                        <p className="text-sm text-zinc-500">{rule.desc}</p>
                      </div>
                      <button
                        onClick={() => updateListing({ rules: { ...listing.rules, [rule.key]: !listing.rules[rule.key] } })}
                        className={`w-12 h-6 rounded-full p-1 transition-colors ${
                          listing.rules[rule.key] ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-600"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${
                            listing.rules[rule.key] ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Review */}
          {currentStep === 8 && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Review your listing</h2>
              <p className="text-zinc-500 mb-8">Make sure everything looks good before publishing</p>

              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                  <div className="flex items-start gap-4">
                    {listing.photos[0] && (
                      <img src={listing.photos[0].url} alt="Cover" className="w-24 h-24 object-cover rounded-lg" />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{listing.details.title || "Untitled Listing"}</h3>
                      <p className="text-sm text-zinc-500">
                        {listing.address.city}, {listing.address.state}
                      </p>
                      <p className="text-sm text-zinc-500 mt-1">
                        {propertyTypes.find((t) => t.id === listing.propertyType)?.label} - {spaceTypes.find((s) => s.id === listing.spaceType)?.label}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <h4 className="font-medium mb-2">Space</h4>
                    <p className="text-sm text-zinc-500">
                      {listing.details.bedrooms} bedroom - {listing.details.beds} bed - {listing.details.bathrooms} bath - Up to {listing.details.maxGuests} guests
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <h4 className="font-medium mb-2">Pricing</h4>
                    <p className="text-sm text-zinc-500">
                      ${listing.pricing.basePrice}/night - ${listing.pricing.weekendPrice}/weekend - ${listing.pricing.cleaningFee} cleaning
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <h4 className="font-medium mb-2">Amenities ({listing.amenities.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {listing.amenities.map((a) => (
                      <span key={a} className="text-xs px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded">{a}</span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-emerald-600 dark:text-emerald-400">Ready to publish!</p>
                      <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">Your listing is complete and ready to go live.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          {currentStep === steps.length ? (
            <Link
              href="/dashboard"
              className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Publish Listing
            </Link>
          ) : (
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

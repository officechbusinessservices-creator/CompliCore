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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Sparkles,
  Wand2,
  RefreshCw,
  Copy,
  Check,
  FileText,
  Home,
  MapPin,
  Users,
  Bed,
  Bath,
  Star,
  Heart,
  Zap,
  Globe,
  Palette,
  Target,
  TrendingUp,
  Edit3,
  Save,
  Download,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Languages,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

// Tone options for description generation
const toneOptions = [
  { id: "professional", label: "Professional", description: "Formal and business-like" },
  { id: "friendly", label: "Friendly", description: "Warm and welcoming" },
  { id: "luxury", label: "Luxury", description: "Elegant and upscale" },
  { id: "adventurous", label: "Adventurous", description: "Exciting and action-oriented" },
  { id: "cozy", label: "Cozy", description: "Comfortable and homey" },
  { id: "minimalist", label: "Minimalist", description: "Clean and simple" },
];

// Sample property for demo
const sampleProperty = {
  name: "Seaside Retreat Villa",
  type: "Villa",
  location: "Malibu, California",
  bedrooms: 4,
  bathrooms: 3,
  guests: 8,
  amenities: ["Ocean View", "Private Pool", "Hot Tub", "BBQ Grill", "Fire Pit", "Smart Home", "High-Speed WiFi", "Fully Equipped Kitchen", "Beach Access", "Parking"],
  highlights: ["Stunning sunset views", "Direct beach access", "Recently renovated", "Perfect for families"],
  nearbyAttractions: ["Malibu Pier (5 min)", "Zuma Beach (10 min)", "Nobu Malibu (15 min)", "Getty Villa (20 min)"],
};

// Generated descriptions based on tone
const generatedDescriptions: Record<string, { title: string; summary: string; full: string; seo: string[] }> = {
  professional: {
    title: "Luxurious Oceanfront Villa in Malibu - 4BR/3BA with Private Pool",
    summary: "Experience unparalleled coastal living in this meticulously designed 4-bedroom oceanfront villa. Featuring a private pool, direct beach access, and panoramic Pacific views, this property offers the perfect blend of luxury and convenience for discerning guests.",
    full: `Welcome to this exceptional oceanfront villa nestled along the pristine Malibu coastline. This recently renovated 4-bedroom, 3-bathroom residence offers 8 guests an unparalleled vacation experience with stunning Pacific Ocean views and direct beach access.

The property features a thoughtfully designed interior with high-end finishes throughout. The fully equipped gourmet kitchen provides everything needed for preparing memorable meals, while the open-concept living area seamlessly connects to an expansive outdoor terrace.

Outdoor amenities include a private heated pool, hot tub, BBQ grill, and fire pit - perfect for evening gatherings under the stars. The smart home technology ensures comfort and convenience at your fingertips, complemented by high-speed WiFi throughout the property.

Located just minutes from Malibu's finest dining establishments, shopping, and attractions, this villa offers both seclusion and accessibility. Whether you're seeking a family retreat or an upscale getaway with friends, this property delivers an exceptional experience.`,
    seo: ["Malibu oceanfront villa", "luxury beach house rental", "private pool Malibu", "beachfront vacation home California"],
  },
  friendly: {
    title: "Your Dream Beach Getaway Awaits! Gorgeous Malibu Villa with Pool",
    summary: "Hey there, beach lovers! Get ready for the vacation of a lifetime in our beautiful Malibu villa. With a private pool, amazing ocean views, and steps-to-the-sand convenience, you'll never want to leave. Perfect for families and friend groups looking to make incredible memories!",
    full: `Welcome to your home away from home in beautiful Malibu! We're so excited to share this special place with you.

Picture this: waking up to the sound of waves, stepping out onto your private terrace with a cup of coffee, and watching dolphins play in the surf. That's just a typical morning here at our beloved beach villa!

We've thought of everything to make your stay amazing. The kids (and kids at heart!) will love splashing in the private pool, while the grown-ups can relax in the hot tub with a glass of wine. When hunger strikes, fire up the BBQ and cook up a feast in the outdoor kitchen - or head inside to our fully stocked gourmet kitchen.

The house sleeps 8 comfortably in 4 gorgeous bedrooms, each with its own special touches. High-speed WiFi keeps everyone connected (though you might find yourself wanting to disconnect and just enjoy the views!).

We're just a short drive from amazing restaurants, fun attractions, and the famous Malibu Pier. But honestly? You might never want to leave your own private paradise!

Can't wait to host you! `,
    seo: ["family beach vacation Malibu", "fun Malibu rental with pool", "best beach house California", "Malibu vacation home"],
  },
  luxury: {
    title: "Exquisite Oceanfront Estate | Private Pool & Beach Access | Malibu",
    summary: "Indulge in the epitome of coastal sophistication at this magnificent Malibu estate. Commanding breathtaking Pacific panoramas, this architectural masterpiece features a private infinity pool, curated interiors, and exclusive beach access for the most discerning travelers.",
    full: `Presenting an extraordinary opportunity to experience Malibu living at its finest. This architectural gem, perched majestically along the California coastline, offers an unrivaled retreat for those who appreciate the finer things in life.

Upon arrival, you'll be greeted by sweeping ocean vistas that stretch to the horizon. The residence has been meticulously curated with designer furnishings, museum-quality art, and bespoke finishes that create an atmosphere of refined elegance.

The chef's kitchen rivals those of Michelin-starred restaurants, equipped with top-tier appliances and premium cookware. Floor-to-ceiling windows throughout bathe the interiors in natural light while framing the ever-changing seascape.

Step outside to your private sanctuary featuring a heated infinity pool that appears to merge with the Pacific, a therapeutic hot tub, and multiple lounging areas designed for ultimate relaxation. The custom fire pit provides the perfect setting for intimate evenings under the stars.

This exclusive enclave offers the rare combination of privacy and proximity to Malibu's renowned dining and cultural destinations. A truly exceptional property for exceptional guests.`,
    seo: ["luxury Malibu estate rental", "exclusive beachfront property", "5-star vacation home Malibu", "ultra-luxury California coast"],
  },
  adventurous: {
    title: "Epic Malibu Beach House - Surf, Sun & Unforgettable Adventures!",
    summary: "Ready for an adventure? This incredible Malibu beach villa is your basecamp for California's best experiences! Catch waves right out front, explore hidden coves, hike coastal trails, then come back to your private pool and hot tub. Let's make some memories!",
    full: `Adventure seekers, you've found your perfect Malibu headquarters!

This isn't just a vacation rental - it's your launchpad for epic California adventures. With direct beach access right from your backyard, you can catch morning waves before anyone else hits the water. The surf here is legendary, and you'll have front-row seats to some of the best breaks on the coast.

But the adventure doesn't stop at the sand! This area is packed with incredible experiences:
- World-class hiking trails through the Santa Monica Mountains
- Kayaking and paddleboarding in crystal-clear coves
- Mountain biking through rugged terrain
- Horseback riding along the beach at sunset
- Rock climbing at nearby formations

After a day of exploration, recharge in your private pool or soak those tired muscles in the hot tub. Fire up the BBQ and swap stories around the fire pit under a blanket of stars.

The villa sleeps 8 adventure buddies comfortably, with all the gear storage you need. High-speed WiFi lets you share your adventures in real-time (or plan tomorrow's expedition).

Your next great adventure starts here. Are you ready?`,
    seo: ["Malibu adventure vacation", "surf house California", "active vacation rental", "beach adventure Malibu"],
  },
  cozy: {
    title: "Charming Beachfront Haven - Your Cozy Malibu Escape Awaits",
    summary: "Snuggle up in this warm and inviting Malibu beach house, where every corner is designed for comfort. From the plush sofas with ocean views to the crackling fire pit, this is the perfect place to slow down, reconnect, and create cherished memories with loved ones.",
    full: `Welcome to your cozy corner of paradise in beautiful Malibu.

There's something magical about this place - the way the morning light filters through the windows, the gentle sound of waves as your soundtrack, the feeling of sand between your toes just steps from your door. It's the kind of place that makes you exhale deeply and just... relax.

We've created a home that wraps around you like a warm blanket. Sink into the plush sofas in the living room and watch the sunset paint the sky in brilliant colors. Curl up with a good book in the reading nook while the ocean breeze drifts through. Gather around the farmhouse dining table for home-cooked meals that taste even better with an ocean view.

The bedrooms are sanctuaries of comfort - quality linens, blackout curtains for sleeping in, and views that make mornings actually enjoyable. The bathrooms feature deep soaking tubs perfect for unwinding after a beach day.

Outside, the heated pool invites lazy afternoon floats, while the hot tub under the stars is pure bliss. Toast marshmallows at the fire pit, play board games on the patio, or simply sit in comfortable silence watching the waves roll in.

This is the vacation you've been dreaming of. Come stay, slow down, and rediscover what matters most.`,
    seo: ["cozy Malibu beach house", "relaxing vacation rental California", "family beach retreat", "peaceful Malibu getaway"],
  },
  minimalist: {
    title: "Modern Malibu Villa | Clean Design | Ocean Views | Private Pool",
    summary: "Less is more at this thoughtfully designed Malibu retreat. Clean lines, curated spaces, and unobstructed ocean views create the perfect backdrop for mindful living. Four bedrooms, private pool, beach access. Everything you need, nothing you don't.",
    full: `A study in purposeful design, this Malibu villa embraces the philosophy that space and simplicity are the ultimate luxuries.

The Architecture:
Clean lines and open spaces define the interior. Floor-to-ceiling windows eliminate the boundary between inside and out, framing the Pacific as living art. Natural materials - stone, wood, glass - create warmth without clutter.

The Essentials:
- 4 bedrooms, thoughtfully appointed
- 3 bathrooms, spa-inspired
- Gourmet kitchen, professional-grade
- Living spaces that breathe

The Outdoors:
Private pool, geometric and pristine. Hot tub with ocean views. Fire pit for evening gatherings. Direct beach access.

The Location:
Malibu's finest dining: 5-15 minutes
Cultural attractions: 20 minutes
LAX: 45 minutes

The Technology:
Smart home integration throughout. High-speed connectivity. Climate control at your fingertips.

The Experience:
Wake with the sun. Practice yoga on the terrace. Swim. Read. Think. Create. Rest.

Capacity: 8 guests
Style: Contemporary minimalist
Feeling: Calm, focused, free`,
    seo: ["modern Malibu rental", "minimalist beach house", "contemporary California vacation", "design vacation home"],
  },
};

export default function ListingGeneratorPage() {
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<typeof generatedDescriptions.friendly | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [propertyDetails, setPropertyDetails] = useState(sampleProperty);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [includeEmojis, setIncludeEmojis] = useState(false);
  const [seoOptimized, setSeoOptimized] = useState(true);
  const [editMode, setEditMode] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(generatedDescriptions[selectedTone]);
      setIsGenerating(false);
    }, 2000);
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRegenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedContent(generatedDescriptions[selectedTone]);
      setIsGenerating(false);
    }, 1500);
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
                  <Wand2 className="h-5 w-5 text-violet-400" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold">AI Listing Generator</h1>
                  <p className="text-xs text-zinc-400">Create compelling property descriptions</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">
                <Sparkles className="h-3 w-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Property Input */}
          <div className="space-y-6">
            {/* Property Details */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Home className="h-5 w-5 text-emerald-400" />
                  Property Details
                </CardTitle>
                <CardDescription>Enter your property information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-zinc-400">Property Name</Label>
                    <Input
                      value={propertyDetails.name}
                      onChange={(e) => setPropertyDetails({ ...propertyDetails, name: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-zinc-400">Property Type</Label>
                    <Select value={propertyDetails.type} onValueChange={(v) => setPropertyDetails({ ...propertyDetails, type: v })}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-700">
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Condo">Condo</SelectItem>
                        <SelectItem value="Cabin">Cabin</SelectItem>
                        <SelectItem value="Cottage">Cottage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-zinc-400">Location</Label>
                  <div className="relative mt-1">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                      value={propertyDetails.location}
                      onChange={(e) => setPropertyDetails({ ...propertyDetails, location: e.target.value })}
                      className="bg-zinc-800 border-zinc-700 pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-zinc-400 flex items-center gap-1">
                      <Bed className="h-3 w-3" /> Bedrooms
                    </Label>
                    <Input
                      type="number"
                      value={propertyDetails.bedrooms}
                      onChange={(e) => setPropertyDetails({ ...propertyDetails, bedrooms: parseInt(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-zinc-400 flex items-center gap-1">
                      <Bath className="h-3 w-3" /> Bathrooms
                    </Label>
                    <Input
                      type="number"
                      value={propertyDetails.bathrooms}
                      onChange={(e) => setPropertyDetails({ ...propertyDetails, bathrooms: parseInt(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-zinc-400 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Guests
                    </Label>
                    <Input
                      type="number"
                      value={propertyDetails.guests}
                      onChange={(e) => setPropertyDetails({ ...propertyDetails, guests: parseInt(e.target.value) })}
                      className="bg-zinc-800 border-zinc-700 mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-zinc-400">Amenities</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {propertyDetails.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="bg-zinc-800 border-zinc-700">
                        {amenity}
                      </Badge>
                    ))}
                    <Button variant="outline" size="sm" className="h-6 text-xs">
                      + Add
                    </Button>
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-zinc-400">Property Highlights</Label>
                  <Textarea
                    value={propertyDetails.highlights.join("\n")}
                    onChange={(e) => setPropertyDetails({ ...propertyDetails, highlights: e.target.value.split("\n") })}
                    placeholder="One highlight per line..."
                    className="bg-zinc-800 border-zinc-700 mt-1 min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tone Selection */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Palette className="h-5 w-5 text-pink-400" />
                  Writing Tone
                </CardTitle>
                <CardDescription>Choose the voice for your listing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {toneOptions.map((tone) => (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => setSelectedTone(tone.id)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedTone === tone.id
                          ? "bg-violet-500/20 border-violet-500/50"
                          : "bg-zinc-800/50 border-zinc-700 hover:border-zinc-600"
                      }`}
                    >
                      <p className="font-medium text-white text-sm">{tone.label}</p>
                      <p className="text-xs text-zinc-400">{tone.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-400" />
                  Generation Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Language</p>
                      <p className="text-xs text-zinc-400">Output language</p>
                    </div>
                  </div>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-32 bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-700">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="it">Italian</SelectItem>
                      <SelectItem value="pt">Portuguese</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium text-white">SEO Optimized</p>
                      <p className="text-xs text-zinc-400">Include keywords for search</p>
                    </div>
                  </div>
                  <Switch checked={seoOptimized} onCheckedChange={setSeoOptimized} />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-700 hover:to-pink-700"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Listing
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generated Content */}
          <div className="space-y-6">
            {!generatedContent ? (
              <Card className="bg-zinc-900/50 border-zinc-800 h-full min-h-[600px] flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                    <Wand2 className="h-8 w-8 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Ready to Create Magic</h3>
                  <p className="text-sm text-zinc-400 max-w-sm">
                    Fill in your property details, choose a tone, and click generate to create your perfect listing description.
                  </p>
                </div>
              </Card>
            ) : (
              <>
                {/* Generated Title */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-emerald-400" />
                        Listing Title
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(generatedContent.title, "title")}
                        >
                          {copied === "title" ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium text-white">{generatedContent.title}</p>
                  </CardContent>
                </Card>

                {/* Generated Summary */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-amber-400" />
                        Summary (for previews)
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(generatedContent.summary, "summary")}
                      >
                        {copied === "summary" ? (
                          <Check className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-300 leading-relaxed">{generatedContent.summary}</p>
                  </CardContent>
                </Card>

                {/* Full Description */}
                <Card className="bg-zinc-900/50 border-zinc-800">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4 text-violet-400" />
                        Full Description
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditMode(!editMode)}>
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(generatedContent.full, "full")}
                        >
                          {copied === "full" ? (
                            <Check className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {editMode ? (
                      <Textarea
                        defaultValue={generatedContent.full}
                        className="bg-zinc-800 border-zinc-700 min-h-[300px] text-sm"
                      />
                    ) : (
                      <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line max-h-[400px] overflow-y-auto">
                        {generatedContent.full}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* SEO Keywords */}
                {seoOptimized && (
                  <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        SEO Keywords
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {generatedContent.seo.map((keyword, index) => (
                          <Badge key={index} className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <Button onClick={handleRegenerate} variant="outline" disabled={isGenerating}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? "animate-spin" : ""}`} />
                    Regenerate
                  </Button>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 ml-auto">
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Apply to Listing
                  </Button>
                </div>

                {/* Feedback */}
                <Card className="bg-zinc-800/30 border-zinc-800">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-zinc-400">Was this helpful?</p>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Yes
                        </Button>
                        <Button variant="ghost" size="sm">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          No
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

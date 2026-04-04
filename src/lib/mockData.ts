// Mock data for the booking engine prototype

export interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  location: {
    city: string;
    state: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  bedrooms: number;
  beds: number;
  bathrooms: number;
  maxGuests: number;
  amenities: string[];
  photos: string[];
  pricing: {
    basePrice: number;
    cleaningFee: number;
    serviceFee: number;
    currency: string;
  };
  rating: number;
  reviewCount: number;
  host: {
    id: string;
    name: string;
    avatar: string;
    superhost: boolean;
    responseRate: number;
  };
  instantBook: boolean;
  houseRules: {
    checkInTime: string;
    checkOutTime: string;
    smokingAllowed: boolean;
    petsAllowed: boolean;
  };
}

export interface Booking {
  id: string;
  confirmationCode: string;
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  pricing: {
    nights: number;
    nightlyRate: number;
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    total: number;
  };
  createdAt: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: "guest" | "host" | "admin";
}

// Sample properties
export const properties: Property[] = [
  {
    id: "prop-1",
    title: "Modern Downtown Loft with Skyline Views",
    description:
      "Wake up to breathtaking city views in this stylish modern loft. Floor-to-ceiling windows flood the space with natural light, while the open floor plan provides the perfect blend of comfort and sophistication.",
    type: "apartment",
    location: {
      city: "San Francisco",
      state: "CA",
      country: "US",
      coordinates: { lat: 37.7749, lng: -122.4194 },
    },
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: [
      "wifi",
      "kitchen",
      "workspace",
      "parking",
      "gym",
      "elevator",
      "air_conditioning",
      "heating",
      "washer",
      "dryer",
    ],
    photos: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    pricing: {
      basePrice: 189,
      cleaningFee: 75,
      serviceFee: 45,
      currency: "USD",
    },
    rating: 4.92,
    reviewCount: 128,
    host: {
      id: "host-1",
      name: "Sarah",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
      superhost: true,
      responseRate: 98,
    },
    instantBook: true,
    houseRules: {
      checkInTime: "15:00",
      checkOutTime: "11:00",
      smokingAllowed: false,
      petsAllowed: false,
    },
  },
  {
    id: "prop-2",
    title: "Cozy Beachfront Cottage with Ocean Access",
    description:
      "Escape to this charming beachfront cottage just steps from the sand. Perfect for a romantic getaway or small family vacation with stunning ocean views and private beach access.",
    type: "cottage",
    location: {
      city: "Santa Cruz",
      state: "CA",
      country: "US",
      coordinates: { lat: 36.9741, lng: -122.0308 },
    },
    bedrooms: 2,
    beds: 3,
    bathrooms: 1.5,
    maxGuests: 4,
    amenities: [
      "wifi",
      "kitchen",
      "beachfront",
      "patio",
      "bbq",
      "outdoor_shower",
      "beach_essentials",
      "bikes",
    ],
    photos: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    ],
    pricing: {
      basePrice: 275,
      cleaningFee: 100,
      serviceFee: 65,
      currency: "USD",
    },
    rating: 4.88,
    reviewCount: 89,
    host: {
      id: "host-2",
      name: "Michael",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
      superhost: true,
      responseRate: 100,
    },
    instantBook: false,
    houseRules: {
      checkInTime: "16:00",
      checkOutTime: "10:00",
      smokingAllowed: false,
      petsAllowed: true,
    },
  },
  {
    id: "prop-3",
    title: "Luxury Mountain Cabin with Hot Tub",
    description:
      "Unwind in this stunning mountain retreat featuring a private hot tub, wood-burning fireplace, and panoramic forest views. Perfect for adventure seekers and nature lovers alike.",
    type: "cabin",
    location: {
      city: "Lake Tahoe",
      state: "CA",
      country: "US",
      coordinates: { lat: 39.0968, lng: -120.0324 },
    },
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    maxGuests: 8,
    amenities: [
      "wifi",
      "kitchen",
      "hot_tub",
      "fireplace",
      "ski_in_out",
      "mountain_view",
      "heating",
      "parking",
      "ev_charger",
    ],
    photos: [
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
      "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800",
      "https://images.unsplash.com/photo-1520984032042-162d526883e0?w=800",
    ],
    pricing: {
      basePrice: 425,
      cleaningFee: 150,
      serviceFee: 95,
      currency: "USD",
    },
    rating: 4.96,
    reviewCount: 156,
    host: {
      id: "host-3",
      name: "Jennifer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
      superhost: true,
      responseRate: 99,
    },
    instantBook: true,
    houseRules: {
      checkInTime: "15:00",
      checkOutTime: "11:00",
      smokingAllowed: false,
      petsAllowed: true,
    },
  },
  {
    id: "prop-4",
    title: "Chic Artist Studio in Historic District",
    description:
      "Stay in this unique artist studio filled with original artwork and creative touches. Located in the heart of the historic district, steps from galleries, restaurants, and boutiques.",
    type: "studio",
    location: {
      city: "Austin",
      state: "TX",
      country: "US",
      coordinates: { lat: 30.2672, lng: -97.7431 },
    },
    bedrooms: 0,
    beds: 1,
    bathrooms: 1,
    maxGuests: 2,
    amenities: [
      "wifi",
      "kitchenette",
      "workspace",
      "air_conditioning",
      "smart_tv",
      "coffee_maker",
    ],
    photos: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      "https://images.unsplash.com/photo-1489171078254-c3365d6e359f?w=800",
    ],
    pricing: {
      basePrice: 95,
      cleaningFee: 45,
      serviceFee: 25,
      currency: "USD",
    },
    rating: 4.85,
    reviewCount: 67,
    host: {
      id: "host-4",
      name: "David",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
      superhost: false,
      responseRate: 92,
    },
    instantBook: true,
    houseRules: {
      checkInTime: "14:00",
      checkOutTime: "11:00",
      smokingAllowed: false,
      petsAllowed: false,
    },
  },
  {
    id: "prop-5",
    title: "Spacious Family Home with Pool",
    description:
      "Perfect for families! This spacious home features a private pool, game room, and large backyard. Close to theme parks and attractions with plenty of room for everyone.",
    type: "house",
    location: {
      city: "Orlando",
      state: "FL",
      country: "US",
      coordinates: { lat: 28.5383, lng: -81.3792 },
    },
    bedrooms: 5,
    beds: 7,
    bathrooms: 3,
    maxGuests: 12,
    amenities: [
      "wifi",
      "kitchen",
      "pool",
      "game_room",
      "bbq",
      "garage",
      "air_conditioning",
      "washer",
      "dryer",
      "high_chair",
      "crib",
    ],
    photos: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    pricing: {
      basePrice: 350,
      cleaningFee: 175,
      serviceFee: 85,
      currency: "USD",
    },
    rating: 4.91,
    reviewCount: 203,
    host: {
      id: "host-5",
      name: "Lisa",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100",
      superhost: true,
      responseRate: 100,
    },
    instantBook: true,
    houseRules: {
      checkInTime: "16:00",
      checkOutTime: "10:00",
      smokingAllowed: false,
      petsAllowed: false,
    },
  },
];

// Sample bookings
export const bookings: Booking[] = [
  {
    id: "book-1",
    confirmationCode: "HX4K9M2",
    property: properties[0],
    checkIn: "2026-03-15",
    checkOut: "2026-03-18",
    guests: 2,
    status: "confirmed",
    pricing: {
      nights: 3,
      nightlyRate: 189,
      subtotal: 567,
      cleaningFee: 75,
      serviceFee: 45,
      taxes: 62,
      total: 749,
    },
    createdAt: "2026-02-01T10:30:00Z",
  },
  {
    id: "book-2",
    confirmationCode: "JK7L3P9",
    property: properties[2],
    checkIn: "2026-04-10",
    checkOut: "2026-04-14",
    guests: 6,
    status: "pending",
    pricing: {
      nights: 4,
      nightlyRate: 425,
      subtotal: 1700,
      cleaningFee: 150,
      serviceFee: 95,
      taxes: 175,
      total: 2120,
    },
    createdAt: "2026-02-03T14:15:00Z",
  },
];

// Sample user
export const currentUser: User = {
  id: "user-1",
  firstName: "Alex",
  lastName: "Johnson",
  email: "alex@example.com",
  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
  role: "guest",
};

// Amenity icons and labels
export const amenityLabels: Record<string, { label: string; icon: string }> = {
  wifi: { label: "Wifi", icon: "M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" },
  kitchen: { label: "Kitchen", icon: "M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.37c-2.032 0-4.034.125-6 .37m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265zm-3 0a.375.375 0 11-.53 0L9 2.845l.265.265zm6 0a.375.375 0 11-.53 0L15 2.845l.265.265z" },
  workspace: { label: "Workspace", icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" },
  parking: { label: "Free Parking", icon: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" },
  pool: { label: "Pool", icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" },
  hot_tub: { label: "Hot Tub", icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" },
  air_conditioning: { label: "Air Conditioning", icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" },
  heating: { label: "Heating", icon: "M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" },
  washer: { label: "Washer", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
  dryer: { label: "Dryer", icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" },
  gym: { label: "Gym", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
};

// Helper functions
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

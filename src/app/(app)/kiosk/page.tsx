"use client";

import { useState, useEffect } from "react";

type KioskStep = "welcome" | "lookup" | "verify" | "rules" | "access" | "complete";

interface BookingInfo {
  confirmationCode: string;
  guestName: string;
  property: string;
  checkIn: string;
  checkOut: string;
  accessCode: string;
  wifiName: string;
  wifiPassword: string;
}

const mockBooking: BookingInfo = {
  confirmationCode: "HX4K9M2",
  guestName: "Alex Johnson",
  property: "Modern Downtown Loft",
  checkIn: "3:00 PM",
  checkOut: "11:00 AM",
  accessCode: "4829",
  wifiName: "LoftGuest",
  wifiPassword: "Welcome2024",
};

const houseRules = [
  "No smoking inside the property",
  "No parties or events",
  "Quiet hours from 10 PM to 8 AM",
  "Maximum 4 guests allowed",
  "No pets unless pre-approved",
  "Remove shoes in the apartment",
  "Take out trash before checkout",
];

const DEV_KIOSK_USER = {
  email: "kiosk.demo@example.com",
  password: "KioskPass123!",
  firstName: "Kiosk",
  lastName: "Demo",
};

export default function KioskPage() {
  const [step, setStep] = useState<KioskStep>("welcome");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [lastName, setLastName] = useState("");
  const [booking, setBooking] = useState<BookingInfo | null>(null);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGuestName, setNewGuestName] = useState("");
  const [newProperty, setNewProperty] = useState("");
  const [newCheckIn, setNewCheckIn] = useState("");
  const [newCheckOut, setNewCheckOut] = useState("");
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lookupError, setLookupError] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLookup = () => {
    const code = confirmationCode.toUpperCase();
    setLookupError(false);
    (async () => {
      try {
        const base = process.env.NEXT_PUBLIC_API_BASE || "";
        const res = await fetch(`${base}/v1/bookings?confirmationCode=${encodeURIComponent(code)}`);
        if (!res.ok) {
          setLookupError(true);
          return;
        }
        const data = await res.json();
        const b: BookingInfo = {
          confirmationCode: data.confirmation_code || data.confirmationCode || code,
          guestName: data.guest_name || data.guestName || mockBooking.guestName,
          property: data.property || mockBooking.property,
          checkIn: data.check_in || data.checkIn || mockBooking.checkIn,
          checkOut: data.check_out || data.checkOut || mockBooking.checkOut,
          accessCode: data.access_code || data.accessCode || mockBooking.accessCode,
          wifiName: data.wifi_name || data.wifiName || mockBooking.wifiName,
          wifiPassword: data.wifi_password || data.wifiPassword || mockBooking.wifiPassword,
        };
        setBooking(b);
        setStep("verify");
      } catch (err) {
        if (code === "HX4K9M2" || code === "1234") {
          setBooking(mockBooking);
          setLookupError(false);
          setStep("verify");
        } else {
          setLookupError(true);
        }
      }
    })();
  };

  async function loginDev() {
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const loginPayload = {
        email: DEV_KIOSK_USER.email,
        password: DEV_KIOSK_USER.password,
      };

      let res = await fetch(`${base}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginPayload),
      });

      if (res.status === 401) {
        const registerRes = await fetch(`${base}/v1/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(DEV_KIOSK_USER),
        });
        if (!(registerRes.status === 201 || registerRes.status === 409)) {
          throw new Error(`register failed (${registerRes.status})`);
        }

        res = await fetch(`${base}/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginPayload),
        });
      }

      if (!res.ok) throw new Error(`login failed (${res.status})`);
      const data = await res.json();
      const accessToken = data.accessToken || data.token;
      if (!accessToken) throw new Error("login response missing access token");
      setToken(accessToken);
      return accessToken;
    } catch (err) {
      setApiError((err as any)?.message || "login error");
      throw err;
    }
  }

  function generateCode(len = 6) {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < len; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
    return out;
  }

  async function createReservation(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setApiError(null);
    setApiLoading(true);
    try {
      let t = token;
      if (!t) t = await loginDev();

      const base = process.env.NEXT_PUBLIC_API_BASE || "";
      const confirmation_code = generateCode();
      const payload = {
        confirmation_code,
        listing_id: 999,
        guest_name: newGuestName || "Guest",
        property: newProperty || "Demo Property",
        check_in: newCheckIn || "3:00 PM",
        check_out: newCheckOut || "11:00 AM",
        access_code: "0000",
        wifi_name: "GuestWifi",
        wifi_password: "password",
      };

      const res = await fetch(`${base}/v1/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `create failed ${res.status}`);
      }
      const data = await res.json();
      const b: BookingInfo = {
        confirmationCode: data.confirmation_code || data.confirmationCode || confirmation_code,
        guestName: data.guest_name || data.guestName || payload.guest_name,
        property: data.property || payload.property,
        checkIn: data.check_in || payload.check_in,
        checkOut: data.check_out || payload.check_out,
        accessCode: data.access_code || payload.access_code,
        wifiName: data.wifi_name || payload.wifi_name,
        wifiPassword: data.wifi_password || payload.wifi_password,
      };
      setBooking(b);
      setShowCreateForm(false);
      setStep("verify");
    } catch (err) {
      setApiError((err as any)?.message || "create error");
    } finally {
      setApiLoading(false);
    }
  }

  const resetKiosk = () => {
    setStep("welcome");
    setConfirmationCode("");
    setLastName("");
    setBooking(null);
    setRulesAccepted(false);
    setLookupError(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-between border-b border-zinc-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-semibold">Self Check-In</h1>
            <p className="text-sm text-zinc-400">Modern Downtown Loft</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
          <p className="text-sm text-zinc-400">{currentTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        {step === "welcome" && (
          <div className="text-center max-w-xl">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4">Welcome!</h2>
            <p className="text-xl text-zinc-400 mb-12">Tap below to begin your self check-in</p>
            <button
              onClick={() => setStep("lookup")}
              className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-emerald-500/25"
            >
              Start Check-In
            </button>
          </div>
        )}

        {step === "lookup" && (
          <div className="w-full max-w-md">
            <button onClick={() => setStep("welcome")} className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h2 className="text-3xl font-bold mb-2">Find Your Reservation</h2>
            <p className="text-zinc-400 mb-8">Enter your confirmation code to continue</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-zinc-400 mb-2">Confirmation Code</label>
                <input
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => { setConfirmationCode(e.target.value.toUpperCase()); setLookupError(false); }}
                  placeholder="e.g. HX4K9M2"
                  className="w-full px-5 py-4 bg-zinc-800 border border-zinc-700 rounded-xl text-xl text-center tracking-widest uppercase focus:outline-none focus:border-emerald-500 transition-colors"
                  autoFocus
                />
              </div>

              {lookupError && (
                <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-xl text-rose-400 text-center">
                  Reservation not found. Please check your code and try again.
                </div>
              )}

              <button
                onClick={handleLookup}
                disabled={confirmationCode.length < 4}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-xl text-lg font-semibold transition-colors"
              >
                Find Reservation
              </button>

              <p className="text-center text-sm text-zinc-500">
                Demo: Use code "HX4K9M2" or "1234"
              </p>
              {lookupError && (
                <div className="mt-4 flex flex-col gap-3">
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded-xl text-lg font-semibold transition-colors"
                  >
                    Create Reservation (Demo)
                  </button>
                </div>
              )}

              {showCreateForm && (
                <form onSubmit={createReservation} className="mt-6 bg-zinc-800 p-4 rounded-xl space-y-3">
                  {apiError && <div className="p-2 text-sm text-rose-400">{apiError}</div>}
                  <div>
                    <label className="text-sm text-zinc-400">Guest Name</label>
                    <input value={newGuestName} onChange={(e) => setNewGuestName(e.target.value)} className="w-full mt-1 p-3 bg-zinc-900 rounded-xl" />
                  </div>
                  <div>
                    <label className="text-sm text-zinc-400">Property</label>
                    <input value={newProperty} onChange={(e) => setNewProperty(e.target.value)} className="w-full mt-1 p-3 bg-zinc-900 rounded-xl" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-sm text-zinc-400">Check-in</label>
                      <input value={newCheckIn} onChange={(e) => setNewCheckIn(e.target.value)} className="w-full mt-1 p-3 bg-zinc-900 rounded-xl" />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm text-zinc-400">Check-out</label>
                      <input value={newCheckOut} onChange={(e) => setNewCheckOut(e.target.value)} className="w-full mt-1 p-3 bg-zinc-900 rounded-xl" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setShowCreateForm(false)} className="flex-1 py-3 border border-zinc-700 rounded-xl">Cancel</button>
                    <button type="submit" disabled={apiLoading} className="flex-1 py-3 bg-emerald-600 rounded-xl">{apiLoading ? 'Creating…' : 'Create Reservation'}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {step === "verify" && booking && (
          <div className="w-full max-w-md">
            <button onClick={() => setStep("lookup")} className="mb-8 flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
            <h2 className="text-3xl font-bold mb-2">Confirm Your Details</h2>
            <p className="text-zinc-400 mb-8">Is this your reservation?</p>

            <div className="bg-zinc-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-zinc-700">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-500">{booking.guestName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-xl font-semibold">{booking.guestName}</p>
                  <p className="text-zinc-400">Confirmation: {booking.confirmationCode}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Property</span>
                  <span className="font-medium">{booking.property}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Check-in</span>
                  <span className="font-medium">{booking.checkIn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Check-out</span>
                  <span className="font-medium">{booking.checkOut}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setStep("lookup")}
                className="flex-1 py-4 border border-zinc-600 hover:border-zinc-500 rounded-xl text-lg font-semibold transition-colors"
              >
                Not Me
              </button>
              <button
                onClick={() => setStep("rules")}
                className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-lg font-semibold transition-colors"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {step === "rules" && (
          <div className="w-full max-w-lg">
            <h2 className="text-3xl font-bold mb-2">House Rules</h2>
            <p className="text-zinc-400 mb-8">Please review and accept our house rules</p>

            <div className="bg-zinc-800 rounded-2xl p-6 mb-6 max-h-80 overflow-y-auto">
              <ul className="space-y-4">
                {houseRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={rulesAccepted}
                onChange={(e) => setRulesAccepted(e.target.checked)}
                className="w-6 h-6 rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-emerald-500"
              />
              <span>I have read and agree to the house rules</span>
            </label>

            <button
              onClick={() => setStep("access")}
              disabled={!rulesAccepted}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-xl text-lg font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {step === "access" && booking && (
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-2">Your Access Code</h2>
            <p className="text-zinc-400 mb-8">Use this code to unlock the door</p>

            <div className="bg-zinc-800 rounded-2xl p-8 mb-6">
              <p className="text-6xl font-mono font-bold tracking-[0.3em] text-emerald-500 mb-4">
                {booking.accessCode}
              </p>
              <p className="text-zinc-400">Enter this on the door keypad</p>
            </div>

            <div className="bg-zinc-800/50 rounded-xl p-4 mb-6 text-left">
              <h4 className="font-semibold mb-2">WiFi Information</h4>
              <div className="space-y-1 text-sm">
                <p><span className="text-zinc-400">Network:</span> {booking.wifiName}</p>
                <p><span className="text-zinc-400">Password:</span> {booking.wifiPassword}</p>
              </div>
            </div>

            <button
              onClick={() => setStep("complete")}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-lg font-semibold transition-colors"
            >
              Complete Check-In
            </button>
          </div>
        )}

        {step === "complete" && (
          <div className="text-center max-w-md">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-emerald-500 flex items-center justify-center animate-bounce">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-4">You're All Set!</h2>
            <p className="text-xl text-zinc-400 mb-8">Enjoy your stay at {mockBooking.property}</p>

            <div className="bg-zinc-800 rounded-xl p-4 mb-8 text-left">
              <p className="text-sm text-zinc-400 mb-2">Need help during your stay?</p>
              <p className="font-medium">Message your host anytime through the app</p>
            </div>

            <button
              onClick={resetKiosk}
              className="px-8 py-3 border border-zinc-600 hover:border-zinc-500 rounded-xl font-medium transition-colors"
            >
              Return to Start
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-zinc-700 text-center text-sm text-zinc-500">
        Need assistance? Contact us at support@rental-platform.com
      </footer>
    </div>
  );
}

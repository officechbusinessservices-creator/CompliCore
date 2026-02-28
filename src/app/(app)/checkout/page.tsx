"use client";

import { useState } from "react";
import Link from "next/link";

interface PaymentMethod {
  id: string;
  type: "card" | "apple" | "google" | "paypal";
  last4?: string;
  brand?: string;
  expiry?: string;
  isDefault?: boolean;
}

const savedPaymentMethods: PaymentMethod[] = [
  { id: "pm1", type: "card", last4: "4242", brand: "Visa", expiry: "12/27", isDefault: true },
  { id: "pm2", type: "card", last4: "5555", brand: "Mastercard", expiry: "08/26" },
];

const bookingDetails = {
  propertyName: "Modern Downtown Loft",
  propertyImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
  hostName: "Sarah",
  checkIn: "2026-03-15",
  checkOut: "2026-03-18",
  guests: 2,
  nights: 3,
  pricePerNight: 175,
  cleaningFee: 75,
  serviceFee: 52,
  taxes: 48,
};

export default function CheckoutPage() {
  const [step, setStep] = useState<"payment" | "review" | "processing" | "success">("payment");
  const [selectedPayment, setSelectedPayment] = useState<string>("pm1");
  const [paymentType, setPaymentType] = useState<"saved" | "new">("saved");
  const [newCard, setNewCard] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    country: "United States",
    zip: "",
  });
  const [saveCard, setSaveCard] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const subtotal = bookingDetails.pricePerNight * bookingDetails.nights;
  const total = subtotal + bookingDetails.cleaningFee + bookingDetails.serviceFee + bookingDetails.taxes;

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(" ").substr(0, 19) : "";
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + "/" + cleaned.substr(2, 2);
    }
    return cleaned;
  };

  const processPayment = () => {
    setStep("processing");
    setTimeout(() => {
      setStep("success");
    }, 2500);
  };

  const getCardIcon = (brand?: string) => {
    if (brand === "Visa") {
      return (
        <svg className="w-8 h-6" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#1A1F71" />
          <path d="M18.5 21H15.5L17.5 11H20.5L18.5 21Z" fill="white" />
          <path d="M28 11L25.5 18L25 15.5L24 12C24 12 23.5 11 22 11H17L17 11.5C17 11.5 19 12 21 13.5L24 21H27L31 11H28Z" fill="white" />
        </svg>
      );
    }
    if (brand === "Mastercard") {
      return (
        <svg className="w-8 h-6" viewBox="0 0 48 32" fill="none">
          <rect width="48" height="32" rx="4" fill="#000" />
          <circle cx="18" cy="16" r="8" fill="#EB001B" />
          <circle cx="30" cy="16" r="8" fill="#F79E1B" />
          <path d="M24 9.5C26 11 27.5 13.5 27.5 16C27.5 18.5 26 21 24 22.5C22 21 20.5 18.5 20.5 16C20.5 13.5 22 11 24 9.5Z" fill="#FF5F00" />
        </svg>
      );
    }
    return (
      <svg className="w-8 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/prototype" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="font-semibold">Rental Platform</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Secure checkout
          </div>
        </div>
      </header>

      {step === "success" ? (
        <div className="max-w-lg mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-zinc-500 mb-6">Your booking has been confirmed. A confirmation email has been sent to your inbox.</p>

          <div className="p-6 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 mb-6 text-left">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-zinc-500">Confirmation Code</span>
              <span className="font-mono font-bold text-lg">HX4K9M2</span>
            </div>
            <div className="flex gap-4">
              <img src={bookingDetails.propertyImage} alt={bookingDetails.propertyName} className="w-20 h-20 rounded-lg object-cover" />
              <div>
                <h3 className="font-semibold">{bookingDetails.propertyName}</h3>
                <p className="text-sm text-zinc-500">
                  {new Date(bookingDetails.checkIn).toLocaleDateString()} - {new Date(bookingDetails.checkOut).toLocaleDateString()}
                </p>
                <p className="text-sm text-zinc-500">{bookingDetails.guests} guests</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/prototype" className="flex-1 py-3 border border-zinc-300 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Back to Home
            </Link>
            <Link href="/dashboard" className="flex-1 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium">
              View Booking
            </Link>
          </div>
        </div>
      ) : step === "processing" ? (
        <div className="max-w-lg mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-500/10 flex items-center justify-center">
            <svg className="w-10 h-10 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Processing Payment...</h1>
          <p className="text-zinc-500">Please wait while we confirm your payment.</p>
          <div className="mt-8 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden max-w-xs mx-auto">
            <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: "60%" }} />
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-3">
              <h1 className="text-2xl font-bold mb-6">Complete your booking</h1>

              {/* Payment Methods */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 mb-6">
                <h2 className="font-semibold mb-4">Payment method</h2>

                {/* Quick Pay Options */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <button className="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
                    <svg className="w-full h-6" viewBox="0 0 50 20">
                      <text x="0" y="16" className="text-sm font-medium fill-current">Apple Pay</text>
                    </svg>
                  </button>
                  <button className="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
                    <svg className="w-full h-6" viewBox="0 0 50 20">
                      <text x="0" y="16" className="text-sm font-medium fill-current">Google Pay</text>
                    </svg>
                  </button>
                  <button className="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors">
                    <svg className="w-full h-6" viewBox="0 0 50 20">
                      <text x="0" y="16" className="text-sm font-medium fill-blue-600">PayPal</text>
                    </svg>
                  </button>
                </div>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-200 dark:border-zinc-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-white dark:bg-zinc-900 text-sm text-zinc-500">or pay with card</span>
                  </div>
                </div>

                {/* Payment Type Toggle */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setPaymentType("saved")}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      paymentType === "saved"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    Saved cards
                  </button>
                  <button
                    onClick={() => setPaymentType("new")}
                    className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                      paymentType === "new"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                    }`}
                  >
                    New card
                  </button>
                </div>

                {paymentType === "saved" ? (
                  <div className="space-y-3">
                    {savedPaymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full p-4 rounded-lg border-2 text-left flex items-center gap-4 transition-all ${
                          selectedPayment === method.id
                            ? "border-emerald-500 bg-emerald-500/5"
                            : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                        }`}
                      >
                        {getCardIcon(method.brand)}
                        <div className="flex-1">
                          <p className="font-medium">{method.brand} ending in {method.last4}</p>
                          <p className="text-sm text-zinc-500">Expires {method.expiry}</p>
                        </div>
                        {method.isDefault && (
                          <span className="text-xs px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded">Default</span>
                        )}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPayment === method.id ? "border-emerald-500" : "border-zinc-300 dark:border-zinc-600"
                        }`}>
                          {selectedPayment === method.id && (
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Card number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={newCard.number}
                          onChange={(e) => setNewCard({ ...newCard, number: formatCardNumber(e.target.value) })}
                          placeholder="1234 1234 1234 1234"
                          maxLength={19}
                          className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 pr-20"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                          {getCardIcon("Visa")}
                          {getCardIcon("Mastercard")}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Expiry date</label>
                        <input
                          type="text"
                          value={newCard.expiry}
                          onChange={(e) => setNewCard({ ...newCard, expiry: formatExpiry(e.target.value) })}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">CVC</label>
                        <input
                          type="text"
                          value={newCard.cvc}
                          onChange={(e) => setNewCard({ ...newCard, cvc: e.target.value.replace(/\D/g, "").substr(0, 4) })}
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Name on card</label>
                      <input
                        type="text"
                        value={newCard.name}
                        onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1.5">Country</label>
                        <select
                          value={newCard.country}
                          onChange={(e) => setNewCard({ ...newCard, country: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>United Kingdom</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1.5">ZIP code</label>
                        <input
                          type="text"
                          value={newCard.zip}
                          onChange={(e) => setNewCard({ ...newCard, zip: e.target.value })}
                          placeholder="12345"
                          className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span className="text-sm">Save card for future payments</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-zinc-300 dark:border-zinc-600 text-emerald-500 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    I agree to the <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">Terms of Service</a>,{" "}
                    <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">Cancellation Policy</a>, and{" "}
                    <a href="#" className="text-emerald-600 dark:text-emerald-400 hover:underline">House Rules</a>.
                  </span>
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 sticky top-24">
                <div className="flex gap-4 mb-6">
                  <img
                    src={bookingDetails.propertyImage}
                    alt={bookingDetails.propertyName}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{bookingDetails.propertyName}</h3>
                    <p className="text-sm text-zinc-500">Hosted by {bookingDetails.hostName}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium">4.92</span>
                      <span className="text-sm text-zinc-500">(128 reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mb-4">
                  <h4 className="font-medium mb-3">Your trip</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Dates</span>
                      <span>{new Date(bookingDetails.checkIn).toLocaleDateString()} - {new Date(bookingDetails.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Guests</span>
                      <span>{bookingDetails.guests} guests</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mb-4">
                  <h4 className="font-medium mb-3">Price details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">${bookingDetails.pricePerNight} x {bookingDetails.nights} nights</span>
                      <span>${subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Cleaning fee</span>
                      <span>${bookingDetails.cleaningFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Service fee</span>
                      <span>${bookingDetails.serviceFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Taxes</span>
                      <span>${bookingDetails.taxes}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 mb-6">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total (USD)</span>
                    <span>${total}</span>
                  </div>
                </div>

                <button
                  onClick={processPayment}
                  disabled={!agreeTerms}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm and pay ${total}
                </button>

                <p className="text-xs text-zinc-500 text-center mt-4">
                  Your card will be charged ${total}. This reservation is non-refundable.
                </p>

                <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <svg className="h-5" viewBox="0 0 50 20">
                    <text x="0" y="16" className="text-xs fill-zinc-400">Powered by</text>
                  </svg>
                  <div className="flex items-center gap-1 text-sm font-semibold text-violet-600">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
                    </svg>
                    Stripe
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

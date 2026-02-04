"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
  change24h: number;
}

interface CurrencyPreference {
  property: string;
  displayCurrency: string;
  acceptedCurrencies: string[];
  autoConvert: boolean;
}

const currencies: Currency[] = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rate: 1, change24h: 0 },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rate: 0.92, change24h: -0.3 },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rate: 0.79, change24h: 0.5 },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rate: 149.50, change24h: -0.8 },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rate: 1.53, change24h: 0.2 },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦", rate: 1.35, change24h: 0.1 },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", rate: 0.88, change24h: -0.1 },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", rate: 7.24, change24h: 0.4 },
  { code: "MXN", name: "Mexican Peso", symbol: "MX$", flag: "🇲🇽", rate: 17.15, change24h: -0.6 },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", rate: 4.97, change24h: 0.9 },
];

const recentTransactions = [
  { id: "t1", guest: "Hans Mueller", country: "Germany", originalAmount: 450, originalCurrency: "EUR", convertedAmount: 489.13, date: "2026-02-03" },
  { id: "t2", guest: "Yuki Tanaka", country: "Japan", originalAmount: 68500, originalCurrency: "JPY", convertedAmount: 458.19, date: "2026-02-02" },
  { id: "t3", guest: "Sophie Martin", country: "France", originalAmount: 720, originalCurrency: "EUR", convertedAmount: 782.61, date: "2026-02-01" },
  { id: "t4", guest: "James Smith", country: "UK", originalAmount: 380, originalCurrency: "GBP", convertedAmount: 481.01, date: "2026-01-30" },
  { id: "t5", guest: "Chen Wei", country: "China", originalAmount: 3200, originalCurrency: "CNY", convertedAmount: 442.10, date: "2026-01-28" },
];

export default function MultiCurrencyPage() {
  const [activeTab, setActiveTab] = useState<"converter" | "settings" | "transactions">("converter");
  const [amount, setAmount] = useState<number>(199);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [enabledCurrencies, setEnabledCurrencies] = useState<string[]>(["USD", "EUR", "GBP", "CAD", "AUD"]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;
  const convertedAmount = (amount / fromRate) * toRate;

  const formatWithSymbol = (value: number, currencyCode: string) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    if (!currency) return `${value.toFixed(2)}`;
    return `${currency.symbol}${value.toFixed(2)}`;
  };

  const toggleCurrency = (code: string) => {
    setEnabledCurrencies((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/prototype/dashboard" className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Multi-Currency Support</h1>
              <p className="text-xs text-zinc-500">International booking payments</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Rates updated</p>
            <p className="text-sm font-medium">{lastUpdated.toLocaleTimeString()}</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Base Currency</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              <span>🇺🇸</span> USD
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Supported Currencies</p>
            <p className="text-2xl font-bold text-emerald-600">{enabledCurrencies.length}</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">Int'l Bookings (30d)</p>
            <p className="text-2xl font-bold">23</p>
          </div>
          <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <p className="text-sm text-zinc-500">FX Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">$2,653</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["converter", "settings", "transactions"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-emerald-500 text-white"
                  : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "converter" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Converter */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-6">Currency Converter</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm text-zinc-500 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
                      {currencies.find((c) => c.code === fromCurrency)?.symbol}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-10 pr-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-zinc-500 mb-2">From</label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-500 mb-2">To</label>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
                    >
                      {currencies.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <button
                    onClick={() => {
                      const temp = fromCurrency;
                      setFromCurrency(toCurrency);
                      setToCurrency(temp);
                    }}
                    className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </button>
                </div>

                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm text-zinc-500 mb-1">Converted Amount</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {formatWithSymbol(convertedAmount, toCurrency)}
                  </p>
                  <p className="text-xs text-zinc-500 mt-2">
                    1 {fromCurrency} = {(toRate / fromRate).toFixed(4)} {toCurrency}
                  </p>
                </div>
              </div>
            </div>

            {/* Live Rates */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Live Exchange Rates</h3>
              <p className="text-xs text-zinc-500 mb-4">Base: 1 USD</p>
              <div className="space-y-3">
                {currencies.filter((c) => c.code !== "USD").map((currency) => (
                  <div key={currency.code} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{currency.flag}</span>
                      <div>
                        <p className="font-medium">{currency.code}</p>
                        <p className="text-xs text-zinc-500">{currency.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{currency.rate.toFixed(currency.rate >= 100 ? 2 : 4)}</p>
                      <p className={`text-xs ${currency.change24h >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                        {currency.change24h >= 0 ? "+" : ""}{currency.change24h}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Base Currency</h3>
              <p className="text-sm text-zinc-500 mb-4">All prices are stored and calculated in this currency.</p>
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg"
              >
                {currencies.slice(0, 6).map((c) => (
                  <option key={c.code} value={c.code}>{c.flag} {c.code} - {c.name}</option>
                ))}
              </select>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Accepted Currencies</h3>
              <p className="text-sm text-zinc-500 mb-4">Select which currencies guests can pay in.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currencies.map((currency) => (
                  <label
                    key={currency.code}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      enabledCurrencies.includes(currency.code)
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                        : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={enabledCurrencies.includes(currency.code)}
                      onChange={() => toggleCurrency(currency.code)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{currency.flag}</span>
                    <div>
                      <p className="font-medium">{currency.code}</p>
                      <p className="text-xs text-zinc-500">{currency.name}</p>
                    </div>
                    {enabledCurrencies.includes(currency.code) && (
                      <svg className="w-5 h-5 text-emerald-500 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
              <h3 className="font-semibold mb-4">Conversion Settings</h3>
              <div className="space-y-4">
                {[
                  { label: "Auto-convert to base currency on payout", enabled: true },
                  { label: "Show prices in guest's local currency", enabled: true },
                  { label: "Add currency conversion fee (2%)", enabled: false },
                  { label: "Lock exchange rate at booking time", enabled: true },
                ].map((setting) => (
                  <div key={setting.label} className="flex items-center justify-between">
                    <span className="text-sm">{setting.label}</span>
                    <div className={`w-10 h-6 rounded-full relative cursor-pointer ${setting.enabled ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"}`}>
                      <span className={`absolute top-0.5 ${setting.enabled ? "right-0.5" : "left-0.5"} w-5 h-5 bg-white rounded-full shadow transition-all`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-semibold">Recent International Transactions</h3>
            </div>
            <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {recentTransactions.map((tx) => {
                const currency = currencies.find((c) => c.code === tx.originalCurrency);
                return (
                  <div key={tx.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{currency?.flag}</span>
                      <div>
                        <p className="font-medium">{tx.guest}</p>
                        <p className="text-sm text-zinc-500">{tx.country}</p>
                        <p className="text-xs text-zinc-400">{new Date(tx.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-zinc-500">
                        {currency?.symbol}{tx.originalAmount.toLocaleString()} {tx.originalCurrency}
                      </p>
                      <p className="font-semibold text-emerald-600">
                        ${tx.convertedAmount.toFixed(2)} USD
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

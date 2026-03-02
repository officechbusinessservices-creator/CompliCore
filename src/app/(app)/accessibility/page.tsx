"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  focusIndicators: boolean;
  colorBlindMode: "none" | "protanopia" | "deuteranopia" | "tritanopia";
  textSpacing: "normal" | "wide" | "wider";
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  largeText: false,
  reduceMotion: false,
  screenReaderOptimized: false,
  keyboardNavigation: true,
  focusIndicators: true,
  colorBlindMode: "none",
  textSpacing: "normal",
};

const SETTINGS_KEY = "rental_platform_accessibility";

export default function AccessibilityPage() {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load accessibility settings:", e);
    }
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    // Apply settings to document
    applySettings(newSettings);

    // Save to localStorage
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  };

  const applySettings = (s: AccessibilitySettings) => {
    const root = document.documentElement;

    // High contrast
    root.classList.toggle("high-contrast", s.highContrast);

    // Large text
    root.classList.toggle("large-text", s.largeText);

    // Reduce motion
    root.classList.toggle("reduce-motion", s.reduceMotion);

    // Text spacing
    root.classList.remove("text-spacing-normal", "text-spacing-wide", "text-spacing-wider");
    root.classList.add(`text-spacing-${s.textSpacing}`);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem(SETTINGS_KEY);
  };

  const saveSettings = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className={`min-h-screen bg-zinc-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 ${settings.highContrast ? "high-contrast" : ""} ${settings.largeText ? "text-lg" : ""}`}>
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/browse"
              className="p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Go back to prototype"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="font-semibold text-lg">Accessibility Settings</h1>
              <p className="text-xs text-zinc-500">Customize your experience</p>
            </div>
          </div>
          <button
            onClick={saveSettings}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              saved
                ? "bg-emerald-500 text-white"
                : "bg-emerald-500 hover:bg-emerald-600 text-white"
            }`}
            aria-live="polite"
          >
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8" role="main">
        {/* Screen Reader Announcement */}
        <div className="sr-only" role="status" aria-live="polite">
          Accessibility settings page. Customize display, motion, and navigation preferences.
        </div>

        {/* Vision Section */}
        <section aria-labelledby="vision-heading" className="mb-8">
          <h2 id="vision-heading" className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Vision
          </h2>

          <div className="space-y-4">
            {/* High Contrast */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div>
                <label htmlFor="high-contrast" className="font-medium cursor-pointer">High Contrast Mode</label>
                <p className="text-sm text-zinc-500">Increase contrast for better visibility</p>
              </div>
              <button
                id="high-contrast"
                role="switch"
                aria-checked={settings.highContrast}
                onClick={() => updateSetting("highContrast", !settings.highContrast)}
                className={`relative w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  settings.highContrast ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  settings.highContrast ? "translate-x-5" : ""
                }`} />
              </button>
            </div>

            {/* Large Text */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div>
                <label htmlFor="large-text" className="font-medium cursor-pointer">Large Text</label>
                <p className="text-sm text-zinc-500">Increase text size throughout the app</p>
              </div>
              <button
                id="large-text"
                role="switch"
                aria-checked={settings.largeText}
                onClick={() => updateSetting("largeText", !settings.largeText)}
                className={`relative w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  settings.largeText ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  settings.largeText ? "translate-x-5" : ""
                }`} />
              </button>
            </div>

            {/* Color Blind Mode */}
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <label htmlFor="color-blind" className="font-medium block mb-2">Color Blind Mode</label>
              <p className="text-sm text-zinc-500 mb-3">Adjust colors for different types of color vision</p>
              <select
                id="color-blind"
                value={settings.colorBlindMode}
                onChange={(e) => updateSetting("colorBlindMode", e.target.value as AccessibilitySettings["colorBlindMode"])}
                className="w-full px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="none">None</option>
                <option value="protanopia">Protanopia (Red-blind)</option>
                <option value="deuteranopia">Deuteranopia (Green-blind)</option>
                <option value="tritanopia">Tritanopia (Blue-blind)</option>
              </select>
            </div>

            {/* Text Spacing */}
            <div className="p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <label htmlFor="text-spacing" className="font-medium block mb-2">Text Spacing</label>
              <p className="text-sm text-zinc-500 mb-3">Adjust spacing between letters and lines</p>
              <div className="flex gap-2" role="radiogroup" aria-labelledby="text-spacing">
                {(["normal", "wide", "wider"] as const).map((option) => (
                  <button
                    key={option}
                    role="radio"
                    aria-checked={settings.textSpacing === option}
                    onClick={() => updateSetting("textSpacing", option)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      settings.textSpacing === option
                        ? "bg-emerald-500 text-white"
                        : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Motion Section */}
        <section aria-labelledby="motion-heading" className="mb-8">
          <h2 id="motion-heading" className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Motion
          </h2>

          <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div>
              <label htmlFor="reduce-motion" className="font-medium cursor-pointer">Reduce Motion</label>
              <p className="text-sm text-zinc-500">Minimize animations and transitions</p>
            </div>
            <button
              id="reduce-motion"
              role="switch"
              aria-checked={settings.reduceMotion}
              onClick={() => updateSetting("reduceMotion", !settings.reduceMotion)}
              className={`relative w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                settings.reduceMotion ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                settings.reduceMotion ? "translate-x-5" : ""
              }`} />
            </button>
          </div>
        </section>

        {/* Navigation Section */}
        <section aria-labelledby="navigation-heading" className="mb-8">
          <h2 id="navigation-heading" className="text-lg font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Navigation
          </h2>

          <div className="space-y-4">
            {/* Screen Reader Optimized */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div>
                <label htmlFor="screen-reader" className="font-medium cursor-pointer">Screen Reader Optimized</label>
                <p className="text-sm text-zinc-500">Enhanced descriptions and ARIA labels</p>
              </div>
              <button
                id="screen-reader"
                role="switch"
                aria-checked={settings.screenReaderOptimized}
                onClick={() => updateSetting("screenReaderOptimized", !settings.screenReaderOptimized)}
                className={`relative w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  settings.screenReaderOptimized ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  settings.screenReaderOptimized ? "translate-x-5" : ""
                }`} />
              </button>
            </div>

            {/* Keyboard Navigation */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div>
                <label htmlFor="keyboard-nav" className="font-medium cursor-pointer">Enhanced Keyboard Navigation</label>
                <p className="text-sm text-zinc-500">Better keyboard shortcuts and tab order</p>
              </div>
              <button
                id="keyboard-nav"
                role="switch"
                aria-checked={settings.keyboardNavigation}
                onClick={() => updateSetting("keyboardNavigation", !settings.keyboardNavigation)}
                className={`relative w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  settings.keyboardNavigation ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  settings.keyboardNavigation ? "translate-x-5" : ""
                }`} />
              </button>
            </div>

            {/* Focus Indicators */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <div>
                <label htmlFor="focus-indicators" className="font-medium cursor-pointer">Visible Focus Indicators</label>
                <p className="text-sm text-zinc-500">Show clear outlines on focused elements</p>
              </div>
              <button
                id="focus-indicators"
                role="switch"
                aria-checked={settings.focusIndicators}
                onClick={() => updateSetting("focusIndicators", !settings.focusIndicators)}
                className={`relative w-12 h-7 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  settings.focusIndicators ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
                }`}
              >
                <span className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  settings.focusIndicators ? "translate-x-5" : ""
                }`} />
              </button>
            </div>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section aria-labelledby="shortcuts-heading" className="mb-8">
          <h2 id="shortcuts-heading" className="text-lg font-semibold mb-4">Keyboard Shortcuts</h2>
          <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="grid gap-3">
              {[
                { keys: ["Alt", "1"], action: "Go to Home" },
                { keys: ["Alt", "2"], action: "Go to Search" },
                { keys: ["Alt", "3"], action: "Go to Wishlist" },
                { keys: ["Alt", "S"], action: "Open Search" },
                { keys: ["Esc"], action: "Close Modal / Go Back" },
                { keys: ["Tab"], action: "Navigate Forward" },
                { keys: ["Shift", "Tab"], action: "Navigate Backward" },
              ].map((shortcut) => (
                <div key={shortcut.action} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-600 dark:text-zinc-400">{shortcut.action}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd key={key} className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetSettings}
            className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 underline focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded"
          >
            Reset to Default Settings
          </button>
        </div>
      </main>
    </div>
  );
}

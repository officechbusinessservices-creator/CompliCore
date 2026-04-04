"use client";

import { useState, useEffect } from "react";

interface MobileAppPromptProps {
  className?: string;
}

export function MobileAppPrompt({ className = "" }: MobileAppPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if dismissed before
    const dismissed = localStorage.getItem("app_prompt_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Check if mobile
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    checkMobile();

    // Show prompt after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("app_prompt_dismissed", "true");
    setIsDismissed(true);
  };

  const handleRemindLater = () => {
    setIsVisible(false);
    // Show again after 24 hours (simulated by just hiding for now)
  };

  if (isDismissed || !isVisible) return null;

  // Mobile banner
  if (isMobile) {
    return (
      <div className={`fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 shadow-xl ${className}`}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">Get the App</h3>
            <p className="text-sm text-zinc-500 mt-0.5">Book faster with our mobile app. Get exclusive deals and instant notifications!</p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => window.open("https://apps.apple.com", "_blank")}
                className="flex-1 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                App Store
              </button>
              <button
                onClick={() => window.open("https://play.google.com", "_blank")}
                className="flex-1 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.001l-2.302 2.302-8.634-8.645z" />
                </svg>
                Google Play
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors shrink-0"
          >
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // Desktop modal with QR code
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${className}`}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">Get the Mobile App</h2>
          <p className="text-white/80 mt-1">Scan the QR code with your phone</p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* QR Code */}
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-xl shadow-inner">
              {/* SVG QR Code placeholder - in production, generate real QR */}
              <svg className="w-40 h-40" viewBox="0 0 200 200">
                {/* QR Code pattern */}
                <rect width="200" height="200" fill="white" />
                {/* Corner markers */}
                <rect x="10" y="10" width="50" height="50" fill="black" />
                <rect x="17" y="17" width="36" height="36" fill="white" />
                <rect x="24" y="24" width="22" height="22" fill="black" />

                <rect x="140" y="10" width="50" height="50" fill="black" />
                <rect x="147" y="17" width="36" height="36" fill="white" />
                <rect x="154" y="24" width="22" height="22" fill="black" />

                <rect x="10" y="140" width="50" height="50" fill="black" />
                <rect x="17" y="147" width="36" height="36" fill="white" />
                <rect x="24" y="154" width="22" height="22" fill="black" />

                {/* Data patterns */}
                <rect x="70" y="10" width="10" height="10" fill="black" />
                <rect x="90" y="10" width="10" height="10" fill="black" />
                <rect x="110" y="10" width="10" height="10" fill="black" />
                <rect x="80" y="20" width="10" height="10" fill="black" />
                <rect x="100" y="20" width="10" height="10" fill="black" />
                <rect x="120" y="20" width="10" height="10" fill="black" />

                <rect x="70" y="70" width="60" height="60" fill="black" />
                <rect x="80" y="80" width="40" height="40" fill="white" />
                <rect x="90" y="90" width="20" height="20" fill="black" />

                <rect x="10" y="70" width="10" height="10" fill="black" />
                <rect x="30" y="70" width="10" height="10" fill="black" />
                <rect x="20" y="80" width="10" height="10" fill="black" />
                <rect x="40" y="80" width="10" height="10" fill="black" />
                <rect x="10" y="90" width="10" height="10" fill="black" />

                <rect x="140" y="70" width="10" height="10" fill="black" />
                <rect x="160" y="70" width="10" height="10" fill="black" />
                <rect x="150" y="80" width="10" height="10" fill="black" />
                <rect x="170" y="80" width="10" height="10" fill="black" />
                <rect x="180" y="90" width="10" height="10" fill="black" />

                <rect x="70" y="140" width="10" height="10" fill="black" />
                <rect x="90" y="140" width="10" height="10" fill="black" />
                <rect x="80" y="150" width="10" height="10" fill="black" />
                <rect x="100" y="150" width="10" height="10" fill="black" />
                <rect x="70" y="160" width="10" height="10" fill="black" />
                <rect x="110" y="160" width="10" height="10" fill="black" />

                <rect x="140" y="140" width="50" height="10" fill="black" />
                <rect x="140" y="160" width="10" height="10" fill="black" />
                <rect x="160" y="160" width="10" height="10" fill="black" />
                <rect x="180" y="160" width="10" height="10" fill="black" />
                <rect x="150" y="170" width="10" height="10" fill="black" />
                <rect x="170" y="180" width="20" height="10" fill="black" />
              </svg>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {[
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", text: "Instant booking confirmations" },
              { icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", text: "Real-time push notifications" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "Secure mobile payments" },
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <span className="text-sm">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* App store badges */}
          <div className="flex gap-3">
            <button
              onClick={() => window.open("https://apps.apple.com", "_blank")}
              className="flex-1 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </button>
            <button
              onClick={() => window.open("https://play.google.com", "_blank")}
              className="flex-1 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.001l-2.302 2.302-8.634-8.645z" />
              </svg>
              Google Play
            </button>
          </div>

          {/* Remind later */}
          <button
            onClick={handleRemindLater}
            className="w-full mt-4 py-2 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Remind me later
          </button>
        </div>
      </div>
    </div>
  );
}

// Floating app download button for header
export function AppDownloadButton({ className = "" }: { className?: string }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors text-sm ${className}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="hidden sm:inline">Get App</span>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="relative p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold">Download Our App</h2>
              <p className="text-white/80 mt-1">Get the best experience on mobile</p>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* QR Code */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
                  <svg className="w-32 h-32" viewBox="0 0 200 200">
                    <rect width="200" height="200" fill="white" />
                    <rect x="10" y="10" width="50" height="50" fill="black" />
                    <rect x="17" y="17" width="36" height="36" fill="white" />
                    <rect x="24" y="24" width="22" height="22" fill="black" />
                    <rect x="140" y="10" width="50" height="50" fill="black" />
                    <rect x="147" y="17" width="36" height="36" fill="white" />
                    <rect x="154" y="24" width="22" height="22" fill="black" />
                    <rect x="10" y="140" width="50" height="50" fill="black" />
                    <rect x="17" y="147" width="36" height="36" fill="white" />
                    <rect x="24" y="154" width="22" height="22" fill="black" />
                    <rect x="70" y="70" width="60" height="60" fill="black" />
                    <rect x="80" y="80" width="40" height="40" fill="white" />
                    <rect x="90" y="90" width="20" height="20" fill="black" />
                  </svg>
                </div>
              </div>
              <p className="text-center text-sm text-zinc-500 mb-6">Scan with your phone camera</p>

              {/* App store badges */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  App Store
                </button>
                <button className="flex-1 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.001l-2.302 2.302-8.634-8.645z" />
                  </svg>
                  Google Play
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

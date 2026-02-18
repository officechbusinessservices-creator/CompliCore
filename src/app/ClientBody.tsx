"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/ThemeProvider";

const SystemHUD = dynamic(() => import("@/components/SystemHUD"), {
  ssr: false,
  loading: () => null,
});

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SystemHUD />
      <div className="antialiased">{children}</div>
    </ThemeProvider>
  );
}

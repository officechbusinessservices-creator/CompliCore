import type { Metadata } from "next";
import "./globals.css";
import "@/styles/tokens.css";
import ClientBody from "./ClientBody";

export const metadata: Metadata = {
  title: {
    default: "CompliCore - Compliance-First Rental Platform",
    template: "%s | CompliCore"
  },
  description: "Comprehensive vendor-neutral architecture for short-term rental platforms with privacy-by-design, ethical AI, and global compliance. Built for property managers, hosts, and guests.",
  keywords: ["rental platform", "property management", "short-term rentals", "vacation rentals", "compliance", "GDPR", "privacy", "AI", "booking system"],
  authors: [{ name: "CompliCore Team" }],
  creator: "CompliCore",
  publisher: "CompliCore",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "CompliCore - Compliance-First Rental Platform",
    description: "Comprehensive vendor-neutral architecture for short-term rental platforms with privacy-by-design, ethical AI, and global compliance.",
    siteName: "CompliCore",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CompliCore Platform"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "CompliCore - Compliance-First Rental Platform",
    description: "Comprehensive vendor-neutral architecture for short-term rental platforms",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>
          <div className="min-h-screen bg-background text-foreground">{children}</div>
        </ClientBody>
      </body>
    </html>
  );
}

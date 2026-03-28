import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | CompliCore+',
    default: 'CompliCore+ — AI Workflows for Property Managers',
  },
  description:
    'Respond to leasing inquiries instantly, automate follow-up, and reduce admin work with active agent flows that run continuously.',
  keywords: [
    'AI automation for property managers',
    'property management workflow automation',
    'leasing lead response automation',
    'leasing follow-up automation',
    'property management AI software',
  ],
  openGraph: {
    title: 'CompliCore+ — AI Workflows for Property Managers',
    description:
      'Automate leasing responses, follow-ups, and routing so no inquiry is ever missed again.',
    type: 'website',
    url: 'https://complicoreplus.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CompliCore+ — AI Workflows for Property Managers',
    description: 'Automate leasing responses, follow-ups, and routing so no inquiry is ever missed again.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body className="bg-canvas text-[#F5F7FB] antialiased">
        {children}
      </body>
    </html>
  )
}

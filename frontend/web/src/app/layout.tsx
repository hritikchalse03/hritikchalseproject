import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FinanceStream - Live Earnings Calls & Transcripts',
  description: 'Access live earnings calls, real-time transcripts, and searchable investor relations materials from 13,000+ public companies.',
  keywords: 'earnings calls, transcripts, investor relations, financial research, live streaming',
  authors: [{ name: 'FinanceStream Team' }],
  creator: 'FinanceStream',
  publisher: 'FinanceStream',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://financestream.com',
    siteName: 'FinanceStream',
    title: 'FinanceStream - Live Earnings Calls & Transcripts',
    description: 'Access live earnings calls, real-time transcripts, and searchable investor relations materials from 13,000+ public companies.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FinanceStream',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinanceStream - Live Earnings Calls & Transcripts',
    description: 'Access live earnings calls, real-time transcripts, and searchable investor relations materials from 13,000+ public companies.',
    creator: '@financestream',
    images: ['/og-image.png'],
  },
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#3b82f6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-white`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
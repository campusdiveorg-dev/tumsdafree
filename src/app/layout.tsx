import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import PublicLayout from '@/components/PublicLayout';
import StructuredData from '@/components/StructuredData';

const BASE_URL = 'https://tumsda.org';

export const metadata: Metadata = {
  // ─── Base & Title ──────────────────────────────────────────────────────────
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'TUMSDA Church — The Church We Love The Most',
    template: '%s | TUMSDA Church',
  },
  description:
    'TUMSDA Church is a Seventh-day Adventist Sabbath school at the Technical University of Mombasa (TUM) in Tudor, Mombasa, Kenya. Join us for Sabbath worship, Bible study, sacred music, and community outreach.',
  keywords: [
    'TUMSDA Church',
    'Seventh-day Adventist Mombasa',
    'SDA Church Mombasa',
    'Technical University Mombasa church',
    'TUM SDA',
    'Sabbath school Mombasa',
    'TUMSDA choir',
    'church Tudor Mombasa',
    'Adventist Kenya',
    'Bible study Mombasa',
    'Christian church Kenya',
    'Ziwani District church',
  ],
  authors: [{ name: 'TUMSDA Church', url: BASE_URL }],
  creator: 'TUMSDA Church',
  publisher: 'TUMSDA Church',
  category: 'religion',

  // ─── Robots ────────────────────────────────────────────────────────────────
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

  // ─── Canonical ─────────────────────────────────────────────────────────────
  alternates: {
    canonical: BASE_URL,
  },

  // ─── Open Graph ────────────────────────────────────────────────────────────
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    url: BASE_URL,
    siteName: 'TUMSDA Church',
    title: 'TUMSDA Church — The Church We Love The Most',
    description:
      'Seventh-day Adventist Sabbath school at the Technical University of Mombasa. Join us for worship, Bible study, and missions.',
    images: [
      {
        url: `${BASE_URL}/assets/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'TUMSDA Church — Seventh-day Adventist, Mombasa Kenya',
      },
    ],
  },

  // ─── Twitter / X Card ──────────────────────────────────────────────────────
  twitter: {
    card: 'summary_large_image',
    title: 'TUMSDA Church — The Church We Love The Most',
    description:
      'Seventh-day Adventist Sabbath school at the Technical University of Mombasa, Kenya.',
    images: [`${BASE_URL}/assets/og-image.png`],
  },

  // ─── Verification ──────────────────────────────────────────────────────────
  // TODO: After creating your Google Search Console account, replace the
  // placeholder below with your real verification token:
  //   1. Go to https://search.google.com/search-console
  //   2. Add property → URL prefix → https://tumsda.org
  //   3. Choose "HTML tag" method → copy the content= value
  //   4. Replace 'PASTE_YOUR_GSC_TOKEN_HERE' with that value
  verification: {
    google: 'PASTE_YOUR_GSC_TOKEN_HERE',
  },

  // ─── Icons ─────────────────────────────────────────────────────────────────
  icons: {
    icon: [
      { url: '/assets/img/favicon.png', type: 'image/png' },
      { url: '/assets/img/icon.png', type: 'image/png' },
    ],
    shortcut: '/assets/img/icon.png',
    apple: '/assets/img/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=League+Spartan:wght@400;600;700;800&family=Source+Sans+Pro:wght@400;700&family=Noto+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          crossOrigin="anonymous"
        />
        <link rel="icon" type="image/png" href="/assets/img/favicon.png" />
        <link rel="shortcut icon" href="/assets/img/icon.png" />
        <link rel="apple-touch-icon" href="/assets/img/icon.png" />
        <link rel="stylesheet" href="/assets/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/style.css?v=1.1" />
        <link rel="stylesheet" href="/assets/style-utils.css" />
      </head>
      <body>
        <StructuredData includeWebSite />
        <PublicLayout>{children}</PublicLayout>
        <Script src="/assets/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

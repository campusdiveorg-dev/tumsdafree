import type { Metadata } from 'next';
import './globals.css';
import Script from 'next/script';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  title: 'TUMSDA Church',
  description: 'TUMSDA Church - The Church we love the most',
  icons: {
    icon: '/assets/img/favicon.png',
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
        <link rel="stylesheet" href="/assets/all.min.css" />
        <link rel="stylesheet" href="/assets/style.css?v=1.1" />
        <link rel="stylesheet" href="/assets/style-utils.css" />
      </head>
      <body>
        <PublicLayout>{children}</PublicLayout>
        <Script src="/assets/bootstrap.bundle.min.js" strategy="afterInteractive" />
        <Script src="/assets/main.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

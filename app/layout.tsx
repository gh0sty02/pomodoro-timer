import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pomodoro Timer - Focus Session & Break Timer',
  description:
    'A beautiful Pomodoro timer with scenic backgrounds, ambient sounds, and customizable focus/break sessions. Boost productivity with time blocking.',
  keywords: [
    'pomodoro',
    'timer',
    'productivity',
    'focus',
    'time management',
    'break timer',
  ],
  authors: [{ name: 'Pomodoro Timer' }],
  metadataBase: new URL('https://pomodoro-timer.vercel.app'),
  openGraph: {
    title: 'Pomodoro Timer - Focus Session & Break Timer',
    description:
      'A beautiful Pomodoro timer with scenic backgrounds and ambient sounds. Customize your focus and break sessions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Pomodoro Timer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Pomodoro Timer - Focus and Break Sessions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pomodoro Timer - Focus Session & Break Timer',
    description:
      'A beautiful Pomodoro timer with scenic backgrounds, ambient sounds, and customizable sessions.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#ffffff',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Pomodoro" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link
          rel="alternate"
          hrefLang="en"
          href="https://pomodoro-timer.vercel.app"
        />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

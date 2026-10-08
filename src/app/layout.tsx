import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'SnapLink — Short Links, Instantly.',
  description: 'Turn long URLs into clean, shareable short links in seconds. Fast, free, and simple.',
  keywords: ['url shortener', 'short links', 'link shortener', 'snaplink'],
  authors: [{ name: 'SnapLink' }],
  openGraph: {
    title: 'SnapLink — Short Links, Instantly.',
    description: 'Turn long URLs into clean, shareable short links in seconds.',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://snaplink.app',
    siteName: 'SnapLink',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SnapLink — Short Links, Instantly.',
    description: 'Turn long URLs into clean, shareable short links in seconds.',
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('snaplink-theme') || 'system';
                const d = t === 'system'
                  ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                  : t;
                document.documentElement.classList.add(d);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

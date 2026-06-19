import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Portuguese for newcomers — Mozambique',
  description:
    'Practical Portuguese for people who have moved to Mozambique. Phrases, guides, and pronunciation.',
};

export const viewport: Viewport = {
  themeColor: '#1a2332',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

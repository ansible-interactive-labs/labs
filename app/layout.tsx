import type { Metadata } from 'next';
import 'asciinema-player/dist/bundle/asciinema-player.css';
import './globals.css';
import { brand } from '@/lib/brand';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: brand.siteName,
  description:
    'Verified Ansible hands-on demonstrations created by Rajat Agrawal, with real workflows, complete output, explanations, and troubleshooting.',
  authors: [{ name: brand.creator, url: brand.linkedin }],
  creator: brand.creator,
  publisher: brand.siteName,
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: {
    title: brand.siteName,
    description: `${brand.descriptor}. ${brand.tagline}`,
    type: 'website',
    images: [{ url: `${basePath}/og.png`, width: 1731, height: 909, alt: `${brand.siteName} — ${brand.descriptor}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: brand.siteName,
    description: `${brand.descriptor}. ${brand.tagline}`,
    images: [`${basePath}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}

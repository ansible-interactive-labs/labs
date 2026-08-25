import type { Metadata } from 'next';
import 'asciinema-player/dist/bundle/asciinema-player.css';
import './globals.css';
import { brand } from '@/lib/brand';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const socialImage = `${siteUrl}/og.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: brand.siteName,
    template: `%s | ${brand.siteName}`,
  },
  description:
    'Hands-On Demos, solution blueprints, and consulting cases across automation, infrastructure, developer platforms, cloud-native engineering, and applied AI.',
  authors: [{ name: brand.creator, url: brand.linkedin }],
  creator: brand.creator,
  publisher: brand.siteName,
  icons: { icon: `${basePath}/favicon.svg` },
  openGraph: {
    title: brand.siteName,
    description: `${brand.descriptor}. ${brand.tagline}`,
    type: 'website',
    images: [{ url: socialImage, width: 1731, height: 909, alt: `${brand.siteName} — ${brand.descriptor}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: brand.siteName,
    description: `${brand.descriptor}. ${brand.tagline}`,
    images: [socialImage],
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

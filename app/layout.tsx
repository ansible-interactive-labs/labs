import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Ansible Automation Lab',
  description:
    'Guided, interactive Ansible demonstrations built from real RHEL workflows, with commands and explanations you can follow in your own environment.',
  icons: { icon: 'favicon.svg' },
  openGraph: {
    title: 'Ansible Automation Lab',
    description: 'Learn by watching. Build by doing.',
    type: 'website',
    images: [{ url: 'og.png', width: 1731, height: 909, alt: 'Ansible Automation Lab' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ansible Automation Lab',
    description: 'Learn by watching. Build by doing.',
    images: ['og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}

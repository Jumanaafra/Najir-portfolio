import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mohamed Nazeer — Supply Chain Supervisor & Web Developer | UAE',
  description:
    'Official portfolio of Mohamed Nazeer — Supply Chain Management Supervisor, Inventory & Operations Coordinator, Web Developer & Digital Marketer based in UAE. Immediate joiner.',
  keywords: [
    'Mohamed Nazeer', 'Supply Chain UAE', 'Inventory Management', 'Web Developer UAE',
    'Digital Marketer', 'WordPress Developer', 'SEO Expert UAE', 'Data Operations',
    'Portfolio UAE', 'Immediate Joiner UAE',
  ],
  openGraph: {
    title: 'Mohamed Nazeer — Cinematic Portfolio',
    description: 'Premium futuristic digital portfolio experience.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}

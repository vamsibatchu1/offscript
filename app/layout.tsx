import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Offscript — Procedural handwriting studio',
  description: 'Draw a one-of-a-kind alphabet. Explore mathematically generated handwriting with live controls for pen pressure, letterforms, and personality.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import './detail.css';
import './brand.css';
import './chart-layout.css';
import './dashboard-tools.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://painel-executivo-santa-ines.sergiopredador23.chatgpt.site'),
  title: 'Painel Executivo — Santa Inês',
  description: 'Dashboard executivo de resultados da Maranhão Motos em Santa Inês.',
  openGraph: {
    title: 'Painel Executivo — Santa Inês',
    description: 'Maranhão Motos • Resultados de Agosto 2026',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Painel Executivo — Santa Inês',
    description: 'Maranhão Motos • Resultados de Agosto 2026',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

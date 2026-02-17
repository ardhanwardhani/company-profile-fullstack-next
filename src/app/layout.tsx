import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'A+ Digital | Custom Software Development & Creative Design',
  description: 'We help companies and startups build exceptional software, craft compelling brands, and create digital products that drive growth.',
  keywords: ['software development', 'web design', 'UI/UX', 'company profile', 'digital agency'],
  openGraph: {
    title: 'A+ Digital | Custom Software Development & Creative Design',
    description: 'We help companies and startups build exceptional software, craft compelling brands, and create digital products that drive growth.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

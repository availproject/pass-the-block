import { Web3Provider } from '@/components/Web3Provider';
import { NexusProvider } from '@/components/NexusProvider';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Nexus SDK Tutorial - Part 1: Getting Started',
  description: 'Learn chain abstraction by building unified balance viewing with the Avail Nexus SDK',
  icons: {
    icon: '/avail-logo.svg',
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
        <Web3Provider>
          <NexusProvider>
            {children}
          </NexusProvider>
        </Web3Provider>
      </body>
    </html>
  );
}

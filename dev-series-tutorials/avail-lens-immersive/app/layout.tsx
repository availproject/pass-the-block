import type { Metadata } from "next";
import { Providers } from "./components/Providers";

export const metadata: Metadata = {
  title: "Lens Network Visualizer by Avail",
  description: "Celebrate Lens Protocol's integration with Avail Data Availability by exploring the Lens social graph in an immersive 3D space. Built by the Avail team.",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background antialiased">
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}

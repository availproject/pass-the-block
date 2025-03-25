import type { Metadata } from "next";
import { Providers } from "./components/Providers";

export const metadata: Metadata = {
  title: "Lens Network Visualizer",
  description: "Explore Lens Protocol connections in 3D space",
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

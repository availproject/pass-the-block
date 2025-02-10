import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avail DA Notes",
  description: "A note-taking app built on Avail",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}

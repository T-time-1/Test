import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Life of Property | Boligprisene i Oslo-regionen",
  description:
    "Track house prices across Oslo and surrounding municipalities. From your first nest to the crown jewel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-display">{children}</body>
    </html>
  );
}

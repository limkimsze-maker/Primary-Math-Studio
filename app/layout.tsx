import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Primary Maths Studio · P1–P3 Teaching Engines",
  description: "15 configurable mathematics teaching engines with original diagrams and offline activities. Created by Lim Kim Sze.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

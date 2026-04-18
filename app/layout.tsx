import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Victorian Casino — Whitefish, Montana",
  description:
    "Montana style gambling at its best. 20 gaming machines, full bar, food. Open 7 days a week in Whitefish, MT.",
  openGraph: {
    title: "Victorian Casino — Whitefish, Montana",
    description: "Montana style gambling at its best.",
    siteName: "Victorian Casino",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}

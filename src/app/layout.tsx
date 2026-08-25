import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const title = "BBCA — British Bangladeshi Construction Association";
const description =
  "Connecting British Bangladeshi construction businesses and professionals.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  // Explicit, un-fingerprinted icon URLs. Next's auto-generated tag appends a
  // build hash query string, which changes the favicon URL on every rebuild;
  // Google's favicon crawler caches per-URL, so a stable path re-resolves faster.
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" }],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "BBCA",
    locale: "en_GB",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

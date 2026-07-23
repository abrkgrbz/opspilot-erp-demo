import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ??
    (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;
  const description =
    "An interactive ERP order and inventory management portfolio demo built by Anil G.";

  return {
    metadataBase: new URL(origin),
    title: "OpsPilot — ERP Operations Demo",
    description,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "OpsPilot — ERP Operations Demo",
      description,
      type: "website",
      url: origin,
      images: [
        {
          url: "/og.png",
          width: 1728,
          height: 912,
          alt: "OpsPilot ERP Operations Demo dashboard",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "OpsPilot — ERP Operations Demo",
      description,
      images: ["/og.png"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}

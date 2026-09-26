import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Siva's Portfolio",
    default: "Siva's Portfolio - Full Stack Developer",
  },
  description: "Explore my portfolio showcasing my projects, skills, and experience.",
  keywords: [
    "developer",
    "portfolio",
    "projects",
    "full stack",
    "react",
    "nodejs",
  ],
  authors: [{ name: "Siva" }],
  creator: "Siva",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourportfolio.com",
    siteName: "Siva's Portfolio",
    title: "Siva's Portfolio - Full Stack Developer",
    description: "Explore my portfolio showcasing my projects, skills, and experience.",
    images: [
      {
        url: "https://yourportfolio.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siva's Portfolio",
    description: "Explore my portfolio showcasing my projects, skills, and experience.",
    creator: "@yourhandle",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#0f172a" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-full flex flex-col bg-slate-950 text-white">
        {children}
      </body>
    </html>
  );
}

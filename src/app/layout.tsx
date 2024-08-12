import "./globals.css";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
// const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/react";
import { GlobalStateProvider } from "@/context/GlobalStateContext";
import Script from "next/script";

const fontCode = localFont({
  src: [
    {
      path: "../../assets/fonts/CalSans-SemiBold.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-code",
});

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Quix.ai",
  description:
    "Quix.ai is an AI assistant for teachers that helps in creating, evaluating, and grading student assignments and managing students.",
  metadataBase: new URL("https://quixai.vercel.app/"),
  openGraph: {
    title: "Quix.ai",
    description:
      "Quix.ai is an AI assistant for teachers that helps in creating, evaluating, and grading student assignments and managing students.",
    url: "https://quixai.vercel.app/",
    images: [
      {
        url: "linklogo.png",
        width: 1200,
        height: 630,
        alt: "Quix.ai",
      },
    ],
    siteName: "Quix.ai",
    locale: "en-US",
    type: "website",
  },
  twitter: {
    title: "Quix.ai",
    description:
      "Quix.ai is an AI assistant for teachers that helps in creating, evaluating, and grading student assignments and managing students.",
    images: [
      {
        url: "linklogo.png",
        width: 1200,
        height: 630,
        alt: "Quix.ai",
      },
    ],
    card: "summary_large_image",
    creator: "@mygodlon",
    site: "@mygodlon",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6142492019505715"
          crossOrigin="anonymous"
        ></Script>
        <Script src="https://app.lemonsqueezy.com/js/lemon.js" defer></Script>
      </head>
      <body
        className={cn(
          `min-h-screen bg-background font-sans antialiased`,
          fontCode.variable,
          fontSans.variable
        )}
      >
        <GlobalStateProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Analytics />
            <Toaster />
          </ThemeProvider>
        </GlobalStateProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import "./globals.css";

// Switzer — the typeface cosmos.studio itself is set in (confirmed via
// computed styles), self-hosted per Fontshare's free license (self-hosting
// "permitted and recommended"). One family, weight does the work of
// hierarchy — headline down to body.
const switzer = localFont({
  src: "./fonts/Switzer-Variable.woff2",
  variable: "--font-switzer",
  weight: "100 900",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Richu Thankachan — Technical Support Engineer & Full-Stack Developer",
  description:
    "Technical Support Engineer with a hands-on software development background in React, Node.js, and SQL — resolving complex SaaS, network, and application issues for 1,000+ end-users.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${switzer.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <ThemeProvider>
          {/* "user" defers to the OS prefers-reduced-motion setting for
              every Motion-driven animation on the page. */}
          <MotionConfig reducedMotion="user">
            <SmoothScroll />
            {children}
          </MotionConfig>
        </ThemeProvider>
      </body>
    </html>
  );
}

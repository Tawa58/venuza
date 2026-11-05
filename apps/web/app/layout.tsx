import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { glassGlow } from "@venuza/design-tokens";
import type { CSSProperties } from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Venuza",
  description: "Discover. Connect. Experience.",
};

const theme = {
  "--vz-main": glassGlow.main,
  "--vz-secondary": glassGlow.secondary,
  "--vz-violet": glassGlow.electricViolet,
  "--vz-cyan": glassGlow.cyan,
  "--vz-near-white": glassGlow.nearWhite,
  "--vz-muted-grey": glassGlow.mutedGrey,
} as CSSProperties;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} style={theme}>
      <body className="flex min-h-full flex-col bg-main text-ink">{children}</body>
    </html>
  );
}

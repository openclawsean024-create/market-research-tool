import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Market Research Tool — AI-Powered Trend Intelligence",
  description: "Collect trending topics from social media, filter for short video suitability, verify sources. Powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}

import React from "react";
import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import ThemeLayoutWrapper from "../components/layout/ThemeLayoutWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CRM - Secure Enterprise Customer Relationship Platform",
  description:
    "A premium, production-level MERN CRM featuring glassmorphism, responsive deal staging, dynamic invoice tracking, and customer ticket support.",
  keywords: ["CRM", "MERN", "Customer Management", "Invoice System", "Deal pipeline", "Enterprise CRM"],
  icons: {
    icon: "/logo-icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${manrope.variable} antialiased min-h-screen flex flex-col justify-between selection:bg-blue-500/30 selection:text-navy-950`}>
        <ThemeLayoutWrapper>{children}</ThemeLayoutWrapper>
      </body>
    </html>
  );
}

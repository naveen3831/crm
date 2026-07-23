"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ThemeLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Hide public navbar and footer on admin & customer dashboard layouts
  const isDashboardRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/customer");

  if (isDashboardRoute) {
    return <main className="w-full relative min-h-screen flex flex-col">{children}</main>;
  }

  const isHomePage = pathname === "/";

  return (
    <div className="w-full min-h-screen flex flex-col justify-between">
      <Navbar />
      
      {/* Mobile Back Button (Only visible on non-home subpages) */}
      {!isHomePage && (
        <div className="md:hidden w-full px-6 pt-4 pb-1 max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#78350f] hover:text-[#1a0f00] transition-all duration-200 py-1.5 px-3.5 rounded-xl bg-white border border-orange-200 shadow-sm"
          >
            <ArrowLeft size={13} className="text-orange-600" />
            <span>Back to Home</span>
          </Link>
        </div>
      )}

      <main className={`flex-grow w-full relative ${isHomePage ? "pb-24 md:pb-0" : ""}`}>
        {children}
      </main>
      
      <Footer />
    </div>
  );
}


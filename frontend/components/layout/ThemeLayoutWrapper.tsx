"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function ThemeLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by rendering a clean wrapper on the server
  if (!mounted) {
    return <main className="w-full relative min-h-screen flex flex-col">{children}</main>;
  }

  // Hide public navbar and footer on admin & customer dashboard layouts
  const isDashboardRoute = pathname?.startsWith("/admin") || pathname?.startsWith("/customer");

  if (isDashboardRoute) {
    return <main className="w-full relative min-h-screen flex flex-col">{children}</main>;
  }

  const isHomePage = pathname === "/";

  return (
    <>
      <Navbar />
      
      {/* Mobile Back Button (Only visible on subpages, rendered below the top navbar) */}
      {pathname !== "/" && (
        <div className="md:hidden w-full px-6 pt-5 pb-1 max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#041429] transition-all duration-200 py-1.5 px-3.5 rounded-xl bg-white border border-gray-200 shadow-sm"
          >
            <ArrowLeft size={13} className="text-[#1687F8]" />
            <span>Back to Home</span>
          </Link>
        </div>
      )}

      <main className={`flex-grow w-full relative ${isHomePage ? "pb-24 md:pb-0" : ""}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}

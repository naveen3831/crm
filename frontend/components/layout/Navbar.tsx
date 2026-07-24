"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Info, Mail, LogIn, Layout, ArrowLeft } from "lucide-react";
import Button from "../ui/Button";

interface LoggedUser {
  email: string;
  role: "admin" | "customer";
}

function MobileTabIcon({
  name,
  isHome,
  isLoggedIn,
}: {
  name: string;
  isHome: boolean;
  isLoggedIn: boolean;
}) {
  if (name === "nav_home") return isHome ? <Home size={18} /> : <ArrowLeft size={18} />;
  if (name === "nav_about") return <Info size={18} />;
  if (name === "nav_contact") return <Mail size={18} />;
  if (name === "nav_auth") return isLoggedIn ? <Layout size={18} /> : <LogIn size={18} />;
  return null;
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Blogs", href: "/blogs" },
  { name: "Contact", href: "/contact" },
];

const mobileTabConfig = [
  { id: "nav_home", label: "Home", baseHref: "/" },
  { id: "nav_about", label: "About", baseHref: "/about" },
  { id: "nav_contact", label: "Contact", baseHref: "/contact" },
  { id: "nav_auth", label: "Log In", baseHref: "/auth/login" },
];

export default function Navbar() {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const pathname = usePathname();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  const isHome = pathname === "/";

  const getTabHref = (id: string) => {
    if (id === "nav_home") return "/";
    if (id === "nav_auth" && user) {
      return user.role === "admin" ? "/admin/dashboard" : "/customer/dashboard";
    }
    return mobileTabConfig.find((t) => t.id === id)?.baseHref ?? "/";
  };

  const getTabLabel = (id: string) => {
    if (id === "nav_home") return isHome ? "Home" : "Back";
    if (id === "nav_auth") return user ? "Dashboard" : "Log In";
    return mobileTabConfig.find((t) => t.id === id)?.label ?? "";
  };

  return (
    <>
      {/* Top Navbar */}
      <nav
        className={`sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-orange-200 py-4 px-6 md:px-12 flex items-center justify-between transition-transform duration-300 shadow-sm ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-sm p-1.5 group-hover:scale-105 transition-transform duration-300">
            <img src="/logo-icon.svg" alt="CRM Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-heading font-extrabold text-xl text-[#1a0f00] tracking-tight">
            CRM
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className="relative text-sm font-medium tracking-wide transition-colors duration-200 py-1"
                style={{ color: isActive ? "#1a0f00" : "#78350f" }}
              >
                <span className="hover:text-[#1a0f00] transition-colors">{link.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link href={user.role === "admin" ? "/admin/dashboard" : "/customer/dashboard"}>
                <Button variant="outline" size="sm" className="font-semibold text-xs">
                  {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="text-xs font-semibold text-red-600 hover:text-red-700"
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm">Register</Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Tab Bar */}
      {isHome && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-200 py-3 px-6 flex items-center justify-around shadow-lg">
          {mobileTabConfig.map((tab) => {
            const href = getTabHref(tab.id);
            const label = getTabLabel(tab.id);
            const isActive = pathname === href;
            return (
              <Link
                key={tab.id}
                href={href}
                className={`flex flex-col items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive ? "text-orange-600 scale-105" : "text-gray-400 hover:text-[#1a0f00]"
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${isActive ? "bg-orange-50" : ""}`}>
                  <MobileTabIcon name={tab.id} isHome={isHome} isLoggedIn={!!user} />
                </div>
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}

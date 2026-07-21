"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Send, Twitter, Linkedin, Github } from "lucide-react";
import Button from "../ui/Button";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer
      className={`w-full bg-[#fff7ed] border-t border-orange-200 pt-14 px-6 md:px-12 ${
        isHomePage ? "pb-32 md:pb-16" : "pb-16"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-sm p-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
                <path d="M 40,95 C 40,55 160,55 160,95" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
                <rect x="62" y="70" width="18" height="50" rx="3" fill="#EE4047" />
                <rect x="86" y="50" width="18" height="70" rx="3" fill="#FF9F0A" />
                <rect x="110" y="30" width="18" height="90" rx="3" fill="#27C15A" />
                <ellipse cx="100" cy="100" rx="48" ry="29" stroke="#1a0f00" strokeWidth="10" transform="rotate(-15, 100, 100)" />
                <path d="M 40,95 C 40,135 160,135 160,95" stroke="#f97316" strokeWidth="7" strokeLinecap="round" />
                <path d="M 75,122 L 35,167" stroke="#1a0f00" strokeWidth="15" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-lg text-[#1a0f00] tracking-tight">CRM</span>
          </Link>
          <p className="text-sm text-[#78350f] leading-relaxed font-sans mt-1">
            Secure, premium customer relationships, smart deal pipeline conversion, and centralized billing automation.
          </p>
          <div className="flex items-center gap-3 mt-1">
            <a href="#" className="w-9 h-9 rounded-lg bg-orange-100 hover:bg-orange-200 flex items-center justify-center text-[#92400e] transition-colors">
              <Twitter size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-orange-100 hover:bg-orange-200 flex items-center justify-center text-[#92400e] transition-colors">
              <Linkedin size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-orange-100 hover:bg-orange-200 flex items-center justify-center text-[#92400e] transition-colors">
              <Github size={16} />
            </a>
          </div>
        </div>

        {/* Product Links */}
        <div>
          <h4 className="font-heading font-bold text-sm text-[#1a0f00] uppercase tracking-wider mb-5">Product</h4>
          <ul className="flex flex-col gap-3 text-sm text-[#78350f] font-sans">
            <li><Link href="/" className="hover:text-[#1a0f00] transition-colors">Core Features</Link></li>
            <li><Link href="/faq" className="hover:text-[#1a0f00] transition-colors">Security Standards</Link></li>
            <li><Link href="/about" className="hover:text-[#1a0f00] transition-colors">Integrations</Link></li>
            <li><Link href="/" className="hover:text-[#1a0f00] transition-colors">Pricing Options</Link></li>
          </ul>
        </div>

        {/* Legal & Support */}
        <div>
          <h4 className="font-heading font-bold text-sm text-[#1a0f00] uppercase tracking-wider mb-5">Legal & Support</h4>
          <ul className="flex flex-col gap-3 text-sm text-[#78350f] font-sans">
            <li><Link href="/privacy" className="hover:text-[#1a0f00] transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[#1a0f00] transition-colors">Terms of Service</Link></li>
            <li><Link href="/faq" className="hover:text-[#1a0f00] transition-colors">Help Center / FAQ</Link></li>
            <li><Link href="/contact" className="hover:text-[#1a0f00] transition-colors">Contact Support</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-heading font-bold text-sm text-[#1a0f00] uppercase tracking-wider mb-5">Newsletter</h4>
          <p className="text-sm text-[#78350f] leading-relaxed font-sans mb-4">
            Subscribe for the latest product features, tips, and enterprise CRM growth reviews.
          </p>
          {submitted ? (
            <div className="p-4 rounded-xl bg-orange-100 border border-orange-300 text-xs font-semibold text-orange-800 flex items-center gap-2">
              <Send size={14} /> Thank you for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-orange-200 text-[#1a0f00] text-xs placeholder:text-gray-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-colors"
                />
                <Mail size={14} className="absolute left-3.5 top-3.5 text-orange-400" />
              </div>
              <Button type="submit" variant="primary" size="sm" className="px-4 py-3">
                <Send size={14} />
              </Button>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-orange-200 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-[#92400e]">
        <p>© {new Date().getFullYear()} CRM. All rights reserved.</p>
        <p className="mt-2 md:mt-0">Enterprise Grade Customer Relationship Platform</p>
      </div>
    </footer>
  );
}

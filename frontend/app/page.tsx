"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, TrendingUp, FileText, CreditCard, TicketCheck, BarChart3,
  ArrowRight, Zap,
} from "lucide-react";
import Button from "../components/ui/Button";
import GlassCard from "../components/ui/GlassCard";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
};

const featureIcons = [
  <Users key="u" className="text-orange-600" size={24} />,
  <TrendingUp key="t" className="text-amber-500" size={24} />,
  <FileText key="f" className="text-purple-600" size={24} />,
  <CreditCard key="c" className="text-green-600" size={24} />,
  <TicketCheck key="tc" className="text-red-500" size={24} />,
  <BarChart3 key="b" className="text-orange-500" size={24} />,
];

const featureData = [
  { title: "Customer Intelligence", description: "Manage detailed records, industrial sectors, GST details, and real-time customer histories in one hub." },
  { title: "Lead & Deal Pipeline", description: "Track lead states from New to Qualification, Proposal Sent, and Conversion using color-coded stage feeds." },
  { title: "Quotations & Invoicing", description: "Generate drafts, verify line items, email PDFs, and instantly convert accepted quotations into active invoices." },
  { title: "Online Invoicing & Payment", description: "Collect payments via UPI, Credit Card, or Net Banking with integrated Stripe & Razorpay gateways." },
  { title: "Support Ticket Desk", description: "Empower customers to submit issues, upload file details, receive admin updates, and track resolution metrics." },
  { title: "Advanced Analytics", description: "Review automated charts of monthly sales, lead conversion metrics, open tickets, and pending collection data." },
];

const workflowSteps = [
  { step: "01", title: "Capture & Qualify", description: "Leads enter from public channels. Assign priority ratings and track correspondence details." },
  { step: "02", title: "Propose & Close", description: "Draft quotations, customize taxes, request client acceptance online, and finalize invoices." },
  { step: "03", title: "Analyze & Support", description: "Evaluate pipeline performance, record UPI transfers, and resolve support requests quickly." },
];

export default function HomePage() {
  return (
    <div className="hero-gradient min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-14 sm:pt-20 pb-16 sm:pb-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 border border-orange-300 text-xs font-semibold text-orange-700 mb-8 shadow-sm"
        >
          <Zap size={13} fill="currentColor" />
          <span>Next.js 14 Production-Ready Setup</span>
        </motion.div>

        <motion.h1
          className="display-xl text-gradient max-w-4xl tracking-tight mb-6 font-heading"
          initial="initial" animate="animate" variants={fadeInUp}
        >
          Drive High Growth with the Complete Customer Platform
        </motion.h1>

        <motion.p
          className="text-[#78350f] text-base sm:text-lg md:text-xl max-w-2xl leading-relaxed mb-10 font-medium"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
        >
          Unify sales pipelines, verify deals, compile quotations, process card payments, and manage support tickets in a beautiful, unified dashboard.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/auth/register">
            <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
              Start Free Trial <ArrowRight size={16} />
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Book CRM Demo
            </Button>
          </Link>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full mt-16 max-w-5xl rounded-2xl overflow-hidden border border-orange-200 shadow-xl p-4 bg-white"
        >
          <div className="flex items-center justify-between pb-4 border-b border-orange-100 px-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400"></span>
              <span className="w-3 h-3 rounded-full bg-green-400"></span>
              <span className="text-xs text-gray-500 font-sans ml-2">crm-v1.0.local</span>
            </div>
            <div className="text-xs text-[#78350f] px-3 py-1 rounded bg-orange-50 font-mono border border-orange-200">
              Role: Admin (Full Access)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
              <div className="text-xs font-bold text-orange-500 mb-1">TOTAL REVENUE</div>
              <div className="text-2xl font-extrabold font-heading text-[#1a0f00]">$142,500.00</div>
              <div className="text-xs text-green-600 font-semibold mt-1">+14.2% from last month</div>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
              <div className="text-xs font-bold text-orange-500 mb-1">CONVERTED LEADS</div>
              <div className="text-2xl font-extrabold font-heading text-[#1a0f00]">82 / 120</div>
              <div className="text-xs text-amber-600 font-semibold mt-1">68% Success Rate</div>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 shadow-sm">
              <div className="text-xs font-bold text-orange-500 mb-1">OPEN TICKETS</div>
              <div className="text-2xl font-extrabold font-heading text-[#1a0f00]">4 Pending</div>
              <div className="text-xs text-red-500 font-semibold mt-1">Avg response time &lt;30m</div>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-white border border-orange-100 shadow-sm text-left">
            <h4 className="text-xs font-bold text-orange-500 tracking-wider mb-3">ACTIVE DEAL STAGES</h4>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between p-2.5 rounded bg-orange-50 text-xs border border-orange-100">
                <span className="font-semibold text-[#1a0f00]">AeroSpace Logistics (Customer Suite)</span>
                <span className="px-2 py-0.5 rounded bg-green-100 text-green-700 font-bold uppercase">Closed Won</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-orange-50 text-xs border border-orange-100">
                <span className="font-semibold text-[#1a0f00]">Vanguard Retail Inc</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 font-bold uppercase">Proposal Stage</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded bg-orange-50 text-xs border border-orange-100">
                <span className="font-semibold text-[#1a0f00]">Cyber Systems Security Setup</span>
                <span className="px-2 py-0.5 rounded bg-red-100 text-red-600 font-bold uppercase">New Lead</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="py-12 sm:py-16 bg-white border-y border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {[["99.9%","Guaranteed Uptime"],["<300ms","Response Time"],["12,000+","Deals Processed"],["500+","Active Customers"]].map(([val, label]) => (
            <div key={label}>
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a0f00] font-heading mb-1">{val}</div>
              <div className="text-xs sm:text-sm text-[#78350f] uppercase font-bold">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="display-md text-gradient mb-4">Engineered for Fast Action</h2>
          <p className="text-[#78350f] font-medium text-base max-w-xl mx-auto">
            Everything you need to automate client accounts, trace proposal requests, and close invoices.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featureData.map((feat, i) => (
            <GlassCard key={i} delay={i * 0.1} className="flex flex-col gap-4 bg-white border border-orange-200 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                {featureIcons[i]}
              </div>
              <h3 className="font-heading font-bold text-lg text-[#1a0f00]">{feat.title}</h3>
              <p className="text-sm text-[#78350f] leading-relaxed">{feat.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="py-16 sm:py-20 bg-white border-t border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="display-md text-gradient mb-4">How the CRM Works</h2>
            <p className="text-[#78350f] font-medium text-base max-w-xl mx-auto">
              From public request to invoice verification — a smooth pipeline flow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {workflowSteps.map((step, i) => (
              <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-3">
                <span className="text-5xl sm:text-6xl font-extrabold text-orange-200 font-heading leading-none">{step.step}</span>
                <h3 className="font-heading font-bold text-xl text-[#1a0f00]">{step.title}</h3>
                <p className="text-sm text-[#78350f] leading-relaxed max-w-xs">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 sm:py-24 px-4 sm:px-8 md:px-12 max-w-5xl mx-auto text-center">
        <div className="mb-10 sm:mb-16">
          <h2 className="display-md text-gradient mb-4 font-heading">Trusted by Global Teams</h2>
        </div>
        <GlassCard className="p-6 sm:p-10 md:p-12 relative flex flex-col items-center gap-6 bg-white border border-orange-200 shadow-md">
          <span className="text-6xl text-orange-200 font-serif leading-none absolute left-6 sm:left-8 top-4 sm:top-6 select-none">&ldquo;</span>
          <p className="text-base sm:text-lg md:text-xl text-[#1a0f00] leading-relaxed font-sans max-w-3xl italic font-medium pt-4">
            This CRM platform changed how we handle invoice payment tracking. We converted three deals within a week of onboarding, and customers love the transparent support ticketing portal!
          </p>
          <div className="mt-2 flex flex-col items-center gap-1">
            <div className="font-heading font-bold text-[#1a0f00]">Sarah Jenkins</div>
            <div className="text-xs text-[#78350f] font-semibold">Director of Operations, AeroSpace Logistics Ltd</div>
          </div>
        </GlassCard>
      </section>

      {/* CTA Banner */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-orange-700 to-orange-500 text-center text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 flex flex-col items-center gap-6 sm:gap-8">
          <h2 className="display-md text-white font-heading">Ready to Streamline Accounts?</h2>
          <p className="text-orange-100 text-sm sm:text-base max-w-lg leading-relaxed font-medium">
            Create your customer account, log tickets, and view quotations. Sign up in less than two minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/register">
              <Button variant="secondary" className="bg-white text-orange-700 border-none hover:bg-orange-50 w-full sm:w-auto">
                Register as Customer
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

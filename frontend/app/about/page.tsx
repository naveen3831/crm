"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Sparkles, Rocket } from "lucide-react";
import Button from "../../components/ui/Button";
import GlassCard from "../../components/ui/GlassCard";

const valueIcons = [
  <Shield key="s" className="text-orange-600" size={24} />,
  <Sparkles key="sp" className="text-amber-500" size={24} />,
  <Rocket key="r" className="text-green-600" size={24} />,
];

const valueData = [
  { title: "Data Security First", description: "Everything, from customer files to invoicing database lines, is fully encrypted and audited." },
  { title: "Premium User Experience", description: "Responsive styling and fast interfaces keep workflows clear and accessible." },
  { title: "Customer Growth Driven", description: "Built to accelerate leads conversion, quotation acceptance, and secure payments." },
];

const team = [
  { name: "Alex Sterling", role: "Lead CRM Architect", initials: "AS" },
  { name: "Marcus Vance", role: "Database Systems Director", initials: "MV" },
  { name: "Elena Rostova", role: "Client Support Executive", initials: "ER" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-8 md:px-12 max-w-7xl mx-auto flex flex-col gap-16 sm:gap-24">
      <section className="text-center max-w-3xl mx-auto flex flex-col gap-5">
        <motion.h1 initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="display-lg text-gradient">
          Building the Ecosystem of Client Success
        </motion.h1>
        <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.5,delay:0.15}} className="text-base sm:text-lg text-[#78350f] leading-relaxed font-sans font-medium">
          Founded on trust and technical excellence, our CRM platform delivers enterprise-level customer relation pipelines, invoicing records, and support ticket automations to teams around the globe.
        </motion.p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
        <div className="flex flex-col gap-5">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-[#1a0f00]">Our Vision</h2>
          <p className="text-sm sm:text-base text-[#78350f] leading-relaxed font-sans">We believe enterprise software should be fast, delightful, and highly secure. Our team built the CRM platform to eliminate clunky spreadsheets, slow pipeline updates, and complex manual billing operations.</p>
          <p className="text-sm sm:text-base text-[#78350f] leading-relaxed font-sans">By combining a high-performance Next.js frontend with Node.js controllers, we guarantee low-latency dashboard speeds, instant search filters, and smooth mobile transitions.</p>
        </div>
        <div className="p-5 sm:p-7 rounded-2xl bg-white border border-orange-200 flex flex-col gap-5 shadow-md">
          <div className="text-sm font-bold text-orange-700 tracking-wider">SYSTEM INTEGRITY FEATURES</div>
          {["Secure JWT Authentication with Token Rotation","Active Audit Logs to Track User Changes","Cloud Database Scalability on MongoDB Atlas"].map(feat => (
            <div key={feat} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 text-xs font-bold shrink-0">✓</div>
              <p className="text-sm text-[#1a0f00] font-semibold">{feat}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8 sm:gap-12">
        <div className="text-center"><h2 className="display-md text-gradient font-heading">Our Core Foundations</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {valueData.map((val, i) => (
            <GlassCard key={i} delay={i*0.1} className="flex flex-col gap-4 bg-white border border-orange-200 shadow-md">
              <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">{valueIcons[i]}</div>
              <h3 className="font-heading font-bold text-lg text-[#1a0f00]">{val.title}</h3>
              <p className="text-sm text-[#78350f] leading-relaxed font-sans">{val.description}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8 sm:gap-12">
        <div className="text-center">
          <h2 className="display-md text-gradient font-heading">Meet the Engineers</h2>
          <p className="text-sm text-[#78350f] font-medium max-w-md mx-auto mt-2">The technical team dedicated to keeping your customer details secure and pipelines running fast.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {team.map((member, i) => (
            <GlassCard key={i} delay={i*0.1} className="flex items-center gap-4 bg-white border border-orange-200 shadow-md">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-700 to-orange-400 flex items-center justify-center text-white font-heading font-bold text-sm shadow-md shrink-0">{member.initials}</div>
              <div>
                <h3 className="font-heading font-bold text-base text-[#1a0f00]">{member.name}</h3>
                <p className="text-xs text-[#78350f] font-semibold font-sans mt-0.5">{member.role}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="p-6 sm:p-10 rounded-2xl bg-white border border-orange-200 shadow-md text-center flex flex-col gap-6 items-center">
        <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#1a0f00]">Technological Framework</h2>
        <div className="flex flex-wrap gap-3 sm:gap-6 justify-center font-heading font-semibold text-sm">
          {["Next.js 14 / React","Node.js / Express","Mongoose / MongoDB Atlas","Tailwind CSS / Motion"].map(t => (
            <span key={t} className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-[#1a0f00] hover:border-orange-500 transition-colors shadow-sm">{t}</span>
          ))}
        </div>
        <Link href="/auth/register" className="mt-2"><Button variant="primary">Create Customer Account</Button></Link>
      </section>
    </div>
  );
}

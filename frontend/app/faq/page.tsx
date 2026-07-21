"use client";

import React, { useState } from "react";
import { Search, HelpCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Accordion from "../../components/ui/Accordion";

const faqData = [
  { category: "General", questions: [
    { title: "What is this CRM?", content: "This CRM is a production-level Customer Relationship Management system built to coordinate sales pipelines, centralize documents, process billing payments, and organize customer support tickets in a unified ecosystem." },
    { title: "Can anyone register an Admin account?", content: "No. Only Customers can register publicly. Admin accounts can only be created by system administrators via secure database seeds or internal command-line utilities." },
  ]},
  { category: "Quotations & Invoicing", questions: [
    { title: "How do customers accept quotations?", content: "When an Admin sends a quotation, the customer can log in to their dashboard, review the line items, and click Accept or Reject. Once accepted, the Admin can convert it into an invoice with a single click." },
    { title: "What payment gateways are supported?", content: "We support Stripe and Razorpay integrations. Customers can clear invoices using Credit/Debit Cards, UPI transfers, or Net Banking directly from the client billing view." },
  ]},
  { category: "Support Tickets", questions: [
    { title: "How does the support ticket system work?", content: "Registered customers can navigate to the Support section, click Raise Ticket, provide details, and upload attachments. Admins are notified instantly and can reply, assign, or mark the ticket as resolved." },
    { title: "Can I receive email notifications for tickets?", content: "Yes. Every ticket state change triggers automated transactional email alerts using our configured SMTP mailer service." },
  ]},
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = faqData
    .map(cat => ({ ...cat, questions: cat.questions.filter(q => q.title.toLowerCase().includes(searchQuery.toLowerCase()) || q.content.toLowerCase().includes(searchQuery.toLowerCase())) }))
    .filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-8 md:px-12 max-w-5xl mx-auto flex flex-col gap-10 sm:gap-12">
      <section className="text-center max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="display-lg text-gradient font-heading">Frequently Asked Questions</h1>
        <p className="text-base text-[#78350f] font-medium font-sans leading-relaxed">
          Quickly search or browse categories to find details regarding pipelines, billing setup, and role configurations.
        </p>
        <div className="relative mt-4 max-w-md mx-auto w-full">
          <input type="text" placeholder="Search FAQs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-orange-200 text-[#1a0f00] font-medium text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-500 shadow-sm" />
          <Search size={18} className="absolute left-4 top-3.5 text-orange-500" />
        </div>
      </section>

      <section className="flex flex-col gap-8 sm:gap-10">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, i) => (
            <div key={i} className="flex flex-col gap-4">
              <h2 className="font-heading font-bold text-base sm:text-lg text-orange-700 border-b-2 border-orange-200 pb-2 uppercase tracking-wider">{cat.category}</h2>
              <Accordion items={cat.questions.map(q => ({ title: q.title, content: q.content }))} />
            </div>
          ))
        ) : (
          <div className="text-center py-16 rounded-2xl bg-white border border-orange-200 shadow-md text-[#78350f]">
            <HelpCircle size={40} className="mx-auto text-orange-400 mb-3" />
            <p className="text-sm font-semibold">No FAQs match your search query.</p>
          </div>
        )}
      </section>

      <section className="rounded-2xl bg-white border border-orange-200 shadow-md p-6 sm:p-8 text-center flex flex-col items-center gap-4">
        <MessageSquare size={28} className="text-orange-600" />
        <h3 className="font-heading font-bold text-lg sm:text-xl text-[#1a0f00]">Still have questions?</h3>
        <p className="text-sm text-[#78350f] font-medium max-w-sm">If you can&apos;t find answers in our FAQs, please contact our team directly.</p>
        <Link href="/contact" className="mt-1"><Button variant="outline" size="sm">Contact Support Desk</Button></Link>
      </section>
    </div>
  );
}

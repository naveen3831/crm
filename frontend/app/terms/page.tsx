"use client";

import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-8 md:px-12 max-w-4xl mx-auto flex flex-col gap-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="display-lg text-gradient font-heading">Terms & Conditions</h1>
        <p className="text-sm text-[#78350f] font-semibold font-sans mt-2">Last Updated: July 21, 2026</p>
      </div>

      <div className="rounded-2xl bg-white border border-orange-200 shadow-md p-6 sm:p-10 flex flex-col gap-7 leading-relaxed font-sans">
        {[
          ["1. Acceptance of Terms", "By creating an account or accessing the CRM, you agree to comply with and be bound by these service conditions, including billing verification terms and support desk usage boundaries."],
          ["2. User Accounts", "Customers are responsible for maintaining the confidentiality of their profile credentials. Any activity taking place under a user profile is the customer's sole responsibility. Admin roles are strictly isolated and locked."],
          ["3. Quotations & Billing Rules", "Quotations sent by administrators are proposals and remain valid for the period specified. Acceptance of a quotation creates a binding invoice. Invoices must be cleared by the due dates via our designated Stripe/Razorpay endpoints."],
          ["4. Support Desk & Fair Use", "Customers may use the support ticketing tool to report service issues. Abusive language, uploading malicious payloads, or spamming ticket comments may lead to immediate profile suspension or deletion."],
        ].map(([title, content]) => (
          <div key={title}>
            <h2 className="font-heading font-bold text-lg sm:text-xl text-[#1a0f00] mb-3">{title}</h2>
            <p className="text-sm sm:text-base text-[#78350f]">{content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-10 sm:py-16 px-4 sm:px-8 md:px-12 max-w-4xl mx-auto flex flex-col gap-10">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="display-lg text-gradient font-heading">Privacy Policy</h1>
        <p className="text-sm text-[#78350f] font-semibold font-sans mt-2">Last Updated: July 21, 2026</p>
      </div>

      <div className="rounded-2xl bg-white border border-orange-200 shadow-md p-6 sm:p-10 flex flex-col gap-7 leading-relaxed font-sans">
        {[
          ["1. Information We Collect", "When you register as a Customer on the CRM, we collect your Full Name, Email Address, Contact Number, Company Name, and GST details where applicable. We also collect transactional and billing records when invoices are created or cleared."],
          ["2. How We Protect Your Data", "We deploy multiple layers of server protection, including Secure HTTP-only cookies, JSON Web Token (JWT) verification, rate limiting, and password hashing using bcrypt. All sensitive credentials and database links are stored in safe environment variables."],
          ["3. Third-Party Services", "We process payments online using integrated gateways, specifically Stripe and Razorpay. These platforms adhere to strict PCI-DSS standards. We do not store credit card or bank credentials directly on our MongoDB Atlas cluster database."],
          ["4. Your Data Rights", "Under local privacy laws, you retain rights to request access to your profile logs, correct incorrect company details, retrieve payment summaries, or close your customer profile by submitting a ticket to the admin desk."],
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

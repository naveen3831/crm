"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";

interface Quote {
  id: string;
  title: string;
  value: number;
  status: "pending" | "accepted" | "rejected";
}

export default function CustomerQuotations() {
  const [quotes, setQuotes] = useState<Quote[]>([
    { id: "Q-9082", title: "Enterprise Database Migration & Setup", value: 4500.0, status: "pending" },
    { id: "Q-9041", title: "Monthly Managed IT Support Retainer", value: 1200.0, status: "accepted" },
  ]);

  const handleAcceptQuote = (quoteId: string) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: "accepted" } : q));
  };

  const handleRejectQuote = (quoteId: string) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: "rejected" } : q));
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading font-bold text-xl text-navy-950">My Quotations</h2>
      <div className="flex flex-col gap-4">
        {quotes.map((q) => (
          <div key={q.id} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 text-xs">
              <span className="text-[10px] font-mono font-semibold text-blue-600">QUOTE ID: {q.id}</span>
              <h4 className="font-heading font-bold text-sm text-navy-950 mt-1">{q.title}</h4>
              <span className="text-gray-500 mt-0.5">Proposed Value: <strong className="text-navy-950">${q.value.toFixed(2)}</strong> (tax inclusive)</span>
            </div>
            <div className="flex items-center gap-3">
              {q.status === "pending" && (
                <>
                  <Button onClick={() => handleAcceptQuote(q.id)} variant="primary" size="sm">
                    Accept
                  </Button>
                  <Button onClick={() => handleRejectQuote(q.id)} variant="secondary" size="sm">
                    Reject
                  </Button>
                </>
              )}
              {q.status === "accepted" && (
                <span className="px-3 py-1 rounded bg-green-50 border border-green-200 text-green-600 font-bold uppercase text-[10px]">
                  Accepted
                </span>
              )}
              {q.status === "rejected" && (
                <span className="px-3 py-1 rounded bg-red-50 border border-red-200 text-red-600 font-bold uppercase text-[10px]">
                  Rejected
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import { CheckCircle } from "lucide-react";

interface TicketData {
  id: string;
  subject: string;
  client: string;
  severity: "high" | "medium" | "low";
  status: "open" | "resolved";
}

export default function AdminTickets() {
  const [tickets, setTickets] = useState<TicketData[]>([
    { id: "T-402", subject: "SMTP Configuration failing on seed logs", client: "Acme Corporation", severity: "high", status: "open" },
    { id: "T-401", subject: "Card payment failed on Stripe endpoint", client: "Vanguard Retail Inc", severity: "medium", status: "resolved" },
    { id: "T-400", subject: "Requesting API documentation details", client: "AeroSpace Logistics", severity: "low", status: "open" },
  ]);

  const resolveTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: "resolved" } : t));
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading font-bold text-xl text-navy-950">Support Ticket Center</h2>
      <div className="flex flex-col gap-4">
        {tickets.map((t) => (
          <div key={t.id} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono bg-red-50 text-red-600 px-2 py-0.5 rounded font-semibold">{t.id}</span>
                <h4 className="font-heading font-bold text-sm text-navy-950">{t.subject}</h4>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                  t.severity === "high" ? "bg-red-100 text-red-600" :
                  t.severity === "medium" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                }`}>
                  {t.severity} severity
                </span>
              </div>
              <div className="flex gap-4 text-gray-500 mt-1">
                <span>Submitted by: <strong className="text-gray-700">{t.client}</strong></span>
                <span>Ticket status: <strong className={t.status === "open" ? "text-amber-600 font-semibold" : "text-green-600 font-semibold"}>{t.status}</strong></span>
              </div>
            </div>
            <div>
              {t.status === "open" ? (
                <Button onClick={() => resolveTicket(t.id)} variant="primary" size="sm" className="gap-1 flex items-center">
                  <CheckCircle size={14} /> Resolve Ticket
                </Button>
              ) : (
                <span className="px-3 py-1 rounded bg-green-50 border border-green-200 text-green-600 font-bold uppercase text-xs">Resolved</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

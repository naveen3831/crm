"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import GlassCard from "../../../components/ui/GlassCard";

interface Ticket {
  id: string;
  subject: string;
  date: string;
  status: "resolved" | "closed" | "open";
}

export default function CustomerTickets() {
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketBody, setTicketBody] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState(false);

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "#1040", subject: "Invoice Dispute", date: "June 24, 2026", status: "resolved" },
    { id: "#0921", subject: "Portal Access Restrict", date: "May 12, 2026", status: "closed" },
  ]);

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketBody.trim()) return;

    // Append to list
    const newTicket: Ticket = {
      id: `#${Math.floor(1000 + Math.random() * 9000)}`,
      subject: ticketSubject,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      status: "open",
    };

    setTickets(prev => [newTicket, ...prev]);
    setTicketSuccess(true);
    setTicketSubject("");
    setTicketBody("");

    setTimeout(() => {
      setTicketSuccess(false);
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Ticket form */}
      <GlassCard className="lg:col-span-2 p-6 bg-white/50 border border-gray-200">
        <h3 className="font-heading font-bold text-base text-navy-950 mb-6">Raise Support Ticket</h3>
        <form onSubmit={handleRaiseTicket} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject / Ticket Title *</label>
            <input 
              type="text" 
              required
              placeholder="Short description of the technical issue"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-xs text-navy-950 placeholder:text-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Ticket Description *</label>
            <textarea 
              required
              rows={4}
              placeholder="Provide details regarding steps to reproduce or invoices related..."
              value={ticketBody}
              onChange={(e) => setTicketBody(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-xs text-navy-950 placeholder:text-gray-400 focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          {ticketSuccess && (
            <div className="text-[11px] text-green-600 bg-green-50 border border-green-200 p-2.5 rounded-xl font-medium">
              Ticket submitted successfully! Support staff will contact you shortly.
            </div>
          )}

          <Button type="submit" variant="primary" className="w-full mt-2">
            Submit Ticket
          </Button>
        </form>
      </GlassCard>

      {/* Ticket log */}
      <div className="flex flex-col gap-4">
        <h3 className="font-heading font-bold text-sm text-navy-950 px-2 uppercase tracking-wide">My Ticket Logs</h3>
        {tickets.map((t) => (
          <div key={t.id} className="p-4 rounded-xl bg-white border border-gray-250 shadow-sm flex items-center justify-between text-xs gap-3">
            <div>
              <h4 className="font-bold text-navy-950">{t.id}: {t.subject}</h4>
              <span className="text-[10px] text-gray-400 mt-1 block">Submitted: {t.date}</span>
            </div>
            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
              t.status === "resolved" ? "bg-green-50 text-green-600" :
              t.status === "open" ? "bg-amber-50 text-amber-600" : "bg-gray-100 text-gray-500"
            }`}>
              {t.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

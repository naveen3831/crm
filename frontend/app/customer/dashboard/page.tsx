"use client";

import React, { useState } from "react";
import { 
  FileText, 
  CreditCard, 
  TicketCheck, 
  DollarSign, 
  AlertCircle, 
  LogOut, 
  Check 
} from "lucide-react";
import GlassCard from "../../../components/ui/GlassCard";
import Button from "../../../components/ui/Button";

interface Quote {
  id: string;
  title: string;
  value: number;
  status: "pending" | "accepted" | "rejected";
}

interface Invoice {
  id: string;
  title: string;
  value: number;
  due: string;
  status: "paid" | "pending";
}

interface Ticket {
  id: string;
  subject: string;
  date: string;
  status: "resolved" | "closed" | "open";
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // Sidebar links definition
  const sidebarLinks = [
    { name: "My Dashboard", id: "overview", icon: <FileText size={18} /> },
    { name: "My Quotations", id: "quotations", icon: <FileText size={18} /> },
    { name: "Invoices & Payments", id: "billing", icon: <CreditCard size={18} /> },
    { name: "Support Ticket Desk", id: "support", icon: <TicketCheck size={18} /> },
  ];

  // States
  const [quotes, setQuotes] = useState<Quote[]>([
    { id: "Q-9082", title: "Enterprise Database Migration & Setup", value: 4500.0, status: "pending" },
    { id: "Q-9041", title: "Monthly Managed IT Support Retainer", value: 1200.0, status: "accepted" },
  ]);

  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-1024", title: "Setup Fee & Initial Migration Setup", value: 4500, due: "July 30, 2026", status: "pending" },
    { id: "INV-0982", title: "Consulting Retainer - June 2026", value: 1200, due: "June 30, 2026", status: "paid" },
  ]);

  const [tickets, setTickets] = useState<Ticket[]>([
    { id: "#1040", subject: "Invoice Dispute", date: "June 24, 2026", status: "resolved" },
    { id: "#0921", subject: "Portal Access Restrict", date: "May 12, 2026", status: "closed" },
  ]);

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketBody, setTicketBody] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Stripe Mock payment states
  const [showPayModal, setShowPayModal] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Handlers
  const handleAcceptQuote = (quoteId: string) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: "accepted" } : q));
  };

  const handleRejectQuote = (quoteId: string) => {
    setQuotes(prev => prev.map(q => q.id === quoteId ? { ...q, status: "rejected" } : q));
  };

  const triggerPayment = (invoice: Invoice) => {
    setPayingInvoice(invoice);
    setPaymentSuccess(false);
    setShowPayModal(true);
  };

  const executeMockPayment = async () => {
    if (!payingInvoice) return;
    setIsPaying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPaying(false);
    setPaymentSuccess(true);
    
    // Update local invoice state
    setInvoices(prev => prev.map(inv => inv.id === payingInvoice.id ? { ...inv, status: "paid" } : inv));
    
    setTimeout(() => {
      setShowPayModal(false);
      setPayingInvoice(null);
    }, 2000);
  };

  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketBody.trim()) return;

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

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
      {/* 1. Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-between shrink-0 p-6">
        <div className="flex flex-col gap-8">
          {/* Logo brand */}
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-700/10 to-blue-500/5 border border-orange-500/10 flex items-center justify-center p-1 text-[#1a0f00]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full text-[#1a0f00]">
                <path d="M 40,95 C 40,55 160,55 160,95" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
                <rect x="62" y="70" width="18" height="50" rx="3" fill="#EE4047" />
                <rect x="86" y="50" width="18" height="70" rx="3" fill="#FF9F0A" />
                <rect x="110" y="30" width="18" height="90" rx="3" fill="#27C15A" />
                <ellipse cx="100" cy="100" rx="48" ry="29" stroke="currentColor" strokeWidth="10" transform="rotate(-15, 100, 100)" />
                <path d="M 40,95 C 40,135 160,135 160,95" stroke="#f97316" strokeWidth="8" strokeLinecap="round" />
                <path d="M 75,122 L 35,167" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-base text-[#1a0f00] tracking-tight">
              CRM Client
            </span>
          </div>

          <nav className="flex flex-col gap-1.5">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold font-heading transition-all ${
                  activeTab === link.id
                    ? "bg-orange-600 text-white shadow-md shadow-orange-500/15"
                    : "text-gray-500 hover:text-[#1a0f00] hover:bg-gray-100"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex flex-col gap-4 mt-8 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-xs">
              JD
            </div>
            <div>
              <div className="text-xs font-bold text-[#1a0f00] leading-none">John Doe</div>
              <div className="text-[10px] text-gray-500 mt-1">Acme Corporation</div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Content */}
      <main className="flex-1 p-6 md:p-10 flex flex-col gap-8 overflow-y-auto">
        <header className="border-b border-gray-200 pb-4">
          <h1 className="font-heading font-extrabold text-2xl text-[#1a0f00]">Customer Space</h1>
          <p className="text-xs text-gray-500 mt-1 font-sans">Profile Company: Acme Corp (GST Active)</p>
        </header>

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-1">
                <FileText className="text-orange-600 mb-2" size={20} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active Quotations</span>
                <span className="text-2xl font-extrabold text-[#1a0f00] font-heading">1</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-1">
                <CreditCard className="text-orange-500 mb-2" size={20} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Unpaid Invoices</span>
                <span className="text-2xl font-extrabold text-[#1a0f00] font-heading">1</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-1">
                <TicketCheck className="text-amber-500 mb-2" size={20} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Open Support Tickets</span>
                <span className="text-2xl font-extrabold text-[#1a0f00] font-heading">1</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col gap-1">
                <DollarSign className="text-green-500 mb-2" size={20} />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Paid</span>
                <span className="text-2xl font-extrabold text-[#1a0f00] font-heading">$1,200</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <GlassCard className="p-6 bg-white/50 border border-gray-200">
                <h3 className="font-heading font-bold text-base text-[#1a0f00] mb-4">Pending Bills Summary</h3>
                <div className="flex flex-col gap-3">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-100 text-xs">
                      <div>
                        <div className="font-bold text-[#1a0f00]">{inv.title}</div>
                        <span className="text-gray-400 text-[10px] mt-1 block">Due: {inv.due}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[#1a0f00]">${inv.value}</span>
                        {inv.status === "paid" ? (
                          <span className="px-2 py-0.5 rounded bg-green-50 text-green-600 font-bold uppercase text-[9px]">Paid</span>
                        ) : (
                          <span className="px-2.5 py-1 rounded bg-pipeline-red-100 text-pipeline-red-550 font-semibold text-[10px]">Unpaid</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-6 bg-white/50 border border-gray-200 flex flex-col gap-4">
                <h3 className="font-heading font-bold text-base text-[#1a0f00]">Active Notifications</h3>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100 text-xs">
                  <AlertCircle className="text-orange-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Admin Operator sent Quotation **Q-9082** for approval. Please accept to proceed with billing.
                  </p>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-green-50 border border-green-100 text-xs">
                  <AlertCircle className="text-green-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-gray-700 font-medium leading-relaxed">
                    Ticket **#1040** (Invoice dispute review) was resolved by support staff.
                  </p>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* Tab 2: Quotations */}
        {activeTab === "quotations" && (
          <div className="flex flex-col gap-6">
            <h2 className="font-heading font-bold text-xl text-[#1a0f00]">My Quotations</h2>
            <div className="flex flex-col gap-4">
              {quotes.map((q) => (
                <div key={q.id} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-[10px] font-mono font-semibold text-orange-600">QUOTE ID: {q.id}</span>
                    <h4 className="font-heading font-bold text-sm text-[#1a0f00] mt-1">{q.title}</h4>
                    <span className="text-gray-500 mt-0.5">Proposed Value: <strong className="text-[#1a0f00]">${q.value.toFixed(2)}</strong> (tax inclusive)</span>
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
        )}

        {/* Tab 3: Billing / Invoices */}
        {activeTab === "billing" && (
          <div className="flex flex-col gap-6">
            <h2 className="font-heading font-bold text-xl text-[#1a0f00]">Invoices & Payments</h2>
            <div className="flex flex-col gap-4">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex flex-col gap-1 text-xs">
                    <span className="text-[10px] font-mono font-semibold text-orange-600">INVOICE ID: {inv.id}</span>
                    <h4 className="font-heading font-bold text-sm text-[#1a0f00] mt-1">{inv.title}</h4>
                    <span className="text-gray-500 mt-0.5">Value: <strong className="text-[#1a0f00]">${inv.value}</strong> &bull; Due: {inv.due}</span>
                  </div>
                  <div>
                    {inv.status === "paid" ? (
                      <span className="px-3 py-1 rounded bg-green-50 border border-green-200 text-green-600 font-bold uppercase text-[10px]">
                        Paid
                      </span>
                    ) : (
                      <Button onClick={() => triggerPayment(inv)} variant="primary" size="sm">
                        Pay Online
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Support */}
        {activeTab === "support" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <GlassCard className="lg:col-span-2 p-6 bg-white/50 border border-gray-200">
              <h3 className="font-heading font-bold text-base text-[#1a0f00] mb-6">Raise Support Ticket</h3>
              <form onSubmit={handleRaiseTicket} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subject / Ticket Title *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Short description of the technical issue"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-xs text-[#1a0f00] placeholder:text-gray-400 focus:outline-none focus:border-orange-500"
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
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-white text-xs text-[#1a0f00] placeholder:text-gray-400 focus:outline-none focus:border-orange-500 resize-none"
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

            <div className="flex flex-col gap-4">
              <h3 className="font-heading font-bold text-sm text-[#1a0f00] px-2 uppercase tracking-wide">My Ticket Logs</h3>
              {tickets.map((t) => (
                <div key={t.id} className="p-4 rounded-xl bg-white border border-gray-250 shadow-sm flex items-center justify-between text-xs gap-3">
                  <div>
                    <h4 className="font-bold text-[#1a0f00]">{t.id}: {t.subject}</h4>
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
        )}
      </main>

      {/* Stripe checkout payment modal */}
      {showPayModal && payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-md p-6 bg-white/95 border border-gray-200 shadow-elevated flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-heading font-extrabold text-[#1a0f00] text-base">Secure Gateway Checkout</h3>
              <button 
                onClick={() => !isPaying && setShowPayModal(false)}
                className="text-gray-400 hover:text-[#1a0f00] transition-colors text-lg"
              >
                &times;
              </button>
            </div>
            
            {paymentSuccess ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600">
                  <Check size={24} />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-[#1a0f00] text-sm">Payment Successful!</h4>
                  <p className="text-xs text-gray-500 mt-1">Invoice {payingInvoice.id} was marked as Paid.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-1 text-xs">
                  <span className="text-gray-400">Total Invoice Value:</span>
                  <span className="text-[#1a0f00] font-extrabold text-base">${payingInvoice.value.toLocaleString()}.00 USD</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4242 4242 4242 4242" 
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-100/50 text-xs text-[#1a0f00] focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="12 / 29" 
                        disabled
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-100/50 text-xs text-[#1a0f00] focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CVC</label>
                      <input 
                        type="text" 
                        placeholder="***" 
                        disabled
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-100/50 text-xs text-[#1a0f00] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={executeMockPayment}
                  disabled={isPaying} 
                  variant="primary"
                  className="w-full mt-2"
                >
                  {isPaying ? "Processing..." : `Pay $${payingInvoice.value.toLocaleString()}.00`}
                </Button>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}


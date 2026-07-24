"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  CreditCard, 
  TicketCheck, 
  DollarSign, 
  AlertCircle, 
  LogOut, 
  Check,
  Plus,
  Loader2
} from "lucide-react";
import GlassCard from "../../../components/ui/GlassCard";
import Button from "../../../components/ui/Button";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface Quote {
  id: string;
  number?: string;
  title?: string;
  clientName?: string;
  items?: string;
  value?: number;
  total?: number;
  status: "pending" | "accepted" | "rejected" | "Approved" | "Pending Approval";
}

interface Invoice {
  id: string;
  title?: string;
  clientName?: string;
  value?: number;
  amount?: number;
  due?: string;
  dueDate?: string;
  status: "paid" | "pending" | "Paid" | "Unpaid";
}

interface Ticket {
  id: string;
  subject: string;
  date: string;
  status: "resolved" | "closed" | "open";
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // States
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketBody, setTicketBody] = useState("");
  const [ticketSuccess, setTicketSuccess] = useState(false);

  // Stripe Mock payment states
  const [showPayModal, setShowPayModal] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      window.location.href = "/auth/login";
      return;
    }
    try {
      const parsed = JSON.parse(savedUser);
      if (parsed.role === "admin") {
        window.location.href = "/admin/dashboard";
        return;
      }
      setCurrentUser(parsed);
    } catch {
      window.location.href = "/auth/login";
      return;
    }
    loadCustomerData();
  }, []);

  // Fetch real-time DB data
  const loadCustomerData = async () => {
    try {
      setIsLoading(true);
      const [resQ, resInv, resT] = await Promise.all([
        fetch(`${API_URL}/crm/quotation`).then((r) => r.json()),
        fetch(`${API_URL}/crm/invoice`).then((r) => r.json()),
        fetch(`${API_URL}/crm/ticket`).then((r) => r.json()),
      ]);

      if (resQ.success) setQuotes(resQ.data || []);
      if (resInv.success) setInvoices(resInv.data || []);
      if (resT.success) setTickets(resT.data || []);
    } catch (err) {
      console.error("[Customer DB Load Error]", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Sidebar links definition
  const sidebarLinks = [
    { name: "My Dashboard", id: "overview", icon: <FileText size={18} /> },
    { name: "My Quotations", id: "quotations", icon: <FileText size={18} /> },
    { name: "Invoices & Payments", id: "billing", icon: <CreditCard size={18} /> },
    { name: "Support Ticket Desk", id: "support", icon: <TicketCheck size={18} /> },
  ];

  // Handlers for Quote Actions
  const handleAcceptQuote = async (quoteId: string) => {
    try {
      await fetch(`${API_URL}/crm/quotation/${quoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
      setQuotes((prev) => prev.map((q) => (q.id === quoteId || q.number === quoteId ? { ...q, status: "accepted" } : q)));
    } catch {}
  };

  const handleRejectQuote = async (quoteId: string) => {
    try {
      await fetch(`${API_URL}/crm/quotation/${quoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected" }),
      });
      setQuotes((prev) => prev.map((q) => (q.id === quoteId || q.number === quoteId ? { ...q, status: "rejected" } : q)));
    } catch {}
  };

  const triggerPayment = (invoice: Invoice) => {
    setPayingInvoice(invoice);
    setPaymentSuccess(false);
    setShowPayModal(true);
  };

  const executeMockPayment = async () => {
    if (!payingInvoice) return;
    setIsPaying(true);
    try {
      const invId = payingInvoice.id;
      await fetch(`${API_URL}/crm/invoice/${invId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "paid" }),
      });

      await fetch(`${API_URL}/crm/payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: currentUser?.name || payingInvoice.clientName || "Customer",
          amount: payingInvoice.value || payingInvoice.amount || 0,
          gateway: "Stripe",
          date: new Date().toISOString().split("T")[0],
        }),
      });

      setIsPaying(false);
      setPaymentSuccess(true);
      
      setInvoices((prev) => prev.map((inv) => (inv.id === invId ? { ...inv, status: "paid" } : inv)));
      
      setTimeout(() => {
        setShowPayModal(false);
        setPayingInvoice(null);
      }, 1500);
    } catch {
      setIsPaying(false);
    }
  };

  const handleRaiseTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketBody.trim()) return;

    const newCustomId = `#TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const ticketPayload = {
      id: newCustomId,
      subject: ticketSubject,
      message: ticketBody,
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      status: "open",
      userEmail: currentUser?.email || "customer@crm.com",
      userName: currentUser?.name || "Customer Account",
    };

    try {
      // Save ticket into CRM collection so Admin can view it
      await fetch(`${API_URL}/crm/ticket`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketPayload),
      });

      // Also submit to enquiries endpoint
      await fetch(`${API_URL}/enquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: currentUser?.name || "Customer Account",
          email: currentUser?.email || "customer@crm.com",
          subject: ticketSubject,
          message: ticketBody,
          consent: true,
        }),
      });

      setTickets((prev) => [ticketPayload, ...prev]);
      setTicketSuccess(true);
      setTicketSubject("");
      setTicketBody("");

      setTimeout(() => {
        setTicketSuccess(false);
      }, 4000);
    } catch (err) {
      console.error("[Create Ticket Error]", err);
    }
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
            <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center p-1.5 shadow-sm">
              <img src="/logo-icon.svg" alt="CRM Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base text-[#1a0f00] tracking-tight block leading-none">
                Client Portal
              </span>
              <span className="text-[10px] text-orange-600 font-medium font-sans">
                {currentUser?.email || "customer@crm.com"}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === link.id
                    ? "bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md shadow-orange-500/20"
                    : "text-gray-600 hover:text-[#1a0f00] hover:bg-orange-50/50"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-gray-100 flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
            <span>Status: <span className="text-green-600 font-bold">Active</span></span>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-center gap-2 py-2 text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            <LogOut size={14} /> Log Out
          </Button>
        </div>
      </aside>

      {/* 2. Main Content Viewport */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-6xl mx-auto w-full">
        {isLoading && (
          <div className="mb-4 flex items-center gap-2 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 p-2.5 rounded-xl">
            <Loader2 size={14} className="animate-spin" /> Syncing with MongoDB live database...
          </div>
        )}

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === "overview" && (
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-2xl font-heading font-extrabold text-[#1a0f00]">Welcome Back, {currentUser?.name || "Client"}</h1>
              <p className="text-sm text-gray-600 font-sans mt-1">Here is a quick summary of your live account activities and records.</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <GlassCard className="p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
                  <span>Quotations</span>
                  <FileText size={18} className="text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-[#1a0f00]">{quotes.length}</div>
                <div className="text-xs text-gray-600">Active quotations in MongoDB</div>
              </GlassCard>

              <GlassCard className="p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
                  <span>Invoices</span>
                  <CreditCard size={18} className="text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-[#1a0f00]">{invoices.length}</div>
                <div className="text-xs text-gray-600">Total invoices generated</div>
              </GlassCard>

              <GlassCard className="p-5 flex flex-col gap-2">
                <div className="flex items-center justify-between text-gray-500 text-xs font-semibold uppercase">
                  <span>Support Tickets</span>
                  <TicketCheck size={18} className="text-orange-500" />
                </div>
                <div className="text-2xl font-bold text-[#1a0f00]">{tickets.length}</div>
                <div className="text-xs text-gray-600">Tickets logged in system</div>
              </GlassCard>
            </div>

            {/* Recent Ticket Activity */}
            <GlassCard className="p-6">
              <h2 className="font-heading font-bold text-lg text-[#1a0f00] mb-4">Live Support Tickets</h2>
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500 font-medium border border-dashed border-gray-200 rounded-xl">
                  No support tickets found in database. Create a new ticket under the Support Desk tab.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="border-b border-gray-200 text-gray-600 uppercase">
                      <tr>
                        <th className="pb-3">Ticket ID</th>
                        <th className="pb-3">Subject</th>
                        <th className="pb-3">Logged Date</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {tickets.map((t) => (
                        <tr key={t.id} className="hover:bg-orange-50/30">
                          <td className="py-3 font-mono font-bold text-orange-600">{t.id}</td>
                          <td className="py-3 font-semibold text-gray-800">{t.subject}</td>
                          <td className="py-3 text-gray-500">{t.date}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              t.status === "open" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                            }`}>
                              {t.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* TAB 2: MY QUOTATIONS */}
        {activeTab === "quotations" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-heading font-extrabold text-[#1a0f00]">My Quotations</h1>
              <p className="text-sm text-gray-600 font-sans mt-1">Review proposals and quotations issued by our enterprise delivery team.</p>
            </div>

            {quotes.length === 0 ? (
              <GlassCard className="p-10 text-center text-sm text-gray-500 font-medium border border-dashed border-gray-200 rounded-2xl">
                No quotations issued yet. Contact admin to generate a custom proposal.
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {quotes.map((q) => (
                  <GlassCard key={q.id || q.number} className="p-6 flex flex-col justify-between gap-4 border border-orange-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-orange-600 uppercase">{q.id || q.number}</span>
                        <h3 className="font-bold text-base text-[#1a0f00] mt-1">{q.title || q.items || "Enterprise Quote Proposal"}</h3>
                        <p className="text-xs text-gray-500 mt-1">Client: {q.clientName || currentUser?.name || "Client"}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        q.status === "accepted" || q.status === "Approved" ? "bg-green-100 text-green-700" :
                        q.status === "rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {q.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-600 uppercase font-semibold block">Total Estimate</span>
                        <span className="text-xl font-extrabold text-[#1a0f00]">${(q.value || q.total || 0).toLocaleString()}</span>
                      </div>

                      {(q.status === "pending" || q.status === "Pending Approval") && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAcceptQuote(q.id || q.number || "")}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleRejectQuote(q.id || q.number || "")}
                            className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INVOICES & PAYMENTS */}
        {activeTab === "billing" && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-heading font-extrabold text-[#1a0f00]">Invoices & Billing</h1>
              <p className="text-sm text-gray-600 font-sans mt-1">Manage active billing statements and make secure online card payments.</p>
            </div>

            {invoices.length === 0 ? (
              <GlassCard className="p-10 text-center text-sm text-gray-500 font-medium border border-dashed border-gray-200 rounded-2xl">
                No invoices found in database.
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {invoices.map((inv) => (
                  <GlassCard key={inv.id} className="p-6 flex flex-col justify-between gap-4 border border-orange-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-mono font-bold text-orange-600 uppercase">{inv.id}</span>
                        <h3 className="font-bold text-base text-[#1a0f00] mt-1">{inv.title || "Services Invoice"}</h3>
                        <p className="text-xs text-gray-500 mt-1">Due: {inv.due || inv.dueDate || "N/A"}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                        inv.status === "paid" || inv.status === "Paid" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}>
                        {inv.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-[10px] text-gray-600 uppercase font-semibold block">Amount Due</span>
                        <span className="text-xl font-extrabold text-[#1a0f00]">${(inv.value || inv.amount || 0).toLocaleString()}</span>
                      </div>

                      {(inv.status === "pending" || inv.status === "Unpaid") && (
                        <button
                          onClick={() => triggerPayment(inv)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition-colors shadow-md"
                        >
                          Pay Invoice
                        </button>
                      )}
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SUPPORT TICKET DESK */}
        {activeTab === "support" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <h1 className="text-2xl font-heading font-extrabold text-[#1a0f00]">Support Ticket Desk</h1>
                <p className="text-sm text-gray-600 font-sans mt-1">Submit technical tickets or inquiry requests to the corporate support team.</p>
              </div>

              <GlassCard className="p-6">
                {ticketSuccess && (
                  <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-400 text-xs font-semibold text-green-700 flex items-center gap-2">
                    <Check size={16} /> Support ticket created and saved to MongoDB! Admin team will review shortly.
                  </div>
                )}

                <form onSubmit={handleRaiseTicket} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-orange-700 uppercase">Ticket Subject *</label>
                    <input
                      type="text"
                      placeholder="e.g., Portal Access or Invoice Inquiry"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-orange-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-orange-700 uppercase">Message Details *</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your request or issue..."
                      value={ticketBody}
                      onChange={(e) => setTicketBody(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-orange-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-300"
                    />
                  </div>

                  <Button type="submit" variant="primary" className="py-3 text-xs font-bold mt-2">
                    Submit Support Ticket
                  </Button>
                </form>
              </GlassCard>
            </div>

            {/* Support Information sidebar */}
            <div className="flex flex-col gap-5">
              <GlassCard className="p-6">
                <h3 className="font-bold text-base text-[#1a0f00] mb-2">Corporate Support Info</h3>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Tickets logged in this client desk are stored directly in MongoDB and processed in real time by our corporate admin team.
                </p>
                <div className="text-xs font-semibold text-gray-700 flex flex-col gap-2 pt-2 border-t border-gray-100">
                  <div>• Email: <span className="text-orange-600">support@crm.com</span></div>
                  <div>• Support Hours: 24/7 Priority SLA</div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

      </main>

      {/* STRIPE PAYMENT MODAL */}
      {showPayModal && payingInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-orange-200 flex flex-col gap-5">
            <h3 className="font-heading font-extrabold text-xl text-[#1a0f00]">Secure Online Payment</h3>
            <p className="text-xs text-gray-600 font-sans">
              Paying Invoice <span className="font-mono font-bold text-orange-600">{payingInvoice.id}</span>
            </p>

            <div className="p-4 bg-orange-50 rounded-xl border border-orange-200 text-center">
              <span className="text-xs text-gray-600 uppercase font-bold block">Total Amount</span>
              <span className="text-2xl font-extrabold text-[#1a0f00]">${(payingInvoice.value || payingInvoice.amount || 0).toLocaleString()}</span>
            </div>

            {paymentSuccess ? (
              <div className="p-4 bg-green-50 border border-green-400 text-green-700 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-2">
                <Check size={16} /> Payment Processed & Logged to Database!
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Card Number (•••• •••• •••• ••••)"
                  className="w-full px-4 py-2.5 rounded-xl border border-orange-200 text-xs font-medium focus:outline-none"
                  defaultValue="4242 •••• •••• 4242"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="MM/YY" className="w-full px-4 py-2.5 rounded-xl border border-orange-200 text-xs font-medium" defaultValue="12/28" />
                  <input type="text" placeholder="CVC" className="w-full px-4 py-2.5 rounded-xl border border-orange-200 text-xs font-medium" defaultValue="123" />
                </div>
                <Button
                  onClick={executeMockPayment}
                  disabled={isPaying}
                  variant="primary"
                  className="w-full py-3 mt-2 text-xs font-bold"
                >
                  {isPaying ? "Processing Payment..." : "Confirm & Pay Now"}
                </Button>
                <button
                  onClick={() => setShowPayModal(false)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-800 text-center pt-1"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

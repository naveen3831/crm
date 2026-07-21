"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import GlassCard from "../../../components/ui/GlassCard";
import { Check } from "lucide-react";

interface Invoice {
  id: string;
  title: string;
  value: number;
  due: string;
  status: "paid" | "pending";
}

export default function CustomerInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: "INV-1024", title: "Setup Fee & Initial Migration Setup", value: 4500, due: "July 30, 2026", status: "pending" },
    { id: "INV-0982", title: "Consulting Retainer - June 2026", value: 1200, due: "June 30, 2026", status: "paid" },
  ]);

  const [showPayModal, setShowPayModal] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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
    
    // Update local invoice state to Paid
    setInvoices(prev => prev.map(inv => inv.id === payingInvoice.id ? { ...inv, status: "paid" } : inv));
    
    setTimeout(() => {
      setShowPayModal(false);
      setPayingInvoice(null);
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading font-bold text-xl text-navy-950">Invoices & Payments</h2>
      <div className="flex flex-col gap-4">
        {invoices.map((inv) => (
          <div key={inv.id} className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-1 text-xs">
              <span className="text-[10px] font-mono font-semibold text-blue-600">INVOICE ID: {inv.id}</span>
              <h4 className="font-heading font-bold text-sm text-navy-950 mt-1">{inv.title}</h4>
              <span className="text-gray-500 mt-0.5">Value: <strong className="text-navy-950">${inv.value}</strong> &bull; Due: {inv.due}</span>
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

      {/* Stripe Modal Overlay */}
      {showPayModal && payingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/40 backdrop-blur-sm p-4">
          <GlassCard className="w-full max-w-md p-6 bg-white/95 border border-gray-200 shadow-elevated flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-heading font-extrabold text-navy-950 text-base">Secure Gateway Checkout</h3>
              <button 
                onClick={() => !isPaying && setShowPayModal(false)}
                className="text-gray-400 hover:text-navy-950 transition-colors text-lg"
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
                  <h4 className="font-heading font-extrabold text-navy-950 text-sm">Payment Successful!</h4>
                  <p className="text-xs text-gray-500 mt-1">Invoice {payingInvoice.id} was marked as Paid.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col gap-1 text-xs">
                  <span className="text-gray-400">Total Invoice Value:</span>
                  <span className="text-navy-950 font-extrabold text-base">${payingInvoice.value.toLocaleString()}.00 USD</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Card Number</label>
                    <input 
                      type="text" 
                      placeholder="4242 4242 4242 4242" 
                      disabled
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-100/50 text-xs text-navy-950 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="12 / 29" 
                        disabled
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-100/50 text-xs text-navy-950 focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CVC</label>
                      <input 
                        type="text" 
                        placeholder="***" 
                        disabled
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-gray-100/50 text-xs text-navy-950 focus:outline-none"
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

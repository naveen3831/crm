"use client";

import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import { Plus } from "lucide-react";

interface InvoiceData {
  id: string;
  client: string;
  value: number;
  due: string;
  status: "paid" | "pending";
}

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([
    { id: "INV-1024", client: "Acme Corporation", value: 4500, due: "July 30, 2026", status: "pending" },
    { id: "INV-0982", client: "AeroSpace Logistics", value: 1200, due: "June 30, 2026", status: "paid" },
    { id: "INV-0981", client: "Vanguard Retail Inc", value: 3500, due: "June 15, 2026", status: "paid" },
  ]);

  const handleCreateInvoice = () => {
    const newInvoice: InvoiceData = {
      id: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      client: "New Customer LLC",
      value: Math.floor(1000 + Math.random() * 8000),
      due: "August 15, 2026",
      status: "pending",
    };
    setInvoices(prev => [newInvoice, ...prev]);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="font-heading font-bold text-xl text-navy-950">Billing Invoices Ledger</h2>
        <Button onClick={handleCreateInvoice} variant="primary" size="sm" className="gap-1.5 text-xs">
          <Plus size={14} /> Create Invoice
        </Button>
      </div>
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4">Invoice ID</th>
              <th className="p-4">Client</th>
              <th className="p-4">Due Date</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-700">
            {invoices.map((inv) => (
              <tr key={inv.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                <td className="p-4 font-mono font-semibold text-blue-600">{inv.id}</td>
                <td className="p-4 font-bold text-navy-950">{inv.client}</td>
                <td className="p-4 text-gray-500">{inv.due}</td>
                <td className="p-4 font-bold text-navy-950">${inv.value.toLocaleString()}.00</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                    inv.status === "paid" ? "bg-green-50 text-green-600" : "bg-pipeline-red-100 text-pipeline-red-550"
                  }`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

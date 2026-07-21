"use client";

import React, { useState } from "react";
import { UserX, UserCheck } from "lucide-react";

interface CustomerData {
  id: string;
  name: string;
  company: string;
  email: string;
  industry: string;
  status: "active" | "suspended";
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerData[]>([
    { id: "C-1002", name: "John Doe", company: "Acme Corporation", email: "john@acme.com", industry: "Manufacturing", status: "active" },
    { id: "C-1003", name: "Sarah Jenkins", company: "AeroSpace Logistics", email: "s.jenkins@aerolog.com", industry: "Transportation", status: "active" },
    { id: "C-1004", name: "Marcus Vance", company: "Vanguard Retail Inc", email: "m.vance@vanguard.com", industry: "Retail", status: "active" },
    { id: "C-1005", name: "Devin Miller", company: "Cyber Systems", email: "d.miller@cybersys.com", industry: "Technology", status: "suspended" },
  ]);

  const toggleCustomerStatus = (id: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === "active" ? "suspended" : "active" };
      }
      return c;
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading font-bold text-xl text-navy-950">Customer Profiles Database</h2>
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-2xl shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="p-4">Customer ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Company</th>
              <th className="p-4">Email</th>
              <th className="p-4">Industry</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-xs text-gray-700">
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                <td className="p-4 font-mono font-semibold text-blue-600">{c.id}</td>
                <td className="p-4 font-bold text-navy-950">{c.name}</td>
                <td className="p-4">{c.company}</td>
                <td className="p-4">{c.email}</td>
                <td className="p-4">{c.industry}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                    c.status === "active" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleCustomerStatus(c.id)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors ${
                      c.status === "active" 
                        ? "bg-red-50 hover:bg-red-100 text-red-600" 
                        : "bg-green-50 hover:bg-green-100 text-green-600"
                    }`}
                  >
                    {c.status === "active" ? (
                      <><UserX size={12} /> Suspend</>
                    ) : (
                      <><UserCheck size={12} /> Activate</>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import GlassCard from "../../../components/ui/GlassCard";

interface DealData {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: string;
}

export default function AdminLeads() {
  const [deals] = useState<DealData[]>([
    { id: "D-802", title: "Enterprise Database Migration Setup", value: 45000, stage: "Proposal", probability: "70%" },
    { id: "D-803", title: "Managed IT Support Retainer 2026", value: 12000, stage: "Negotiation", probability: "90%" },
    { id: "D-804", title: "Cloud Security Configuration", value: 8500, stage: "Prospecting", probability: "30%" },
    { id: "D-805", title: "API Gateway Integration Project", value: 15000, stage: "Closed Won", probability: "100%" },
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-heading font-bold text-xl text-navy-950">Leads & Deals Pipeline</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {deals.map((deal) => (
          <GlassCard key={deal.id} className="bg-white/50 border border-gray-200 p-5 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded max-w-fit">{deal.id}</span>
              <h4 className="font-heading font-bold text-sm text-navy-950">{deal.title}</h4>
            </div>
            <div className="border-t border-gray-150 pt-3 flex flex-col gap-1.5 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Deal Value:</span>
                <strong className="text-navy-950">${deal.value.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Pipeline Stage:</span>
                <strong className="text-blue-600 font-semibold">{deal.stage}</strong>
              </div>
              <div className="flex justify-between">
                <span>Conversion Probability:</span>
                <strong className="text-gray-700">{deal.probability}</strong>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}

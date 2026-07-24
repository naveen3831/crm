"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProposalEightSectionsSuite from "@/components/admin/ProposalEightSectionsSuite";

export default function ProposalEightSectionsPage() {
  const params = useParams();
  const id = (params?.id as string) || "OPRJ-6561";
  const proposalId = (params?.proposalId as string) || "QT-OPRJ-6561";

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <ProposalEightSectionsSuite projectId={id} proposalId={proposalId} />
    </div>
  );
}

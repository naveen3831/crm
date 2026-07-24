"use client";

import React from "react";
import { useParams } from "next/navigation";
import ProposalCrudWorkspace from "@/components/admin/ProposalCrudWorkspace";

export default function ProposalsCrudPage() {
  const params = useParams();
  const id = (params?.id as string) || "OPRJ-6561";

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <ProposalCrudWorkspace projectId={id} />
    </div>
  );
}

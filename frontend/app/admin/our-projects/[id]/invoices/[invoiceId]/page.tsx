"use client";

import React from "react";
import { useParams } from "next/navigation";
import FullInvoiceDocumentPage from "@/components/admin/FullInvoiceDocumentPage";

export default function SingleInvoiceFullPage() {
  const params = useParams();
  const id = (params?.id as string) || "OPRJ-6561";
  const invoiceId = (params?.invoiceId as string) || "SPW2026070712";

  return (
    <FullInvoiceDocumentPage projectId={id} invoiceId={invoiceId} />
  );
}

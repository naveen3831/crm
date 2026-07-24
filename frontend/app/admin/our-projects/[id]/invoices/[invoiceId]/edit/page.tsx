"use client";

import React from "react";
import { useParams } from "next/navigation";
import FullInvoiceEditorPage from "@/components/admin/FullInvoiceEditorPage";

export default function EditInvoiceFullPage() {
  const params = useParams();
  const id = (params?.id as string) || "OPRJ-6561";
  const invoiceId = (params?.invoiceId as string) || "SPW2026070712";

  return (
    <FullInvoiceEditorPage projectId={id} invoiceId={invoiceId} />
  );
}

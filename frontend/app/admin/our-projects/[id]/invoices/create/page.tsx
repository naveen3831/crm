"use client";

import React from "react";
import { useParams } from "next/navigation";
import FullInvoiceEditorPage from "@/components/admin/FullInvoiceEditorPage";

export default function CreateInvoiceFullPage() {
  const params = useParams();
  const id = (params?.id as string) || "OPRJ-6561";

  return (
    <FullInvoiceEditorPage projectId={id} />
  );
}

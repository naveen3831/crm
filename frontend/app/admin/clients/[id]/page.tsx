"use client";

import React from "react";
import { useParams } from "next/navigation";
import FullClientProfilePage from "@/components/admin/FullClientProfilePage";

export default function ClientProfileFullPage() {
  const params = useParams();
  const id = (params?.id as string) || "CLI-4635";

  return (
    <FullClientProfilePage clientId={id} />
  );
}

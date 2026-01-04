"use client";

import { useState } from "react";
import CreateInvoice from "@/components/invoice/InvoiceForm";
import { InvoiceData, InvoiceItem } from "@/components/invoice/types";

export default function ClientInvoice({
  initialData,
}: {
  initialData?: Partial<InvoiceData>; // partial to allow missing fields
}) {
  const [data, setData] = useState<InvoiceData>({
    status: "pending", // a reasonable default
    currency: "USD",
    invoiceNumber: "",
    invoiceDate: new Date().toISOString(),
    dueDate: new Date().toISOString(),
    clientName: "",
    clientEmail: "",
    items: [] as InvoiceItem[],
    discountType: "fixed",
    discountValue: 0,
    taxRate: 0,
    ...initialData, // override defaults with initialData if provided
  });

  return (
    <CreateInvoice
      data={data}
      setData={setData}
      onDownload={() => {}}
    />
  );
}

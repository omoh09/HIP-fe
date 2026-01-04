"use client";

import { useState } from "react";
import CreateInvoice from "@/components/invoice/InvoiceForm";
import { InvoiceData } from "@/components/invoice/types";

export default function ClientInvoice({
  initialData,
}: {
  initialData?: InvoiceData;
}) {
  const [data, setData] = useState<InvoiceData>(
    initialData || DEFAULT_INVOICE
  );

  return (
    <CreateInvoice
      data={data}
      setData={setData}
      onDownload={() => {}}
    />
  );
}

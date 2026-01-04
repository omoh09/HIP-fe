import { useEffect } from "react";
import { InvoiceData } from "./types";

export function useInvoiceDraft(
  data: InvoiceData,
  setData: (d: InvoiceData) => void
) {
  useEffect(() => {
    const saved = localStorage.getItem("invoice_draft");
    if (saved) setData(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("invoice_draft", JSON.stringify(data));
  }, [data]);
}

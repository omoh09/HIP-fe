"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";

import InvoiceForm from "@/components/invoice/InvoiceForm";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import { InvoiceData } from "@/components/invoice/types";

export default function CreateInvoicePage() {
  const previewRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<InvoiceData>({
    logo: "",
    status: "pending",
    currency: "NGN",
    invoiceNumber: "",
    invoiceDate: "",
    dueDate: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    items: [{ item: "", description: "", quantity: 1, rate: 0 }],
    discountType: "fixed",
    discountValue: 0,
    taxRate: 0,
  });

  const downloadGuestPDF = async () => {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#f8fafc",
      onclone: (doc) => {
        doc.querySelectorAll("*").forEach((el: any) => {
          const style = window.getComputedStyle(el);
          if (style.color?.includes("lab")) el.style.color = "#000";
          if (style.backgroundColor?.includes("lab"))
            el.style.backgroundColor = "#fff";
        });
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.85);

    const pdf = new jsPDF("p", "mm", "a4", true);
    const margin = 10;
    const pdfWidth = 210 - margin * 2;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "JPEG",
      margin,
      margin,
      pdfWidth,
      pdfHeight
    );

    pdf.save(`Invoice-${data.invoiceNumber || "draft"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        <InvoiceForm
          data={data}
          setData={setData}
          onDownload={downloadGuestPDF}
        />

        <InvoicePreview ref={previewRef} data={data} />
      </div>
    </div>
  );
}

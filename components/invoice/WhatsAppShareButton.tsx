'use client';

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { InvoiceData } from "./types";
import { generateInvoicePdfBlob } from "@/lib/invoice/downloadPdf";
import { formatMoney } from "@/lib/currency";
import { markInvoiceShared } from "@/lib/onboarding/client";

function normalizePhone(phone?: string) {
  if (!phone) return "";
  const digits = phone.replace(/[^0-9]/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.startsWith("0")) return `234${digits.slice(1)}`;
  if (digits.startsWith("234")) return digits;
  return digits;
}

export default function WhatsAppShareButton({
  clientName,
  clientPhone,
  invoiceNumber,
  amount,
  currency = "NGN",
  paymentLink,
  invoiceData,
}: {
  clientName?: string;
  clientPhone?: string;
  invoiceNumber?: string;
  amount?: number;
  currency?: string;
  paymentLink?: string;
  invoiceData?: InvoiceData;
}) {
  const phone = normalizePhone(clientPhone);
  const hasPhone = Boolean(phone);
  const [canNativeShareFiles, setCanNativeShareFiles] = useState(false);

  // Capability detection is intentionally delayed until after hydration so the
  // server and first client render always match. This avoids the Button
  // hydration error that previously appeared in the invoice builder.
  useEffect(() => {
    if (typeof navigator === "undefined" || typeof navigator.share !== "function") return;
    setCanNativeShareFiles(true);
  }, []);


  const share = async () => {
    const amountText =
      amount != null
        ? `Amount due: ${formatMoney(Number(amount), currency, { showCode: true })}`
        : "";

    const message = [
      `Hello${clientName ? ` ${clientName}` : ""},`,
      "",
      `Please find your invoice${invoiceNumber ? ` ${invoiceNumber}` : ""}.`,
      amountText,
      paymentLink
        ? `You can view and pay securely here: ${paymentLink}`
        : "The invoice is ready. I will share the payment link with you separately.",
      "",
      "Thank you.",
    ]
      .filter(Boolean)
      .join("\n");

    if (invoiceData && canNativeShareFiles && typeof navigator !== "undefined") {
      try {
        const blob = await generateInvoicePdfBlob(invoiceData);
        const fileName = `${invoiceNumber || "invoice"}.pdf`;
        const file = new File([blob], fileName, { type: "application/pdf" });
        const canShareFile = typeof navigator.canShare === "function"
          ? navigator.canShare({ files: [file] })
          : false;

        if (canShareFile) {
          await navigator.share({
            files: [file],
            title: invoiceNumber ? `Invoice ${invoiceNumber}` : "Invoice",
            text: message,
          });
          await markInvoiceShared(invoiceData?.id);
          return;
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    const target = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(target, "_blank", "noopener,noreferrer");
    void markInvoiceShared(invoiceData?.id);
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={share}
      title={hasPhone ? "Send invoice via WhatsApp" : "Open WhatsApp and choose the client"}
      className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 dark:border-emerald-400/20 dark:text-emerald-300 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-200"
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      {invoiceData && canNativeShareFiles ? "WhatsApp / Share PDF" : "WhatsApp"}
    </Button>
  );
}

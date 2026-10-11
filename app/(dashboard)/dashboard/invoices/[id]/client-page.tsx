'use client';

import { useRef, useState } from "react";
import { ArrowLeft, Copy, Download, ExternalLink, Pencil, Printer } from "lucide-react";
import { useRouter } from "next/navigation";
import InvoicePreview from "@/components/invoice/InvoicePreview";
import InvoiceQrCode from "@/components/invoice/InvoiceQrCode";
import WhatsAppShareButton from "@/components/invoice/WhatsAppShareButton";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import { downloadInvoicePdf } from "@/lib/invoice/downloadPdf";
import { printInvoiceElement } from "@/lib/invoice/printInvoice";
import type { InvoiceData } from "@/components/invoice/types";
import { formatMoney } from "@/lib/currency";
import { getInvoiceClientUrl } from "@/lib/qr/invoiceQr";
import { markInvoiceShared } from "@/lib/onboarding/client";

export default function ClientInvoice({ initialData }: { initialData: InvoiceData }) {
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [printing, setPrinting] = useState(false);

  const paymentLink = getInvoiceClientUrl(initialData);
  const paidAmount = Number(initialData.amountPaid ?? initialData.payment?.amount ?? 0);
  const totalAmount = Number(initialData.amount ?? 0);
  const balanceAmount = Math.max(Number(initialData.amountDue ?? totalAmount - paidAmount), 0);
  const isPartial = initialData.status === "partial" || (paidAmount > 0 && balanceAmount > 0 && paidAmount < totalAmount);
  const clientPhone = initialData.clientPhone ?? initialData.client?.phone;
  const normalizedStatus = String(initialData.status || "pending").toLowerCase().replace(/[-\s]/g, "_");
  const canEdit = initialData.canEdit ?? initialData.can_edit ?? (paidAmount <= 0 && !["paid", "partial", "partially_paid"].includes(normalizedStatus));

  const handleDownload = async () => {
    if (!previewRef.current) return;
    setDownloading(true);
    try {
      await downloadInvoicePdf(initialData, initialData.invoiceNumber || "invoice");
      showToast("Invoice PDF downloaded.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to generate the invoice PDF.", "error");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = async () => {
    if (!previewRef.current) return;
    setPrinting(true);
    try {
      await printInvoiceElement(previewRef.current);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Unable to print the invoice.", "error");
    } finally {
      setPrinting(false);
    }
  };

  const copyPaymentLink = async () => {
    if (!paymentLink) return;
    await navigator.clipboard.writeText(paymentLink);
    await markInvoiceShared(initialData.id);
    showToast("Payment link copied.", "success");
  };

  return (
    <section className="page-container py-8 lg:py-10">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <button type="button" onClick={() => router.push("/dashboard/invoices")} className="mb-3 inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><ArrowLeft className="mr-1 h-4 w-4" />Back to invoices</button>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-emerald-700">Invoice</p>
            {isPartial && <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Partial</span>}
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{initialData.invoiceNumber || "Invoice"}</h1>
          <p className="mt-2 text-sm text-slate-500">{initialData.clientName || "Client"} · {formatMoney(Number(initialData.amount ?? 0), initialData.currency || "NGN", { showCode: true })}</p>
          {initialData.createdAt && <p className="mt-1 text-xs text-slate-400">Created {new Date(initialData.createdAt).toLocaleString()}{initialData.updatedAt && initialData.updatedAt !== initialData.createdAt ? ` · Last edited ${new Date(initialData.updatedAt).toLocaleString()}` : ""}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          {canEdit && <Button variant="outline" onClick={() => router.push(`/dashboard/invoices/${initialData.id}/edit`)}><Pencil className="mr-2 h-4 w-4" />Edit invoice</Button>}
          <Button variant="outline" disabled={printing} onClick={handlePrint}><Printer className="mr-2 h-4 w-4" />{printing ? "Preparing…" : "Print"}</Button>
          <Button variant="outline" disabled={downloading} onClick={handleDownload}><Download className="mr-2 h-4 w-4" />{downloading ? "Generating…" : "Download PDF"}</Button>
          <WhatsAppShareButton clientName={initialData.clientName} clientPhone={clientPhone} invoiceNumber={initialData.invoiceNumber} amount={balanceAmount} currency={initialData.currency} paymentLink={paymentLink} invoiceData={initialData} />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-auto rounded-2xl border border-slate-200 bg-slate-100 p-4 shadow-sm">
          <InvoicePreview ref={previewRef} data={initialData} />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Payment status</p>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-2xl font-bold capitalize text-slate-950">{isPartial ? "Partially paid" : initialData.status}</p>
              {isPartial && <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Partial</span>}
            </div>
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Paid</span><span className="font-medium">{formatMoney(Number(initialData.amountPaid ?? 0), initialData.currency || "NGN")}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Balance</span><span className="font-semibold">{formatMoney(Number(initialData.amountDue ?? 0), initialData.currency || "NGN")}</span></div>
              {initialData.platformFeePercent !== undefined && <div className="flex justify-between"><span className="text-slate-500">Hip Homorrd collection fee</span><span className="font-medium">{Number(initialData.platformFeePercent).toFixed(2)}%</span></div>}
            </div>
            {initialData.platformFeePercent !== undefined && <p className="mt-3 text-xs leading-5 text-slate-400">This merchant-side fee was locked when the invoice was created. Payment-provider processing fees are separate.</p>}
          </div>

          {paymentLink && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-950">
              <p className="font-semibold text-slate-950 dark:text-white">Invoice QR code</p>
              <p className="mx-auto mt-1 max-w-[240px] text-sm leading-6 text-slate-500 dark:text-slate-400">The QR code is unique to this invoice and opens the same secure client link you share on WhatsApp.</p>
              <div className="mt-4 flex justify-center">
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                  <InvoiceQrCode url={paymentLink} size={156} />
                </div>
              </div>
              <Button className="mt-4 w-full" variant="outline" onClick={copyPaymentLink}><Copy className="mr-2 h-4 w-4" />Copy client invoice link</Button>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <p className="font-semibold text-slate-950 dark:text-white">Send to your client</p>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Send this existing invoice to the client through WhatsApp. If a number is saved, WhatsApp opens directly for that client; otherwise you can choose the client in WhatsApp.</p>
            <div className="mt-4 grid gap-2">
              <WhatsAppShareButton clientName={initialData.clientName} clientPhone={clientPhone} invoiceNumber={initialData.invoiceNumber} amount={balanceAmount} currency={initialData.currency} paymentLink={paymentLink} invoiceData={initialData} />
              <Button variant="outline" disabled={!paymentLink} onClick={copyPaymentLink}><Copy className="mr-2 h-4 w-4" />Copy payment link</Button>
              {paymentLink && <a href={paymentLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Open payment page <ExternalLink className="ml-2 h-4 w-4" /></a>}
            </div>
            {!clientPhone && <p className="mt-3 text-xs text-slate-500">No WhatsApp number is saved on this invoice, so WhatsApp will let you choose the recipient.</p>}
            {!paymentLink && <p className="mt-2 text-xs text-amber-700">No payment link is available yet; the invoice details will still be included in the WhatsApp message.</p>}
          </div>
        </aside>
      </div>
    </section>
  );
}

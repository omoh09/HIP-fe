import { forwardRef, useEffect, useMemo, useState } from "react";
import { InvoiceData } from "./types";
import { normalizeInvoiceItems, useInvoiceCalculator } from "./useInvoiceCalculator";
import { CURRENCY_SYMBOL } from "./constants";
import InvoicePayNow from './InvoicePayNow';
import InvoiceQrCode from './InvoiceQrCode';
import { getInvoiceClientUrl } from '@/lib/qr/invoiceQr';

type Props = {
  data: InvoiceData;
  onPaymentSuccess?: (updatedInvoice: InvoiceData) => void;
};

const InvoicePreview = forwardRef<HTMLDivElement, Props>(
  ({ data, onPaymentSuccess }, ref) => {
    const { subtotal, discount, tax, total } =
      useInvoiceCalculator(data);
    const [invoice, setInvoice] = useState<InvoiceData>(data);
    const [businessName, setBusinessName] = useState('Business Name');
    const [businessLogo, setBusinessLogo] = useState('');

    useEffect(() => {
      setInvoice(data);
    }, [data]);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      setBusinessName(window.localStorage.getItem('business_name') || 'Business Name');
      setBusinessLogo(window.localStorage.getItem('business_logo') || '');
    }, []);

    useEffect(() => {
      if (typeof window === 'undefined') return;
      const handleStorage = () => {
        setBusinessName(window.localStorage.getItem('business_name') || 'Business Name');
        setBusinessLogo(window.localStorage.getItem('business_logo') || '');
      };

      const handleLogoUpdated = () => {
        setBusinessName(window.localStorage.getItem('business_name') || 'Business Name');
        setBusinessLogo(window.localStorage.getItem('business_logo') || '');
      };

      window.addEventListener('storage', handleStorage);
      window.addEventListener('business-logo-updated', handleLogoUpdated);
      return () => {
        window.removeEventListener('storage', handleStorage);
        window.removeEventListener('business-logo-updated', handleLogoUpdated);
      };
    }, []);

    const symbol = CURRENCY_SYMBOL[invoice.currency] ?? "";
    const clientInvoiceUrl = getInvoiceClientUrl(invoice);

    // ✅ Auto-generated date (once per render)
    const generatedAt = useMemo(() => {
      return new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }, []);

    const items = useMemo(() => {
      return normalizeInvoiceItems(invoice.items || []);
    }, [invoice.items]);

    const invoiceAmount = useMemo(() => {
      const amountFromData = Number(invoice.amountDue ?? invoice.amount ?? 0);
      return amountFromData > 0 ? amountFromData : total;
    }, [invoice.amount, invoice.amountDue, total]);

    const paidAmount = useMemo(() => {
      const paymentAmount = Number(invoice.amountPaid ?? invoice.payment?.amount ?? 0);
      return paymentAmount > 0 ? paymentAmount : 0;
    }, [invoice.amountPaid, invoice.payment?.amount]);

    const balanceAmount = useMemo(() => {
      return Math.max(total - paidAmount, 0);
    }, [total, paidAmount]);

    const showPaymentSummary = invoiceAmount > 0 || paidAmount > 0;
    const displayStatus = useMemo(() => {
      const raw = String(invoice.status || "pending").toLowerCase().replace(/[\s-]+/g, "_");
      if (raw === "partial" || raw === "partially_paid" || (paidAmount > 0 && balanceAmount > 0 && paidAmount < invoiceAmount)) {
        return "partial";
      }
      return raw;
    }, [invoice.status, paidAmount, balanceAmount, invoiceAmount]);
    const logoSrc = useMemo(() => {
      const rawLogo = businessLogo || invoice.logo || data.logo || "";
      if (typeof rawLogo !== "string") return "";
      const trimmed = rawLogo.trim();
      if (!trimmed) return "";
      if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
      if (trimmed.startsWith("data:image/")) return trimmed;
      return trimmed;
    }, [businessLogo, invoice.logo, data.logo]);

    return (
      /* ===============================
         MOBILE SCALE WRAPPER (NOT PDF)
         =============================== */
      <div className="w-full overflow-x-auto">
        <div
          className="
            mx-auto
            origin-top
            scale-[0.85]
            sm:scale-100
          "
        >
          {/* ===============================
              ACTUAL PDF / PRINT NODE
              =============================== */}
          <div
            ref={ref}
            className="invoice-print-target
              relative
              bg-white
              text-slate-900
              text-sm
              shadow-sm
              rounded-xl
              p-8
              w-[794px]
              min-h-[1123px]   /* A4 height */
              pb-36
            "
          >
            {/* ===============================
               WATERMARK
               =============================== */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0" aria-hidden="true">
              <span
                className={`select-none text-[88px] font-black uppercase tracking-[0.18em] rotate-[-28deg] border-[10px] px-8 py-3 rounded-2xl print-watermark ${
                  displayStatus === "paid"
                    ? "border-emerald-400/25 text-emerald-500/20"
                    : displayStatus === "partial"
                      ? "border-blue-400/25 text-blue-500/20"
                      : displayStatus === "overdue"
                        ? "border-red-400/25 text-red-500/20"
                        : "border-amber-400/25 text-amber-500/20"
                }`}
              >
                {displayStatus === "partial"
                  ? "PARTIAL"
                  : displayStatus === "paid"
                    ? "PAID"
                    : displayStatus === "overdue"
                      ? "OVERDUE"
                      : "PENDING"}
              </span>
            </div>

            {/* ===============================
               HEADER
               =============================== */}
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div >
                <div className="text-xl font-bold tracking-wide">
                  INVOICE                
                </div>
                <p className="font-semibold">
                  {businessName}
                </p>
              </div>
              
              {logoSrc ? (
                <div className="flex items-center justify-center rounded-md border border-gray-200 bg-white p-2 max-w-[180px] min-h-[48px]">
                  <img
                    src={logoSrc}
                    alt="Business Logo"
                    crossOrigin="anonymous"
                    className="max-h-12 max-w-[160px] object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-12 w-32 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-xs text-gray-400">
                  No logo
                </div>
              )}

              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : invoice.status === "partial"
                        ? "bg-blue-100 text-blue-700"
                        : invoice.status === "overdue"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {displayStatus === "partial" ? "Partial" : displayStatus}
                </span>               
                <p className="font-bolder mt-2">
                  To :
                </p>
                <p className="font-semibold">
                  {invoice.clientName || "Client name"}
                </p>
                <p className="text-gray-500">
                  {invoice.clientEmail || "client@email.com"}
                </p>
              </div>
            </div>

            {/* ===============================
               META
               =============================== */}
            <div className="mb-6 space-y-1 relative z-10">
              <p>
                <span className="font-medium">Invoice #:</span>{" "}
                {invoice.invoiceNumber || "—"}
              </p>
              <p>
                <span className="font-medium">Invoice Date:</span>{" "}
                {invoice.invoiceDate || "—"}
              </p>
              <p>
                <span className="font-medium">Due Date:</span>{" "}
                {invoice.dueDate || "—"}
              </p>
              <p>
                <span className="font-medium">Generated On:</span>{" "}
                {generatedAt}
              </p>
            </div>

            <div className="flex items-start justify-start mb-8 relative z-10">
              <InvoicePayNow
                invoice={invoice}
                total={balanceAmount}
                currency={invoice.currency || 'NGN'}
                onPaymentSuccess={(updatedInvoice) => {
                  setInvoice(updatedInvoice);
                  onPaymentSuccess?.(updatedInvoice);
                }}
              />
            </div>


            {/* ===============================
               ITEMS TABLE
               =============================== */}
            <table className="w-full border mb-6 relative z-10">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 border text-left">
                    Description
                  </th>
                  <th className="p-2 border text-right">Qty</th>
                  <th className="p-2 border text-right">Rate</th>
                  <th className="p-2 border text-right">
                    Amount
                  </th>
                </tr>
              </thead>

              <tbody>
  {items.map((i, idx) => (
    <tr key={idx} className="break-inside-avoid">
      <td className="p-2 border">
        <div className="font-medium">
          {(() => {
            const displayName = [i.item, i.name].find(
              (value) => typeof value === "string" && value.trim()
            );

            return displayName ? displayName.toString() : "Item";
          })()}
        </div>
        {i.description && (
          <div className="text-gray-500 text-xs">
            {i.description}
          </div>
        )}
      </td>

      <td className="p-2 border text-right">
        {i.quantity}
      </td>

      <td className="p-2 border text-right">
        {symbol}
        {Number(i.rate).toFixed(2)}
      </td>

      <td className="p-2 border text-right">
        {symbol}
        {(Number(i.quantity) * Number(i.rate)).toFixed(2)}
      </td>
    </tr>
  ))}
</tbody>

            </table>

            {/* ===============================
               TOTALS
               =============================== */}
            <div className="space-y-2 max-w-xs ml-auto relative z-10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>
                  {symbol}
                  {subtotal.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span>
                  -{symbol}
                  {discount.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>
                  {symbol}
                  {tax.toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total</span>
                <span>
                  {symbol}
                  {total.toFixed(2)}
                </span>
              </div>

              {showPaymentSummary && (
                <div className="border-t pt-2 space-y-1 text-xs text-gray-600">
                  {/* <div className="flex justify-between">
                    <span>Amount</span>
                    <span>{symbol}{invoiceAmount.toFixed(2)}</span>
                  </div> */}
                  <div className="flex justify-between">
                    <span>Amount Paid</span>
                    <span>{symbol}{paidAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Balance</span>
                    <span>{symbol}{balanceAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            {clientInvoiceUrl && (
              <div className="mt-10 flex items-end justify-between gap-8 border-t border-slate-200 pt-6 relative z-10">
                <div className="max-w-md">
                  <p className="text-sm font-semibold text-slate-900">Open this invoice on your phone</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Scan the unique QR code to view this invoice, see the current balance and continue to the secure payment page.</p>
                </div>
                <InvoiceQrCode url={clientInvoiceUrl} size={112} />
              </div>
            )}

            {/* ===============================
               FOOTER
               =============================== */}
            <div className="absolute bottom-1 left-8 right-8 text-xs text-gray-400 text-center">
              Generated via Hip Homorrd on {generatedAt}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";

export default InvoicePreview;

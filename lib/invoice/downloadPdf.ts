import type { InvoiceData } from "@/components/invoice/types";
import { CURRENCY_SYMBOL } from "@/components/invoice/constants";
import { getInvoiceClientUrl, qrToPngDataUrl } from "@/lib/qr/invoiceQr";

function money(value: number, symbol: string) {
  return `${symbol}${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function toNumber(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

async function imageToDataUrl(src: string): Promise<string | null> {
  if (!src) return null;
  try {
    let response: Response;
    if (src.startsWith("data:image/")) {
      const parts = src.split(",", 2);
      if (parts.length !== 2) return null;
      const byteString = atob(parts[1]);
      const bytes = new Uint8Array(byteString.length);
      for (let i = 0; i < byteString.length; i += 1) bytes[i] = byteString.charCodeAt(i);
      const blob = new Blob([bytes], { type: parts[0].match(/data:(.*?);/)?.[1] || "image/png" });
      response = new Response(blob);
    } else {
      response = await fetch(src, { mode: "cors", credentials: "include", cache: "no-store" });
      if (!response.ok) {
        const proxyUrl = `/api/invoice/logo?url=${encodeURIComponent(src)}`;
        response = await fetch(proxyUrl, { credentials: "include", cache: "no-store" });
      }
    }
    if (!response.ok) return null;
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
      const image = new Image();
      image.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Unable to decode logo"));
        image.src = objectUrl;
      });
      const maxWidth = 900;
      const scale = Math.min(1, maxWidth / Math.max(image.naturalWidth || 1, 1));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round((image.naturalWidth || 300) * scale));
      canvas.height = Math.max(1, Math.round((image.naturalHeight || 120) * scale));
      const context = canvas.getContext("2d");
      if (!context) return null;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL("image/png");
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  } catch {
    return null;
  }
}

/**
 * Generates the invoice PDF from invoice data rather than screenshotting the
 * rendered DOM. This deliberately avoids html2canvas so Tailwind's modern
 * lab()/oklch() colours cannot break PDF generation.
 */
export async function generateInvoicePdfBlob(data: InvoiceData): Promise<Blob> {
  const { default: jsPDF } = await import("jspdf");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  const symbol = CURRENCY_SYMBOL[data.currency] ?? data.currency;
  const items = Array.isArray(data.items) ? data.items : [];

  const subtotal = items.reduce(
    (sum, item) => sum + toNumber(item.quantity) * toNumber(item.rate ?? item.unit_price),
    0,
  );
  const discount =
    data.discountType === "percentage"
      ? subtotal * Math.min(Math.max(toNumber(data.discountValue), 0), 100) / 100
      : Math.min(Math.max(toNumber(data.discountValue), 0), subtotal);
  const taxable = Math.max(subtotal - discount, 0);
  const tax = taxable * Math.max(toNumber(data.taxRate), 0) / 100;
  const total = Math.max(taxable + tax, 0);
  const paid = Math.max(toNumber(data.amountPaid ?? data.payment?.amount), 0);
  const balance = Math.max(total - paid, 0);
  const rawStatus = String(data.status || "pending").toLowerCase().replace(/[\s-]+/g, "_");
  const displayStatus =
    rawStatus === "partial" || rawStatus === "partially_paid" || (paid > 0 && balance > 0 && paid < total)
      ? "partial"
      : rawStatus;
  const watermarkText =
    displayStatus === "paid" ? "PAID"
      : displayStatus === "partial" ? "PARTIAL"
        : displayStatus === "overdue" ? "OVERDUE"
          : "PENDING";

  let y = margin;

  // Status watermark: rendered before invoice content so it stays behind the
  // readable invoice details. The intentionally pale status colour keeps it
  // prominent without interfering with the document content.
  const drawWatermark = () => {
    const color = displayStatus === "paid"
      ? [205, 235, 220]
      : displayStatus === "partial"
        ? [205, 220, 240]
        : displayStatus === "overdue"
          ? [240, 210, 210]
          : [242, 228, 190];
    doc.setTextColor(color[0], color[1], color[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(42);
    doc.text(watermarkText, pageWidth / 2, pageHeight / 2, { align: "center", angle: 28 });
  };

  drawWatermark();

  const ensureSpace = (height: number) => {
    if (y + height > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Header
  const logoSource = data.logo || (typeof window !== "undefined" ? window.localStorage.getItem("business_logo") || "" : "");
  const businessName = (typeof window !== "undefined" ? window.localStorage.getItem("business_name") || "" : "") || "Hip Homorrd";
  const logo = await imageToDataUrl(logoSource);
  if (logo) {
    try {
      doc.addImage(logo, "AUTO", pageWidth - margin - 36, y, 36, 18, undefined, "FAST");
    } catch {
      // A remote logo should never prevent an invoice from downloading.
    }
  }

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("INVOICE", margin, y + 8);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(businessName, margin, y + 14);

  doc.setFont("helvetica", "bold");
  doc.text(data.status.toUpperCase(), pageWidth - margin, y + 27, { align: "right" });

  y += 36;

  // Invoice/client metadata
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);

  const metaLeft = [
    `Invoice #: ${data.invoiceNumber || "—"}`,
    `Invoice date: ${data.invoiceDate || "—"}`,
    `Due date: ${data.dueDate || "—"}`,
  ];
  metaLeft.forEach((line, index) => doc.text(line, margin, y + index * 5));

  const clientLines = [
    `Bill to: ${data.clientName || "—"}`,
    data.clientEmail || "",
    data.clientPhone || "",
  ].filter(Boolean);

  clientLines.forEach((line, index) =>
    doc.text(line, pageWidth - margin, y + index * 5, { align: "right" }),
  );

  y += Math.max(metaLeft.length, clientLines.length) * 5 + 10;

  // Items table
  const col = {
    description: margin,
    qty: margin + 112,
    rate: margin + 136,
    amount: pageWidth - margin,
  };

  const drawTableHeader = () => {
    doc.setFillColor(248, 250, 252);
    doc.rect(margin, y - 5, contentWidth, 9, "F");
    doc.setTextColor(71, 85, 105);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text("DESCRIPTION", col.description + 2, y);
    doc.text("QTY", col.qty, y, { align: "right" });
    doc.text("RATE", col.rate, y, { align: "right" });
    doc.text("AMOUNT", col.amount - 2, y, { align: "right" });
    y += 9;
  };

  drawTableHeader();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);

  for (const item of items) {
    const name = String(item.item || item.name || "Item");
    const description = String(item.description || "");
    const lines = doc.splitTextToSize(
      description ? `${name}\n${description}` : name,
      100,
    ) as string[];
    const rowHeight = Math.max(9, lines.length * 4 + 3);

    if (y + rowHeight > pageHeight - 52) {
      doc.addPage();
      y = margin;
      drawWatermark();
      drawTableHeader();
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + rowHeight - 1, pageWidth - margin, y + rowHeight - 1);

    doc.text(lines, col.description + 2, y + 3);
    doc.text(String(toNumber(item.quantity)), col.qty, y + 3, { align: "right" });
    doc.text(money(toNumber(item.rate ?? item.unit_price), symbol), col.rate, y + 3, { align: "right" });
    doc.text(
      money(toNumber(item.quantity) * toNumber(item.rate ?? item.unit_price), symbol),
      col.amount - 2,
      y + 3,
      { align: "right" },
    );

    y += rowHeight;
  }

  ensureSpace(65);
  y += 8;

  // Totals
  const totalsX = pageWidth - margin - 62;
  const totalsValueX = pageWidth - margin;
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);

  const totalRow = (label: string, value: number, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.text(label, totalsX, y);
    doc.text(money(value, symbol), totalsValueX, y, { align: "right" });
    y += 6;
  };

  totalRow("Subtotal", subtotal);
  totalRow("Discount", -discount);
  totalRow("Tax", tax);
  doc.setDrawColor(203, 213, 225);
  doc.line(totalsX, y - 2, totalsValueX, y - 2);
  totalRow("Total", total, true);

  if (paid > 0) {
    totalRow("Amount paid", paid);
    totalRow("Balance", balance, true);
  }

  if (data.description || data.discription) {
    ensureSpace(25);
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.text("Notes", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    const notes = doc.splitTextToSize(String(data.description || data.discription), contentWidth);
    doc.text(notes, margin, y);
    y += Math.max(8, notes.length * 4);
  }

  const clientInvoiceUrl = getInvoiceClientUrl(data);
  if (clientInvoiceUrl) {
    ensureSpace(44);
    y += 8;
    const qrDataUrl = qrToPngDataUrl(clientInvoiceUrl, { size: 640, quietZone: 4 });
    if (qrDataUrl) {
      const qrSize = 31;
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 7;
      doc.setTextColor(15, 23, 42);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text("Scan to view & pay", margin, y + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      const helper = doc.splitTextToSize(
        "Open the live client invoice to view the current balance and continue to secure payment.",
        110,
      );
      doc.text(helper, margin, y + 11);
      doc.addImage(qrDataUrl, "PNG", pageWidth - margin - qrSize, y, qrSize, qrSize, undefined, "FAST");
      y += qrSize + 4;
    }
  }

  // Footer on every page.
  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Generated via Hip Homorrd • Page ${page} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 8,
      { align: "center" },
    );
  }

  return doc.output("blob");
}

export async function downloadInvoicePdf(data: InvoiceData, filename = "invoice") {
  const blob = await generateInvoicePdfBlob(data);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename.replace(/\.pdf$/i, "") || "invoice"}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

import QRCode from "@/lib/vendor/qrcode/index.js";
import QRErrorCorrectLevel from "@/lib/vendor/qrcode/QRErrorCorrectLevel.js";
import type { InvoiceData } from "@/components/invoice/types";

export type QrMatrix = {
  modules: boolean[][];
  moduleCount: number;
};

export function getInvoiceClientUrl(invoice: Partial<InvoiceData>): string {
  return String(
    invoice.clientInvoiceUrl ||
      invoice.client_invoice_url ||
      invoice.qrCodeValue ||
      invoice.qr_code_value ||
      invoice.paymentLink ||
      invoice.payment_link ||
      invoice.publicUrl ||
      invoice.public_url ||
      "",
  ).trim();
}

export function buildQrMatrix(value: string): QrMatrix | null {
  const payload = value.trim();
  if (!payload) return null;

  const qr = new (QRCode as any)(-1, (QRErrorCorrectLevel as any).M);
  qr.addData(payload);
  qr.make();

  const moduleCount = Number(qr.getModuleCount());
  const modules: boolean[][] = [];

  for (let row = 0; row < moduleCount; row += 1) {
    const currentRow: boolean[] = [];
    for (let col = 0; col < moduleCount; col += 1) {
      currentRow.push(Boolean(qr.isDark(row, col)));
    }
    modules.push(currentRow);
  }

  return { modules, moduleCount };
}

export function qrToPngDataUrl(
  value: string,
  options: { size?: number; quietZone?: number } = {},
): string | null {
  if (typeof document === "undefined") return null;

  const matrix = buildQrMatrix(value);
  if (!matrix) return null;

  const requestedSize = Math.max(160, Math.round(options.size ?? 512));
  const quietZone = Math.max(4, Math.round(options.quietZone ?? 4));
  const cells = matrix.moduleCount + quietZone * 2;
  const cellSize = Math.max(1, Math.floor(requestedSize / cells));
  const canvasSize = cellSize * cells;

  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  const context = canvas.getContext("2d");
  if (!context) return null;

  context.imageSmoothingEnabled = false;
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvasSize, canvasSize);
  context.fillStyle = "#020617";

  matrix.modules.forEach((row, rowIndex) => {
    row.forEach((dark, colIndex) => {
      if (!dark) return;
      context.fillRect(
        (colIndex + quietZone) * cellSize,
        (rowIndex + quietZone) * cellSize,
        cellSize,
        cellSize,
      );
    });
  });

  return canvas.toDataURL("image/png");
}

export async function printInvoiceElement(element: HTMLElement): Promise<void> {
  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=1200");

  if (!printWindow) {
    throw new Error("Unable to open the print window. Please allow pop-ups for this site.");
  }

  const clone = element.cloneNode(true) as HTMLElement;

  // The invoice is rendered inside a responsive scale/overflow wrapper on screen.
  // Printing a clean clone avoids transformed/hidden dashboard ancestors and
  // guarantees that only the invoice is sent to the printer.
  clone.classList.remove("scale-[0.85]", "sm:scale-100");
  clone.style.cssText = "width: 190mm; min-height: 267mm; margin: 0 auto; transform: none; box-shadow: none; border-radius: 0; overflow: visible;";

  const styles = Array.from(document.querySelectorAll<HTMLStyleElement>("style"))
    .map((style) => `<style>${style.textContent ?? ""}</style>`)
    .join("\n");
  const links = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'))
    .map((link) => `<link rel="stylesheet" href="${link.href}">`)
    .join("\n");

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Invoice</title>
${links}
${styles}
<style>
  @page { size: A4 portrait; margin: 0; }
  html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
  body { width: 210mm; min-height: 297mm; }
  .print-document { width: 190mm; margin: 15mm auto; }
  .invoice-print-target { width: 190mm !important; min-height: 267mm !important; max-width: 190mm !important; margin: 0 auto !important; padding: 12mm !important; box-sizing: border-box !important; background: #fff !important; box-shadow: none !important; border-radius: 0 !important; transform: none !important; overflow: visible !important; }
  .invoice-print-target button, .invoice-print-target [role="button"] { display: none !important; }
  .print-watermark { opacity: .13 !important; }
  img { max-width: 100%; }
  table { width: 100% !important; border-collapse: collapse !important; }
  tr, img, .print-watermark { break-inside: avoid !important; page-break-inside: avoid !important; }
</style>
</head>
<body>
<div class="print-document">${clone.outerHTML}</div>
<script>
  (function () {
    var images = Array.prototype.slice.call(document.images);
    var pending = images.map(function (img) {
      if (img.complete) return Promise.resolve();
      return new Promise(function (resolve) { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }); });
    });
    Promise.all(pending).then(function () {
      setTimeout(function () { window.focus(); window.print(); }, 250);
    });
  })();
</script>
</body>
</html>`);
  printWindow.document.close();

  // Close the temporary print document after the print dialog has been handled.
  printWindow.addEventListener("afterprint", () => printWindow.close(), { once: true });
}

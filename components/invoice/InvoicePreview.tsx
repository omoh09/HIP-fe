import { forwardRef, useMemo } from "react";
import { InvoiceData } from "./types";
import { useInvoiceCalculator } from "./useInvoiceCalculator";
import { CURRENCY_SYMBOL } from "./constants";

type Props = {
  data: InvoiceData;
};

const InvoicePreview = forwardRef<HTMLDivElement, Props>(
  ({ data }, ref) => {
    const { subtotal, discount, tax, total } =
      useInvoiceCalculator(data);

    const symbol = CURRENCY_SYMBOL[data.currency] ?? "";

    // ✅ Auto-generated date (once per render)
    const generatedAt = useMemo(() => {
      return new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }, []);

    const items = useMemo(() => {
        return (data.items || []).map((i: any) => ({
            ...i,
            rate: i.rate ?? i.unit_price ?? 0,
            quantity: i.quantity ?? 0,
        }));
        }, [data.items]);


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
            className="
              relative
              bg-white
              text-sm
              shadow-sm
              rounded-xl
              p-8
              w-[794px]
              min-h-[1123px]   /* A4 height */
            "
          >
            {/* ===============================
               WATERMARK
               =============================== */}
            {data.status !== "pending" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span
                  className={`text-8xl font-bold rotate-45 opacity-15 ${
                    data.status === "paid"
                      ? "text-green-300"
                      : "text-gray-300"
                  }`}
                >
                  {data.status}
                </span>
              </div>
            )}

            {/* ===============================
               HEADER
               =============================== */}
            <div className="flex justify-between items-start mb-8 relative z-10">
              {data.logo ? (
                <img
                  src={data.logo}
                  alt="Logo"
                  className="h-10 object-contain"
                />
              ) : (
                <div className="text-xl font-bold tracking-wide">
                  INVOICE
                </div>
              )}

              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    data.status === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {data.status}
                </span>

                <p className="font-semibold mt-2">
                  {data.clientName || "Client name"}
                </p>
                <p className="text-gray-500">
                  {data.clientEmail || "client@email.com"}
                </p>
              </div>
            </div>

            {/* ===============================
               META
               =============================== */}
            <div className="mb-6 space-y-1 relative z-10">
              <p>
                <span className="font-medium">Invoice #:</span>{" "}
                {data.invoiceNumber || "—"}
              </p>
              <p>
                <span className="font-medium">Invoice Date:</span>{" "}
                {data.invoiceDate || "—"}
              </p>
              <p>
                <span className="font-medium">Due Date:</span>{" "}
                {data.dueDate || "—"}
              </p>
              <p>
                <span className="font-medium">Generated On:</span>{" "}
                {generatedAt}
              </p>
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
          {i.item || "Item"}
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
            </div>

            {/* ===============================
               FOOTER
               =============================== */}
            <div className="absolute bottom-6 left-8 right-8 text-xs text-gray-400 text-center">
              Generated via Homord Invoice Payment on {generatedAt}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePreview.displayName = "InvoicePreview";

export default InvoicePreview;

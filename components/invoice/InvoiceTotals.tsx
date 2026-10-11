import { useInvoiceCalculator } from "./useInvoiceCalculator";
import { InvoiceData } from "./types";

export default function InvoiceTotals({ data }: { data: InvoiceData }) {
  const { subtotal, discount, tax, total } = useInvoiceCalculator(data);

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between">
        <span>Sub Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Discount</span>
        <span>- ${discount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between">
        <span>Tax</span>
        <span>${tax.toFixed(2)}</span>
      </div>
      <div className="flex justify-between font-bold text-lg border-t pt-2">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

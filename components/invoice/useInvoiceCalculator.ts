import { InvoiceData } from "./types";

export function useInvoiceCalculator(data?: InvoiceData) {
  const items = data?.items ?? [];

  const subtotal = items.reduce(
    (sum, i) => sum + i.quantity * i.rate,
    0
  );

  const discount =
    data?.discountType === "percentage"
      ? (subtotal * (data?.discountValue ?? 0)) / 100
      : data?.discountValue ?? 0;

  const taxable = Math.max(subtotal - discount, 0);
  const tax = ((data?.taxRate ?? 0) * taxable) / 100;
  const total = taxable + tax;

  return { subtotal, discount, tax, total };
}

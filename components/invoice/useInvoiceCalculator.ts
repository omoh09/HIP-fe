import { InvoiceData, InvoiceItem } from "./types";

function toNumber(value: unknown): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeInvoiceItem(
  item: Partial<InvoiceItem> | undefined
): Partial<InvoiceItem> & { quantity: number; rate: number } {
  const quantity = toNumber(item?.quantity ?? 0);
  const rate = toNumber(item?.rate ?? item?.unit_price ?? 0);
  const itemName = [item?.item, item?.name].find(
    (value) => typeof value === "string" && value.trim()
  ) as string | undefined;

  return {
    ...item,
    item: itemName ?? item?.item ?? "",
    name: itemName ?? item?.name ?? "",
    quantity,
    rate,
  };
}

export function normalizeInvoiceItems(items: Array<Partial<InvoiceItem>> = []) {
  return items.map((item) => normalizeInvoiceItem(item));
}

export function useInvoiceCalculator(data?: InvoiceData) {
  const items = normalizeInvoiceItems(data?.items ?? []);

  const subtotal = items.reduce((sum, i) => sum + (i.quantity ?? 0) * (i.rate ?? 0), 0);

  const discount =
    data?.discountType === "percentage"
      ? (subtotal * toNumber(data?.discountValue)) / 100
      : toNumber(data?.discountValue);

  const taxable = Math.max(subtotal - discount, 0);
  const tax = (toNumber(data?.taxRate) * taxable) / 100;
  const total = taxable + tax;

  return { subtotal, discount, tax, total };
}

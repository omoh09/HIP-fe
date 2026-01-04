export type InvoiceItem = {
  item: string;
  description: string;
  quantity: number;
  rate: number;
};

export type InvoiceStatus = "pending" | "overdue" | "paid";

export type InvoiceData = {
  logo?: string;
  status: InvoiceStatus;
  currency: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  items: InvoiceItem[];
  discountType: "fixed" | "percentage";
  discountValue: number;
  taxRate: number;
};

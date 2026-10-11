export type InvoiceItem = {
  item?: string;
  name?: string;
  description?: string;
  quantity?: number | string;
  rate?: number | string;
  unit_price?: number | string;
};

export type InvoiceStatus = "draft" | "pending" | "overdue" | "paid" | "partial";

export interface Payment {
  id?: number;
  reference?: string;
  provider?: string;
  payment_status?: "pending" | "success" | "failed";
  amount?: string | number;
  currency?: string;
}

export interface Client {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
}

export type InvoiceData = {
  id?: number | string;
  logo?: string;
  status: InvoiceStatus;
  currency: string;
  invoiceNumber: string;
  reference?: string;
  paymentLink?: string;
  payment_link?: string;
  planCode?: string;
  platformFeePercent?: number;
  publicUrl?: string;
  public_url?: string;
  clientInvoiceUrl?: string;
  client_invoice_url?: string;
  qrCodeValue?: string;
  qr_code_value?: string;
  invoiceDate: string;
  dueDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  clientAddress?: string;
  description?: string;
  discription?: string;
  items: InvoiceItem[];
  payment?: Payment;
  client?: Client;
  discountType: "fixed" | "percentage";
  discountValue: number;
  taxRate: number;
  amount?: number;
  amountDue?: number;
  amountPaid?: number;
  createdAt?: string;
  updatedAt?: string;
  canEdit?: boolean;
  canRemind?: boolean;
  can_edit?: boolean;
  can_remind?: boolean;
};

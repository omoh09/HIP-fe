export type Invoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  paymentLink?: string;
  issuedAt: string;
  dueAt?: string;
};

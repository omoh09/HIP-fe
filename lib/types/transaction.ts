export type Transaction = {
  id: string;
  invoiceId: string;
  reference: string;
  amount: number;
  currency: string;
  status: 'success' | 'pending' | 'failed';
  channel: 'card' | 'bank' | 'ussd';
  paidAt?: string;
};

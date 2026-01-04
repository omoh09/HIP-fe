import InvoiceModule from '@/app/(dashboard)/dashboard/invoices/client-page';
import { getInvoices } from "../actions";

export default async function InvoicePage() {
  const invoices = await getInvoices();

  return <InvoiceModule invoices={invoices} />;
}

import InvoiceModule from '@/app/(dashboard)/dashboard/invoices/client-page';
import { getInvoices } from "../actions";
import { mapInvoiceResponse } from "@/app/utils/mapInvoice";
import { getCurrentUser } from "@/lib/auth/current-user";

export default async function InvoicePage() {
  const apiResponse = await getInvoices();
  const [invoices, user] = await Promise.all([
    Promise.resolve(mapInvoiceResponse(apiResponse)),
    getCurrentUser(),
  ]);
  const brandedInvoices = invoices.map((invoice) => ({
    ...invoice,
    logo: invoice.logo || user?.logo || undefined,
  }));

  return <InvoiceModule invoices={brandedInvoices} />;
}

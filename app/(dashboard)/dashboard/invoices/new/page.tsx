import ClientInvoice from './client-page';
import { getInvoices } from "../../actions";
export default async function InvoicePage() {
  let initialInvoiceData = await getInvoices();

   return <ClientInvoice initialData={initialInvoiceData} />
}

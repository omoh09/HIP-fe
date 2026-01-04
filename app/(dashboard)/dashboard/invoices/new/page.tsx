import ClientInvoice from './client-page';
import { getInvoices } from "../../actions";
export default async function InvoicePage() {
  let initialInvoiceData = null;

   return <ClientInvoice initialData={getInvoices} />
}

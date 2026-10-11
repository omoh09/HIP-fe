import ClientInvoice from './client-page';
import { getClient, getMarketSettings } from '../../actions';

export default async function InvoicePage() {
  let clients: any[] = [];
  let usage: any = null;
  let baseCurrency = 'NGN';
  try {
    const [clientResponse, marketResponse] = await Promise.all([getClient(), getMarketSettings()]);
    clients = Array.isArray(clientResponse?.data) ? clientResponse.data : Array.isArray(clientResponse) ? clientResponse : [];
    usage = clientResponse?.usage ?? null;
    baseCurrency = marketResponse?.data?.base_currency || 'NGN';
  } catch {}

  return <ClientInvoice clients={clients} usage={usage} initialData={{ currency: baseCurrency }} />;
}

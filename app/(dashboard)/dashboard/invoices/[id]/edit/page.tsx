import { notFound } from 'next/navigation';
import { getClient, getInvoice } from '../../../actions';
import { mapInvoiceResponse } from '@/app/utils/mapInvoice';
import InvoiceEditor from '../../new/client-page';

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();

  try {
    const [invoiceResponse, clientResponse] = await Promise.all([getInvoice(id), getClient()]);
    const rawInvoice = invoiceResponse?.data ?? invoiceResponse;
    const mapped = mapInvoiceResponse([rawInvoice])[0];
    if (!mapped) notFound();

    const clients = Array.isArray(clientResponse?.data) ? clientResponse.data : Array.isArray(clientResponse) ? clientResponse : [];
    const usage = clientResponse?.usage ?? null;
    const clientId = rawInvoice?.client?.id ?? mapped.client?.id ?? null;

    return <InvoiceEditor mode="edit" invoiceId={id} initialData={mapped} initialClientId={clientId} clients={clients} usage={usage} />;
  } catch {
    notFound();
  }
}

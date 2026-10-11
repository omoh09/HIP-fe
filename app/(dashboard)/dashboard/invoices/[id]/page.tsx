import { notFound } from 'next/navigation';
import { getInvoice } from '../../actions';
import { mapInvoiceResponse } from '@/app/utils/mapInvoice';
import { getCurrentUser } from '@/lib/auth/current-user';
import ClientInvoice from './client-page';

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) notFound();

  try {
    const invoice = await getInvoice(id);
    const rawInvoice = invoice?.data ?? invoice;
    const mapped = mapInvoiceResponse([rawInvoice])[0];
    if (!mapped) notFound();
    const user = await getCurrentUser();
    const branded = { ...mapped, logo: mapped.logo || user?.logo || undefined };
    return <ClientInvoice initialData={branded} />;
  } catch {
    notFound();
  }
}

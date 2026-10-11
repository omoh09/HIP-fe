import { getClient } from '../actions';
import ClientTable from './client-table';

export default async function ClientsPage() {
  const response = await getClient();
  const clients = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
  const usage = response?.usage ?? null;

  return <ClientTable clients={clients} usage={usage} />;
}

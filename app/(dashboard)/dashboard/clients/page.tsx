import { getClient } from '../actions';
import ClientTable from './client-table';

export default async function ClientsPage() {
  const clients = await getClient();

  return <ClientTable clients={clients} />;
}

import { getInvoice } from "../../actions";
import ClientInvoice from "./client-page";

export default async function EditInvoicePage({
  params,
}: {
  params: { id: string };
}) {
  const invoice = await getInvoice(params.id);

  return <ClientInvoice initialData={invoice} />;
}

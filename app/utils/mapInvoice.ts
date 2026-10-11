import { InvoiceData, InvoiceItem, Payment, Client, InvoiceStatus } from "@/components/invoice/types";

export function mapInvoiceResponse(api: any): InvoiceData[] {
  const invoices = Array.isArray(api?.data) ? api.data : Array.isArray(api) ? api : [];

  return invoices.map((invoice: any): InvoiceData => {
    const items: InvoiceItem[] = Array.isArray(invoice.items)
      ? invoice.items.map((item: any) => ({
          item: [item.item, item.name, item.title].find((value: unknown) => typeof value === "string" && value.trim()) ?? "",
          name: [item.item, item.name, item.title].find((value: unknown) => typeof value === "string" && value.trim()) ?? "",
          description: item.description ?? "",
          quantity: Number(item.quantity ?? 0),
          unit_price: Number(item.unit_price ?? item.rate ?? 0),
          rate: Number(item.rate ?? item.unit_price ?? 0),
        }))
      : [];

    const client: Client = {
      id: Number(invoice.client?.id ?? 0) || undefined,
      name: invoice.client?.name ?? invoice.client_name ?? "",
      email: invoice.client?.email ?? invoice.client_email ?? "",
      phone: invoice.client?.phone ?? invoice.client?.phone_number ?? invoice.client?.mobile ?? invoice.client?.whatsapp_number ?? invoice.client_phone ?? invoice.phone ?? invoice.phone_number ?? invoice.mobile ?? invoice.whatsapp_number ?? "",
    };

    const payment: Payment = {
      id: Number(invoice.payment?.id ?? 0) || undefined,
      reference: invoice.payment?.reference ?? invoice.reference ?? "",
      provider: invoice.payment?.provider ?? "",
      payment_status: (invoice.payment?.payment_status ?? "pending") as Payment["payment_status"],
      amount: invoice.payment?.amount ?? invoice.amount_paid ?? 0,
      currency: invoice.payment?.currency ?? invoice.currency ?? "NGN",
    };

    const rawStatus = String(invoice.status ?? "pending").toLowerCase().trim().replace(/[\s-]+/g, "_");
    const amount = Number(invoice.total_amount ?? invoice.amount ?? invoice.total ?? 0);
    const amountPaid = Number(invoice.amount_paid ?? invoice.amountPaid ?? invoice.payment?.amount ?? 0);
    const amountDue = Number(invoice.amount_due ?? invoice.amountDue ?? Math.max(amount - amountPaid, 0));
    const normalizedStatus = rawStatus === "partially_paid" || rawStatus === "partiallypay" ? "partial" : rawStatus;
    const status: InvoiceStatus = normalizedStatus === "partial" || (amountPaid > 0 && amountDue > 0 && amountPaid < amount)
      ? "partial"
      : ["draft", "pending", "overdue", "paid"].includes(normalizedStatus)
        ? (normalizedStatus as InvoiceStatus)
        : "pending";

    return {
      id: invoice.id,
      logo: invoice.logo_url ?? invoice.logo ?? undefined,
      status,
      currency: invoice.currency ?? "NGN",
      invoiceNumber: invoice.invoice_number ?? invoice.invoiceNumber ?? "",
      reference: invoice.reference ?? "",
      paymentLink: invoice.payment_link ?? invoice.paymentLink ?? invoice.payment_url ?? invoice.paymentUrl ?? invoice.public_url ?? invoice.publicUrl ?? "",
      payment_link: invoice.payment_link ?? invoice.paymentLink ?? "",
      planCode: invoice.plan_code ?? invoice.planCode ?? undefined,
      platformFeePercent: invoice.platform_fee_percent !== null && invoice.platform_fee_percent !== undefined ? Number(invoice.platform_fee_percent) : undefined,
      publicUrl: invoice.public_url ?? invoice.publicUrl ?? "",
      public_url: invoice.public_url ?? invoice.publicUrl ?? "",
      clientInvoiceUrl: invoice.client_invoice_url ?? invoice.clientInvoiceUrl ?? invoice.public_url ?? invoice.publicUrl ?? invoice.payment_link ?? invoice.paymentLink ?? "",
      client_invoice_url: invoice.client_invoice_url ?? invoice.clientInvoiceUrl ?? invoice.public_url ?? invoice.publicUrl ?? invoice.payment_link ?? invoice.paymentLink ?? "",
      qrCodeValue: invoice.qr_code_value ?? invoice.qrCodeValue ?? invoice.client_invoice_url ?? invoice.clientInvoiceUrl ?? invoice.public_url ?? invoice.publicUrl ?? invoice.payment_link ?? invoice.paymentLink ?? "",
      qr_code_value: invoice.qr_code_value ?? invoice.qrCodeValue ?? invoice.client_invoice_url ?? invoice.clientInvoiceUrl ?? invoice.public_url ?? invoice.publicUrl ?? invoice.payment_link ?? invoice.paymentLink ?? "",
      invoiceDate: invoice.invoice_date ?? invoice.created_at?.split("T")[0] ?? "",
      dueDate: invoice.due_date ?? invoice.dueDate ?? "",
      clientName: client.name ?? "",
      clientEmail: client.email ?? "",
      clientPhone: client.phone ?? "",
      clientAddress: invoice.client_address ?? invoice.clientAddress ?? "",
      description: invoice.description ?? invoice.discription ?? "",
      discription: invoice.description ?? invoice.discription ?? "",
      items,
      client,
      payment,
      discountType: invoice.discount_type === "percentage" ? "percentage" : "fixed",
      discountValue: Number(invoice.discount_value ?? 0),
      taxRate: Number(invoice.tax_rate ?? 0),
      amount: Number(invoice.total_amount ?? invoice.amount ?? 0),
      amountDue: Number(invoice.amount_due ?? invoice.total_amount ?? invoice.amount ?? 0),
      amountPaid: Number(invoice.amount_paid ?? invoice.payment?.amount ?? 0),
      canEdit: invoice.can_edit ?? invoice.canEdit ?? undefined,
      can_edit: invoice.can_edit ?? invoice.canEdit ?? undefined,
      canRemind: invoice.can_remind ?? invoice.canRemind ?? undefined,
      can_remind: invoice.can_remind ?? invoice.canRemind ?? undefined,
      createdAt: invoice.created_at ?? undefined,
      updatedAt: invoice.updated_at ?? undefined,
    };
  });
}

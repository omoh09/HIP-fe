import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function POST(req: Request) {
  try {
    const { withPaymentLink, ...invoiceData } = await req.json();
    const endpoint = withPaymentLink ? '/api/v1/invoices/send-with-payment' : '/api/v1/invoices/send';

    const data = await backendRequest({ url: endpoint,
      method: 'POST',
      data: invoiceData,
      headers: { 'Content-Type': 'application/json' },
    });

    return NextResponse.json(data);
  } catch (error) {
    const result = backendError(error, 'Failed to send invoice');
    return NextResponse.json({ message: result.message }, { status: result.status });
  }
}

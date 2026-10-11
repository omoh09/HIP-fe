import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body?.id) {
      return NextResponse.json({ message: 'Invoice id is required' }, { status: 400 });
    }

    const data = await backendRequest({ url: `/api/v1/invoices/${encodeURIComponent(body.id)}`,
      method: 'PUT',
      data: body,
      headers: { 'Content-Type': 'application/json' },
    });

    return NextResponse.json(data);
  } catch (error) {
    const result = backendError(error, 'Failed to save invoice');
    return NextResponse.json({ message: result.message }, { status: result.status });
  }
}

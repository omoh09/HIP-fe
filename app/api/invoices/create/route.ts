import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = await backendRequest({ url: '/api/v1/invoices',
      method: 'POST',
      data: body,
      headers: { 'Content-Type': 'application/json' },
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const result = backendError(error, 'Invoice creation failed');
    return NextResponse.json({ message: result.message }, { status: result.status });
  }
}

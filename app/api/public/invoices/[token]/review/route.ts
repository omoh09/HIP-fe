import { NextResponse } from 'next/server';
import { backendError, publicBackendRequest } from '@/app/api/_lib/backend';

export async function POST(req: Request, context: { params: Promise<{ token: string }> }) {
  try {
    const { token } = await context.params;
    const body = await req.json();
    const response = await publicBackendRequest({
      url: `/api/v1/public/invoices/${encodeURIComponent(token)}/review`,
      method: 'POST',
      data: body,
      headers: { 'Content-Type': 'application/json' },
    });
    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const result = backendError(error, 'Unable to submit your review');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}

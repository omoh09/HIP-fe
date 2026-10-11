import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await backendRequest({ url: '/api/v1/billing/subscription/checkout', method: 'POST', data: body, headers: { 'Content-Type': 'application/json' } });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to start subscription checkout');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}

import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function GET() {
  try {
    const response = await backendRequest({ url: '/api/v1/payment-accounts', method: 'GET' });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to load payment accounts');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}

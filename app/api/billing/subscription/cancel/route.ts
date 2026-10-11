import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function POST() {
  try {
    const response = await backendRequest({ url: '/api/v1/billing/subscription/cancel', method: 'POST' });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to cancel subscription');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}

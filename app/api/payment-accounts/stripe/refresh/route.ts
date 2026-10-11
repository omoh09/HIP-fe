import { NextResponse } from 'next/server';
import { backendError, backendRequest } from '@/app/api/_lib/backend';

export async function POST() {
  try {
    const response = await backendRequest({
      url: '/api/v1/payment-accounts/stripe/refresh',
      method: 'POST',
      data: {},
      headers: { 'Content-Type': 'application/json' },
    });
    return NextResponse.json(response);
  } catch (error) {
    const result = backendError(error, 'Unable to refresh Stripe status');
    return NextResponse.json({ error: result.message }, { status: result.status });
  }
}
